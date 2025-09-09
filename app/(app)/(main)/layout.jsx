import React from "react";
// import Navbar from "@/components/Navbar.jsx";
import Navbar from "@/components/Navbar";

const layout = ({ children }) => {
    return (
        <>
            <Navbar /> {children}
        </>
    );
};

export default layout;
