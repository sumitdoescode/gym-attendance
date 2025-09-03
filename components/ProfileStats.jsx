import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Calendar, Flame } from "lucide-react";

const ProfileStats = ({ totalAttendance, thisMonthAttendance, streak }) => {
    return (
        <div className="mt-10 flex flex-col sm:flex-row gap-5">
            {/* first stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0"}>
                    <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Target className={`w-6 h-6 text-primary`} />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right"}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight">{totalAttendance}</h1>
                    <h2 className="text-muted-foreground text-base">Total Attendance</h2>
                </CardContent>
            </Card>

            {/* second stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0"}>
                    <div className={`w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Calendar className={`w-6 h-6 text-blue-500`} />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right"}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight">{thisMonthAttendance}</h1>
                    <h2 className="text-muted-foreground text-base">This Month</h2>
                </CardContent>
            </Card>

            {/* third stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0"}>
                    <div className={`w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Flame className={`w-6 h-6 text-orange-500`} />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right "}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight mr-0.5">{streak}</h1>
                    <h2 className="text-muted-foreground text-base">Streak</h2>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileStats;
