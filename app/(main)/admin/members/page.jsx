"use client";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

import AddMemberDialog from "@/components/AddMemberDialog";
import MemberCard from "@/components/MemberCard";
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

const Page = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get("/api/admin/members");
            setMembers(data.data.members);
            console.log(data.data.members);
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
        <section className="py-24">
            <Container>
                <h1 className="text-4xl font-bold">Members</h1>

                {/* total members count card */}
                <Card className="mt-5 gap-0 p-4 border-none">
                    <CardHeader className="m-0 p-0">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-rose-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="text-right p-0 mt-0">
                        <h1 className="text-foreground font-bold text-4xl tracking-tight sm:mt-5">{members.length}</h1>
                        <h2 className="text-muted-foreground text-base">Total Members</h2>
                    </CardContent>
                </Card>

                {/* add member dialog */}
                <AddMemberDialog fetchMembers={fetchMembers} />

                {/* search member input */}
                <div className="flex w-full items-center gap-2 mt-6">
                    <Input type="text" placeholder="Search by name.." className="text-lg px-3 py-2" />
                    <Button className="text-base">Search</Button>
                </div>

                {/* list of all members */}
                <div className="mt-6 flex flex-col gap-2">
                    {members.map((member) => (
                        <MemberCard key={member._id} {...member} fetchMembers={fetchMembers} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Page;
