import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";
import { Logo } from "./logo";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const Navbar = async () => {

    const {userId} = await auth();
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white dark:bg-gray-900 shadow-xl">
            <Link href={!userId ? "/" : "/home"} className={!userId ? "p-6 hidden md:block" : "hidden" }>
                <Logo />
            </Link>
            <MobileSidebar />
            <NavbarRoutes />
        </div>
     );
}