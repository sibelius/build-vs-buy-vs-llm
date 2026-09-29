export type ApproachId = "build" | "buy" | "llm";

export type AiEffect = "stronger" | "weaker" | "same";

export type Point = {
  title: string;
  body: string;
  ai: AiEffect;
  aiNote: string;
};

export type Approach = {
  id: ApproachId;
  name: string;
  color: string;
  tagline: string;
  definition: string;
  examples: string[];
  pros: Point[];
  cons: Point[];
  bestWhen: string[];
};

export const COLORS: Record<ApproachId, string> = {
  build: "#38bdf8",
  buy: "#fbbf24",
  llm: "#e535ab",
};

export const APPROACHES: Record<ApproachId, Approach> = {
  build: {
    id: "build",
    name: "Build",
    color: COLORS.build,
    tagline: "Your team writes, ships and owns the code.",
    definition:
      "You design, implement, operate and maintain the software yourself. The logic is deterministic code in your repo, running on your infra, owned by your team forever.",
    examples: [
      "Core ledger & payment orchestration",
      "Pricing / risk engine",
      "Internal admin tailored to your domain",
    ],
    pros: [
      {
        title: "Perfect fit",
        body: "Models your domain exactly. No bending your process around someone else's product.",
        ai: "same",
        aiNote: "Fit was always Build's strength. AI doesn't change it, but it does make getting there cheaper.",
      },
      {
        title: "Differentiation & moat",
        body: "What you build is what competitors can't buy. Customers experience the core of your product as your code.",
        ai: "stronger",
        aiNote: "Anyone can buy or prompt the commodity parts now, so the parts only you have are worth more.",
      },
      {
        title: "No lock-in, no seat tax",
        body: "No per-seat or per-transaction fees that grow with you. Adding a user costs close to nothing.",
        ai: "same",
        aiNote: "Unchanged. At high volume, owning the code is still the cheapest way to run.",
      },
      {
        title: "Deterministic & testable",
        body: "Same input, same output. You can unit test it, audit it, and explain it to a regulator.",
        ai: "stronger",
        aiNote: "LLM-driven parts are probabilistic, so a deterministic core you can verify is worth more than before.",
      },
      {
        title: "Data stays home",
        body: "Nothing leaves your perimeter. Security and privacy follow your rules.",
        ai: "stronger",
        aiNote: "Proprietary data is now the thing that makes AI useful. Keeping it in-house has strategic value.",
      },
    ],
    cons: [
      {
        title: "Slow to first value",
        body: "Months of design, implementation, hardening and edge cases before users see anything.",
        ai: "weaker",
        aiNote: "Coding agents compress weeks into days for well-specified software. This is the biggest shift.",
      },
      {
        title: "High upfront cost",
        body: "Engineer-months are expensive, and you pay them before you learn whether it works.",
        ai: "weaker",
        aiNote: "The same team ships 2–5× more. Upfront cost drops, but review and judgment don't compress.",
      },
      {
        title: "Maintenance forever",
        body: "60–80% of lifetime software cost comes after launch: upgrades, CVEs, migrations, on-call.",
        ai: "weaker",
        aiNote: "Agents handle dependency bumps, migrations and bug triage. Ownership and on-call are still yours.",
      },
      {
        title: "Opportunity cost",
        body: "Every engineer rebuilding commodity software isn't working on your core product.",
        ai: "weaker",
        aiNote: "With cheaper engineering hours, rebuilding a commodity tool steals less from your core roadmap.",
      },
      {
        title: "Key-person risk",
        body: "Tribal knowledge concentrates in a few people. When they leave, so does velocity.",
        ai: "weaker",
        aiNote: "Agents can read, explain and modify unfamiliar codebases, which softens the bus factor.",
      },
    ],
    bestWhen: [
      "It is your core differentiation",
      "Rules are well understood and must be exact",
      "Volume is high and per-unit vendor fees would dominate",
      "Compliance requires you to explain every decision",
    ],
  },
  buy: {
    id: "buy",
    name: "Buy",
    color: COLORS.buy,
    tagline: "Rent a product someone else builds and runs.",
    definition:
      "You adopt a SaaS, vendor platform or managed service. Someone else spreads the R&D across thousands of customers and handles upgrades, uptime and compliance for you.",
    examples: [
      "Auth, email, observability",
      "CRM, HR, accounting",
      "KYC providers, card processors",
    ],
    pros: [
      {
        title: "Fastest to production",
        body: "Sign a contract, configure, integrate. Days, not quarters.",
        ai: "same",
        aiNote: "Still fast. AI mostly speeds up the integration work on your side.",
      },
      {
        title: "Shared R&D cost",
        body: "Thousands of customers fund the edge cases, so you get years of hardening for a subscription.",
        ai: "weaker",
        aiNote: "When building gets cheaper, the discount you get from shared R&D gets smaller, especially for thin CRUD tools.",
      },
      {
        title: "Battle-tested & certified",
        body: "SOC 2, PCI, ISO and uptime SLAs come in the box. Someone else is on-call.",
        ai: "stronger",
        aiNote: "AI can write code quickly. It can't write trust, certifications or audit history.",
      },
      {
        title: "Zero maintenance",
        body: "The vendor handles upgrades, security patches and scaling. Your team stays on your product.",
        ai: "same",
        aiNote: "Still true, but AI shrinks the maintenance cost of the Build alternative, so the gap narrows.",
      },
      {
        title: "Network effects & data",
        body: "Some products are valuable because of their network or dataset, like fraud signals or bank connectivity.",
        ai: "stronger",
        aiNote: "Proprietary networks and data can't be generated. These vendors get more defensible.",
      },
    ],
    cons: [
      {
        title: "Lock-in & switching cost",
        body: "Data, workflows and integrations pile up. Leaving becomes a project in itself.",
        ai: "weaker",
        aiNote: "Agents write migration scripts and adapters, so leaving is cheaper than it used to be. It's still not free.",
      },
      {
        title: "Pricing scales against you",
        body: "Per-seat and per-transaction pricing grows linearly while your costs to build would stay flat.",
        ai: "same",
        aiNote: "Unchanged, and more visible now that Build is cheaper to compare against.",
      },
      {
        title: "80% fit",
        body: "You bend your process to the tool. The last 20% is workarounds, spreadsheets and glue.",
        ai: "weaker",
        aiNote: "Vendors ship AI configurability, and your glue code gets cheaper to write.",
      },
      {
        title: "No differentiation",
        body: "Your competitors can buy the exact same thing tomorrow.",
        ai: "stronger",
        aiNote: "When everyone buys the same AI-enabled SaaS, it stops being an advantage for anyone.",
      },
      {
        title: "Vendor risk",
        body: "Price hikes, acquisitions, shutdowns, roadmap changes. Your fate is tied to theirs.",
        ai: "stronger",
        aiNote: "Many AI-era vendors are young, and incumbents are being disrupted. Vendor churn is higher.",
      },
    ],
    bestWhen: [
      "It is commodity: every company needs it, none wins with it",
      "Trust, certification or a network is the product",
      "You need it this week",
      "Usage is small enough that fees stay trivial",
    ],
  },
  llm: {
    id: "llm",
    name: "LLM",
    color: COLORS.llm,
    tagline: "Describe the job; let a model do it at runtime.",
    definition:
      "Instead of hand-coding logic or buying a product, you give a model the task: a prompt, tools, context and evals. The behavior lives in instructions, not in code, and the model runs it on every request.",
    examples: [
      "Support triage & replies",
      "Document / invoice extraction",
      "Reconciliation of messy exports",
    ],
    pros: [
      {
        title: "Prototype in hours",
        body: "A prompt and a few tools get a working version the same day. Iterate by editing text.",
        ai: "stronger",
        aiNote: "Better models, agent SDKs and tool calling make the first prototype close to production quality.",
      },
      {
        title: "Handles the fuzzy long tail",
        body: "Unstructured text, PDFs, images, languages, typos. It covers cases no one would ever write a rule for.",
        ai: "stronger",
        aiNote: "Each model generation takes on messier inputs with less prompting.",
      },
      {
        title: "Improves for free",
        body: "Swap in a newer model and quality goes up without touching your code.",
        ai: "stronger",
        aiNote: "Model upgrades arrive every few months. That's R&D you get without paying for it.",
      },
      {
        title: "Changes without deploys",
        body: "New policy? Edit the prompt, re-run evals, ship. Domain experts can do it too.",
        ai: "same",
        aiNote: "This was always true. What's changed is that evals make it safe.",
      },
      {
        title: "Natural-language interface",
        body: "Users and operators just ask. No forms and no training on a new UI.",
        ai: "stronger",
        aiNote: "Users now expect to be able to just ask.",
      },
    ],
    cons: [
      {
        title: "Non-deterministic",
        body: "The same input can produce different outputs. You need evals, guardrails and human review for high-stakes paths.",
        ai: "weaker",
        aiNote: "Structured outputs, better models and eval tooling reduce variance, but it never reaches zero.",
      },
      {
        title: "Per-call cost & latency",
        body: "Every request pays tokens and seconds. At millions of calls, the unit economics can dominate.",
        ai: "weaker",
        aiNote: "The price for a given capability has been falling several-fold per year, and small models cover more tasks.",
      },
      {
        title: "Hallucinations & correctness",
        body: "Confident wrong answers. Dangerous where money, health or law is involved.",
        ai: "weaker",
        aiNote: "Grounding, tool use and verification loops help. High-stakes paths still need deterministic checks.",
      },
      {
        title: "Security: prompt injection",
        body: "Untrusted input can steer the model. Tools with side effects need strict permissioning.",
        ai: "same",
        aiNote: "Still an open problem. Treat model output as untrusted input.",
      },
      {
        title: "Auditability",
        body: "It's hard to explain to an auditor why the model decided X. There's no line of code to point at.",
        ai: "same",
        aiNote: "Traces help, but regulators still want deterministic, explainable decision paths.",
      },
    ],
    bestWhen: [
      "Inputs are unstructured or open-ended",
      "An occasional error is cheap and can be caught",
      "The spec is unclear. Use the LLM to discover it",
      "Volume is moderate, or cost per call is falling fast",
    ],
  },
};

