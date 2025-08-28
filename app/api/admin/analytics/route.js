import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
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

        const now = new Date();

        // ✅ Start + End of today
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));

        // ✅ Today Morning 5–10 AM
        const todayMorning = await Attendance.countDocuments({
            createdAt: {
                $gte: new Date(startOfToday.setHours(5, 0, 0, 0)),
                $lt: new Date(startOfToday.setHours(10, 0, 0, 0)),
            },
        });

        // ✅ Today Evening 5–10 PM
        const todayEvening = await Attendance.countDocuments({
            createdAt: {
                $gte: new Date(startOfToday.setHours(17, 0, 0, 0)),
                $lt: new Date(startOfToday.setHours(22, 0, 0, 0)),
            },
        });

        // ✅ Today Total Attendance
        const todayTotal = await Attendance.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday },
        });

        // ✅ Last 10 days breakdown
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 9); // include today

        const last10days = await Attendance.aggregate([
            { $match: { createdAt: { $gte: tenDaysAgo } } },
            {
                $addFields: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dayOfWeek: { $dayOfWeek: "$createdAt" },
                    hour: { $hour: "$createdAt" },
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
            { $sort: { date: 1 } },
        ]);

        // ✅ Total Gym Members
        const totalMembers = await User.countDocuments();

        return NextResponse.json(
            {
                success: true,
                data: {
                    todayMorning,
                    todayEvening,
                    todayTotal,
                    last10days,
                    totalMembers,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
    }
};
