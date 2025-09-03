import React from "react";
import Container from "@/components/Container";
import { SignIn } from "@clerk/nextjs";

const page = () => {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <Container>
                <div className="flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/complete-profile" />
                </div>
            </Container>
        </section>
    );
};

export default page;
