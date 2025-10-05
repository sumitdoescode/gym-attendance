"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Shield, Clock, EllipsisVertical, Loader2, Home } from "lucide-react";

import axios from "axios";
import { Button } from "@/components/ui/button";
import ProfileStats from "@/components/ProfileStats";
import AttendanceHistory from "@/components/AttendanceHistory";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useSession, signIn } from "next-auth/react";

const page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return; // wait for session to load

        if (!session) {
            signIn("google");
            return;
        }
    }, [session, status]);

    const params = useParams();
    const { username } = params;

    const fetchUserProfile = async () => {
        try {
            const { data } = await axios.get(`/api/user/${username}`);
            if (data.success) {
                console.log(data.data.user);
                setUser(data.data.user);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setNotFound(true);
            }
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserProfile();
    }, []);
    if (loading) {
        return <Loading />;
    }

    if (notFound) {
        return (
            <section className="min-h-screen flex items-center justify-center text-center py-24 grow">
                <Container>
                    <div className="-mt-5 max-w-sm mx-auto">
                        <h1 className="text-5xl font-bold text-foreground">User Not Found</h1>
                        <p className="text-muted-foreground mt-2">
                            The username <b>@{username}</b> does not exist.
                        </p>
                        <Button onClick={() => (window.location.href = "/")} className="group h-10 rounded-2xl mt-5 shadow-2xl shadown-primary/25 transform transition-all duration-300 text-base w-full sm:w-auto">
                            <Home className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                            Go to Home
                        </Button>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-24 grow">
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
                            {/* <div className="flex items-center gap-0.5 mt-1">
                                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                                <span className="text-muted-foreground text-base">Fitness Zone Gym 3</span>
                            </div> */}
                        </div>
                    </div>
                </div>

                <ProfileStats {...user?.stats} />
                <AttendanceHistory attendanceHistory={user?.attendanceHistory} />
            </Container>
        </section>
    );
};

export default page;
