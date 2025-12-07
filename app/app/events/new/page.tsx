"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createEventSchema, type CreateEventInput } from "@/lib/validations/event";
import { createEvent } from "@/lib/api/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CreateEventInput>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            type: "wedding",
        },
    });

    const title = watch("title");

    // Auto-generate slug from title
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const onSubmit = async (data: CreateEventInput) => {
        setLoading(true);
        setError(null);

        try {
            const result = await createEvent(data);
            // Navigate to the new event page
            router.push(`/app/events/${result.eventId}`);
        } catch (err: any) {
            setError(err.message || "Failed to create event");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/app" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to events
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>
                        Set up your event details. You can customize everything later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Sarah & John's Wedding Weekend"
                                {...register("title", {
                                    onChange: (e) => {
                                        // Auto-generate slug when title changes
                                        const slug = generateSlug(e.target.value);
                                        setValue("slug", slug);
                                    }
                                })}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Event Type *</Label>
                            <select
                                id="type"
                                {...register("type")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="wedding">Wedding</option>
                                <option value="trip">Trip</option>
                                <option value="party">Party</option>
                                <option value="corporate">Corporate Event</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-destructive">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date *</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    {...register("start_date")}
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-destructive">{errors.start_date.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date *</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    {...register("end_date")}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-destructive">{errors.end_date.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location_summary">Location</Label>
                            <Input
                                id="location_summary"
                                placeholder="e.g., Napa Valley, California"
                                {...register("location_summary")}
                            />
                            {errors.location_summary && (
                                <p className="text-sm text-destructive">{errors.location_summary.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                rows={3}
                                placeholder="A brief description of your event..."
                                {...register("description")}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug *</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">/event/</span>
                                <Input
                                    id="slug"
                                    placeholder="my-event"
                                    {...register("slug")}
                                    className="flex-1"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This will be part of your event's URL. Use lowercase letters, numbers, and hyphens.
                            </p>
                            {errors.slug && (
                                <p className="text-sm text-destructive">{errors.slug.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
