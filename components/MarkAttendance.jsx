import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const MarkAttendance = ({ fetchOwnUserProfile }) => {
    const [loading, setLoading] = useState(false);
    const markAttendance = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post("/api/attendance");
            if (data.success) {
                toast.success("Attendance marked successfully!");
                fetchOwnUserProfile();
            }
        } catch (error) {
            toast.error("Failed to Mark Attendance", {
                description: error.response?.data?.message || "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Button size={"lg"} className={"bg-primary text-primary-foreground text-lg font-medium tracking-tight mt-8 w-full md:w-auto shadow-[0_0_40px_10px_rgba(16,185,129,0.2)] cursor-pointer"} onClick={markAttendance} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Marking.." : "Mark Attendance"}
        </Button>
    );
};

export default MarkAttendance;
