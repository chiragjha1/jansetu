import { ExtractionResult, ExtractionResultSchema, SchemeRoutingResult, SchemeRoutingSchema, VerificationResult, VerificationResultSchema, CATEGORIES, Category } from "./types";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-2";

// Fast client instance builder (server-side only)
async function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("Failed to import @google/genai:", err);
    return null;
  }
}

/**
 * Fallback keyword extraction when offline or API key missing
 */
export function fallbackExtract(text: string, state: string): ExtractionResult {
  const t = text.toLowerCase();
  const lang = state === "rajasthan" ? "hi" : state === "odisha" ? "or" : state === "tamil_nadu" ? "ta" : "en";

  if (t.includes("पानी") || t.includes("ପାଣି") || t.includes("நீர்") || t.includes("water") || t.includes("बोरवेल") || t.includes("pipe")) {
    return {
      language_detected: lang,
      translation_en: "Drinking water pipeline leak and acute community water supply crisis.",
      category: "water",
      sub_issue: "Drinking water pipeline and supply restoration",
      urgency: 4,
      urgency_reason: "Lack of potable water severely impacts community health.",
      affected_population_estimate: 2500,
      confidence: 0.88,
      needs_clarification: false,
      clarifying_question: null,
    };
  }

  if (t.includes("सड़क") || t.includes("ରାସ୍ତା") || t.includes("சாலை") || t.includes("road") || t.includes("डामर") || t.includes("पुल")) {
    return {
      language_detected: lang,
      translation_en: "Rural access road damaged with severe potholes preventing transit.",
      category: "road",
      sub_issue: "All-weather asphalt road construction and repair",
      urgency: 4,
      urgency_reason: "Road erosion blocks emergency ambulance access.",
      affected_population_estimate: 4200,
      confidence: 0.9,
      needs_clarification: false,
      clarifying_question: null,
    };
  }

  if (t.includes("अस्पताल") || t.includes("डॉक्टर") || t.includes("health") || t.includes("மருத்துவ") || t.includes("phc")) {
    return {
      language_detected: lang,
      translation_en: "Primary health centre lacking emergency medical equipment and staff.",
      category: "health",
      sub_issue: "Primary health centre infrastructure and equipment",
      urgency: 5,
      urgency_reason: "Immediate risk to patient emergency care.",
      affected_population_estimate: 5500,
      confidence: 0.92,
      needs_clarification: false,
      clarifying_question: null,
    };
  }

  if (t.includes("स्कूल") || t.includes("school") || t.includes("ଶିକ୍ଷା") || t.includes("பள்ளி")) {
    return {
      language_detected: lang,
      translation_en: "Government school classroom additions and girl-child toilet facilities needed.",
      category: "education",
      sub_issue: "School classroom addition and sanitation infrastructure",
      urgency: 3,
      urgency_reason: "Critical for student safety and daily attendance.",
      affected_population_estimate: 950,
      confidence: 0.85,
      needs_clarification: false,
      clarifying_question: null,
    };
  }

  return {
    language_detected: lang,
    translation_en: text,
    category: "other",
    sub_issue: "Rural public infrastructure maintenance",
    urgency: 3,
    urgency_reason: "Community development request.",
    affected_population_estimate: 1200,
    confidence: 0.8,
    needs_clarification: false,
    clarifying_question: null,
  };
}

/**
 * 1. EXTRACTION: Structured JSON output with Gemini 2.5 Flash
 */
