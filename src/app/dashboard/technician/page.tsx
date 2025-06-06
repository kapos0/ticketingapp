import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAssignedTickets, getTickets } from "@/actions/TicketActions";
import { TicketType } from "@/models/TicketModel";
import TechnicianTabs from "@/components/TechnicianTabs";

export default async function TechnicianDashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!(session?.user.role === "technician")) redirect("/auth/sign-in");
    const [assignedTickets, allTickets] = await Promise.all([
        getAssignedTickets(session?.user.id || ""),
        getTickets(true),
    ]);
    function serializeTicket(ticket: TicketType): TicketType {
        return {
            ...ticket,
            _id: ticket._id?.toString?.() ?? ticket._id,
            createdAt:
                typeof ticket.createdAt === "string"
                    ? new Date(ticket.createdAt)
                    : ticket.createdAt,
        };
    }
    const assigned: TicketType[] = (assignedTickets as TicketType[]).map(serializeTicket);
    const all: TicketType[] = (allTickets as TicketType[]).map(serializeTicket);
    return (
        <div className="min-h-screen bg-blue-50 dark:bg-neutral-900 p-8 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-8 text-center transition-colors duration-300">
                Technical Support Panel
            </h1>
            <TechnicianTabs assigned={assigned} all={all} />
        </div>
    );
}
