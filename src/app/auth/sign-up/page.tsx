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
import { GoogleAuthButton } from "@/components/auth/GoogleBtn";
import { GithubAuthButton } from "@/components/auth/GithubBtn";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

type SignUpFormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUpPage() {
    const form = useForm<SignUpFormValues>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const [loading, setLoading] = useState(false);

    async function onSubmit(data: SignUpFormValues) {
        if (
            data.password !== data.confirmPassword ||
            data.password.length < 8
        ) {
            toast("Passwords do not match or too short");
            return;
        }
        if (!data.email || !data.username) {
            toast("Email and username are required");
            return;
        }
        await authClient.signUp.email(
            {
                email: data.email,
                password: data.password,
                name: data.username,
            },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onSuccess: () => {
                    toast("Account created");
                    form.reset();
                    console.log("success");
                },
                onError: (ctx) => {
                    console.log("error", ctx);
                    toast(ctx.error.message ?? "something went wrong.");
                    console.log("error", ctx.error.message);
                },
            }
        );
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
                            Create an account
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your information to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <InputField
                                    control={form.control}
                                    name="username"
                                    label="Username"
                                    placeholder="aboow"
                                    type="text"
                                    icon={
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    }
                                />

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

                                <InputField
                                    control={form.control}
                                    name="password"
                                    label="Password"
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
                                    label="Confirm Password"
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
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Please wait...
                                        </>
                                    ) : (
                                        <>
                                            Sign up{" "}
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <GoogleAuthButton
                                action="sign-up"
                                buttonText="Sign Up with Google"
                                redirectTo="/dashboard"
                            />
                            <GithubAuthButton
                                action="sign-up"
                                buttonText="Sign Up with Github"
                                redirectTo="/dashboard"
                            />
                        </div>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                href="/auth/sign-in"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
