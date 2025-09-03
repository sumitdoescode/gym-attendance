import Member from "@/models/Member";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

// Update a member
export const PATCH = async (request, { params }) => {
    try {
        await connectDB();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // check if user is an admin
        const user = await User.findOne({ clerkId: userId });
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const { fullName, gymCode, phone } = await request.json();
        if (!fullName?.trim() || !gymCode?.trim()) {
            console.log(fullName, gymCode, phone);
            // fullName and gymCode are required
            return NextResponse.json({ success: false, message: "Full Name and Gym Code are required" }, { status: 400 });
        }

        // id validation
        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
        }

        // check if gymCode already exists
        const existingMember = await Member.findOne({ gymCode: gymCode.trim() });
        if (existingMember && existingMember._id.toString() !== id) {
            return NextResponse.json({ success: false, message: "Gym Code already exists" }, { status: 400 });
        }

        const member = await Member.findByIdAndUpdate(id, { fullName: fullName.trim(), gymCode: gymCode.trim(), phone: phone?.trim() || "" }, { new: true });
        if (!member) {
            return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Member updated successfully", data: member }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// delete a member
export const DELETE = async (request, { params }) => {
    try {
        await connectDB();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // check if the user is admin
        const user = await User.findOne({ clerkId: userId });
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
        }
        const member = await Member.findByIdAndDelete(id);
        if (!member) {
            return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Member deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};
