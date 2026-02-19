import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!userId || !productId) {
            return NextResponse.json({ eligible: false });
        }

        // Check if user has a DELIVERED order with this product
        const order = await prisma.order.findFirst({
            where: {
                userId,
                status: 'DELIVERED',
                orderItems: {
                    some: { productId }
                }
            },
            select: { id: true }
        });

        if (!order) {
            return NextResponse.json({ eligible: false, reason: "No delivered order found" });
        }

        // Check if user has already rated this product for this order
        const alreadyRated = await prisma.rating.findFirst({
            where: {
                userId,
                productId,
                orderId: order.id
            }
        });

        if (alreadyRated) {
            return NextResponse.json({ eligible: false, reason: "Already rated" });
        }

        return NextResponse.json({
            eligible: true,
            orderId: order.id
        });

    } catch (error) {
        console.error("Review status API error:", error);
        return NextResponse.json({ eligible: false }, { status: 500 });
    }
}
