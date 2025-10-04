"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useSession, signIn } from "next-auth/react";

const layout = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return; // wait for session to load

        if (!session) {
            signIn("google");
            return;
        }

        // this means we are logged in here
        if (!session.user || session.user.role !== "admin") {
            router.push("/");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <Loading />;
    }

    if (!session?.user || session?.user?.role !== "admin") {
        return null; // prevent flashing before redirect
    }

    return <>{children}</>;
};

export default layout;
