import React from "react";
import { Clock } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AttendanceHistory = ({ attendanceHistory }) => {
    if (attendanceHistory.length === 0) {
        return null;
    }
    return (
        <div>
            <h2 className="text-2xl font-bold mt-10">Attendance History</h2>
            <div className="flex flex-col gap-3 mt-5">
                {attendanceHistory.length &&
                    attendanceHistory.map(({ _id, date, day, time }) => {
                        return (
                            <Card className={"cursor-pointer border-none transition-all duration-200 p-3 gap-0"} key={_id}>
                                <CardHeader className={"p-0 gap-0"}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* <Avatar className="w-10 h-10">
                                            <AvatarImage src={avatar} />
                                            <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                                        </Avatar> */}
                                            <div>
                                                <h2 className="text-foreground text-lg sm:text-xl tracking-tight font-bold">{date}</h2>
                                                <Badge variant="secondary" className={"mt-0.5 ml-0.5"}>
                                                    {day}
                                                </Badge>
                                                {/* <h3 className="text-muted-foreground text-sm -mt-1">{day}</h3> */}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-primary/10 py-1 px-1.5 rounded-xl">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-xs text-primary inline-block">{time}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );
};

export default AttendanceHistory;
