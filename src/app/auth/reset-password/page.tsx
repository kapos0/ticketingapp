"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/auth/FormFields";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

type ResetPasswordFormValues = {
    password: string;
    confirmPassword: string;
};

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const form = useForm<ResetPasswordFormValues>({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(data: ResetPasswordFormValues) {
        if (data.password !== data.confirmPassword) {
            toast("Passwords do not match");
            return;
        }
        setLoading(true);
        const { error } = await authClient.resetPassword({
            newPassword: data.password,
            token: token as string,
        });
        if (error) {
            toast(error.message ?? "something went wrong");
        } else {
            toast(
                "Your password has been reset successfully. sign-in to continue"
            );
            router.push("/auth/sign-in");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <h1 className="text-2xl font-bold">
                                Better-Auth Demo
                            </h1>
                        </div>
                    </Link>
                </div>

                <Card className="border-none shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Reset Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your new password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-4"
                            >
                                <InputField
                                    control={form.control}
                                    name="password"
                                    label="New Password"
                                    placeholder="••••••••"
                                    type="password"
                                    icon={
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    }
                                    showPasswordToggle={true}
                                />

                                <InputField
                                    control={form.control}
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    placeholder="••••••••"
                                    type="password"
                                    icon={
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    }
                                    showPasswordToggle={true}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Updating password...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password{" "}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="mt-4 text-center text-sm">
                    Remember your password?{" "}
                    <Link
                        href="/auth/sign-in"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
