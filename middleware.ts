import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Read envs directly and fail-open if missing so dev flow isn't blocked
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn(
            "[Middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY - skipping auth enforcement (dev mode tolerant)."
        );
        return response;
    }

    let supabase;
    try {
        supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        try {
                            request.cookies.set(name, value);
                            response.cookies.set(name, value, options);
                        } catch (err) {
                            // Setting cookies may not be allowed in certain edge runtimes; swallow safely
                            console.warn("[Middleware] Failed to set cookie:", name);
                        }
                    });
                },
            },
        });
    } catch (err) {
        console.warn("[Middleware] Failed to create Supabase client, skipping auth enforcement:", err);
        return response;
    }

    let user = null;
    try {
        const {
            data: { user: u },
        } = await supabase.auth.getUser();
        user = u ?? null;
    } catch {
        return response;
    }

    // Protect /app routes
    if (request.nextUrl.pathname.startsWith("/app")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Redirect logged-in users from login page
    if (request.nextUrl.pathname === "/login" && user) {
        return NextResponse.redirect(new URL("/app", request.url));
    }

    return response;
}

export const config = {
    // Only run middleware for protected app routes and top-level auth pages.
    // This avoids interfering with /auth/callback and shortlinks (/r) so the PKCE verifier cookie isn't lost.
    matcher: ["/app/:path*", "/login", "/signup"],
};
