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
        <nav className="px-6 py-4 flex justify-between items-center">
            <div>
                <Link href="/" className="text-xl font-bold">
                    QuickTicket
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <>
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