export const ORDER: ApproachId[] = ["build", "buy", "llm"];

/* ─── Decision matrix ─────────────────────────────────────────────── */

export type Era = "pre" | "ai";

export type Criterion = {
  id: string;
  label: string;
  hint: string;
  // score 1..5, higher = better for the decision maker
  scores: Record<Era, Record<ApproachId, number>>;
  why: string;
};

export const CRITERIA: Criterion[] = [
  {
    id: "ttm",
    label: "Time to market",
    hint: "How fast users get value",
    scores: { pre: { build: 1, buy: 5, llm: 3 }, ai: { build: 3, buy: 5, llm: 5 } },
    why: "Coding agents move Build from quarters to weeks. LLM prototypes ship the same day.",
  },
  {
    id: "upfront",
    label: "Low upfront cost",
    hint: "Cash spent before it works",
    scores: { pre: { build: 1, buy: 4, llm: 3 }, ai: { build: 3, buy: 4, llm: 5 } },
    why: "Engineering hours get cheaper per feature. Prompting costs almost nothing up front.",
  },
  {
    id: "run",
    label: "Low cost at scale",
    hint: "Unit cost at 100× volume",
    scores: { pre: { build: 5, buy: 2, llm: 1 }, ai: { build: 5, buy: 2, llm: 3 } },
    why: "Token prices keep falling. Seat and transaction fees don't.",
  },
  {
    id: "fit",
    label: "Fit & control",
    hint: "Matches your process exactly",
    scores: { pre: { build: 5, buy: 2, llm: 3 }, ai: { build: 5, buy: 3, llm: 4 } },
    why: "Vendors add AI configurability, and LLMs follow instructions much better.",
  },
  {
    id: "diff",
    label: "Differentiation",
    hint: "Competitors can't copy it",
    scores: { pre: { build: 5, buy: 1, llm: 2 }, ai: { build: 5, buy: 1, llm: 2 } },
    why: "Unchanged per option, but it matters more now. Raise its weight.",
  },
  {
    id: "determinism",
    label: "Reliability & determinism",
    hint: "Same input → same output",
    scores: { pre: { build: 5, buy: 4, llm: 1 }, ai: { build: 5, buy: 4, llm: 3 } },
    why: "Structured outputs and evals close part of the gap, not all of it.",
  },
  {
    id: "maint",
    label: "Low maintenance burden",
    hint: "Ongoing work after launch",
    scores: { pre: { build: 1, buy: 5, llm: 2 }, ai: { build: 3, buy: 5, llm: 3 } },
    why: "Agents take over upgrades and migrations. Models improve without your help.",
  },
  {
    id: "lockin",
    label: "Low lock-in",
    hint: "Easy to switch later",
    scores: { pre: { build: 5, buy: 2, llm: 2 }, ai: { build: 5, buy: 3, llm: 4 } },
    why: "Models are more interchangeable now, and agents write migration code.",
  },
  {
    id: "fuzzy",
    label: "Handles messy input",
    hint: "Text, docs, images, edge cases",
    scores: { pre: { build: 1, buy: 2, llm: 4 }, ai: { build: 3, buy: 4, llm: 5 } },
    why: "Everyone can embed a model now, but LLM-native designs still handle it best.",
  },
  {
    id: "audit",
    label: "Compliance & audit",
    hint: "Explain every decision",
    scores: { pre: { build: 4, buy: 5, llm: 1 }, ai: { build: 4, buy: 5, llm: 2 } },
    why: "Traces help a little. Regulators still want deterministic paths.",
  },
];

