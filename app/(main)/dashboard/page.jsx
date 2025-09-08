"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Shield, Clock, EllipsisVertical, Loader2 } from "lucide-react";
import axios from "axios";
import MarkAttendance from "@/components/MarkAttendance";
import ProfileStats from "@/components/ProfileStats";
import AttendanceHistory from "@/components/AttendanceHistory";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const fetchOwnUserProfile = async () => {
        try {
            const { data } = await axios.get("/api/user");
            if (data.success) {
                // console.log(data.data.user);
                setUser(data.data.user);
            }
        } catch (error) {
            console.log(error.response);
            // if user profile is not complete, redirect him to complete profile page
            if (!error?.response?.data.isProfileComplete) {
                router.push("/complete-profile");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOwnUserProfile();
    }, []);
    if (loading) {
        return <Loading />;
    }
    return (
        <section className="py-24">
            <Container>
                {/* Profile Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <Avatar className={"w-25 h-25 z-0"}>
                            <AvatarImage src={user?.avatar} alt="User Avatar" />
                            <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            {user?.role === "admin" && <Badge variant={"secondary"}>Admin</Badge>}
                            <h1 className="text-foreground font-bold text-3xl md:text-4xl tracking-tight">{user?.fullName}</h1>
                            <h2 className="text-muted-foreground text-base -mt-1">@{user?.username}</h2>
                            {/* <div className="flex items-center gap-0.5 mt-1">
                                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                                <span className="text-muted-foreground text-base">Fitness Zone Gym 3</span>
                            </div> */}
                        </div>
                    </div>
                </div>

                <MarkAttendance />
                <ProfileStats {...user?.stats} />
                <AttendanceHistory attendanceHistory={user?.attendanceHistory} />
            </Container>
        </section>
    );
};

export default page;
