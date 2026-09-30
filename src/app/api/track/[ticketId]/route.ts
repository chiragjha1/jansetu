import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    const request = store.getRequest(ticketId);

    if (!request) {
      // Check precomputed requests directly if not in store
      const precomputed = store.getRequests().find((r) => r.id === ticketId);
      if (!precomputed) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }
      const project = precomputed.project_id ? store.getProject(precomputed.project_id) : undefined;
      return NextResponse.json({ request: precomputed, project });
    }

    const project = request.project_id ? store.getProject(request.project_id) : undefined;

    return NextResponse.json({
      request,
      project,
    });
  } catch (err: any) {
    console.error("Track API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
