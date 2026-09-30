import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId") || undefined;

    const states = store.getStates();
    const schemes = store.getSchemes();
    const projects = store.getProjects(stateId);
    const requests = store.getRequests(stateId);

    return NextResponse.json({
      states,
      schemes,
      projects,
      requests,
    });
  } catch (err: any) {
    console.error("API projects error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
