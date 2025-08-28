import mongoose, { Schema, model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const attendanceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// ✅ Add index here
attendanceSchema.index({ createdAt: -1 });

attendanceSchema.plugin(aggregatePaginate);
const Attendance = mongoose.models.Attendance || model("Attendance", attendanceSchema);

export default Attendance;
