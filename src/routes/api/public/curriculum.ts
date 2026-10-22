import { createFileRoute } from "@tanstack/react-router";
import { universities } from "@/lib/lmd-data";

// Public catalog only: no grades, users, pending proposals or privileged reads.
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store",
};
export const Route = createFileRoute("/api/public/curriculum")({
  server: { handlers: {
    GET: () => Response.json(universities, { headers }),
    OPTIONS: () => new Response(null, { status: 204, headers }),
  } },
});