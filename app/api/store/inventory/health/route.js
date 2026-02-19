import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { storeId },
            select: {
                id: true,
                name: true,
                stock: true,
                images: true
            },
            orderBy: { stock: 'asc' }
        });

        const inventorySummary = {
            critical: products.filter(p => p.stock === 0),
            low: products.filter(p => p.stock > 0 && p.stock < 10),
            healthy: products.filter(p => p.stock >= 10),
        };

        return NextResponse.json({ inventorySummary });
    } catch (error) {
        console.error("Inventory health API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
