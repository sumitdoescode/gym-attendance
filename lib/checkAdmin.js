import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function checkAdmin() {
    await dbConnect();

    const { userId } = auth();

    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== "admin") {
        return false; // user is not admin
    }

    return true; // ✅ means user is admin
}

// will use this later
