import fs from "fs";
import path from "path";
import {
  CitizenRequest,
  ExtractionResult,
  Project,
  Scheme,
  SchemeRoutingResult,
  StateConfig,
} from "../src/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PRECOMPUTED_DIR = path.join(DATA_DIR, "precomputed");
const REQUESTS_FILE = path.join(PRECOMPUTED_DIR, "requests.json");
const PROJECTS_FILE = path.join(PRECOMPUTED_DIR, "projects.json");
const TICKETS_FILE = path.join(PRECOMPUTED_DIR, "seed_tickets.json");
const SCHEMES_FILE = path.join(DATA_DIR, "schemes.json");
const CONFIG_STATES_DIR = path.join(process.cwd(), "config", "states");

console.log("Running seed:ai processing pipeline...");

const requests: CitizenRequest[] = JSON.parse(fs.readFileSync(REQUESTS_FILE, "utf-8"));
const schemes: Scheme[] = JSON.parse(fs.readFileSync(SCHEMES_FILE, "utf-8"));

// Category mapping helper
function categorize(text: string, defaultCat: string = "other"): {
  cat: any;
  sub: string;
  trans: string;
  urgency: number;
  reason: string;
  pop: number;
} {
  const t = text.toLowerCase();
  if (t.includes("पानी") || t.includes("ପାଣି") || t.includes("நீர்") || t.includes("water") || t.includes("बोरवेल") || t.includes("pipe")) {
    return {
      cat: "water",
      sub: "Drinking water pipeline leakage and acute salinity issue",
      trans: "Severe shortage of safe drinking water and damaged distribution pipelines affecting community supply.",
      urgency: 4,
      reason: "Contaminated or interrupted potable water poses immediate health risk to rural households.",
      pop: 3400,
    };
  }
  if (t.includes("सड़क") || t.includes("ରାସ୍ତା") || t.includes("சாலை") || t.includes("road") || t.includes("डामर") || t.includes("पुल") || t.includes("bridge")) {
    return {
      cat: "road",
      sub: "All-weather asphalt road connectivity and culvert construction",
      trans: "Main village access road heavily eroded with deep potholes preventing ambulance and transport access.",
      urgency: 4,
      reason: "Critical rural connectivity severed during emergency transit and agricultural produce movement.",
      pop: 4800,
    };
  }
  if (t.includes("डॉक्टर") || t.includes("ଡାକ୍ତର") || t.includes("மருத்துவ") || t.includes("health") || t.includes("अस्पताल") || t.includes("डिस्पेंसरी") || t.includes("phc")) {
    return {
      cat: "health",
      sub: "Primary Health Centre infrastructure, emergency care and cold chain facility",
      trans: "Local primary healthcare facility lacking emergency duty staff, essential drug stocks and vaccine refrigeration.",
      urgency: 5,
      reason: "Lack of immediate medical response and cold storage for vaccines threatens vulnerable mothers and children.",
      pop: 6200,
    };
  }
  if (t.includes("स्कूल") || t.includes("ବିଦ୍ୟାଳୟ") || t.includes("பள்ளி") || t.includes("school") || t.includes("कमरे") || t.includes("लैब")) {
    return {
      cat: "education",
      sub: "Government school classroom expansion, lab and sanitation facilities",
      trans: "Dilapidated school roof leaking and severe shortage of classrooms, science laboratory, and dedicated girls' toilets.",
      urgency: 3,
      reason: "Inadequate educational infrastructure directly hinders students' regular attendance and learning outcomes.",
      pop: 1200,
    };
  }
  if (t.includes("बिजली") || t.includes("ବିଜୁଳି") || t.includes("மின்சாரம்") || t.includes("electricity") || t.includes("ट्रांसफार्मर") || t.includes("voltage")) {
    return {
      cat: "electricity",
      sub: "Dedicated transformer installation and high-capacity electricity transmission",
      trans: "Chronic low-voltage and burnt distribution transformer causing persistent blackouts and pump failures.",
      urgency: 3,
      reason: "Frequent power cuts jeopardize agricultural tubewell irrigation and night-time village safety.",
      pop: 2100,
    };
  }
  if (t.includes("नाली") || t.includes("ଶୌଚାଳୟ") || t.includes("கழிவுநீர்") || t.includes("sanitation") || t.includes("ड्रेनेज") || t.includes("कचरा")) {
    return {
      cat: "sanitation",
      sub: "Solid waste management and concrete drainage channel network",
      trans: "Stagnant wastewater flooding public pathways due to lack of drainage culverts and waste disposal bins.",
      urgency: 4,
      reason: "Unhygienic drainage stagnation creates vector-borne disease breeding zones in dense settlements.",
      pop: 2900,
    };
  }
  if (t.includes("आवास") || t.includes("ଘର") || t.includes("வீடு") || t.includes("housing") || t.includes("झोपड़ी")) {
    return {
      cat: "housing",
      sub: "Pucca rural housing allocation for flood-prone and kutcha settlements",
      trans: "Homeless and vulnerable households living in dilapidated mud-thatch dwellings requiring disaster-resilient shelter.",
      urgency: 3,
      reason: "Extreme weather exposure causes recurring structural collapse and safety risks to impoverished families.",
      pop: 850,
    };
  }
  if (t.includes("एनीकट") || t.includes("କେନାଲ") || t.includes("பாசனம்") || t.includes("irrigation") || t.includes("चेकडैम")) {
    return {
      cat: "irrigation",
      sub: "Check dam construction and irrigation canal desilting",
      trans: "Silting of irrigation canal network blocking tail-end agricultural water distribution to farm clusters.",
      urgency: 3,
      reason: "Agricultural livelihoods dependent on seasonal surface water retention and water table recharge.",
      pop: 3100,
    };
  }

  return {
    cat: "other",
    sub: "Community asset upgradation and public utility repair",
    trans: "General community infrastructure maintenance and civic amenity development requested by local residents.",
    urgency: 2,
    reason: "Public utility enhancement requested for local community welfare.",
    pop: 1500,
  };
}

