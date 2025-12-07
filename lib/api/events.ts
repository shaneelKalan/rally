"use server";

import { createClient } from "@/lib/supabase/server";
import { createEventSchema, type CreateEventInput } from "@/lib/validations/event";
import { revalidatePath } from "next/cache";

/**
 * Ensures the user exists in the public.users table.
 * Supabase Auth creates users in auth.users, but we need them in public.users
 * for foreign key relationships.
 * 
 * Note: This requires an INSERT policy on the users table:
 * CREATE POLICY "Users can create own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
 */
async function ensureUserProfile(supabase: Awaited<ReturnType<typeof createClient>>, user: { id: string; email?: string }) {
    // Try to upsert the user profile - this handles both new users and existing ones
    const { error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email || "",
    } as any, { onConflict: "id" });

    if (error) {
        // RLS policy might block this if the INSERT policy isn't set up
        // Log warning but don't throw - the user might already exist from a database trigger
        // or they might have been created during signup
        console.warn("[ensureUserProfile] Could not upsert user profile (this may be expected if RLS INSERT policy is missing):", error.message);

        // Only throw if it's not an RLS error - RLS errors mean we should continue and hope for the best
        if (!error.message.includes("row-level security") && !error.message.includes("duplicate")) {
            throw new Error("Failed to create user profile: " + error.message);
        }
    }
}

export async function createEvent(input: CreateEventInput) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Ensure user profile exists in public.users table
    await ensureUserProfile(supabase, user);

    // Validate input
    const validated = createEventSchema.parse(input);

    // Create event
    const { data: event, error } = await supabase
        .from("events")
        .insert({
            ...validated,
            user_id: user.id,
        } as any)
        .select()
        .single();

    if (error || !event) {
        throw new Error(error?.message || "Failed to create event");
    }

    const eventData: any = event;

    // Create default theme for event
    await supabase.from("event_themes").insert({
        event_id: eventData.id,
    } as any);

    revalidatePath("/app");

    // Return the event ID for client-side redirect
    // Using redirect() in server actions can sometimes hang
    return { eventId: eventData.id };
}

export async function getEvent(eventId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("user_id", user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return event;
}

export async function getEventWithTheme(eventId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data: event, error } = await supabase
        .from("events")
        .select(`
      *,
      event_themes (*)
    `)
        .eq("id", eventId)
        .eq("user_id", user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return event;
}
