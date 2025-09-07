"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const Provider = ({ children }) => {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                elements: {
                    avatarBox: {
                        width: "40px",
                        height: "40px",
                    },
                },
            }}
        >
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                {children}
                <Toaster />
            </ThemeProvider>
        </ClerkProvider>
    );
};

export default Provider;
