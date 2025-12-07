import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.warn(
            "[supabase/client] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
        throw new Error("Missing Supabase environment variables");
    }

    // Return singleton to avoid creating multiple GoTrue clients
    if (!supabaseInstance) {
        supabaseInstance = createBrowserClient<Database>(url, key);
    }

    return supabaseInstance;
}
