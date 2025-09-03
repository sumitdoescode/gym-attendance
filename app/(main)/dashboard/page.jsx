"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Shield, Clock, EllipsisVertical, Loader2 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "axios";
import { toast } from "sonner";
import MarkAttendance from "@/components/MarkAttendance";
import ProfileStats from "@/components/ProfileStats";
import AttendanceHistory from "@/components/AttendanceHistory";
import Loading from "@/components/Loading";

const page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOwnUserProfile = async () => {
        try {
            const { data } = await axios.get("/api/user");
            if (data.success) {
                console.log(data.data.user);
                setUser(data.data.user);
            }
        } catch (error) {
            console.log(error.response?.data);
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
                            <h1 className="text-foreground font-bold text-3xl md:text-4xl tracking-tight">{user?.fullName}</h1>
                            <h2 className="text-muted-foreground text-base -mt-1">@{user?.username}</h2>
                            <div className="flex items-center gap-0.5 mt-1">
                                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                                <span className="text-muted-foreground text-base">Fitness Zone Gym 3</span>
                            </div>
                        </div>
                    </div>

                    <Popover>
                        <PopoverTrigger>
                            <div className={`w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <EllipsisVertical className={`w-6 h-6 text-blue-500`} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>Place content for the popover here.</PopoverContent>
                    </Popover>
                </div>

                <MarkAttendance />
                <ProfileStats {...user?.stats} />
                <AttendanceHistory attendanceHistory={user?.attendanceHistory} />
            </Container>
        </section>
    );
};

export default page;
