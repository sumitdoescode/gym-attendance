import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

// api/attendance => POST
// create an attendance or mark an attendance
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

        // ✅ check if profile complete
        if (!user.isProfileComplete) {
            return NextResponse.json({ success: false, message: "Profile is not complete" }, { status: 400 });
        }

        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const currentHour = now.getHours();

        // ✅ Prevent Sundays
        if (dayOfWeek === 0) {
            return NextResponse.json({ success: false, message: "Attendance not allowed on Sundays" }, { status: 400 });
        }

        // ✅ Gym timing restriction (5–10 AM, 5–10 PM)
        // const inMorning = currentHour >= 5 && currentHour < 10;
        // const inEvening = currentHour >= 17 && currentHour < 22;
        // if (!inMorning && !inEvening) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Attendance only allowed during gym hours (5–10 AM, 5–10 PM)",
        //         },
        //         { status: 400 }
        //     );
        // }

        // ✅ Prevent multiple attendances in same day
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            userId: user._id,
            createdAt: { $gte: startOfToday },
        });

        if (existingAttendance) {
            return NextResponse.json({ success: false, message: "Attendance already marked for today" }, { status: 400 });
        }

        // ✅ Streak logic (skip Sundays)
        let streak = 1; // today counts at least
        if (dayOfWeek === 1) {
            // Monday → check Saturday (skip Sunday)
            const startOfSaturday = new Date(startOfToday);
            startOfSaturday.setDate(startOfSaturday.getDate() - 2);
            const endOfSaturday = new Date(startOfSaturday);
            endOfSaturday.setHours(23, 59, 59, 999);

            const saturdayAttendance = await Attendance.findOne({
                userId: user._id,
                createdAt: { $gte: startOfSaturday, $lte: endOfSaturday },
            });

            if (saturdayAttendance) {
                streak = (user.stats.streak || 0) + 1;
            }
        } else {
            // Normal case → check yesterday
            const startOfYesterday = new Date(startOfToday);
            startOfYesterday.setDate(startOfYesterday.getDate() - 1);
            const endOfYesterday = new Date(startOfYesterday);
            endOfYesterday.setHours(23, 59, 59, 999);

            const yesterdayAttendance = await Attendance.findOne({
                userId: user._id,
                createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
            });

            if (yesterdayAttendance) {
                streak = (user.stats.streak || 0) + 1;
            }
        }

        // ✅ Update user stats (before creating today’s record)
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const lastAttendance = await Attendance.findOne({ userId: user._id }).sort({ createdAt: -1 });

        if (!lastAttendance || lastAttendance.createdAt.getMonth() !== currentMonth || lastAttendance.createdAt.getFullYear() !== currentYear) {
            // First attendance of new month → reset month count
            user.stats.thisMonthAttendance = 1;
        } else {
            // Same month → increment
            user.stats.thisMonthAttendance = (user.stats.thisMonthAttendance || 0) + 1;
        }

        user.stats.totalAttendance = (user.stats.totalAttendance || 0) + 1;
        user.stats.streak = streak;

        await user.save();

        // ✅ Finally mark attendance
        const attendance = await Attendance.create({ userId: user._id });

        // format fields same as feed API
        const createdAt = attendance.createdAt;

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const day = dayNames[createdAt.getDay()];

        const time = createdAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateLabel;
        if (createdAt >= today) {
            dateLabel = "Today";
        } else if (createdAt >= yesterday) {
            dateLabel = "Yesterday";
        } else {
            dateLabel = createdAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
            });
        }

        // payload to pusher
        const payload = {
            day: day,
            date: dateLabel,
            attendances: [
                {
                    id: attendance._id,
                    time,
                    fullName: user.fullName,
                    username: user.username,
                    avatar: user.avatar,
                },
            ],
        };

        await pusherServer.trigger("feed", "new_attendance", payload);

        return NextResponse.json(
            {
                success: true,
                message: "Attendance marked successfully",
                // stats: {
                //   total: user.totalAttendance,
                //   thisMonth: user.thisMonthAttendance,
                //   streak: user.streak,
                // },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Attendance POST error:", error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// attendance feed
// api/attendance => GET
export const GET = async (request) => {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 3;

        // Force dates in Asia/Kolkata
        const tz = "Asia/Kolkata";
        const now = new Date();

        const today = new Date(now.toLocaleString("en-US", { timeZone: tz }));
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // ✅ format today & yesterday in IST, not UTC
        const todayStr = today.toLocaleDateString("en-CA", { timeZone: tz }); // "2025-09-09"
        const yesterdayStr = yesterday.toLocaleDateString("en-CA", { timeZone: tz }); // "2025-09-08"

        const pipeline = [
            {
                $addFields: {
                    formattedDate: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: tz,
                        },
                    },
                    dayName: {
                        $switch: {
                            branches: [
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] }, then: "Sunday" },
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] }, then: "Monday" },
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] }, then: "Tuesday" },
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] }, then: "Wednesday" },
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] }, then: "Thursday" },
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] }, then: "Friday" },
                                { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] }, then: "Saturday" },
                            ],
                            default: "Unknown",
                        },
                    },
                    time: {
                        $dateToString: {
                            format: "%H:%M",
                            date: "$createdAt",
                            timezone: tz,
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$formattedDate",
                    formattedDate: { $first: "$formattedDate" },
                    day: { $first: "$dayName" },
                    rawDate: { $first: "$createdAt" },
                    attendances: {
                        $push: {
                            id: "$_id",
                            time: "$time",
                            fullName: "$user.fullName",
                            username: "$user.username",
                            avatar: "$user.avatar",
                        },
                    },
                },
            },
            { $sort: { _id: -1 } },
            {
                $addFields: {
                    date: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$formattedDate", todayStr] }, then: "Today" },
                                { case: { $eq: ["$formattedDate", yesterdayStr] }, then: "Yesterday" },
                            ],
                            default: {
                                $dateToString: {
                                    format: "%-d %b", // 👉 "6 Sep" (no leading 0)
                                    date: "$rawDate",
                                    timezone: tz,
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    rawDate: 0,
                    formattedDate: 0,
                },
            },
        ];

        const options = { page, limit };
        let result = await Attendance.aggregatePaginate(Attendance.aggregate(pipeline), options);

        return NextResponse.json({ success: true, data: { ...result } }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};
