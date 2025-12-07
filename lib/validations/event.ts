import { z } from "zod";

export const createEventSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    type: z.enum(["wedding", "trip", "party", "corporate", "other"]),
    description: z.string().optional(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    location_summary: z.string().optional(),
    slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
