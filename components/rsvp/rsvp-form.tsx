"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RSVPFormProps {
    household: any;
    guests: any[];
    sessions: any[];
    existingRsvps: any[];
    questions?: any[];
    existingResponses?: any[];
    theme: any;
}

export default function RSVPForm({
    household,
    guests,
    sessions,
    existingRsvps,
    questions = [],
    existingResponses = [],
    theme
}: RSVPFormProps) {
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

    // State to track Answers: { [guestId_questionId]: value }
    const [answers, setAnswers] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        existingResponses.forEach((response) => {
            initial[`${response.guest_id}_${response.question_id}`] = response.answer_text || response.answer_json;
        });
        return initial;
    });

    const handleSelection = (guestId: string, sessionId: string, status: string) => {
        setSelections(prev => ({
            ...prev,
            [`${guestId}_${sessionId}`]: status
        }));
    };

    const handleAnswer = (guestId: string, questionId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [`${guestId}_${questionId}`]: value
        }));
    };

    const isQuestionVisible = (question: any, guestId: string) => {
        // If question is tied to a session, only show if guest is attending that session
        if (question.event_session_id) {
            const rsvpKey = `${guestId}_${question.event_session_id}`;
            const status = selections[rsvpKey];
            if (status !== "attending") return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();
        const rsvpUpserts: any[] = [];
        const responseUpserts: any[] = [];

        // Build list of updates
        for (const guest of guests) {
            // RSVPs
            for (const session of sessions) {
                const key = `${guest.id}_${session.id}`;
                const status = selections[key];

                if (status) {
                    rsvpUpserts.push({
                        guest_id: guest.id,
                        event_session_id: session.id,
                        status: status,
                        responded_at: new Date().toISOString()
                    });
                }
            }

            // Answers
            for (const question of questions) {
                if (!isQuestionVisible(question, guest.id)) continue;

                const key = `${guest.id}_${question.id}`;
                const value = answers[key];

                if (value !== undefined && value !== "") {
                    responseUpserts.push({
                        guest_id: guest.id,
                        question_id: question.id,
                        event_session_id: question.event_session_id,
                        answer_text: typeof value === 'string' ? value : JSON.stringify(value),
                        answer_json: typeof value === 'object' ? value : null
                    });
                }
            }
        }

        try {
            // Save RSVPs
            if (rsvpUpserts.length > 0) {
                const { error } = await supabase
                    .from("rsvps")
                    .upsert(rsvpUpserts as any, { onConflict: "event_session_id, guest_id" });
                if (error) throw error;
            }

            // Save Responses
            if (responseUpserts.length > 0) {
                const guestIds = guests.map(g => g.id);
                const questionIds = questions.map(q => q.id);

                // Best effort cleanup + insert
                await supabase
                    .from("responses")
                    .delete()
                    .in("guest_id", guestIds)
                    .in("question_id", questionIds);

                const { error } = await supabase
                    .from("responses")
                    .insert(responseUpserts as any);

                if (error) throw error;
            }

            setCompleted(true);
            router.refresh();
        } catch (error) {
            console.error("Error saving RSVP:", error);
            alert("There was a problem saving your RSVP. Please try again.");
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
                        <div key={guest.id} className="p-6 rounded-2xl bg-white/50 border border-white/50 backdrop-blur-sm shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                                {guest.first_name} {guest.last_name}
                            </h3>

                            <div className="space-y-6">
                                {/* Sessions */}
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Events</h4>
                                    <div className="space-y-4">
                                        {sessions.map((session) => {
                                            const key = `${guest.id}_${session.id}`;
                                            const currentStatus = selections[key];

                                            return (
                                                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/40 transition-colors">
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
                                                                    ? "bg-primary text-white shadow-lg scale-105 ring-2 ring-primary ring-offset-2"
                                                                    : "hover:bg-primary/10 hover:text-primary border-primary/20"
                                                            )}
                                                            onClick={() => handleSelection(guest.id, session.id, "attending")}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Accept
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={currentStatus === "not_attending" ? "destructive" : "outline"}
                                                            className={cn(
                                                                "rounded-full transition-all duration-300",
                                                                currentStatus === "not_attending"
                                                                    ? "bg-destructive text-white shadow-lg scale-105 ring-2 ring-destructive ring-offset-2"
                                                                    : "hover:bg-destructive/10 hover:text-destructive border-destructive/20"
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

                                {/* Questions */}
                                {questions.length > 0 && questions.some(q => isQuestionVisible(q, guest.id)) && (
                                    <div className="pt-4 border-t border-black/5">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Questions</h4>
                                        <div className="space-y-6">
                                            {questions.map((question) => {
                                                if (!isQuestionVisible(question, guest.id)) return null;

                                                const key = `${guest.id}_${question.id}`;
                                                // Default to empty string if undefined
                                                const value = answers[key] ?? "";

                                                return (
                                                    <div key={question.id} className="space-y-2">
                                                        <Label className="text-base font-medium">
                                                            {question.label}
                                                            {question.is_required && <span className="text-destructive ml-1">*</span>}
                                                        </Label>
                                                        {question.description && (
                                                            <p className="text-sm text-muted-foreground -mt-1 mb-2">{question.description}</p>
                                                        )}

                                                        {question.type === "text" && (
                                                            <Input
                                                                value={value}
                                                                onChange={(e) => handleAnswer(guest.id, question.id, e.target.value)}
                                                                placeholder="Type your answer..."
                                                                className="bg-white/50 backdrop-blur-sm border-black/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                                            />
                                                        )}

                                                        {question.type === "single_choice" && question.options && (
                                                            <div className="flex flex-col space-y-2">
                                                                {question.options.options.map((opt: string) => (
                                                                    <label key={opt} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-black/5 transition-colors">
                                                                        <input
                                                                            type="radio"
                                                                            name={key}
                                                                            value={opt}
                                                                            checked={value === opt}
                                                                            onChange={(e) => handleAnswer(guest.id, question.id, e.target.value)}
                                                                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                                                        />
                                                                        <span className="text-sm font-medium">{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-md p-4 -mx-6 -mb-6 border-t z-10 rounded-b-2xl">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        size="lg"
                        className="rounded-full min-w-[200px] h-12 text-base shadow-xl hover:shadow-2xl transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending Response...
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
