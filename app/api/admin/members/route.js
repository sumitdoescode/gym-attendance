import Member from "@/models/Member";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

// GET all members
// GET => /api/admin/members
export const GET = async (request) => {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // check if the user is an admin
        const user = await User.findOne({ clerkId: userId });
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const members = await Member.find();
        return NextResponse.json({ success: true, message: "Members retrieved successfully", data: { members } }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// Create Member
// POST => /api/admin/members
export const POST = async (request) => {
    try {
        await connectDB();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // check if user is as admin
        const user = await User.findOne({ clerkId: userId });
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
};
