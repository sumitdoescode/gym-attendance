"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const layout = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get("/api/user/me");
                if (data.success) {
                    // if user is not admin
                    if (data.data.user.role !== "admin") {
                        router.push("/");
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    return <>{children}</>;
};

export default layout;
