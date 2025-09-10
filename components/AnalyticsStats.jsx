import React from "react";
import { Users, CheckCheck, Sun, SunMoon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const AnalyticsStats = ({ totalMembers, todayTotal, todayMorning, todayEvening }) => {
    return (
        <div className="mt-10 flex flex-col md:flex-row gap-5">
            {/* first stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0 gap-0"}>
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-rose-500" />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right "}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight mr-0.5">{totalMembers}</h1>
                    <h2 className="text-muted-foreground text-base">Total Members</h2>
                </CardContent>
            </Card>

            {/* second stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0 gap-0"}>
                    <div className={`w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <CheckCheck className={`w-6 h-6 text-purple-500`} />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right"}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight">{todayTotal}</h1>
                    <h2 className="text-muted-foreground text-base">Today</h2>
                </CardContent>
            </Card>

            {/* third stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0 gap-0"}>
                    <div className={`w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Sun className={`w-6 h-6 text-blue-500`} />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right"}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight">{todayMorning}</h1>
                    <h2 className="text-muted-foreground text-base">Morning</h2>
                </CardContent>
            </Card>

            {/* fourth stat */}
            <Card className={"p-4 border-none gap-0 flex-1"}>
                <CardHeader className={"p-0 gap-0"}>
                    <div className={`w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <SunMoon className={`w-6 h-6 text-orange-500`} />
                    </div>
                </CardHeader>
                <CardContent className={"p-0 text-right "}>
                    <h1 className="text-foreground font-bold text-4xl tracking-tight mr-0.5">{todayEvening}</h1>
                    <h2 className="text-muted-foreground text-base">Evening</h2>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsStats;
