"use client";
import React from "react";
import Container from "./Container";
import Link from "next/link";
import { logoFont } from "@/app/layout";
import { Button } from "@/components/ui/button";
import { SignUp, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AlignJustify } from "lucide-react";
import Sidebar from "./Sidebar";

const Navbar = () => {
    return (
        <nav className="text-primary py-2 fixed z-10 min-w-full border-b-1 bg-background/20 backdrop-blur-md w-full">
            <Container>
                <div className="flex items-center justify-between">
                    <Sidebar />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;
