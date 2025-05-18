"use client";
import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/auth/FormFields";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

type ForgotPasswordFormValues = {
    email: string;
};

export default function ForgotPasswordPage() {
    const form = useForm<ForgotPasswordFormValues>({
        defaultValues: {
            email: "",
        },
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(data: ForgotPasswordFormValues) {
        if (!data.email) {
            toast("Email is required");
            return;
        }
        setLoading(true);
        const { error } = await authClient.forgetPassword({
            email: data.email,
            redirectTo: "/auth/reset-password",
        });
        if (error) toast(error.message ?? "something went wrong");
        else toast("Success ! Check your email for the reset link");

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
                            Forgot Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to receive a password reset link
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
                                    name="email"
                                    label="Email"
                                    placeholder="example@example.com"
                                    type="email"
                                    icon={
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    }
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Sending email...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link{" "}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm">
                            Remember your password?{" "}
                            <Link
                                href="/auth/sign-in"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
