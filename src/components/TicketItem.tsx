import Link from "next/link";
import type { TicketType } from "@/models/TicketModel";
import { getPriorityClass } from "@/lib/utils";

type TicketItemProps = {
    ticket: TicketType;
};

export default function TicketItem({ ticket }: TicketItemProps) {
    const isClosed = ticket.status === "Closed";
    return (
        <div
            key={ticket._id}
            className={`flex justify-between items-center bg-white dark:bg-neutral-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 ${
                isClosed ? "opacity-50" : ""
            }`}
        >
            <div>
                <h1 className="text-sm text-gray-500 dark:text-gray-200 transition-colors duration-300">
                    Created by: {ticket.user}
                </h1>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300 transition-colors duration-300">
                    {ticket.subject}
                </h2>
            </div>
            <div className="text-right space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-200 transition-colors duration-300">
                    Priority:
                    <span className={getPriorityClass(ticket.priority)}>
                        {ticket.priority}
                    </span>
                </div>
                <Link
                    href={`/tickets/${ticket._id}`}
                    className={`inline-block mt-2 text-sm px-3 py-1 rounded text-center transition-colors duration-300 ${
                        isClosed
                            ? "bg-gray-400 text-gray-700 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed pointer-events-none"
                            : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
                    }`}
                >
                    View Ticket
                </Link>
            </div>
        </div>
    );
}
