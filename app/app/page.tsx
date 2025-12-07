import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Plus, MapPin, Users } from "lucide-react";

export default async function AppHomePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user's events
    const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Your Events</h1>
                    <p className="text-lg text-muted-foreground">
                        Create beautiful invitations and track RSVPs with elegance
                    </p>
                </div>
                <Link href="/app/events/new">
                    <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {events && events.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event: any) => (
                        <Link
                            key={event.id}
                            href={`/app/events/${event.id}`}
                            className="block group"
                        >
                            <div className="border-2 rounded-2xl p-6 hover-lift bg-gradient-to-br from-white to-primary/5 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                                        <Heart className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-serif font-semibold group-hover:text-primary transition-colors truncate mb-2">
                                            {event.title}
                                        </h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {new Date(event.start_date).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </p>
                                            {event.location_summary && (
                                                <p className="flex items-start gap-2 truncate">
                                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                    <span className="truncate">{event.location_summary}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-gradient-wedding">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-6">
                        <Heart className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-serif font-semibold mb-3">Create Your First Event</h3>
                    <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                        Start crafting beautiful invitations for your wedding, celebration, or special occasion
                    </p>
                    <Link href="/app/events/new">
                        <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                            <Plus className="h-5 w-5 mr-2" />
                            Create Event
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
