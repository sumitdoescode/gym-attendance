"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    morning: {
        label: "Morning",
        color: "var(--chart-1)",
    },
    evening: {
        label: "Evening",
        color: "var(--chart-2)",
    },
};

const AnalyticsChart = ({ last10days }) => {
    console.log(last10days);
    return (
        <Card className={"w-full mt-5 p-4"}>
            <CardHeader className={"p-0"}>
                <CardTitle>Last 10 days breakdown</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent className={"p-0"}>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={last10days}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="morning" stackId="a" fill="var(--color-morning)" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="evening" stackId="a" fill="var(--color-evening)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm p-0">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
            </CardFooter> */}
        </Card>
    );
};

export default AnalyticsChart;
