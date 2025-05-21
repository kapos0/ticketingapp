import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewTicketForm from "@/components/NewTicketForm";

export default async function NewTicketPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) redirect("/auth/sign-in");
    return (
        <div className="min-h-screen bg-blue-50 dark:bg-black flex items-center justify-center px-4">
            <NewTicketForm user={session.user.name} />
        </div>
    );
}
