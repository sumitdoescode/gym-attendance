import React from "react";
import Container from "./Container";
import Link from "next/link";

const Navbar = () => {
    return (
        <div className="bg-background text-primary py-2">
            <Container>
                <Link href={"/"} className="text-3xl font-semibold">
                    Strongly
                </Link>
            </Container>
        </div>
    );
};

export default Navbar;
