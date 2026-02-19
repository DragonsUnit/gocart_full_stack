import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }

        const data = await request.json();
        const { name, description, address, logo, email, contact } = data;

        const updatedStore = await prisma.store.update({
            where: { userId },
            data: {
                name,
                description,
                address,
                logo,
                email,
                contact
            }
        });

        return NextResponse.json({ success: true, store: updatedStore });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
