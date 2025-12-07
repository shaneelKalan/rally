"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCallbackPage() {
    const [status, setStatus] = useState("Completing login...");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const supabase = createClient();

                // Check if we have a session from the URL hash (implicit flow)
                // The Supabase client automatically handles the hash fragment
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                if (session) {
                    setStatus("Login successful! Redirecting...");
                    // Small delay to show success message
                    setTimeout(() => {
                        window.location.href = "/app";
                    }, 500);
                } else {
                    // No session found, might be an error
                    setError("No session found. Please try logging in again.");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2000);
                }
            } catch (err: any) {
                console.error("[Auth Callback] Error:", err);
                setError(err.message || "Authentication failed");
                setTimeout(() => {
                    window.location.href = `/login?error=auth_failed&message=${encodeURIComponent(err.message || "Unknown error")}`;
                }, 2000);
            }
        };

        handleAuth();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-liquid p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        {error ? "Login Failed" : "Verifying"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    {error ? (
                        <p className="text-destructive">{error}</p>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-muted-foreground">{status}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
