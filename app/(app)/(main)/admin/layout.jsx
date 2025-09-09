"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useUserContext } from "@/contexts/UserContextProvider";

const layout = ({ children }) => {
    const router = useRouter();
    const { user, loading } = useUserContext();

    useEffect(() => {
        if (!loading && user && user.role !== "admin") {
            router.push("/");
        }
    }, [loading, user]);

    if (loading) {
        return <Loading />;
    }

    if (!user || user.role !== "admin") {
        return null; // prevent flashing before redirect
    }

    return <>{children}</>;
};

export default layout;
