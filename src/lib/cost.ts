import type { ApproachId, Era } from "./content";

export type CostInputs = {
  engCost: number; // $ per engineer-month, fully loaded
  buildEffort: number; // engineer-months for v1, pre-AI
  seats: number;
  seatPrice: number; // $ / seat / month
  requestsPerDay: number;
  tokensPerRequest: number;
  pricePerMTok: number; // blended $ per 1M tokens today
  growth: number; // % per month usage growth
};

export const DEFAULT_INPUTS: CostInputs = {
  engCost: 15000,
  buildEffort: 12,
  seats: 40,
  seatPrice: 60,
  requestsPerDay: 5000,
  tokensPerRequest: 4000,
  pricePerMTok: 5,
  growth: 4,
};

// How the AI era changes the cost model. These are the "weights" the site is about.
export const ERA_FACTORS: Record<Era, { buildMult: number; maintMult: number; glueMult: number; tokenDeclinePerYear: number }> = {
  pre: { buildMult: 1, maintMult: 1, glueMult: 1, tokenDeclinePerYear: 0 },
  ai: { buildMult: 0.4, maintMult: 0.6, glueMult: 0.5, tokenDeclinePerYear: 0.6 },
};

export const MONTHS = 36;
const TEAM = 3; // engineers working on the build in parallel
const MAINT_PER_YEAR = 0.25; // share of initial build effort spent maintaining, per year
const INFRA = 800; // $ / month to run self-built or LLM glue

export type Series = Record<ApproachId, number[]>; // cumulative $ at month 0..MONTHS

export function simulate(i: CostInputs, era: Era): { series: Series; launch: Record<ApproachId, number> } {
  const f = ERA_FACTORS[era];
  const buildMonths = (i.buildEffort * f.buildMult) / TEAM;
  const buildUpfront = i.buildEffort * f.buildMult * i.engCost;
  const buildMaint = (i.buildEffort * MAINT_PER_YEAR * f.maintMult * i.engCost) / 12;

  const buySetup = 1 * f.glueMult * i.engCost; // one eng-month of integration
  const llmSetup = 1.5 * f.buildMult * i.engCost; // prompts, tools, evals
  const llmUpkeep = 0.15 * i.engCost * f.maintMult; // eval upkeep, prompt tuning

  const series: Series = { build: [0], buy: [buySetup], llm: [llmSetup] };
  let cb = 0,
    cu = buySetup,
    cl = llmSetup;

  for (let m = 1; m <= MONTHS; m++) {
    const usage = Math.pow(1 + i.growth / 100, m - 1);
    // build: spend upfront evenly during construction, then maintain
    if (m <= Math.ceil(buildMonths)) {
      cb += buildUpfront / Math.ceil(buildMonths);
    } else {
      cb += buildMaint + INFRA * Math.sqrt(usage);
    }
    // buy: seats grow with usage, 7% price bump each year
    const bump = Math.pow(1.07, Math.floor((m - 1) / 12));
    cu += i.seats * usage * i.seatPrice * bump;
    // llm: tokens × volume, price per token falls continuously in the AI era
    const tokPrice = i.pricePerMTok * Math.pow(1 - f.tokenDeclinePerYear, (m - 1) / 12);
    const monthlyTok = (i.requestsPerDay * 30 * usage * i.tokensPerRequest) / 1e6;
    cl += monthlyTok * tokPrice + llmUpkeep + INFRA / 2;

    series.build.push(cb);
    series.buy.push(cu);
    series.llm.push(cl);
  }
  return { series, launch: { build: buildMonths, buy: 0.25 * f.glueMult * 2, llm: 0.2 } };
}

export function fmtMoney(v: number) {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M`;
  if (v >= 1e3) return `$${Math.round(v / 1e3)}k`;
  return `$${Math.round(v)}`;
}
