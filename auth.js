import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import { ObjectId } from "mongodb";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    events: {
        async createUser({ user }) {
            console.log("coming inside create user");
            const client = await clientPromise;
            const db = client.db();
            const role = user.email === "hi.sumitbro@gmail.com" ? "admin" : "member";
            await db.collection("users").updateOne({ _id: new ObjectId(user.id) }, { $set: { email: user.email, avatar: user.image, role } });
            console.log("User role updated");
        },
    },

    callbacks: {
        async jwt({ token, user }) {
            // On first login, user object is available
            if (user) {
                token.id = user.id;
                token.role = user.role || "member"; // default role if not set
            }
            return token;
        },

        // Runs whenever a session is checked/created
        async session({ session, token }) {
            if (session?.user && token?.id) {
                session.user.id = token.id;
                session.user.role = token.role || "member";
            }
            return session;
        },
    },
});
