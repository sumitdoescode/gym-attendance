import React from "react";
import Container from "@/components/Container";
import { SignUp } from "@clerk/nextjs";

const page = () => {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <Container>
                <div className="flex items-center justify-center">
                    <SignUp fallbackRedirectUrl="/complete-profile" />
                </div>
            </Container>
        </section>
    );
};

export default page;
