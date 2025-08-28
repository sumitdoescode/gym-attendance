import React from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, BarChart3, Zap, UserCheck, Users, TrendingUp, Shield, Clock } from "lucide-react";

const page = () => {
    return (
        <>
            {/* hero section */}
            <section className="min-h-[80vh] flex items-center bg-background">
                <Container>
                    <div className="max-w-md sm:max-w-lg  md:max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center text-foreground tracking-tight">
                            Track <span className="text-primary">Attendance</span>
                            <br />
                            as it happens
                        </h1>
                        <p className="text-base text-muted-foreground mt-5 text-center">See every member check-in as it happens — track attendance, trends, streaks in real time.</p>
                        <Link href="" className="mt-5 mx-auto flex w-fit text-base">
                            <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground"}>
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>

            {/* performace section */}
            <section className="py-14 md:py-20 bg-secondary/20">
                <Container>
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
                            Built for <span className="text-primary">Performance</span>
                        </h2>
                        <p className="text-base text-[#9CA3AF] max-w-2xl mx-auto">Everything you need to track attendance and stay motivated</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-10">
                        <div className="bg-card p-4 rounded-2xl border border-[#1F1F1F] hover:border-[#00FF88]/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-[#00FF88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF88]/20 transition-all duration-300">
                                <UserCheck className="w-8 h-8 text-[#00FF88]" />
                            </div>
                            <h3 className="text-2xl text-card-foreground font-bold">Attendance History</h3>
                            <p className="text-[#9CA3AF] leading-relaxed mt-3">Track your check-ins easily with a clean, intuitive interface that shows your gym journey.</p>
                        </div>

                        <div className="bg-card p-4 rounded-2xl border border-[#1F1F1F] hover:border-[#38BDF8]/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#38BDF8]/20 transition-all duration-300">
                                <Zap className="w-8 h-8 text-[#38BDF8]" />
                            </div>
                            <h3 className="text-2xl text-card-foreground font-bold">Streaks</h3>
                            <p className="text-[#9CA3AF] leading-relaxed mt-3">Stay motivated with consistency tracking that celebrates your dedication and progress.</p>
                        </div>

                        <div className="bg-card p-4 rounded-2xl border border-[#1F1F1F] hover:border-[#00FF88]/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-[#00FF88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF88]/20 transition-all duration-300">
                                <BarChart3 className="w-8 h-8 text-[#00FF88]" />
                            </div>
                            <h3 className="text-2xl text-card-foreground font-bold">Analytics</h3>
                            <p className="text-[#9CA3AF] leading-relaxed mt-3">Gym owners see attendance insights with detailed analytics and member engagement data.</p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* how it works section */}
            <section>
                <Container></Container>
            </section>

            {/* why go digital section */}

            <section>
                <Container></Container>
            </section>

            {/* ready to start tracking */}
            <section>
                <Container></Container>
            </section>
        </>
    );
};

export default page;
