import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, project_id, rank, priority_score, category, components, movers } = body;

    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

    if (mode === "what_changed") {
      // Top movers narration
      if (apiKey) {
        try {
          const { GoogleGenAI } = await import("@google/genai");
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `You are an AI governance analyst explaining project rank shifts to a policymaker.
The following top 5 projects changed rank after the policymaker adjusted priority weights:
${JSON.stringify(movers, null, 2)}

Write exactly a 3-sentence plain English summary explaining which projects gained or lost priority and strictly citing the reasons based on the weights and scores provided. Do NOT invent or compute any numbers. Be concise and professional.`;

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
          });

          if (response.text) {
            return NextResponse.json({
              narrative: response.text.trim(),
              is_live_ai: true,
            });
          }
        } catch (aiErr) {
          console.error("Gemini what_changed error, falling back:", aiErr);
        }
      }

      // High-quality deterministic fallback
      const topRisers = movers?.filter((m: any) => m.delta > 0) || [];
      const topFallers = movers?.filter((m: any) => m.delta < 0) || [];

      const riserText = topRisers.length > 0
        ? `${topRisers[0].title} moved up ${topRisers[0].delta} ranks due to elevated gap and need weighting.`
        : "Projects with higher service gaps advanced across districts.";
      const fallerText = topFallers.length > 0
        ? `${topFallers[0].title} conceded ranks as weight shifted toward urgent rural infrastructure.`
        : "Lower urgency schemes accommodated higher priority interventions.";

      return NextResponse.json({
        narrative: `Weight adjustments directly altered the priority distribution across the state. ${riserText} ${fallerText}`,
        is_live_ai: false,
      });
    }

    // Default: why_rank explanation
    if (apiKey) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are JanSetu's Explainable Governance Assistant.
Explain why this community project is ranked #${rank} with priority score ${priority_score}/100.
Project Category: ${category}
Deterministic metrics:
- Normalized Adjusted Demand: ${components?.norm_adjusted_demand}
- Normalized Service Gap: ${components?.norm_gap}
- Normalized Average Urgency: ${components?.norm_avg_urgency}
- Normalized Cost-Effectiveness: ${components?.norm_benefit_per_rupee}

Rules:
1. Maximum 60 words.
2. Plain English.
3. Cite only the provided numbers and metric names. Do NOT calculate or invent any new numbers.`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        if (response.text) {
          return NextResponse.json({
            explanation: response.text.trim(),
            is_live_ai: true,
          });
        }
      } catch (aiErr) {
        console.error("Gemini why_rank error, falling back:", aiErr);
      }
    }

    // Deterministic fallback
    return NextResponse.json({
      explanation: `Ranked #${rank} with priority score ${priority_score}/100 based on a high service gap index (${Math.round((components?.norm_gap ?? 0.5) * 100)}%) and substantial citizen demand (${Math.round((components?.norm_adjusted_demand ?? 0.5) * 100)}%), yielding optimal community value.`,
      is_live_ai: false,
    });
  } catch (err: any) {
    console.error("Explain route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
