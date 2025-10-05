import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { urbanist } from "@/lib/fonts";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Strongly",
    description: "Easily track gym check-ins, monitor attendance trends, and manage members with Strongly Check-in — the smart gym attendance system.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${urbanist.variable} antialiased flex flex-col min-h-screen`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <SessionProvider>
                        {children}
                        <Footer />
                    </SessionProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
