import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
  const embedModel = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-2";

  const states = store.getStates();
  const projects = store.getProjects();
  const requests = store.getRequests();

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    gemini: {
      configured: hasKey,
      model,
      embedModel,
      mode: hasKey ? "live" : "fallback_precomputed",
    },
    store: {
      states_count: states.length,
      projects_count: projects.length,
      requests_count: requests.length,
    },
  });
}
