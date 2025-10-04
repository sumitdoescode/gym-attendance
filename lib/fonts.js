import { Urbanist } from "next/font/google";
import { Bebas_Neue } from "next/font/google";

export const logoFont = Bebas_Neue({
    variable: "--font-bebas-neue",
    weight: "400",
    subsets: ["latin"],
});

export const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });
