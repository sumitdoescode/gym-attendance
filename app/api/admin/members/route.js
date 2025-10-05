import Member from "@/models/Member";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

// GET all members
// GET => /api/admin/members
export async function GET(request) {
    try {
        await connectDB();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // check if the user is an admin
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q");

        let filter = {};
        if (q && q.trim()) {
            // Case-insensitive search on fullName or gymCode
            filter = {
                $or: [{ fullName: { $regex: q.trim(), $options: "i" } }, { gymCode: { $regex: q.trim(), $options: "i" } }],
            };
        }

        const members = await Member.find(filter);
        const totalMembersCount = await Member.countDocuments();
        return NextResponse.json({ success: true, message: "Members retrieved successfully", data: { members, totalMembersCount } }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Create Member
// POST => /api/admin/members
export async function POST(request) {
    try {
        await connectDB();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // check if user is as admin
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const { fullName, gymCode, phone } = await request.json();
        console.log(fullName, gymCode, phone);
        if (!fullName?.trim() || !gymCode?.trim()) {
            return NextResponse.json({ success: false, message: "Full Name and Gym Code are required" }, { status: 400 });
        }

        // Check if a member with the same gymCode already exists
        const existingMember = await Member.findOne({ gymCode: gymCode?.trim() });
        if (existingMember) {
            return NextResponse.json({ success: false, message: "Member with the same Gym Code already exists" }, { status: 400 });
        }
        await Member.create({ fullName: fullName.trim(), gymCode: gymCode.trim(), phone: phone ? phone.trim() : undefined });
        return NextResponse.json({ success: true, message: "Member created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
