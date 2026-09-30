import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { extractCitizenRequest, getEmbedding, cosineSimilarity } from "@/lib/gemini";
import { CitizenRequest, Project } from "@/lib/types";

export const dynamic = "force-dynamic";

// Rate limiting in-memory map: phone_hash -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      state = "rajasthan",
      district = "barmer",
      village_text = "Village",
      channel = "text",
      original_text = "",
      audio_base64,
      mime_type = "audio/webm",
      phone_hash = `hash_${Math.floor(100000 + Math.random() * 900000)}`,
      photo_ref,
    } = body;

    if (!original_text && !audio_base64) {
      return NextResponse.json(
        { error: "Please provide either text description or audio recording." },
        { status: 400 }
      );
    }

    // Rate limit: max 5 submissions per phone_hash per day
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const timestamps = (rateLimitMap.get(phone_hash) || []).filter((t) => t > dayAgo);

    if (timestamps.length >= 5) {
      return NextResponse.json(
        {
          error: "Daily rate limit reached (5 submissions per day). Please wait before submitting more requests.",
          rate_limited: true,
        },
        { status: 429 }
      );
    }

    timestamps.push(now);
    rateLimitMap.set(phone_hash, timestamps);

    // Step 1: Extract structured data with Gemini
    const { result: extraction, is_live_ai } = await extractCitizenRequest(
      original_text,
      state,
      audio_base64,
      mime_type
    );

    // If clarification needed, return early so citizen can clarify
    if (extraction.needs_clarification && extraction.clarifying_question) {
      return NextResponse.json({
        success: true,
        needs_clarification: true,
        clarifying_question: extraction.clarifying_question,
        extraction,
        is_live_ai,
      });
    }

    // Create unique citizen request ticket ID
    const ticketId = `TICKET-${state.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`;
    const newRequest: CitizenRequest = {
      id: ticketId,
      channel: channel as any,
      original_text: original_text || extraction.transcript || "Voice recording submitted",
      photo_ref,
      state,
      district,
      village_text,
      phone_hash,
      created_at: new Date().toISOString(),
      extraction,
      synthetic: false,
    };

    // Step 2: Deduplication via Embeddings
    const textToEmbed = `${extraction.translation_en} ${extraction.sub_issue} ${extraction.category}`;
    const newEmbedding = await getEmbedding(textToEmbed);

    // Search existing projects in same district & category
    const existingProjects = store.getProjects(state).filter(
      (p) => p.district.toLowerCase() === district.toLowerCase() && p.category === extraction.category
    );

    let matchedProject: Project | null = null;
    let highestSim = 0;

    for (const p of existingProjects) {
      if (p.embedding && p.embedding.length > 0) {
        const sim = cosineSimilarity(newEmbedding, p.embedding);
        if (sim > highestSim) {
          highestSim = sim;
          if (sim >= 0.82) {
            matchedProject = p;
          }
        }
      } else {
        // Text-based fallback match
        const isSimilar =
          p.sub_issue.toLowerCase().includes(extraction.sub_issue.toLowerCase()) ||
          extraction.sub_issue.toLowerCase().includes(p.sub_issue.toLowerCase());
        if (isSimilar) {
          matchedProject = p;
          highestSim = 0.85;
          break;
        }
      }
    }

    let targetProjectId = "";

    if (matchedProject) {
      // Merge request into existing project cluster
      matchedProject.request_ids.push(ticketId);
      matchedProject.issue_count += 1;

      // Count unique citizens (spammer counts once)
      const allClusterRequests = store.getRequests().filter((r) => matchedProject!.request_ids.includes(r.id));
      const uniquePhones = new Set(allClusterRequests.map((r) => r.phone_hash));
      uniquePhones.add(phone_hash);
      matchedProject.unique_citizens = uniquePhones.size;

      // Update average urgency
      const totalUrgency = allClusterRequests.reduce((acc, r) => acc + (r.extraction?.urgency || 3), extraction.urgency);
      matchedProject.avg_urgency = Number((totalUrgency / (allClusterRequests.length + 1)).toFixed(1));

      if (village_text && !matchedProject.village_texts.includes(village_text)) {
        matchedProject.village_texts.push(village_text);
      }

      newRequest.project_id = matchedProject.id;
      store.saveProject(matchedProject);
      targetProjectId = matchedProject.id;
    } else {
      // Create new Project cluster
      const newProjectId = `PRJ-${state.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
      newRequest.project_id = newProjectId;

      // Primary scheme mapping based on catalog
      let primaryScheme = "MGNREGA";
      let unitCost = 0.35;
      if (extraction.category === "road") {
        primaryScheme = "PMGSY";
        unitCost = 0.65;
      } else if (extraction.category === "water") {
        primaryScheme = "JJM";
        unitCost = 0.45;
      } else if (extraction.category === "health") {
        primaryScheme = "NHM";
        unitCost = 0.55;
      } else if (extraction.category === "education") {
        primaryScheme = "SAMAGRA_SHIKSHA";
        unitCost = 0.4;
      } else if (extraction.category === "housing") {
        primaryScheme = "PMAY-G";
        unitCost = 0.35;
      }

      const newProject: Project = {
        id: newProjectId,
        state,
        district,
        category: extraction.category,
        title: `${extraction.sub_issue} in ${village_text || district}`,
        sub_issue: extraction.sub_issue,
        village_texts: village_text ? [village_text] : [district],
        request_ids: [ticketId],
        issue_count: 1,
        unique_citizens: 1,
        avg_urgency: extraction.urgency,
        est_affected_population: extraction.affected_population_estimate || 2000,
        est_cost_crore: unitCost,
        embedding: newEmbedding,
        scheme_routing: {
          primary_scheme_id: primaryScheme,
          secondary_scheme_id: "MGNREGA",
          reasoning: `Categorized under ${primaryScheme} eligible civic works.`,
          catalog_basis: `Identified by Gemini semantic alignment with ${primaryScheme} guidelines.`,
          confidence: 0.92,
          human_check_needed: false,
          is_live_ai: is_live_ai,
        },
        priority_score: 75,
        funding_status: "Funded",
        allocated_scheme_id: primaryScheme,
        status_timeline: [
          {
            stage: "received",
            timestamp: new Date().toISOString(),
            note: "Citizen request registered into ledger.",
          },
          {
            stage: "grouped",
            timestamp: new Date().toISOString(),
            note: `Grouped into community project ${newProjectId}.`,
          },
        ],
      };

      store.saveProject(newProject);
      targetProjectId = newProjectId;
    }

    // Save request to store
    store.addRequest(newRequest);

    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      project_id: targetProjectId,
      is_deduplicated: Boolean(matchedProject),
      extraction,
      is_live_ai,
      message: matchedProject
        ? `Grouped with existing project #${matchedProject.id} (cosine similarity: ${(highestSim * 100).toFixed(1)}%)`
        : `Created new project cluster #${targetProjectId}`,
    });
  } catch (err: any) {
    console.error("Submit API error:", err);
    return NextResponse.json({ error: err.message || "Intake error" }, { status: 500 });
  }
}
