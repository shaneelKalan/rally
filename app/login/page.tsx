"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorParam = searchParams.get("error");
        const messageParam = searchParams.get("message");
        if (errorParam === "auth_failed") {
            setError(messageParam ? `Authentication failed: ${messageParam}` : "Authentication failed. Please try again.");
        }
    }, [searchParams]);

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setSent(true);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (!data.session) {
                throw new Error("No session returned from login");
            }

            // Success - use hard redirect to ensure session is picked up
            window.location.href = "/app";
        } catch (err: any) {
            console.error("[Login] Error:", err);
            setError(err.message || "Invalid email or password");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-liquid p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 justify-center">
                        <div className="h-12 w-12 relative">
                            <Image src="/logo.png" alt="Rally Together" fill className="object-cover rounded-xl" />
                        </div>
                        <span className="text-3xl font-serif font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Rally Together
                        </span>
                    </Link>
                </div>

                <Card className="border-2 shadow-xl">
                    <CardHeader className="space-y-3 pb-6">
                        <CardTitle className="text-3xl font-serif text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center text-base">
                            Sign in to manage your beautiful invitations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sent ? (
                            <div className="text-center py-10">
                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-6">
                                    <Mail className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-serif font-semibold mb-3">Check your email</h3>
                                <p className="text-base text-muted-foreground mb-2">
                                    We sent a magic link to
                                </p>
                                <p className="text-base font-medium mb-4">
                                    {email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Click the link in the email to sign in to your account.
                                </p>
                                <Button
                                    variant="ghost"
                                    className="mt-8"
                                    onClick={() => {
                                        setSent(false);
                                        setEmail("");
                                    }}
                                >
                                    Use a different email
                                </Button>
                            </div>
                        ) : (
                            <Tabs defaultValue="password" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="password" className="text-base">Password</TabsTrigger>
                                    <TabsTrigger value="magic" className="text-base">Magic Link</TabsTrigger>
                                </TabsList>

                                <TabsContent value="password">
                                    <form onSubmit={handlePasswordLogin} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="email-password" className="text-base">Email</Label>
                                            <Input
                                                id="email-password"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="h-11 text-base"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-base">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="h-11 text-base"
                                            />
                                        </div>

                                        {error && (
                                            <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                                                {error}
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                                            <Lock className="h-4 w-4 mr-2" />
                                            {loading ? "Signing in..." : "Sign In"}
                                        </Button>

                                        <p className="text-sm text-center text-muted-foreground">
                                            Don't have an account?{" "}
                                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                                Sign up
                                            </Link>
                                        </p>
                                    </form>
                                </TabsContent>

                                <TabsContent value="magic">
                                    <form onSubmit={handleMagicLink} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="email-magic" className="text-base">Email</Label>
                                            <Input
                                                id="email-magic"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="h-11 text-base"
                                            />
                                        </div>

                                        {error && (
                                            <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                                                {error}
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            {loading ? "Sending..." : "Send Magic Link"}
                                        </Button>

                                        <p className="text-sm text-center text-muted-foreground">
                                            We'll email you a secure link to sign in instantly.
                                        </p>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
