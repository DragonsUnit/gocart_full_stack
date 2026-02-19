import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Get Dashboard Data for Seller ( total orders, total earnings, total products )
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        // Get all orders for seller (last 30 days for trends)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await prisma.order.findMany({
            where: {
                storeId,
                createdAt: { gte: thirtyDaysAgo },
                OR: [
                    { paymentMethod: 'COD' },
                    { AND: [{ paymentMethod: 'STRIPE' }, { isPaid: true }] }
                ]
            },
            include: { orderItems: { include: { product: true } } }
        });

        // Calculate 7-day trend
        const revenueData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString().split(' ')[0]; // e.g., 'Mon'

            const dayOrders = orders.filter(o => o.createdAt.toDateString() === date.toDateString());
            revenueData.push({
                day: dateStr,
                revenue: Math.round(dayOrders.reduce((acc, o) => acc + o.total, 0)),
                orders: dayOrders.length
            });
        }

        // Calculate Category Breakdown
        const products = await prisma.product.findMany({ where: { storeId } });
        const categories = [...new Set(products.map(p => p.category))];
        const categoryData = categories.map((cat, i) => ({
            name: cat,
            value: products.filter(p => p.category === cat).length,
            color: ['#f97316', '#3b82f6', '#8b5cf6', '#10b981'][i % 4]
        }));

        // Top 5 Products by Revenue
        const productStats = {};
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!productStats[item.productId]) {
                    productStats[item.productId] = { name: item.product.name, revenue: 0, sales: 0 };
                }
                productStats[item.productId].revenue += item.price * item.quantity;
                productStats[item.productId].sales += item.quantity;
            });
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const ratings = await prisma.rating.findMany({
            where: { productId: { in: products.map(product => product.id) } },
            include: { user: true, product: true }
        });

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, order) => acc + order.total, 0)),
            totalProducts: products.length,
            revenueData,
            categoryData,
            topProducts
        };

        return NextResponse.json({ dashboardData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}