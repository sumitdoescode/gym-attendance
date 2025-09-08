import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import Member from "@/models/Member";
import { auth } from "@clerk/nextjs/server";

// GET /api/admin/analytics
// get overall analytics (morning + evening attendance today, last 10 days breakdown, total members)
export const GET = async () => {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        // check if the user is an admin
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // check if user is an admin
        if (user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        // Base start and end of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Today Morning
        const todayMorning = await Attendance.countDocuments({
            createdAt: {
                $gte: new Date(new Date(startOfToday).setHours(5, 0, 0, 0)),
                $lt: new Date(new Date(startOfToday).setHours(10, 0, 0, 0)),
            },
        });

        // Today Evening
        const todayEvening = await Attendance.countDocuments({
            createdAt: {
                $gte: new Date(new Date(startOfToday).setHours(17, 0, 0, 0)),
                $lt: new Date(new Date(startOfToday).setHours(22, 0, 0, 0)),
            },
        });

        // Today Total
        const todayTotal = await Attendance.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday },
        });

        // ✅ Last 10 days breakdown (including today)
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 9);
        tenDaysAgo.setHours(0, 0, 0, 0); // start of the day

        const last10days = await Attendance.aggregate([
            {
                $match: {
                    createdAt: { $gte: tenDaysAgo },
                },
            },
            {
                $addFields: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata", // 👈 your timezone
                        },
                    },
                    dayOfWeek: { $dayOfWeek: { date: "$createdAt", timezone: "Asia/Kolkata" } },
                    hour: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } },
                },
            },
            {
                $group: {
                    _id: "$date",
                    morning: {
                        $sum: {
                            $cond: [{ $and: [{ $gte: ["$hour", 5] }, { $lt: ["$hour", 10] }] }, 1, 0],
                        },
                    },
                    evening: {
                        $sum: {
                            $cond: [{ $and: [{ $gte: ["$hour", 17] }, { $lt: ["$hour", 22] }] }, 1, 0],
                        },
                    },
                    total: { $sum: 1 },
                    dayOfWeek: { $first: "$dayOfWeek" },
                },
            },
            {
                $addFields: {
                    day: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$dayOfWeek", 1] }, then: "Sunday" },
                                { case: { $eq: ["$dayOfWeek", 2] }, then: "Monday" },
                                { case: { $eq: ["$dayOfWeek", 3] }, then: "Tuesday" },
                                { case: { $eq: ["$dayOfWeek", 4] }, then: "Wednesday" },
                                { case: { $eq: ["$dayOfWeek", 5] }, then: "Thursday" },
                                { case: { $eq: ["$dayOfWeek", 6] }, then: "Friday" },
                                { case: { $eq: ["$dayOfWeek", 7] }, then: "Saturday" },
                            ],
                            default: "Unknown",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    day: 1,
                    morning: 1,
                    evening: 1,
                    total: 1,
                },
            },
            { $sort: { date: -1 } },
        ]);

        // ✅ Total Gym Members
        const totalMembers = await Member.countDocuments();

        return NextResponse.json(
            {
                success: true,
                data: {
                    todayMorning,
                    todayEvening,
                    todayTotal,
                    totalMembers,
                    last10days,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
    }
};
