import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({ success: true, message: "Health status is good", timestamp: new Date().toISOString() }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Health check failed", error: error.message }, { status: 500 });
    }
}
