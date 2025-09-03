import React from "react";
import Container from "@/components/Container";
import { SignIn } from "@clerk/nextjs";

const page = () => {
    return (
        <section className="py-10">
            <Container>
                <div className="flex items-center justify-center">
                    <SignIn fallbackredirecturl="/" />
                </div>
            </Container>
        </section>
    );
};

export default page;
