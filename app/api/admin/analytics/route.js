import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import Member from "@/models/Member";
import { auth } from "@/auth";
import moment from "moment-timezone";

// GET /api/admin/analytics
// get overall analytics (morning + evening attendance today, last 10 days breakdown, total members)
export async function GET() {
    try {
        await connectDB();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // check if the user is an admin
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // check if user is an admin
        if (user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        // Start of today (00:00 IST)
        const startOfToday = moment().tz("Asia/Kolkata").startOf("day").toDate();

        // End of today (23:59:59 IST)
        const endOfToday = moment().tz("Asia/Kolkata").endOf("day").toDate();

        const morningStart = moment().tz("Asia/Kolkata").startOf("day").hour(5).toDate();
        const morningEnd = moment().tz("Asia/Kolkata").startOf("day").hour(10).toDate();

        const eveningStart = moment().tz("Asia/Kolkata").startOf("day").hour(17).toDate();
        const eveningEnd = moment().tz("Asia/Kolkata").startOf("day").hour(22).toDate();

        const todayMorning = await Attendance.countDocuments({
            createdAt: { $gte: morningStart, $lt: morningEnd },
        });

        const todayEvening = await Attendance.countDocuments({
            createdAt: { $gte: eveningStart, $lt: eveningEnd },
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
}