export type Weights = Record<string, number>;

export const PRESETS: { id: string; label: string; note: string; weights: Weights }[] = [
  {
    id: "balanced",
    label: "Balanced",
    note: "Every criterion equal",
    weights: Object.fromEntries(CRITERIA.map((c) => [c.id, 3])),
  },
  {
    id: "mvp",
    label: "Startup MVP",
    note: "Speed and cash above all",
    weights: { ttm: 5, upfront: 5, run: 1, fit: 2, diff: 2, determinism: 2, maint: 3, lockin: 1, fuzzy: 3, audit: 1 },
  },
  {
    id: "core",
    label: "Core product",
    note: "The thing customers pay for",
    weights: { ttm: 3, upfront: 1, run: 4, fit: 5, diff: 5, determinism: 4, maint: 2, lockin: 4, fuzzy: 2, audit: 3 },
  },
  {
    id: "commodity",
    label: "Back-office commodity",
    note: "Everyone needs it, no one wins with it",
    weights: { ttm: 4, upfront: 4, run: 2, fit: 1, diff: 0, determinism: 3, maint: 5, lockin: 2, fuzzy: 1, audit: 3 },
  },
  {
    id: "fintech",
    label: "Regulated fintech",
    note: "Money moves, auditors watch",
    weights: { ttm: 2, upfront: 2, run: 4, fit: 4, diff: 4, determinism: 5, maint: 3, lockin: 3, fuzzy: 1, audit: 5 },
  },
  {
    id: "ops",
    label: "Ops on messy data",
    note: "Tickets, PDFs, emails",
    weights: { ttm: 4, upfront: 3, run: 2, fit: 3, diff: 1, determinism: 2, maint: 3, lockin: 2, fuzzy: 5, audit: 2 },
  },
];

