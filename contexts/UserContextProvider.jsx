"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get("/api/user/me");
                if (data.success) {
                    setUser(data.data.user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    return useContext(UserContext);
};

export default UserContextProvider;
