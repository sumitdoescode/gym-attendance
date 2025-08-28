import { NextResponse } from "next/server";

export const GET = async (req) => {
    if (!req) {
        return NextResponse.json({ success: false, message: "Health Status is not good" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Health status is good" }, { status: 200 });
};
