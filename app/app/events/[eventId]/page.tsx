import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EventPage({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch event
    const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("user_id", user.id)
        .single();

    if (error || !event) {
        notFound();
    }

    // Fetch basic stats
    const { count: guestCount } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId);

    const { count: sessionCount } = await supabase
        .from("event_sessions")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId);

    // Fetch RSVP count
    // interacting with rsvps table which is linked to event_sessions
    const { count: rsvpCount } = await supabase
        .from("rsvps")
        .select(`
            *,
            event_sessions!inner(event_id)
        `, { count: "exact", head: true })
        .eq("event_sessions.event_id", eventId);

    const eventData: any = event;

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/app"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to events
                </Link>
                <h1 className="text-3xl font-bold">{eventData.title}</h1>
                <p className="text-muted-foreground mt-1">
                    {new Date(eventData.start_date).toLocaleDateString()} -{" "}
                    {new Date(eventData.end_date).toLocaleDateString()}
                    {eventData.location_summary && ` • ${eventData.location_summary}`}
                </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="guests">
                        Guests {guestCount ? `(${guestCount})` : ""}
                    </TabsTrigger>
                    <TabsTrigger value="sessions">
                        Sessions {sessionCount ? `(${sessionCount})` : ""}
                    </TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="theme">Theme</TabsTrigger>
                    <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border rounded-lg p-6">
                            <div className="text-2xl font-bold">{guestCount || 0}</div>
                            <p className="text-sm text-muted-foreground">Total Guests</p>
                        </div>
                        <div className="border rounded-lg p-6">
                            <div className="text-2xl font-bold">{sessionCount || 0}</div>
                            <p className="text-sm text-muted-foreground">Sessions</p>
                        </div>
                        <div className="border rounded-lg p-6">
                            <div className="text-2xl font-bold">{rsvpCount || 0}</div>
                            <p className="text-sm text-muted-foreground">RSVPs Received</p>
                        </div>
                    </div>

                    <div className="mt-6 border rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Get started by adding sessions and inviting guests to your event.
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="guests">
                    <div className="border rounded-lg p-6">
                        <p className="text-muted-foreground">Guest management coming soon...</p>
                    </div>
                </TabsContent>

                <TabsContent value="sessions">
                    <div className="border rounded-lg p-6">
                        <p className="text-muted-foreground">Session management coming soon...</p>
                    </div>
                </TabsContent>

                <TabsContent value="questions">
                    <div className="border rounded-lg p-6">
                        <p className="text-muted-foreground">Questions builder coming soon...</p>
                    </div>
                </TabsContent>

                <TabsContent value="theme">
                    <div className="border rounded-lg p-6">
                        <p className="text-muted-foreground">Theme customization coming soon...</p>
                    </div>
                </TabsContent>

                <TabsContent value="rsvps">
                    <div className="border rounded-lg p-6">
                        <p className="text-muted-foreground">RSVP analytics coming soon...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
