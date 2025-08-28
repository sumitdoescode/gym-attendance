import Member from "@/models/Member";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";

// api/user => GET
// get own user profile + attendance history (dashboard)
export const GET = async (request) => {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ clerkId: userId }).select("-clerkId -gymCode").lean();

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // 🚨 Block incomplete profiles
        if (!user.isProfileComplete) {
            return NextResponse.json({ success: false, message: "Profile is not complete" }, { status: 400 });
        }

        // ✅ fetch last 50 attendances (newest first)
        const attendances = await Attendance.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();

        let history = [];
        if (attendances.length) {
            // map for quick lookup
            const attendanceMap = {};
            attendances.forEach((a) => {
                const dateStr = new Date(a.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
                attendanceMap[dateStr] = {
                    _id: a._id,
                    time: new Date(a.createdAt).toISOString().split("T")[1].split(".")[0],
                };
            });

            // earliest date among attendances
            const earliestDate = new Date(attendances[attendances.length - 1].createdAt);

            // build hybrid history (from today → earliest attendance OR max 50 days)
            const today = new Date();
            for (let i = 0; i < 50; i++) {
                const d = new Date();
                d.setDate(today.getDate() - i);

                if (d < earliestDate) break;

                const dateStr = d.toISOString().split("T")[0];
                history.push({
                    date: dateStr,
                    day: d.toLocaleDateString("en-US", { weekday: "long" }),
                    present: attendanceMap[dateStr] ? true : false,
                    ...(attendanceMap[dateStr] || {}),
                });
            }
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    ...user,
                    attendanceHistory: history, // ✅ we only keep history
                    // user.stats already has totalAttendance, thisMonthAttendance, streak
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// api/user => POST
// complete profile by providing gymCode and name in correct pair
export const POST = async (request) => {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { name, gymCode } = await request.json();
        if (!name?.trim() || !gymCode?.trim()) {
            return NextResponse.json({ success: false, message: "Name and Gym Code are required" }, { status: 400 });
        }

        // check if member exists in correct name, gymCode pair
        const validMember = await Member.findOne({ name: name?.trim(), gymCode: gymCode?.trim() });
        if (!validMember) {
            return NextResponse.json({ success: false, message: "Invalid name or gym code" }, { status: 400 });
        }

        // update the user profile
        user.gymCode = gymCode.trim();
        user.name = name.trim();
        user.isProfileComplete = true;
        await user.save();

        return NextResponse.json({ success: true, message: "Profile Completed Successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// api/user => PATCH
// Update user profile gymCode, name
export const PATCH = async (request) => {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { name, gymCode } = await request.json();
        if (!name?.trim() && !gymCode?.trim()) {
            return NextResponse.json({ success: false, message: "Name or Gym Code is required" }, { status: 400 });
        }
        // check if name and gymCode exists in correct pair
        const validMember = await Member.findOne({ name: name?.trim(), gymCode: gymCode?.trim() });
        if (!validMember) {
            return NextResponse.json({ success: false, message: "Invalid name or gym code" }, { status: 400 });
        }

        user.name = name?.trim();
        user.gymCode = gymCode?.trim();
        await user.save();

        return NextResponse.json({ success: true, message: "Profile Updated Successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// we are not letting user to delete their (name and gymCode)
