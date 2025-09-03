"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const layout = ({ children }) => {
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);
    if (loading) {
        return <Loading />;
    }
    return <>{children}</>;
};

export default layout;
