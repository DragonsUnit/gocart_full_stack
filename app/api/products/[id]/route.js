import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                rating: {
                    select: {
                        createdAt: true,
                        rating: true,
                        review: true,
                        user: { select: { name: true, image: true } }
                    }
                },
                store: true,
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });

    } catch (error) {
        console.error("Single product API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
