"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { User, Key, ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useUserContext } from "@/contexts/UserContextProvider";

const page = () => {
    const [fullName, setFullName] = useState("");
    const [gymCode, setGymCode] = useState("");
    const [updating, setUpdating] = useState(false);

    const router = useRouter();
    const { user, loading } = useUserContext();
    useEffect(() => {
        if (user) {
            setFullName(user?.fullName);
            setGymCode(user?.gymCode);
        }
    }, [user]);

    const updateProfile = async () => {
        try {
            setUpdating(true);
            const { data } = await axios.post("/api/user", {
                fullName,
                gymCode,
            });
            toast.success("✅ Profile updated successfully");
            router.push("/dashboard");
        } catch (error) {
            toast.error("❌ Failed to update profile", {
                title: error?.response?.data?.message || "Try again later",
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile();
    };

    if (loading) return <Loading />;
    const isFormValid = fullName?.trim().length > 3 && gymCode?.trim().length > 0;
    return (
        <section className="py-20">
            <Container>
                {/* <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6"> */}
                <div className="w-full max-w-sm mx-auto">
                    {/* Logo */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl font-bold text-foreground tracking-tight`}>Strongly</h1>
                        <div className="w-12 h-0.5 bg-primary mx-auto mt-3"></div>
                    </div>

                    {/* Form */}
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-foreground">Update Your Profile</h2>
                            <p className="text-muted-foreground text-sm">Let's get your account ready before you start checking in</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className={`pl-12 h-12 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200`}
                                    />
                                </div>
                            </div>

                            {/* Gym Code */}
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-emerald-500" />
                                    <Input
                                        id="gymCode"
                                        type="number"
                                        placeholder="Enter your gym code"
                                        value={gymCode}
                                        onChange={(e) => setGymCode(e.target.value)}
                                        className={`pl-12 h-12 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 `}
                                    />
                                </div>
                                <p className="text-zinc-500 text-xs">Ask your gym staff for the access code</p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!isFormValid || updating}
                                className="w-full h-12 bg-primary hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-primary-foreground text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed mt-8"
                            >
                                {updating ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Save & Continue</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
                {/* </div> */}
            </Container>
        </section>
    );
};

export default page;
