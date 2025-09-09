"use client";
import React from "react";
import Container from "./Container";
import Link from "next/link";
import { logoFont } from "@/app/layout";
import { Button } from "@/components/ui/button";
import { SignUp, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AlignJustify } from "lucide-react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    return (
        <nav className="text-primary py-2 fixed z-10 min-w-full border-b-1 bg-background/20 backdrop-blur-md w-full">
            <Container>
                <div className="flex items-center justify-between">
                    <SignedIn>
                        <Sidebar />
                        <div className="flex items-center gap-4">
                            {pathname === "/dashboard" ? (
                                <Link href="/feed">
                                    <Button variant="outline" className="text-foreground hover:text-foreground">
                                        Feed
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/dashboard">
                                    <Button variant="outline" className="text-foreground hover:text-foreground">
                                        Dashboard
                                    </Button>
                                </Link>
                            )}
                            <UserButton />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <Link href={"/"} className={`${logoFont.className} text-3xl font-bold tracking-tight uppercase text-primary`}>
                            Strong
                            <span className="text-white">ly</span>
                        </Link>
                    </SignedOut>
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;
