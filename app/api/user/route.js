import Member from "@/models/Member";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import { auth } from "@/auth";

// api/user => GET
// get own user profile + attendance history (dashboard)

export const GET = async (request) => {
    try {
        await connectDB();
        const session = await auth();

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await User.findById(userId).select("-clerkId -gymCode").lean();

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // 🚨 Block incomplete profiles
        if (!user.isProfileComplete) {
            return NextResponse.json({ success: false, message: "Profile is not complete", data: { isProfileComplete: user.isProfileComplete } }, { status: 400 });
        }

        // ✅ fetch last 50 attendances (newest first)
        const attendances = await Attendance.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();

        const history = attendances.map((a) => {
            const d = new Date(a.createdAt);
            const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

            // figure out today/yesterday
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            let formattedDate;
            if (d >= today) {
                formattedDate = "Today";
            } else if (d >= yesterday) {
                formattedDate = "Yesterday";
            } else {
                formattedDate = d.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Kolkata", // ✅ same timezone used here
                }); // e.g. September 2
            }

            return {
                _id: a._id,
                date: formattedDate,
                day: d.toLocaleDateString("en-US", { weekday: "long" }),
                time: d.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Kolkata", // ✅ ensure correct local time
                }),
            };
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    user: {
                        ...user,
                        attendanceHistory: history,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// api/user => POST
// complete profile by providing gymCode and name and by choosing a username
export const POST = async (request) => {
    try {
        await connectDB();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { username, fullName, gymCode } = await request.json();
        if (!fullName?.trim() || !gymCode?.trim() || !username?.trim()) {
            return NextResponse.json({ success: false, message: "Full Name, Gym Code and Username are required" }, { status: 400 });
        }

        // check if username already exists
        const existingUser = await User.findOne({ username: username?.trim() });
        if (existingUser) {
            return NextResponse.json({ success: false, message: "Username already exists" }, { status: 400 });
        }

        // check if member exists in correct fullName, gymCode pair
        const validMember = await Member.findOne({ fullName: fullName?.trim(), gymCode: gymCode?.trim() });
        if (!validMember) {
            return NextResponse.json({ success: false, message: "Invalid full name or gym code" }, { status: 400 });
        }

        // update the user profile
        user.gymCode = gymCode.trim();
        user.fullName = fullName.trim();
        user.username = username.trim();
        user.isProfileComplete = true;
        await user.save();

        return NextResponse.json({ success: true, message: "Profile Completed Successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// api/user => PATCH
// Update user profile gymCode, name
export async function PATCH(request) {
    try {
        await connectDB();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { username, name, gymCode } = await request.json();
        if (!username?.trim() || !name?.trim() || !gymCode?.trim()) {
            return NextResponse.json({ success: false, message: "Username, Name and Gym Code are required" }, { status: 400 });
        }

        // check if username already exists
        const existingUser = await User.findOne({ username: username?.trim() });
        if (existingUser) {
            return NextResponse.json({ success: false, message: "Username already exists" }, { status: 400 });
        }

        // check if name and gymCode exists in correct pair
        const validMember = await Member.findOne({ name: name?.trim(), gymCode: gymCode?.trim() });
        if (!validMember) {
            return NextResponse.json({ success: false, message: "Invalid name or gym code" }, { status: 400 });
        }
        // update the user profile
        user.name = name?.trim();
        user.gymCode = gymCode?.trim();
        user.username = username?.trim();
        await user.save();

        return NextResponse.json({ success: true, message: "Profile Updated Successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// we are not letting user to delete their (name and gymCode)
