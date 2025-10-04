import User from "@/models/User";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/db";
import { auth } from "@/auth";

// GET => /api/user/me
// get, current user it admin or not
export async function GET() {
    try {
        await connectDB();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await User.findById(userId).select("fullName gymCode username phone avatar isProfileComplete role");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                success: true,
                data: { user },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
