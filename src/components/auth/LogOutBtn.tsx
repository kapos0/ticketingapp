"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogOutBtn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSignOut() {
        setLoading(true);
        try {
            await authClient.signOut();
            toast("You have been signed out successfully.");
            router.push("/auth/sign-in");
        } catch (error) {
            console.error("Error signing out:", error);
            toast("there is a problem signing out");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" onClick={handleSignOut} disabled={loading}>
            {loading ? (
                <>
                    <LogOut className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                </>
            ) : (
                <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </>
            )}
        </Button>
    );
}
