"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, User, LogOut, CircleUserRound, Radio, UserPen, ShieldUser, ChartNoAxesCombined, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import { logoFont } from "@/app/layout";
import Loading from "./Loading";
import { useUserContext } from "@/contexts/UserContextProvider";

const Sidebar = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const { user, loading } = useUserContext();

    useEffect(() => {
        if (!loading && user && user.role === "admin") {
            setIsAdmin(true);
        }
    }, [user, loading]);

    // Sidebar menu items
    const items = [
        { title: "Home", url: "/", Icon: Home, adminOnly: false },
        { title: "Feed", url: "/feed", Icon: Radio, adminOnly: false },
        { title: "Dashboard", url: "/dashboard", Icon: LayoutDashboard, adminOnly: false },
        { title: "Update Profile", url: `/update-profile`, Icon: UserPen, adminOnly: false },

        // these two only be visible if user is admin
        { title: "Members", url: `/admin/members`, Icon: ShieldUser, adminOnly: true },
        { title: "Analytics", url: `/admin/analytics`, Icon: ChartNoAxesCombined, adminOnly: true },
    ];

    // if (loading) {
    //     return <Loading />;
    // }

    return (
        <Sheet className="">
            <SheetTrigger asChild className="sticky top-0 z-50 bg-background rounded-xl ">
                <button className="p-2">
                    <AlignJustify size={28} />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[250px] p-0">
                <SheetHeader className="p-2">
                    <SheetTitle>
                        <Link href={"/"} className={`${logoFont.className} text-3xl font-bold tracking-tight uppercase text-primary`}>
                            Strong
                            <span className="text-white">ly</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Sidebar Items */}
                <div className="px-2">
                    <div className="flex flex-col gap-4">
                        {items.map(
                            ({ title, url, Icon, adminOnly }) =>
                                (!adminOnly || isAdmin) && (
                                    <div key={title} className="px-2 py-1 hover:bg-stone-800 duration-200 ease-in-out rounded-md">
                                        <Link href={url} className="flex items-center gap-2">
                                            <Icon size={22} />
                                            <span className="text-xl">{title}</span>
                                        </Link>
                                    </div>
                                )
                        )}

                        {/* Logout */}
                        {/* <div className="px-2 py-1 hover:bg-stone-800 duration-200 ease-in-out rounded-md cursor-pointer">
                            <SignOutButton fallbackredirecturl="/sign-in">
                                <div className="flex items-center gap-2">
                                    <LogOut size={22} />
                                    <span className="text-xl">Logout</span>
                                </div>
                            </SignOutButton>
                        </div> */}
                    </div>
                </div>

                {/* Footer: User Info */}
                {/* <SheetFooter>
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user?.profileImage?.url} alt={user?.username} />
                            <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user?.username}</span>
                            <span className="truncate text-xs">{user?.email}</span>
                        </div>
                    </div>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;
