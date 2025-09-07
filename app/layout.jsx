"use client";

import { Urbanist } from "next/font/google";
import "./globals.css";
import { Bebas_Neue } from "next/font/google";

import Provider from "@/components/Provider";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export const logoFont = Bebas_Neue({
    variable: "--font-bebas-neue",
    weight: "400",
    subsets: ["latin"],
});

const metadata = {
    title: "Strongly Check-in",
    description: "Easily track gym check-ins, monitor attendance trends, and manage members with Strongly Check-in — the smart gym attendance system.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${urbanist.variable} antialiased`}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
