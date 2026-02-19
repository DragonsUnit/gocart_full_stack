import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");
        const category = searchParams.get("category");

        if (!productId || !category) {
            return NextResponse.json({ error: "Missing productId or category" }, { status: 400 });
        }

        // Logical Advancement: Fetch top-rated similar products
        const recommendations = await prisma.product.findMany({
            where: {
                category: category,
                id: { not: productId },
                inStock: true,
                store: { isActive: true }
            },
            take: 4,
            include: {
                rating: true,
                store: true
            },
            orderBy: [
                { rating: { _count: 'desc' } }, // Products with more ratings first
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error("Recommendations API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
