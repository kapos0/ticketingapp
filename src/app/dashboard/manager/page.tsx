import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTickets } from "@/actions/TicketActions";
import { TicketType } from "@/models/TicketModel";
import ManagerDashboardUI from "@/components/ManagerDashboardUI";

export default async function ManagerDashBoardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!(session?.user.role === "manager")) redirect("/");

    const rawTickets = await getTickets(true);
    const tickets = rawTickets.map((t: TicketType) => ({
        ...t,
        _id: t._id?.toString?.() ?? t._id ?? "",
        createdAt: t.createdAt
            ? typeof t.createdAt === "string"
                ? t.createdAt
                : new Date(t.createdAt).toISOString()
            : "",
    })) as unknown as TicketType[];

    return <ManagerDashboardUI tickets={tickets} />;
}
