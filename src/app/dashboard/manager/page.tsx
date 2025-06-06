import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTickets } from "@/actions/TicketActions";
import { TicketType } from "@/models/TicketModel";
import ManagerDashboardUI from "@/components/ManagerDashboardUI";
import { getAllTechnicians, getUsers } from "@/actions/UserActions";

export default async function ManagerDashBoardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!(session?.user.role === "manager")) redirect("/");

    const rawTickets = await getTickets(true);
    const rawUsers = await getUsers();
    const rawTechnicians = await getAllTechnicians();

    if (!rawTickets || !rawUsers || !rawTechnicians)
        return <div>Error loading data</div>;

    const tickets = Array.isArray(rawTickets)
        ? rawTickets.map((t: TicketType) => ({
              ...t,
              _id: t._id?.toString?.() ?? t._id ?? "",
              createdAt: t.createdAt
                  ? typeof t.createdAt === "string"
                      ? new Date(t.createdAt)
                      : t.createdAt
                  : new Date(),
          }))
        : [];
    const users = Array.isArray(rawUsers)
        ? rawUsers.map((u) => ({
              id: u._id?.toString?.() ?? u._id ?? "",
              name: u.name ?? "",
              email: u.email ?? "",
              role: u.role ?? "user",
              emailVerified: u.emailVerified ?? false,
              createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
              updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
              image: u.image ?? null,
          }))
        : [];
    const technicians = Array.isArray(rawTechnicians)
        ? rawTechnicians.map((t) => ({
              id: t._id?.toString?.() ?? t._id ?? "",
              name: t.name ?? "",
              role: t.role ?? "technician",
              email: t.email ?? "",
              emailVerified: t.emailVerified ?? false,
              createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
              updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
              image: t.image ?? null,
          }))
        : [];
    return (
        <ManagerDashboardUI
            tickets={tickets}
            users={users}
            technicians={technicians}
        />
    );
}
