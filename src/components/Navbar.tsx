import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "./ui/theme-toggle";
import LogOutBtn from "./auth/LogOutBtn";

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return (
        <nav className="px-6 py-4 flex justify-between items-center relative">
            <div>
                <Link href="/" className="text-xl font-bold">
                    QuickTicket
                </Link>
            </div>
            {/* Hamburger menu for mobile */}
            <input id="menu-toggle" type="checkbox" className="peer hidden" />
            <label
                htmlFor="menu-toggle"
                className="lg:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer z-20"
            >
                <span className="block w-6 h-0.5 bg-current mb-1 transition-all duration-300"></span>
                <span className="block w-6 h-0.5 bg-current mb-1 transition-all duration-300"></span>
                <span className="block w-6 h-0.5 bg-current transition-all duration-300"></span>
            </label>
            {/* Menu links */}
            <div className="flex items-center space-x-4 lg:space-x-4 lg:flex-row flex-col lg:static absolute top-full right-0 left-0 bg-white dark:bg-zinc-900 shadow-lg lg:shadow-none lg:bg-transparent lg:dark:bg-transparent transition-all duration-300 z-10 max-lg:peer-checked:flex max-lg:hidden max-lg:items-start max-lg:space-x-0 max-lg:space-y-2 max-lg:p-6">
                {session?.user ? (
                    <>
                        {session.user.role === "manager" ? (
                            <Link
                                href="/dashboard/manager"
                                className="hover:underline transition"
                            >
                                Manager Dashboard
                            </Link>
                        ) : session.user.role === "technician" ? (
                            <Link
                                href="/dashboard/technician"
                                className="hover:underline transition"
                            >
                                Technician Dashboard
                            </Link>
                        ) : null}
                        <Link
                            href="/tickets/new"
                            className="hover:underline transition"
                        >
                            New Ticket
                        </Link>
                        <Link
                            href="/tickets"
                            className="hover:underline transition"
                        >
                            My Tickets
                        </Link>
                        <LogOutBtn />
                    </>
                ) : (
                    <>
                        <Link
                            href="/auth/sign-in"
                            className="hover:underline transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="px-4 py-2 rounded transition"
                        >
                            Register
                        </Link>
                    </>
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
}
