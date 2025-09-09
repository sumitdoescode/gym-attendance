import { Urbanist } from "next/font/google";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import UserContextProvider from "@/contexts/UserContextProvider";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export const metadata = {
    title: "Strongly Check-in",
    description: "Easily track gym check-ins, monitor attendance trends, and manage members with Strongly Check-in — the smart gym attendance system.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${urbanist.variable} antialiased`}>
                <Provider>
                    <UserContextProvider>{children}</UserContextProvider>
                </Provider>
            </body>
        </html>
    );
}
