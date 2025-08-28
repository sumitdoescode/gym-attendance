import { headers } from "next/headers";
import { Webhook } from "svix";
// import { buffer } from "micro";
import User from "@/models/User";
import connectDB from "@/lib/db";

// api/webhooks/clerk => POST
export async function POST(req) {
    console.log("coming here");
    await connectDB();

    const payload = await req.text();
    const headerPayload = await headers();

    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 });
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return new Response("Invalid signature", { status: 400 });
    }

    const { type, data } = evt;

    console.log("🔔 Incoming webhook:", type, data);

    if (type === "user.created") {
        console.log("coming inside user.created");
        // check if the user is an admin
        const ADMIN_EMAILS = ["hi.sumitbro@gmail.com"];
        const role = ADMIN_EMAILS.includes(data.email_addresses[0]?.email_address) ? "admin" : "member";
        await User.create({
            clerkId: data.id,
            email: data.email_addresses[0]?.email_address || "",
            username: data.username || data.id,
            avatar: data.image_url,
            role,
        });
    }

    if (type === "user.updated") {
        console.log("coming inside user.updated");
        await User.findOneAndUpdate(
            { clerkId: data.id },
            {
                clerkId: data.id,
                email: data.email_addresses[0]?.email_address || "",
                username: data.username || data.id,
                avatar: data.image_url,
            }
        );
    }

    if (type === "user.deleted") {
        console.log("coming inside user.deleted");
        await User.findOneAndDelete({ clerkId: data.id });
    }

    return new Response("Webhook received", { status: 200 });
}