// Scheme routing logic based on catalog
function routeScheme(cat: string, sub: string): SchemeRoutingResult {
  switch (cat) {
    case "road":
      return {
        primary_scheme_id: "PMGSY",
        secondary_scheme_id: "MGNREGA",
        reasoning: "All-weather blacktopped road construction to unconnected rural habitations aligns with PMGSY mandate.",
        catalog_basis: 'Quoted: "Construction and major upgradation of all-weather rural roads, culverts, cross-drainage structures, blacktopping."',
        confidence: 0.95,
        human_check_needed: false,
        is_live_ai: false,
      };
    case "water":
      return {
        primary_scheme_id: "JJM",
        secondary_scheme_id: "MGNREGA",
        reasoning: "Piped drinking water distribution and functional household tap connections fall directly under Jal Jeevan Mission.",
        catalog_basis: 'Quoted: "Piped drinking water distribution networks, borewell solar pumps, village water storage tanks."',
        confidence: 0.94,
        human_check_needed: false,
        is_live_ai: false,
      };
    case "health":
      return {
        primary_scheme_id: "NHM",
        secondary_scheme_id: null,
        reasoning: "Primary health centre and sub-centre strengthening, cold chain, and maternal care are core NHM eligible works.",
        catalog_basis: 'Quoted: "Primary Health Centre (PHC) building upgradation, Sub-Health Centre solar power and labour rooms, cold chain."',
        confidence: 0.93,
        human_check_needed: false,
        is_live_ai: false,
      };
    case "education":
      return {
        primary_scheme_id: "SAMAGRA_SHIKSHA",
        secondary_scheme_id: null,
        reasoning: "Government school infrastructure, classroom addition, and girl-child toilet blocks are funded under Samagra Shiksha.",
        catalog_basis: 'Quoted: "Government school classroom additions, school boundary walls, girl-child toilet blocks, drinking water points."',
        confidence: 0.96,
        human_check_needed: false,
        is_live_ai: false,
      };
    case "housing":
      return {
        primary_scheme_id: "PMAY-G",
        secondary_scheme_id: null,
        reasoning: "Rural housing financial assistance for kutcha and dilapidated dwellings is exclusively covered by PMAY-Gramin.",
        catalog_basis: 'Quoted: "Rural pucca housing clusters, disaster-resilient dwelling units, housing sanitation attachment."',
        confidence: 0.98,
        human_check_needed: false,
        is_live_ai: false,
      };
    case "sanitation":
      return {
        primary_scheme_id: "MGNREGA",
        secondary_scheme_id: "PMAY-G",
        reasoning: "Community wastewater drainage, soak pits, and solid waste composting in rural panchayats are permitted works under MGNREGA.",
        catalog_basis: 'Quoted: "Water conservation and harvesting, desilting of ponds/canals, rural sanitation structures."',
        confidence: 0.88,
        human_check_needed: true,
        is_live_ai: false,
      };
    case "irrigation":
      return {
        primary_scheme_id: "MGNREGA",
        secondary_scheme_id: null,
        reasoning: "Canal desilting, check dam construction, and natural resource water conservation are core MGNREGA works.",
        catalog_basis: 'Quoted: "Water conservation and harvesting, check dams, desilting of ponds/canals."',
        confidence: 0.92,
        human_check_needed: false,
        is_live_ai: false,
      };
    default:
      return {
        primary_scheme_id: "MGNREGA",
        secondary_scheme_id: null,
        reasoning: "Unclassified rural community asset creation recommended for local panchayat execution under MGNREGA works.",
        catalog_basis: 'Quoted: "Creating durable rural community assets and manual wage works."',
        confidence: 0.75,
        human_check_needed: true,
        is_live_ai: false,
      };
  }
}

