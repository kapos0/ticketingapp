import Link from "next/link";
import { TicketIcon } from "lucide-react";

export default function Home() {
    return (
        <main className="flex flex-col text-center items-center justify-center min-h-screen px-4">
            <TicketIcon className="mx-auto mb-4 text-red-600" size={60} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">
                Welcome to Quick Ticket
            </h1>
            <p className="text-lg mb-8">
                Fast and simple support ticket management system.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center animate-slide opacity-0">
                <Link
                    href="/tickets/new"
                    className="px-6 py-3 rounded shadow transition"
                >
                    Submit a Ticket
                </Link>
                <Link
                    href="/tickets"
                    className="px-6 py-3 rounded shadow transition"
                >
                    View Tickets
                </Link>
            </div>
        </main>
    );
}
