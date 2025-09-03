import User from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";

// api/user/[username]
// get user profile by username (requires auth) + attendance history
export const GET = async (request, { params }) => {
    try {
        await connectDB();

        // ✅ must be logged in
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { username } = await params;

        // ❌ remove confidential fields
        const user = await User.findOne({ username: username.trim() }).select("-clerkId -gymCode -email").lean();

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
            const attendanceMap = {};
            attendances.forEach((a) => {
                const dateStr = new Date(a.createdAt).toISOString().split("T")[0];
                attendanceMap[dateStr] = {
                    _id: a._id,
                    time: new Date(a.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    }),
                };
            });

            const earliestDate = new Date(attendances[attendances.length - 1].createdAt);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            for (let i = 0; i < 50; i++) {
                const d = new Date();
                d.setDate(today.getDate() - i);

                if (d < earliestDate) break;

                const dateStr = d.toISOString().split("T")[0];

                let formattedDate;
                if (d.toDateString() === today.toDateString()) {
                    formattedDate = "Today";
                } else if (d.toDateString() === yesterday.toDateString()) {
                    formattedDate = "Yesterday";
                } else {
                    const opts = { month: "long", day: "numeric" };
                    if (d.getFullYear() !== today.getFullYear()) {
                        opts.year = "numeric";
                    }
                    formattedDate = d.toLocaleDateString("en-US", opts);
                }

                if (attendanceMap[dateStr]) {
                    history.push({
                        date: formattedDate,
                        day: d.toLocaleDateString("en-US", { weekday: "long" }),
                        ...attendanceMap[dateStr],
                    });
                }
            }
        }

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
