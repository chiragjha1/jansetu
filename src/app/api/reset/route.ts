import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST() {
  try {
    store.resetDemo();
    return NextResponse.json({ success: true, message: "Demo state restored to precomputed seed." });
  } catch (err: any) {
    console.error("Reset error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
