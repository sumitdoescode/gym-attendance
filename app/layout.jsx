import { Urbanist } from "next/font/google";
import "./globals.css";
import { Bebas_Neue } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const urbanist = Urbanist({
    variable: "--font-urbanist",
    subsets: ["latin"],
});

export const logoFont = Bebas_Neue({
    variable: "--font-bebas-neue",
    weight: "400",
    subsets: ["latin"],
});

export const metadata = {
    title: "Strongly Check-in",
    description: "Easily track gym check-ins, monitor attendance trends, and manage members with Strongly Check-in — the smart gym attendance system.",
};

export default function RootLayout({ children }) {
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
            <html lang="en">
                <body className={`${urbanist.variable} antialiased`}>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
