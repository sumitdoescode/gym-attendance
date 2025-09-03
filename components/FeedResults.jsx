import React from "react";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const FeedResults = ({ results }) => {
    return results.map((doc, index) => {
        return (
            <div className="mt-10" key={index}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{doc.date}</h2>
                        <span className="w-8 h-8 rounded-full bg-[#38BDF8]/8 text-[#38BDF8] text-md font-bold flex items-center justify-center">{doc.attendances.length}</span>
                    </div>
                    <Badge variant={"outline"}>{doc.day}</Badge>
                    {/* <h2 className="text-sm text-orange-500 bg-orange-500/10 p-2 rounded-full">{doc.day}</h2> */}
                </div>
                <div className="flex flex-col gap-3 mt-3">
                    {doc.attendances.map(({ id, time, fullName, username, avatar }) => {
                        return (
                            <Card className={"cursor-pointer border-none transition-all duration-200 p-3 gap-0"} key={id}>
                                <CardHeader className={"p-0 gap-0"}>
                                    <Link href={`/u/${username}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={avatar} />
                                                    <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h2 className="text-foreground text-lg sm:text-xl tracking-tight font-bold">{fullName}</h2>
                                                    <h3 className="text-muted-foreground text-sm -mt-1">@{username}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-primary/10 py-1 px-1.5 rounded-xl">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span className="text-xs text-primary inline-block">{time}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    });
};

export default FeedResults;
