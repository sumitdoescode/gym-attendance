import React from "react";
import { logoFont } from "@/lib/fonts";
// client components cannot import from server components but server components can
import Link from "next/link";

const Logo = () => {
    console.log(logoFont);
    return (
        <Link href={"/"} className={`${logoFont.className}  text-3xl font-bold tracking-tight uppercase text-primary`}>
            Strong
            <span className="text-white">ly</span>
        </Link>
    );
};

export default Logo;
