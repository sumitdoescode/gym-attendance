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

        const { name, gymCode, phone } = await request.json();
        if (!name?.trim() || !gymCode?.trim()) {
            // name and gymCode are required
            return NextResponse.json({ success: false, message: "Name and Gym Code are required" }, { status: 400 });
        }

        const { id } = params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
        }

        const member = await Member.findByIdAndUpdate(id, { name: name.trim(), gymCode: gymCode.trim(), phone: phone?.trim() ? phone.trim() : undefined }, { new: true });
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

        const { id } = params;
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
