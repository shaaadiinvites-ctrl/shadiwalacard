import { createClient } from "@supabase/supabase-js";

// Polyfill global WebSocket for Node.js < 22 environments where Supabase Realtime checks globalThis.WebSocket
const globalScope = globalThis as unknown as { WebSocket?: typeof WebSocket };
if (typeof globalThis !== "undefined" && !globalScope.WebSocket) {
  globalScope.WebSocket = class DummyWebSocket {} as unknown as typeof WebSocket;
}

// Server-side only — uses service role key, bypasses RLS
// NEVER import this in client components
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
