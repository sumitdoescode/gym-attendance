"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/Loading";
import axios from "axios";

const page = () => {
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            const { data } = await axios.get("/api/attendance");
            if (data.success) {
                console.log(data);
                // Handle successful feed retrieval
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    if (loading) {
        return <Loading />;
    }
    return (
        <section className="py-20">
            <Container>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Recent <span className="text-primary">Activity</span>
                        </h1>
                        <div className="flex items-center space-x-2 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            <span className="text-primary text-sm tracking-wider">LIVE</span>
                        </div>
                    </div>
                    {/* <Link href="/dashboard" className="inline-block">
                        <Button className={"rounded-full text-primary-foreground font-semibold cursor-pointer"}>Mark Attendance</Button>
                    </Link> */}
                </div>

                {/* feed */}
                <div className="mt-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold">Today</h2>
                        <span className="w-10 h-10 rounded-full bg-primary/8 text-primary text-md font-bold flex items-center justify-center">4</span>
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => {
                            return (
                                <Card className={"cursor-pointer border-none transition-all duration-200 p-3 gap-0"} key={item}>
                                    <CardHeader className={"p-0 gap-0"}>
                                        <Link href="/dashboard">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h2 className="text-foreground text-lg sm:text-xl tracking-tight font-bold">Sumit Raj</h2>
                                                        <h3 className="text-muted-foreground text-sm -mt-1">@sumitbro</h3>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground mt-1">5:20</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-bold">Yesterday</h2>
                            <span className="w-10 h-10 rounded-full bg-[#38BDF8]/8 text-[#38BDF8] text-md font-bold flex items-center justify-center">4</span>
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => {
                                return (
                                    <Card className={"cursor-pointer border-none transition-all duration-200 p-3 gap-0"} key={item}>
                                        <CardHeader className={"p-0 gap-0"}>
                                            <Link href="/dashboard">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h2 className="text-foreground text-lg sm:text-xl tracking-tight font-bold">Sumit Raj</h2>
                                                            <h3 className="text-muted-foreground text-sm -mt-1">@sumitbro</h3>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground mt-1">5:20</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default page;
