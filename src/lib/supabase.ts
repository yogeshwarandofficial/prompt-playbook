import { createClient } from "@supabase/supabase-js";

// ── Browser client (anon key) — used in React components ──────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase VITE_ environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Server client (service role key) — used ONLY in API routes ────────────
// Service role bypasses RLS — never expose this key to the browser.
// process.env is available in TanStack Start server (Nitro) context.
export function getServerSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY — add it to .env (no VITE_ prefix)"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type Database = {
  public: {
    Tables: {
      internship_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          mobile: string;
          college_name: string;
          domain: string;
          subdomain: string | null;
          message: string | null;
          resume_url: string | null;
          ip_address: string | null;
          submitted_at: string;
          status: "new" | "reviewed" | "accepted" | "rejected";
        };
        Insert: Omit<Database["public"]["Tables"]["internship_applications"]["Row"], "id" | "submitted_at" | "status">;
      };
      contact_submissions: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          subject: string;
          message: string;
          ip_address: string | null;
          submitted_at: string;
          status: "new" | "read" | "replied";
        };
        Insert: Omit<Database["public"]["Tables"]["contact_submissions"]["Row"], "id" | "submitted_at" | "status">;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: { email: string };
      };
    };
  };
};
