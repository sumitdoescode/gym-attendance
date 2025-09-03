"use client";
import { Loader2 } from "lucide-react";

const Loading = ({ fullScreen = true, message = "Loading..." }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-3
      ${fullScreen ? "min-h-screen" : "py-10"} `}
        >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            {/* <p className="text-muted-foreground text-sm">{message}</p> */}
        </div>
    );
};

export default Loading;
