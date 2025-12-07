"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            // Check if user was created and session exists (email confirm disabled)
            if (data.session) {
                // Auto-confirmed, redirect to app
                window.location.href = "/app";
            } else if (data.user) {
                // Email confirmation required
                setError("Please check your email to confirm your account.");
                setLoading(false);
            } else {
                throw new Error("Signup failed - no user returned");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during signup");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-liquid p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="h-10 w-10 relative">
                            <Image src="/logo.png" alt="Rally Together" fill className="object-cover rounded-xl" />
                        </div>
                        <span className="text-2xl font-bold">Rally Together</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                            Start managing your events today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Create Account"}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>

                            <p className="text-xs text-center text-muted-foreground pt-4 border-t">
                                By creating an account, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
