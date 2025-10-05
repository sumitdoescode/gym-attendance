"use client";
import Container from "@/components/Container";

import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import AnalyticsStats from "@/components/AnalyticsStats";
import AnalyticsChart from "@/components/AnalyticsChart";

const Page = () => {
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get("/api/admin/analytics");
            setAnalytics(data.data);
        } catch (error) {
            console.log("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <section className="py-24 grow">
            <Container>
                <h1 className="text-4xl font-bold">Analytics</h1>

                <AnalyticsStats {...analytics} />
                {/* <h1 className="text-2xl mt-10 font-bold">Last 10 days</h1> */}
                <AnalyticsChart {...analytics} />
            </Container>
        </section>
    );
};

export default Page;