// Map each request to an extraction
for (const req of requests) {
  const { cat, sub, trans, urgency, reason, pop } = categorize(req.original_text);
  const lang = req.state === "rajasthan" ? "hi" : req.state === "odisha" ? "or" : "ta";
  req.extraction = {
    language_detected: lang,
    transcript: req.channel === "voice" ? req.original_text : null,
    translation_en: trans,
    category: cat,
    sub_issue: sub,
    urgency,
    urgency_reason: reason,
    affected_population_estimate: pop,
    confidence: 0.94,
    needs_clarification: false,
    clarifying_question: null,
  };
}

// Group requests into Projects by state + district + category
const clusterMap = new Map<string, CitizenRequest[]>();

for (const req of requests) {
  const cat = req.extraction?.category || "other";
  const key = `${req.state}:${req.district}:${cat}`;
  if (!clusterMap.has(key)) {
    clusterMap.set(key, []);
  }
  clusterMap.get(key)!.push(req);
}

const projects: Project[] = [];
let projectCounter = 1;

for (const [key, clusterReqs] of clusterMap.entries()) {
  const [state, district, category] = key.split(":");
  const projectId = `PRJ-${state.toUpperCase().slice(0, 3)}-${String(projectCounter++).padStart(3, "0")}`;

  // Unique citizens by phone hash
  const phoneSet = new Set<string>();
  const villages = new Set<string>();
  let totalUrgency = 0;
  let totalPop = 0;

  for (const r of clusterReqs) {
    r.project_id = projectId;
    phoneSet.add(r.phone_hash);
    if (r.village_text) villages.add(r.village_text);
    totalUrgency += r.extraction?.urgency || 3;
    totalPop += r.extraction?.affected_population_estimate || 2000;
  }

  const avgUrgency = Number((totalUrgency / clusterReqs.length).toFixed(1));
  const subIssue = clusterReqs[0].extraction?.sub_issue || "Community need";
  const schemeRouting = routeScheme(category, subIssue);

  // Unit cost calculation
  const schemeObj = schemes.find((s) => s.id === schemeRouting.primary_scheme_id);
  const unitCost = schemeObj ? schemeObj.unit_cost_crore : 0.5;
  const severityMultiplier = avgUrgency >= 4 ? 1.4 : avgUrgency >= 3 ? 1.0 : 0.8;
  const estCostCrore = Number((unitCost * severityMultiplier).toFixed(2));

  // Determine stage and timeline
  let fundingStatus: "Funded" | "Unfunded - High Priority" | "Under Review" = "Funded";
  const timeline: any[] = [
    {
      stage: "received",
      timestamp: clusterReqs[clusterReqs.length - 1].created_at,
      note: `${clusterReqs.length} community requests received from citizens.`,
    },
    {
      stage: "grouped",
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      note: `Synthesized into prioritized project cluster for ${district}.`,
    },
    {
      stage: "prioritised",
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      note: `Scored and routed to ${schemeRouting.primary_scheme_id}.`,
    },
  ];

  // Specific demo projects
  let verification: any = undefined;
  if (clusterReqs.some((r) => r.id === "TICKET-DEMO-01")) {
    fundingStatus = "Funded";
    timeline.push({
      stage: "funded",
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      note: "Budget allocated under Jal Jeevan Mission.",
    });
  } else if (clusterReqs.some((r) => r.id === "TICKET-DEMO-02")) {
    fundingStatus = "Funded";
    timeline.push({
      stage: "funded",
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      note: "Sanctioned and scheduled under PMGSY batch 2026.",
    });
  } else if (clusterReqs.some((r) => r.id === "TICKET-DEMO-03")) {
    fundingStatus = "Funded";
    timeline.push({
      stage: "funded",
      timestamp: new Date(Date.now() - 15 * 86400000).toISOString(),
      note: "Sanctioned and funded under National Health Mission.",
    });
    timeline.push({
      stage: "completed",
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      note: "Solar refrigeration & labour room installation completed and verified by field officer.",
      photo_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
    });
    verification = {
      matches_reported_issue: true,
      shows_completion: true,
      evidence_notes: "Solar cold chain storage units installed and operational at Tiruvadanai PHC with continuous power supply.",
      confidence: 0.98,
      verdict: "verified",
      is_live_ai: false,
    };
  }

  projects.push({
    id: projectId,
    state,
    district,
    category: category as any,
    title: `${subIssue} in ${Array.from(villages).slice(0, 2).join(", ") || district}`,
    sub_issue: subIssue,
    village_texts: Array.from(villages),
    request_ids: clusterReqs.map((r) => r.id),
    issue_count: clusterReqs.length,
    unique_citizens: phoneSet.size,
    avg_urgency: avgUrgency,
    est_affected_population: totalPop,
    est_cost_crore: estCostCrore,
    scheme_routing: schemeRouting,
    priority_score: 85, // Will be computed deterministically in M2
    funding_status: fundingStatus,
    allocated_scheme_id: schemeRouting.primary_scheme_id,
    status_timeline: timeline,
    verification,
  });
}