export async function extractCitizenRequest(
  text: string,
  state: string,
  audioBase64?: string,
  mimeType: string = "audio/webm"
): Promise<{ result: ExtractionResult; is_live_ai: boolean }> {
  const ai = await getGenAIClient();

  if (ai) {
    const prompt = `You are JanSetu's Multilingual Indian Citizen Governance Intake Assistant.
Extract structured civic data from the citizen submission.
The submission may be in Hindi, Odia, Tamil, English, or code-mixed (Hinglish/Tanglish).
State context: ${state}.

Rules:
1. Detect language ('hi', 'or', 'ta', 'en', etc.).
2. Translate accurately to clear English in 'translation_en'.
3. Assign category strictly from: ['road', 'water', 'health', 'education', 'electricity', 'sanitation', 'housing', 'irrigation', 'other'].
4. 'sub_issue': Short English phrase (e.g. 'All-weather road connectivity').
5. 'urgency': Integer 1 to 5 with one-sentence 'urgency_reason'.
6. 'affected_population_estimate': Realistic integer or null.
7. If the request is so vague that the civic problem cannot be understood at all, set 'needs_clarification': true and write 'clarifying_question' in the citizen's own language asking for the specific issue. Otherwise false.
8. NEVER guess a village name if unstated.
Output strictly valid JSON conforming to the schema.`;

    const parts: any[] = [];
    if (audioBase64) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType,
        },
      });
      parts.push({
        text: `${prompt}\n(Note: Audio recording provided by citizen. First transcribe it into 'transcript', then translate and extract.)`,
      });
    } else {
      parts.push({
        text: `${prompt}\nCitizen text: "${text}"`,
      });
    }

    // Attempt call with 1 retry on malformed JSON
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: parts,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          const cat = String(parsed.category || "").toLowerCase();
          const matchedCategory: Category = CATEGORIES.includes(cat as Category)
            ? (cat as Category)
            : cat.includes("water") ? "water"
            : cat.includes("road") ? "road"
            : cat.includes("health") ? "health"
            : cat.includes("school") || cat.includes("education") ? "education"
            : cat.includes("electric") ? "electricity"
            : cat.includes("sanitat") ? "sanitation"
            : "other";

          let urg = typeof parsed.urgency === "number" ? Math.round(parsed.urgency) : 3;
          if (typeof parsed.urgency === "string") {
            const u = parsed.urgency.toLowerCase();
            if (u.includes("high") || u.includes("crit")) urg = 4;
            else if (u.includes("low")) urg = 2;
          }
          urg = Math.max(1, Math.min(5, urg));

          const normalized: ExtractionResult = {
            language_detected: String(parsed.language_detected || (state === "rajasthan" ? "hi" : state === "odisha" ? "or" : state === "tamil_nadu" ? "ta" : "en")),
            transcript: parsed.transcript || null,
            translation_en: String(parsed.translation_en || text),
            category: matchedCategory,
            sub_issue: String(parsed.sub_issue || "Public infrastructure issue"),
            urgency: urg,
            urgency_reason: String(parsed.urgency_reason || "Community civic requirement"),
            affected_population_estimate: typeof parsed.affected_population_estimate === "number" ? parsed.affected_population_estimate : null,
            confidence: typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.92,
            needs_clarification: Boolean(parsed.needs_clarification),
            clarifying_question: parsed.clarifying_question || null,
          };
          const validated = ExtractionResultSchema.parse(normalized);
          return { result: validated, is_live_ai: true };
        }
      } catch (err) {
        console.warn(`Gemini extraction attempt ${attempt + 1} failed:`, err);
      }
    }
  }

  // Graceful fallback to deterministic extractor
  return {
    result: fallbackExtract(text, state),
    is_live_ai: false,
  };
}

/**
 * 2. EMBEDDINGS: GEMINI_EMBED_MODEL
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const ai = await getGenAIClient();
  if (ai) {
    try {
      const resp = await ai.models.embedContent({
        model: GEMINI_EMBED_MODEL,
        contents: text,
      });
      const values = (resp as any).embeddings?.[0]?.values || (resp as any).embedding?.values;
      if (values && values.length > 0) {
        return values;
      }
    } catch (e) {
      console.warn("Embedding API error, using hash embedding fallback:", e);
    }
  }

  // Deterministic 16-dimensional feature vector fallback for offline clustering
  const hashVec = new Array(16).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const charCode = words[i].charCodeAt(0) || 0;
    hashVec[i % 16] += charCode / 255;
  }
  const norm = Math.sqrt(hashVec.reduce((a, b) => a + b * b, 0)) || 1;
  return hashVec.map((v) => v / norm);
}

/**
 * Cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 0;
  return dot / denom;
}
