"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const page = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken({ template: "default" });
            console.log(token);
        };
        fetchToken();
    }, []);
    return (
        <div>
            <h1 className="text-xl">This is dashboard</h1>
        </div>
    );
};

export default page;