// Save precomputed outputs
fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf-8");
fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");

// Save guaranteed seed tickets metadata
const seedTickets = [
  {
    ticket_id: "TICKET-DEMO-01",
    state: "rajasthan",
    district: "barmer",
    village: "Ramsar",
    stage: "grouped",
    description: "Ramsar drinking water pipeline crisis",
    project_id: requests.find((r) => r.id === "TICKET-DEMO-01")?.project_id,
  },
  {
    ticket_id: "TICKET-DEMO-02",
    state: "odisha",
    district: "koraput",
    village: "Lamtaput",
    stage: "funded",
    description: "Lamtaput all-weather road connectivity",
    project_id: requests.find((r) => r.id === "TICKET-DEMO-02")?.project_id,
  },
  {
    ticket_id: "TICKET-DEMO-03",
    state: "tamil_nadu",
    district: "ramanathapuram",
    village: "Tiruvadanai",
    stage: "completed",
    description: "Tiruvadanai PHC vaccine cold storage installation",
    project_id: requests.find((r) => r.id === "TICKET-DEMO-03")?.project_id,
  },
];
fs.writeFileSync(TICKETS_FILE, JSON.stringify(seedTickets, null, 2), "utf-8");

console.log(`Precomputed ${projects.length} project clusters from ${requests.length} requests.`);
console.log(`Saved projects to ${PROJECTS_FILE}`);
console.log(`Saved seed tickets to ${TICKETS_FILE}`);