export function scoreFor(era: Era, weights: Weights): Record<ApproachId, number> {
  const total = CRITERIA.reduce((s, c) => s + (weights[c.id] ?? 0), 0) || 1;
  const out = { build: 0, buy: 0, llm: 0 } as Record<ApproachId, number>;
  for (const id of ORDER) {
    const sum = CRITERIA.reduce((s, c) => s + (weights[c.id] ?? 0) * c.scores[era][id], 0);
    out[id] = Math.round((sum / (total * 5)) * 100);
  }
  return out;
}

/* ─── What AI changes ─────────────────────────────────────────────── */

export type Shift = {
  factor: string;
  before: number; // 0..100 relative weight/magnitude
  after: number;
  direction: "up" | "down";
  affects: ApproachId[];
  impact?: -1; // default +1: the shift helps the options it affects
  summary: string;
};

export const SHIFTS: Shift[] = [
  {
    factor: "Cost to write code",
    before: 90,
    after: 30,
    direction: "down",
    affects: ["build"],
    summary: "Coding agents write, test and refactor. For clear specs, implementation is no longer the bottleneck.",
  },
  {
    factor: "Cost of maintenance",
    before: 80,
    after: 45,
    direction: "down",
    affects: ["build"],
    summary: "Dependency upgrades, framework migrations and bug triage become agent work. Ownership stays with you.",
  },
  {
    factor: "Cost of integration glue",
    before: 70,
    after: 25,
    direction: "down",
    affects: ["buy", "build"],
    summary: "Mapping schemas, writing adapters and syncing systems gets cheap, so mixing vendors and your own code is easier.",
  },
  {
    factor: "Moat of thin SaaS",
    before: 75,
    after: 30,
    direction: "down",
    affects: ["buy"],
    impact: -1,
    summary: "A CRUD app with a nice UI can be rebuilt in days. Vendors whose moat is trust, data or network keep their value.",
  },
  {
    factor: "Cost per LLM call",
    before: 85,
    after: 20,
    direction: "down",
    affects: ["llm"],
    summary: "The price for a given capability tier keeps falling fast. Workloads that didn't pay off last year can this year.",
  },
  {
    factor: "Value of differentiation",
    before: 55,
    after: 90,
    direction: "up",
    affects: ["build"],
    summary: "When everyone can buy or prompt the commodity, only the unique core sets you apart.",
  },
  {
    factor: "Value of proprietary data",
    before: 45,
    after: 90,
    direction: "up",
    affects: ["build", "llm"],
    summary: "Models are commodities. Your context isn't. Data and domain knowledge decide who has the better AI.",
  },
  {
    factor: "Value of verification",
    before: 40,
    after: 85,
    direction: "up",
    affects: ["build", "llm"],
    summary: "Tests, evals and review capacity become the bottleneck. Knowing it's correct matters more than writing it.",
  },
  {
    factor: "Value of clear specs & judgment",
    before: 50,
    after: 90,
    direction: "up",
    affects: ["build", "llm", "buy"],
    summary: "When anything can be built, deciding what to build and what 'done' means is the scarce skill.",
  },
  {
    factor: "Value of trust & certification",
    before: 60,
    after: 80,
    direction: "up",
    affects: ["buy"],
    summary: "SOC 2, licenses, SLAs and a track record can't be generated. Regulated vendors get stronger.",
  },
];

