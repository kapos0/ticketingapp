export type TicketType = {
    _id?: string;
    subject: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    userId: string;
    assignInfo?: {
        assignedTo: string;
        assignedTechnicianName: string;
        assignedAt: Date;
    };
    department: string;
    user: string;
    createdAt: Date;
};

export function validateTicket(ticket: TicketType): boolean {
    const validPriorities = ["Low", "Medium", "High"];
    const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];

    if (
        !ticket.subject ||
        !ticket.description ||
        !ticket.userId ||
        !ticket.user ||
        !ticket.department
    ) {
        return false; // Zorunlu alanlar eksik
    }

    if (!validPriorities.includes(ticket.priority)) {
        return false; // Priority hatalı
    }

    if (!validStatuses.includes(ticket.status)) {
        return false; // Status hatalı
    }

    return true; // Veri geçerli
}
