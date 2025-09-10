import React from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, BarChart3, Zap, UserCheck, Users, TrendingUp, Shield, Clock } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUp, SignedIn, SignedOut } from "@clerk/nextjs";

const page = () => {
    return (
        <>
            {/* hero section */}
            <section className="min-h-[80vh] flex items-center bg-background">
                <Container>
                    <div className="max-w-md sm:max-w-lg  md:max-w-3xl mx-auto">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-center text-foreground tracking-tight">
                            Track <span className="text-primary">Attendance</span>
                            <br />
                            as it
                            <span className=""> happens</span>
                            {/* as it happens */}
                        </h1>
                        <p className="text-lg text-muted-foreground mt-3 text-center font-normal">See every member check-in as it happens — track attendance, trends, streaks in real time.</p>

                        <SignedOut>
                            <Link href="/sign-in" className="mt-5 mx-auto flex w-fit text-base">
                                <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer"}>
                                    Get Started
                                </Button>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/feed" className="mt-5 mx-auto flex w-fit text-base">
                                <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer"}>
                                    Go to Feed
                                </Button>
                            </Link>
                        </SignedIn>
                    </div>
                </Container>
            </section>

            {/* performace section */}
            <section className="py-20 bg-secondary/20">
                <Container>
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
                            Built for <span className="text-[#38BDF8]">Performance</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <Card className={"border border-[#1F1F1F] hover:border-[#00FF88]/30 transition-all duration-300 group gap-1.5 p-4"}>
                            <CardHeader className={"mb-0 p-0"}>
                                <div className="w-16 h-16 bg-[#00FF88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF88]/20 transition-all duration-300">
                                    <UserCheck className="w-8 h-8 text-[#00FF88]" />
                                </div>
                            </CardHeader>
                            <CardContent className={"m-0 p-0"}>
                                <h3 className="text-2xl font-bold">Attendance History</h3>
                            </CardContent>
                            <CardFooter className={"p-0"}>
                                <p className="text-muted-foreground text-lg">Track your check-ins easily with a clean, intuitive interface that shows your gym journey.</p>
                            </CardFooter>
                        </Card>

                        <Card className={"border border-[#1F1F1F] hover:border-[#00FF88]/30 transition-all duration-300 group gap-1.5 p-4"}>
                            <CardHeader className={"mb-0 p-0"}>
                                <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#38BDF8]/20 transition-all duration-300">
                                    <Zap className="w-8 h-8 text-[#38BDF8]" />
                                </div>
                            </CardHeader>
                            <CardContent className={"m-0 p-0"}>
                                <h3 className="text-2xl font-bold">Streaks</h3>
                            </CardContent>
                            <CardFooter className={"p-0"}>
                                <p className="text-muted-foreground text-lg">Stay motivated with consistency tracking that celebrates your dedication and progress.</p>
                            </CardFooter>
                        </Card>

                        <Card className={"border border-[#1F1F1F] hover:border-[#00FF88]/30 transition-all duration-300 group gap-1.5 p-4"}>
                            <CardHeader className={"mb-0 p-0"}>
                                <div className="w-16 h-16 bg-[#00FF88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF88]/20 transition-all duration-300">
                                    <BarChart3 className="w-8 h-8 text-[#00FF88]" />
                                </div>
                            </CardHeader>
                            <CardContent className={"m-0 p-0"}>
                                <h3 className="text-2xl font-bold">Analytics</h3>
                            </CardContent>
                            <CardFooter className={"p-0"}>
                                <p className="text-muted-foreground text-lg">Gym members see attendance insights with detailed analytics.</p>
                            </CardFooter>
                        </Card>
                    </div>
                </Container>
            </section>

            {/* how it works section */}
            <section className="py-20 bg-background">
                <Container>
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
                            How it <span className="text-[#38BDF8]">Works</span>
                        </h2>
                        {/* <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mt-3">Get started in minutes, not hours</p> */}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#00FF88]/20 to-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto border border-[#00FF88]/30 group-hover:scale-110 transition-all duration-300">
                                <span className="text-2xl font-black text-[#00FF88]">1</span>
                            </div>
                            <h3 className="text-xl font-bold mt-5">Login with Google</h3>
                            <p className="text-muted-foreground text-base mt-2">Quick and secure authentication with your Google account</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#38BDF8]/20 to-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto border border-[#38BDF8]/30 group-hover:scale-110 transition-all duration-300">
                                <span className="text-2xl font-black text-[#38BDF8]">2</span>
                            </div>
                            <h3 className="text-xl font-bold mt-5">Create Gym Profile</h3>
                            <p className="text-muted-foreground text-base mt-2">Set up your profile with gym name and unique gym code</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#00FF88]/20 to-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto border border-[#00FF88]/30 group-hover:scale-110 transition-all duration-300">
                                <span className="text-2xl font-black text-[#00FF88]">3</span>
                            </div>
                            <h3 className="text-xl font-bold mt-5">Mark Attendance</h3>
                            <p className="text-muted-foreground text-base mt-2">One-click check-in system for effortless attendance tracking</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#38BDF8]/20 to-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto border border-[#38BDF8]/30 group-hover:scale-110 transition-all duration-300">
                                <span className="text-2xl font-black text-[#38BDF8]">4</span>
                            </div>
                            <h3 className="text-xl font-bold mt-5">Track Progress</h3>
                            <p className="text-muted-foreground text-base mt-2">View your streaks, history, and consistency metrics</p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* why go digital section */}

            <section className="py-20 bg-secondary/20">
                <Container>
                    <div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tight">
                            Why Go <span className="text-[#38BDF8]">Digital?</span>
                        </h2>
                        {/* <p className="text-base text-muted-foreground mt-3 leading-relaxed">Transform your gym experience with modern attendance</p> */}
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-16 justify-between">
                        <div className="flex md:flex-col items-start gap-4">
                            <div>
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1.5">
                                    <CheckCircle className="w-7 h-7 text-black" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Cleaner than registers</h3>
                                <p className="text-base text-muted-foreground mt-1">No more messy paper logs or lost attendance records</p>
                            </div>
                        </div>

                        <div className="flex md:flex-col items-start gap-4">
                            <div>
                                <div className="w-8 h-8 bg-[#38BDF8] rounded-full flex items-center justify-center flex-shrink-0 mt-1.5">
                                    <Users className="w-7 h-7 text-black" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Easy for members</h3>
                                <p className="text-base text-muted-foreground mt-1">Simple one-click check-in process that anyone can use</p>
                            </div>
                        </div>

                        <div className="flex md:flex-col items-start gap-4">
                            <div>
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1.5">
                                    <Zap className="w-7 h-7 text-black" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Boosts consistency</h3>
                                <p className="text-muted-foreground text-base mt-1">Streaks and progress tracking motivates regular attendance</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ready to start tracking */}
            <section className="py-20 bg-background">
                <Container>
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                            Ready to Start <span className="text-primary">Tracking?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">Thousands are transforming fitness with smart tracking—join them.</p>
                        <Link href="/feed" className="mt-8 inline-block">
                            <Button className={"rounded-full text-base text-primary-foreground font-semibold cursor-pointer"} size={"lg"}>
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default page;
