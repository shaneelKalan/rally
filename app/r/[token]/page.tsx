import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

export default async function RSVPPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const supabase = await createClient();

    // Look up household by RSVP token
    const { data: household, error: householdError } = await supabase
        .from("households")
        .select(`
      *,
      events (
        *,
        event_themes (*)
      )
    `)
        .eq("rsvp_token", token)
        .single();

    if (householdError || !household) {
        notFound();
    }

    const householdData: any = household;
    const event: any = householdData.events;
    const theme: any = event.event_themes?.[0];

    // Fetch guests in this household
    const { data: guests } = await supabase
        .from("guests")
        .select("*")
        .eq("household_id", householdData.id)
        .order("is_primary_contact", { ascending: false });

    const guestsData: any[] = guests || [];

    // Fetch sessions for this event
    const { data: sessions } = await supabase
        .from("event_sessions")
        .select("*")
        .eq("event_id", event.id)
        .order("start_datetime", { ascending: true });

    const sessionsData: any[] = sessions || [];

    return (
        <div className="min-h-screen bg-liquid">
            {/* Event Header */}
            <div
                className="border-b bg-gradient-to-r from-primary/10 to-secondary/10"
                style={{
                    backgroundColor: theme?.primary_color
                        ? `${theme.primary_color}15`
                        : undefined,
                }}
            >
                <div className="container py-12 md:py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {event.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>
                                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                                    {new Date(event.end_date).toLocaleDateString()}
                                </span>
                            </div>
                            {event.location_summary && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>{event.location_summary}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        {event.description && (
                            <p className="mt-4 text-lg text-muted-foreground">
                                {event.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* RSVP Content */}
            <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Welcome, {householdData.name}!</CardTitle>
                            <CardDescription>
                                You're invited to {sessionsData.length || 0} event
                                {sessionsData.length !== 1 ? "s" : ""}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Your Household</h3>
                                    <ul className="space-y-1">
                                        {guestsData.map((guest) => (
                                            <li key={guest.id} className="text-sm">
                                                {guest.first_name} {guest.last_name}
                                                {guest.is_primary_contact && (
                                                    <span className="text-muted-foreground ml-2">
                                                        (Primary Contact)
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sessions */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Event Timeline</h2>
                        {sessionsData.length > 0 ? (
                            sessionsData.map((session: any) => (
                                <Card key={session.id}>
                                    <CardHeader>
                                        <CardTitle>{session.name}</CardTitle>
                                        <CardDescription>
                                            {new Date(session.start_datetime).toLocaleString()}
                                            {session.location_name && ` • ${session.location_name}`}
                                        </CardDescription>
                                    </CardHeader>
                                    {session.description && (
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {session.description}
                                            </p>
                                            {session.dress_code && (
                                                <p className="text-sm mt-2">
                                                    <span className="font-medium">Dress Code:</span>{" "}
                                                    {session.dress_code}
                                                </p>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No sessions have been added yet. Check back soon!
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="mt-8 p-6 border rounded-lg bg-muted/50 text-center">
                        <p className="text-sm text-muted-foreground">
                            RSVP functionality coming soon! You'll be able to respond for your
                            entire household and answer custom questions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
