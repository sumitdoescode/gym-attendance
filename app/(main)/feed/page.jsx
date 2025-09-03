"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

import Loading from "@/components/Loading";
import axios from "axios";
import FeedResults from "@/components/FeedResults";

const page = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [nextPage, setNextPage] = useState(2);

    const fetchFeed = async (pageNum = 1) => {
        try {
            const { data } = await axios.get(`/api/attendance?page=${pageNum}&limit=2`);
            if (data.success) {
                if (pageNum === 1) {
                    setResults(data.data.docs);
                } else {
                    setResults((prev) => [...prev, ...data.data.docs]);
                }
                setHasNextPage(data.data.hasNextPage);
                setNextPage(data.data.nextPage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed(1);
    }, []);

    if (loading) {
        return <Loading />;
    }
    return (
        <section className="py-20">
            <Container>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/50 blur-3xl"></div>
                            <h1 className="relative text-3xl font-black leading-none bg-gradient-to-b from-primary via-primary to-primary bg-clip-text text-transparent select-none">
                                <span className="text-foreground">Recent</span> Activity
                            </h1>
                        </div>
                        {/* <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Recent <span className="text-primary">Activity</span>
                        </h1> */}
                        <div className="flex items-center space-x-2 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            <span className="text-primary text-sm tracking-wider">LIVE</span>
                        </div>
                    </div>
                    {/* <Link href="/dashboard" className="inline-block">
                        <Button className={"rounded-full text-primary-foreground font-semibold cursor-pointer"}>Mark Attendance</Button>
                    </Link> */}
                </div>

                {/* feed results */}
                <FeedResults results={results} />

                {/* load more button */}
                {hasNextPage && (
                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={() => {
                                fetchFeed(nextPage);
                            }}
                            className="rounded-full font-semibold"
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default page;
