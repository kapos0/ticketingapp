"use client";
import { useState } from "react";
import { TicketType } from "@/models/TicketModel";
import TicketItem from "@/components/TicketItem";

export default function TechnicianTabs({
    assigned,
    all,
}: {
    assigned: TicketType[];
    all: TicketType[];
}) {
    const [tab, setTab] = useState<"assigned" | "all">("assigned");
    function renderTickets(tickets: TicketType[], emptyMsg: string) {
        if (tickets.length === 0) {
            return <p className="text-center text-gray-600 dark:text-gray-200">{emptyMsg}</p>;
        }
        return (
            <div className="space-y-4">
                {tickets.map((ticket: TicketType) => (
                    <TicketItem key={ticket._id} ticket={ticket} />
                ))}
            </div>
        );
    }
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ${
                        tab === "assigned"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-300"
                    }`}
                    onClick={() => setTab("assigned")}
                >
                    Assigned Tickets
                </button>
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ml-2 ${
                        tab === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-300"
                    }`}
                    onClick={() => setTab("all")}
                >
                    All Tickets
                </button>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-b-lg shadow p-6 min-h-[200px] transition-colors duration-300">
                {tab === "assigned"
                    ? renderTickets(assigned, "There are no assigned tickets.")
                    : renderTickets(all, "There are no tickets.")}
            </div>
        </div>
    );
}