/* ─── Guided decision ─────────────────────────────────────────────── */

export type Question = {
  id: string;
  q: string;
  help: string;
  options: { label: string; effect: Partial<Record<ApproachId, number>>; reason?: string }[];
};

export const QUESTIONS: Question[] = [
  {
    id: "core",
    q: "Is this part of what customers choose you for?",
    help: "Differentiation: would a competitor buying the same thing hurt you?",
    options: [
      { label: "Yes, it's our core", effect: { build: 3 }, reason: "It is your core, and your moat is code you own." },
      { label: "Somewhat", effect: { build: 1, llm: 1 } },
      { label: "No, it's commodity", effect: { buy: 3 }, reason: "It's commodity, so let someone else carry the R&D." },
    ],
  },
  {
    id: "input",
    q: "What do the inputs look like?",
    help: "Structured fields vs free text, documents, images",
    options: [
      { label: "Structured & well-defined", effect: { build: 2, buy: 1 } },
      { label: "Mixed", effect: { llm: 1, build: 1 } },
      { label: "Messy / unstructured", effect: { llm: 3 }, reason: "Inputs are unstructured, and models handle that long tail natively." },
    ],
  },
  {
    id: "error",
    q: "What does one wrong output cost?",
    help: "Error tolerance",
    options: [
      { label: "Almost nothing, a human catches it", effect: { llm: 2 } },
      { label: "Annoying but recoverable", effect: { llm: 1, buy: 1 } },
      { label: "Money lost / regulator calls", effect: { build: 2, buy: 1, llm: -3 }, reason: "Errors are expensive, so keep the decision path deterministic." },
    ],
  },
  {
    id: "vendor",
    q: "Is there a mature vendor that fits ≥ 80%?",
    help: "Market maturity",
    options: [
      { label: "Yes, several", effect: { buy: 3 }, reason: "A mature market exists, and 80% fit today beats 100% fit next quarter." },
      { label: "One, and it's young", effect: { buy: 1 } },
      { label: "No", effect: { build: 2, llm: 1, buy: -3 } },
    ],
  },
  {
    id: "volume",
    q: "How much volume at full scale?",
    help: "Unit economics",
    options: [
      { label: "Low (hundreds / day)", effect: { llm: 1, buy: 1 } },
      { label: "Medium", effect: {} },
      { label: "Huge (millions / day)", effect: { build: 3, llm: -1, buy: -1 }, reason: "At huge volume, per-unit fees and tokens add up. Owned code is the cheapest to run." },
    ],
  },
  {
    id: "spec",
    q: "How well do you understand the rules?",
    help: "Spec clarity",
    options: [
      { label: "Crystal clear", effect: { build: 2 }, reason: "The spec is clear, and coding agents build clear specs fast." },
      { label: "Mostly", effect: { build: 1 } },
      { label: "We're still discovering", effect: { llm: 2 }, reason: "The spec is still forming. Prototype with an LLM, then turn what you learn into code." },
    ],
  },
  {
    id: "time",
    q: "When do you need it?",
    help: "Urgency",
    options: [
      { label: "This week", effect: { buy: 2, llm: 2 } },
      { label: "This quarter", effect: { build: 1 } },
      { label: "No rush", effect: { build: 1 } },
    ],
  },
];
