import React from "react";
import Container from "./Container";
import Link from "next/link";
import { logoFont } from "@/app/layout";
import { Button } from "@/components/ui/button";
import { SignUp, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const Navbar = () => {
    return (
        <nav className="text-primary py-2 fixed z-10 min-w-full border-b-1 bg-background/20 backdrop-blur-md">
            <Container>
                <div className="flex items-center justify-between">
                    <Link href={"/"} className={`${logoFont.className} text-3xl font-bold tracking-tight uppercase`}>
                        Strong
                        <span className="text-white">ly</span>
                    </Link>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;
