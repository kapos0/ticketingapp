import Link from "next/link";
import { notFound } from "next/navigation";
import { getTicketById } from "@/actions/TicketAction";
import { getPriorityClass } from "@/lib/utils";
import CloseTicketButton from "@/components/CloseTicketButton";
import { TicketType } from "@/models/TicketModel";

export default async function TicketDetailsPage(props: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await props.params;
    const ticketData = await getTicketById(id);
    if (!ticketData) notFound();

    const ticket: TicketType = {
        _id: ticketData._id?.toString() ?? "",
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority,
        createdAt: ticketData.createdAt,
        status: ticketData.status,
        userId: ticketData.userId,
    };

    const isClosed = ticket.status === "Closed";

    return (
        <div className="min-h-screen bg-blue-50 dark:bg-gray-900 p-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8 space-y-6">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                    {ticket.subject}
                </h1>

                <div className="text-gray-700 dark:text-gray-200">
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p>{ticket.description}</p>
                </div>

                <div className="text-gray-700 dark:text-gray-200">
                    <h2 className="text-lg font-semibold mb-2">Priority</h2>
                    <p className={getPriorityClass(ticket.priority)}>
                        {ticket.priority}
                    </p>
                </div>

                <div className="text-gray-700 dark:text-gray-200">
                    <h2 className="text-lg font-semibold mb-2">Created At</h2>
                    <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>

                <Link
                    href="/tickets"
                    className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                >
                    ← Back to Tickets
                </Link>

                {ticket.status !== "Closed" && (
                    <CloseTicketButton
                        ticketId={ticket._id!}
                        isClosed={isClosed}
                    />
                )}
            </div>
        </div>
    );
}
