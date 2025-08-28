import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";

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
        const inMorning = currentHour >= 5 && currentHour < 10;
        const inEvening = currentHour >= 17 && currentHour < 22;
        if (!inMorning && !inEvening) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Attendance only allowed during gym hours (5–10 AM, 5–10 PM)",
                },
                { status: 400 }
            );
        }

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

        // ✅ Mark attendance
        const attendance = await Attendance.create({ userId: user._id, createdAt: new Date() });

        // ✅ Streak logic (skip Sundays)
        let streak = 1; // at least today counts
        if (dayOfWeek === 1) {
            // Today is Monday → check Saturday (skip Sunday)
            const startOfSaturday = new Date(startOfToday);
            startOfSaturday.setDate(startOfSaturday.getDate() - 2);
            const endOfSaturday = new Date(startOfSaturday);
            endOfSaturday.setHours(23, 59, 59, 999);

            const saturdayAttendance = await Attendance.findOne({
                userId: user._id,
                createdAt: { $gte: startOfSaturday, $lte: endOfSaturday },
            });

            if (saturdayAttendance) {
                streak = (user.streak || 0) + 1;
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
                streak = (user.streak || 0) + 1;
            }
        }

        // ✅ Update user stats
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const lastAttendance = await Attendance.findOne({ userId: user._id }).sort({ createdAt: -1 });

        if (!lastAttendance || lastAttendance.createdAt.getMonth() !== currentMonth || lastAttendance.createdAt.getFullYear() !== currentYear) {
            // First attendance of new month → reset
            user.thisMonthAttendance = 1;
        } else {
            // Same month → increment
            user.thisMonthAttendance = (user.thisMonthAttendance || 0) + 1;
        }

        user.totalAttendance = (user.totalAttendance || 0) + 1;
        user.streak = streak;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Attendance marked successfully",
                // data: attendance,
                // stats: {
                //     total: user.totalAttendance,
                //     thisMonth: user.thisMonthAttendance,
                //     currentStreak: user.streak,
                // },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};

// api/attendance => GET
// get all attendaces aka attendance feed
export const GET = async (request) => {
    try {
        await connectDB();

        // doesn't require authentication
        // const { userId } = await auth();
        // if (!userId) {
        //     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // }

        // const user = await User.findById(userId);
        // if (!user) {
        //     return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        // }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 2; // number of days per page

        const pipeline = [
            {
                $addFields: {
                    formattedDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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
                    time: { $dateToString: { format: "%H:%M", date: "$createdAt" } },
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
            { $sort: { createdAt: -1 } }, // latest attendance first within the day
            {
                $group: {
                    _id: "$formattedDate",
                    day: { $first: "$dayName" },
                    attendances: {
                        $push: {
                            id: "$_id",
                            time: "$time",
                            name: "$user.name",
                            username: "$user.username",
                            avatar: "$user.avatar",
                        },
                    },
                },
            },
            { $sort: { _id: -1 } }, // latest date groups first
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    day: 1,
                    attendances: 1,
                },
            },
        ];

        const options = { page, limit };
        const result = await Attendance.aggregatePaginate(Attendance.aggregate(pipeline), options);

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
};
