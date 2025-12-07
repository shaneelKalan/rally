import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Heart, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-liquid">
            {/* Top Navigation */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container flex h-20 items-center justify-between">
                    <Link href="/app" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="h-10 w-10 relative">
                            <Image src="/logo.png" alt="Rally Together" fill className="object-cover rounded-xl" />
                        </div>
                        <span className="text-2xl font-serif font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Rally Together
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {user.email}
                            </span>
                        </div>
                        <form action={signOut}>
                            <Button variant="ghost" size="default" type="submit" className="hover:bg-muted/50">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-background/50 backdrop-blur mt-20">
                <div className="container py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 relative">
                                <Image src="/logo.png" alt="Rally Together" fill className="object-cover rounded-md" />
                            </div>
                            <span className="text-sm font-serif font-semibold">Rally Together</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            © 2025 Made with love for your special moments
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
