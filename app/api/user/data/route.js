import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                loyaltyPoints: true,
                cart: true
                // Add other fields as needed
            }
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("User data API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
