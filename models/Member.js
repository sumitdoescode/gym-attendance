import mongoose, { Schema, model } from "mongoose";

const memberSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        gymCode: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Member = mongoose.models.Member || model("Member", memberSchema);

export default Member;
