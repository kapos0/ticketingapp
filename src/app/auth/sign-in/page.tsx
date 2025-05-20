"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
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
import { CheckboxField, InputField } from "@/components/auth/FormFields";
import { GoogleAuthButton } from "@/components/auth/GoogleBtn";
import { GithubAuthButton } from "@/components/auth/GithubBtn";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

type SignInFormValues = {
    email: string;
    password: string;
    rememberMe?: boolean;
};

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<SignInFormValues>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    async function onSubmit(data: SignInFormValues) {
        if (!data.email || !data.password) {
            toast("Email and password are required");
            return;
        }
        await authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
            },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onSuccess: () => {
                    form.reset();
                    router.push("/dashboard");
                },
                onError: (ctx) => {
                    console.log("error", ctx);
                    toast(ctx.error.message ?? "something went wrong");
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
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
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

                                <div className="flex items-center justify-between">
                                    <CheckboxField
                                        control={form.control}
                                        name="rememberMe"
                                        label="Remember me"
                                    />

                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

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
                                            Log in{" "}
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

                        <div className="flex flex-col gap-2 ">
                            <GoogleAuthButton
                                action="sign-in"
                                buttonText="Sign In with Google"
                                redirectTo="/dashboard"
                            />
                            <GithubAuthButton
                                action="sign-in"
                                buttonText="Sign In with Github"
                                redirectTo="/dashboard"
                            />
                        </div>
                        <div className="text-center text-sm">
                            Dont have an account?
                            <Link
                                href="/auth/sign-up"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
