import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Sparkles, BarChart3, Mail, Palette, Check, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-liquid">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-20 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 relative">
                            <Image src="/logo.png" alt="Rally Together" fill className="object-cover rounded-xl" />
                        </div>
                        <span className="text-2xl font-serif font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Rally Together
                        </span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" size="lg" className="text-base">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="lg" className="text-base shadow-lg hover:shadow-xl transition-shadow">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container py-20 md:py-32">
                <div className="mx-auto max-w-4xl text-center animate-slide-up">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                        <Sparkles className="h-4 w-4" />
                        <span>Trusted by 10,000+ couples worldwide</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                        Beautiful Invitations<br />for Your Special Day
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                        Create stunning, personalized wedding invitations and manage RSVPs with elegance. Your guests will love the experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="min-w-[220px] h-14 text-lg shadow-xl hover:shadow-2xl transition-all">
                                Create Your Invitation
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="min-w-[220px] h-14 text-lg border-2">
                                View Examples
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-accent" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-accent" />
                            <span>Free forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-accent" />
                            <span>Setup in 5 minutes</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features wrapped in an elegant, easy-to-use interface
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-2 hover-lift bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Heart className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-serif">Beautiful Design</CardTitle>
                                <CardDescription className="text-base">
                                    Stunning, mobile-first invitations that capture your unique style and leave a lasting impression.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover-lift bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                                    <Users className="h-7 w-7 text-accent" />
                                </div>
                                <CardTitle className="text-2xl font-serif">Smart Guest Management</CardTitle>
                                <CardDescription className="text-base">
                                    Organize guests into households and groups. Track RSVPs and meal preferences effortlessly.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover-lift bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Sparkles className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-serif">Multi-Event Support</CardTitle>
                                <CardDescription className="text-base">
                                    Manage welcome dinners, ceremonies, receptions, and after-parties all in one place.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover-lift bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                                    <Palette className="h-7 w-7 text-accent" />
                                </div>
                                <CardTitle className="text-2xl font-serif">Custom Branding</CardTitle>
                                <CardDescription className="text-base">
                                    Personalize colors, fonts, and images to match your wedding theme perfectly.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover-lift bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Mail className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-serif">Magic Link RSVPs</CardTitle>
                                <CardDescription className="text-base">
                                    No passwords needed. Send personalized links and guests respond in seconds.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover-lift bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                                    <BarChart3 className="h-7 w-7 text-accent" />
                                </div>
                                <CardTitle className="text-2xl font-serif">Real-Time Analytics</CardTitle>
                                <CardDescription className="text-base">
                                    Track responses, export guest lists, and get insights as RSVPs roll in.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-12 md:p-16 border-2 border-primary/20">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Start Creating Today
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of couples who've created unforgettable invitation experiences
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="min-w-[240px] h-14 text-lg shadow-xl hover:shadow-2xl">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background/50 backdrop-blur">
                <div className="container py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 relative">
                                <Image src="/logo.png" alt="Rally Together" fill className="object-cover rounded-lg" />
                            </div>
                            <span className="text-lg font-serif font-semibold">Rally Together</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2025 Rally Together. Made with love for your special moments.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
