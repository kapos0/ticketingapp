import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TicketType } from "@/models/TicketModel";
import { getTickets } from "@/actions/TicketActions";
import TicketItem from "@/components/TicketItem";

export default async function TicketsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/auth/sign-in");

    const rawTickets = await getTickets(false);
    const tickets = rawTickets as unknown as TicketType[];

    return (
        <div className="min-h-screen bg-blue-50 dark:bg-neutral-900 p-8 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-8 text-center transition-colors duration-300">
                Support Tickets Which You Created
            </h1>
            {tickets.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-200 transition-colors duration-300">
                    No Tickets Yet
                </p>
            ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {tickets.map((ticket: TicketType) => (
                        <TicketItem key={ticket._id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
}
