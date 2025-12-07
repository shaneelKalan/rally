"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RSVPFormProps {
    household: any;
    guests: any[];
    sessions: any[];
    existingRsvps: any[];
    theme: any;
}

export default function RSVPForm({ household, guests, sessions, existingRsvps, theme }: RSVPFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    // State to track RSVPs: { [guestId_sessionId]: status }
    const [selections, setSelections] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        existingRsvps.forEach((rsvp) => {
            initial[`${rsvp.guest_id}_${rsvp.event_session_id}`] = rsvp.status;
        });
        return initial;
    });

    const handleSelection = (guestId: string, sessionId: string, status: string) => {
        setSelections(prev => ({
            ...prev,
            [`${guestId}_${sessionId}`]: status
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();
        const upserts = [];

        // Build list of updates
        for (const guest of guests) {
            for (const session of sessions) {
                const key = `${guest.id}_${session.id}`;
                const status = selections[key];

                if (status) { // Only upsert if a selection is made
                    upserts.push({
                        guest_id: guest.id,
                        event_session_id: session.id,
                        status: status,
                        responded_at: new Date().toISOString()
                    });
                }
            }
        }

        if (upserts.length > 0) {
            // We need to upsert each one. Supabase upsert works with unique constraints.
            // Our Schema has UNIQUE(event_session_id, guest_id) on rsvps table.
            const { error } = await supabase
                .from("rsvps")
                .upsert(upserts as any, { onConflict: "event_session_id, guest_id" });

            if (error) {
                console.error("Error saving RSVPs:", error);
                alert("There was a problem saving your RSVP. Please try again.");
            } else {
                setCompleted(true);
                router.refresh(); // Refresh server data
            }
        } else {
            setCompleted(true);
        }
        setLoading(false);
    };

    if (completed) {
        return (
            <Card className="glass-panel border-0 animate-fade-in bg-white/80">
                <CardContent className="pt-6 text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">RSVP Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                        Thank you for responding. You can update your response at any time using the same link.
                    </p>
                    <Button onClick={() => setCompleted(false)} variant="outline" className="rounded-full">
                        Update Response
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-panel border-0 bg-white/80">
            <CardContent className="pt-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">RSVP</h2>
                    <p className="text-muted-foreground">
                        Please indicate attendance for each guest below.
                    </p>
                </div>

                <div className="space-y-8">
                    {guests.map((guest) => (
                        <div key={guest.id} className="p-4 rounded-xl bg-white/50 border border-white/50 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                {guest.first_name} {guest.last_name}
                            </h3>

                            <div className="space-y-4">
                                {sessions.map((session) => {
                                    const key = `${guest.id}_${session.id}`;
                                    const currentStatus = selections[key];

                                    return (
                                        <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 last:pb-0 border-b last:border-0 border-black/5">
                                            <div>
                                                <p className="font-medium">{session.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(session.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={currentStatus === "attending" ? "default" : "outline"}
                                                    className={cn(
                                                        "rounded-full transition-all duration-300",
                                                        currentStatus === "attending"
                                                            ? "bg-primary text-white shadow-lg scale-105"
                                                            : "hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                                                    )}
                                                    onClick={() => handleSelection(guest.id, session.id, "attending")}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Attending
                                                </Button>

                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={currentStatus === "not_attending" ? "destructive" : "outline"}
                                                    className={cn(
                                                        "rounded-full transition-all duration-300",
                                                        currentStatus === "not_attending"
                                                            ? "bg-destructive text-white shadow-lg scale-105"
                                                            : "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                                                    )}
                                                    onClick={() => handleSelection(guest.id, session.id, "not_attending")}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Decline
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        size="lg"
                        className="rounded-full min-w-[150px] shadow-xl hover:shadow-2xl transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Submit RSVP"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
