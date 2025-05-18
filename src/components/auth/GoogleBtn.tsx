"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "../ui/google-icon";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

type GoogleAuthButtonProps = {
    action: "sign-in" | "sign-up";
    redirectTo?: string;
    buttonText?: string;
};

export function GoogleAuthButton({
    action = "sign-in",
    redirectTo = "/dashboard",
    buttonText = "Continue with Google",
}: GoogleAuthButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleGoogleAuth() {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: redirectTo,
            });
            toast(
                action === "sign-in"
                    ? "Logged in successfully"
                    : "Signed up successfully"
            );
        } catch (error) {
            console.error("Error during Google authentication:", error);
            toast(
                action === "sign-in" ? "Error logging in" : "Error signing up"
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleAuth}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    <GoogleIcon className="w-4 h-4" />
                    <span>{buttonText}</span>
                </>
            )}
        </Button>
    );
}
