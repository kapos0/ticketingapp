"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashBoardPage() {
    const { session, isError, isLoading } = useSession();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>There was an error loading your session</div>;
    if (!session) redirect("/auth/sign-in");

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div>Welcome to your dashboard</div>
        </div>
    );
}
