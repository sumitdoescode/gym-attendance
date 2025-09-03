import mongoose, { Schema, model } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        fullName: { type: String },
        gymCode: { type: String, unique: true },
        avatar: { type: String },
        role: {
            type: String,
            enum: ["member", "admin"], // ✅ restrict values
            default: "member",
        },
        isProfileComplete: { type: Boolean, default: false },

        // ✅ Grouped stats
        stats: {
            totalAttendance: { type: Number, default: 0 },
            thisMonthAttendance: { type: Number, default: 0 },
            streak: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || model("User", userSchema);

export default User;
