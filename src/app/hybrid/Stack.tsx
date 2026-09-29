"use client";

import { useState } from "react";
import { EraToggle, NextLink, PageHeader, Panel, PanelLabel, WhyGrid } from "@/components/ui";
import { APPROACHES, ORDER, type ApproachId } from "@/lib/content";
import { useDecision } from "@/lib/decision";

type Part = { name: string; layer: string; pre: ApproachId; ai: ApproachId; why: string };

const LAYERS = ["Experience", "Core domain", "Fuzzy edges", "Operations", "Commodity"];

const PARTS: Part[] = [
  { name: "Customer app & dashboard", layer: "Experience", pre: "build", ai: "build", why: "It's the product itself, so it stays in-house." },
  { name: "Ask-your-data assistant", layer: "Experience", pre: "buy", ai: "llm", why: "BI seats replaced by a model that writes SQL against your own schema, with guardrails." },
  { name: "Ledger & balances", layer: "Core domain", pre: "build", ai: "build", why: "It has to balance every time, and auditors read the code. This never goes to a model." },
  { name: "Payment orchestration", layer: "Core domain", pre: "build", ai: "build", why: "This is the differentiation. Build it and own it." },
  { name: "Pricing & risk rules", layer: "Core domain", pre: "build", ai: "build", why: "Deterministic and explainable. An LLM can propose rules; code executes them." },
  { name: "KYC document extraction", layer: "Fuzzy edges", pre: "buy", ai: "llm", why: "Used to be an OCR vendor at so much per page. Now it's a vision model plus schema validation plus human review of low-confidence results." },
  { name: "Support triage & replies", layer: "Fuzzy edges", pre: "buy", ai: "llm", why: "The helpdesk's rules engine is replaced by a model that reads the ticket and the customer's history." },
  { name: "Bank statement reconciliation", layer: "Fuzzy edges", pre: "build", ai: "llm", why: "Hand-written parsers for every bank format are replaced by a model that normalises, with deterministic matching afterwards." },
  { name: "Internal admin tools", layer: "Operations", pre: "buy", ai: "build", why: "Low-code seats are replaced by an agent-built admin that fits your domain exactly." },
  { name: "Feature flags & experiments", layer: "Operations", pre: "buy", ai: "build", why: "A thin, well-understood tool. A coding agent can ship it in a day." },
  { name: "Observability & on-call", layer: "Operations", pre: "buy", ai: "buy", why: "You're buying reliability at scale and someone else's infrastructure." },
  { name: "Cloud, auth, email/SMS", layer: "Commodity", pre: "buy", ai: "buy", why: "Pure commodity with certifications included." },
  { name: "Accounting, HR, payroll", layer: "Commodity", pre: "buy", ai: "buy", why: "Regulatory knowledge and liability transfer are the product." },
  { name: "Fraud signal network", layer: "Commodity", pre: "buy", ai: "buy", why: "The moat is data from thousands of other companies. You can't build that." },
];

export function Stack() {
  const { era } = useDecision();
  const [sel, setSel] = useState<Part | null>(null);
  const other = era === "ai" ? "pre" : "ai";
  const moved = PARTS.filter((p) => p.pre !== p.ai).length;

  return (
    <div>
      <PageHeader n="07" title="It's not either/or. It's a stack.">
        Real products use all three options. The useful question is which layer gets which option. Here is one example
        stack, a payments product. Switch eras to see which parts moved. In this example, {moved} of {PARTS.length} parts
        changed approach between 2022 and 2026.
      </PageHeader>

      <div className="mb-4 flex items-center justify-between gap-3">
        <EraToggle />
        <span className="text-xs text-faint">Click any part for the reasoning</span>
      </div>

      <Panel className="overflow-x-auto">
        <div className="grid min-w-[680px] grid-cols-[120px_repeat(3,1fr)] gap-2">
          <div />
          {ORDER.map((id) => (
            <div key={id} className="flex items-center gap-2 px-2 pb-1 text-xs font-semibold tracking-wide uppercase" style={{ color: APPROACHES[id].color }}>
              {APPROACHES[id].name}
            </div>
          ))}
          {LAYERS.map((layer) => (
            <div key={layer} className="contents">
              <div className="flex items-center border-t border-line py-2 pr-2 text-xs text-faint">{layer}</div>
              {ORDER.map((id) => (
                <div key={id} className="flex min-h-14 flex-wrap content-start gap-1.5 rounded-lg border-t border-line bg-bg/40 p-2">
                  {PARTS.filter((p) => p.layer === layer && p[era] === id).map((p) => {
                    const didMove = p[era] !== p[other];
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setSel(p)}
                        className={`animate-rise rounded-md border px-2 py-1 text-left text-xs transition-colors hover:border-ink ${
                          sel?.name === p.name ? "border-ink bg-panel-2" : "border-line bg-panel-2/70"
                        }`}
                        style={didMove ? { borderColor: `${APPROACHES[id].color}99` } : undefined}
                      >
                        {p.name}
                        {didMove && (
                          <span className="ml-1.5 font-mono text-[10px] text-faint">
                            {era === "ai" ? "← " : "→ "}
                            {APPROACHES[p[other]].name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {sel && (
        <Panel className="mt-4 animate-rise">
          <div className="flex flex-wrap items-center gap-3">
            <div className="font-medium">{sel.name}</div>
            <span className="font-mono text-xs text-muted">
              2022: <span style={{ color: APPROACHES[sel.pre].color }}>{APPROACHES[sel.pre].name}</span>
              {"  →  "}2026: <span style={{ color: APPROACHES[sel.ai].color }}>{APPROACHES[sel.ai].name}</span>
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{sel.why}</p>
        </Panel>
      )}

      <Panel className="mt-4">
        <PanelLabel>Graduation paths: decisions aren&apos;t permanent</PanelLabel>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 860 210" className="min-w-[680px]" role="img" aria-label="Common migrations between build, buy and LLM">
            <defs>
              <marker id="ga" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#8a93a8" />
              </marker>
            </defs>
            {(
              [
                ["llm", 60, 70],
                ["build", 370, 70],
                ["buy", 680, 70],
              ] as const
            ).map(([id, x, y]) => (
              <g key={id}>
                <rect x={x} y={y} width="120" height="56" rx="12" fill="#171b24" stroke="#242a38" />
                <rect x={x} y={y} width="4" height="56" rx="2" fill={APPROACHES[id].color} />
                <text x={x + 60} y={y + 33} textAnchor="middle" fill="#e7e9f0" fontSize="15" fontWeight="600">
                  {APPROACHES[id].name}
                </text>
              </g>
            ))}
            {/* LLM → Build */}
            <path d="M 180 88 C 260 60, 290 60, 366 88" fill="none" stroke="#8a93a8" strokeWidth="1.5" strokeDasharray="5 6" markerEnd="url(#ga)">
              <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.2s" repeatCount="indefinite" />
            </path>
            <text x="273" y="46" textAnchor="middle" fill="#e7e9f0" fontSize="12" fontWeight="500">distill</text>
            <text x="273" y="30" textAnchor="middle" fill="#8a93a8" fontSize="11">spec is stable, volume grew</text>
            {/* Build → LLM */}
            <path d="M 366 112 C 290 140, 260 140, 184 112" fill="none" stroke="#5a6275" strokeWidth="1.5" markerEnd="url(#ga)" />
            <text x="273" y="158" textAnchor="middle" fill="#8a93a8" fontSize="11">rules exploding into edge cases</text>
            {/* Buy → Build */}
            <path d="M 676 88 C 600 60, 570 60, 494 88" fill="none" stroke="#8a93a8" strokeWidth="1.5" strokeDasharray="5 6" markerEnd="url(#ga)">
              <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.2s" repeatCount="indefinite" />
            </path>
            <text x="585" y="46" textAnchor="middle" fill="#e7e9f0" fontSize="12" fontWeight="500">insource</text>
            <text x="585" y="30" textAnchor="middle" fill="#8a93a8" fontSize="11">seat bill &gt; an engineer</text>
            {/* Build → Buy */}
            <path d="M 494 112 C 570 140, 600 140, 676 112" fill="none" stroke="#5a6275" strokeWidth="1.5" markerEnd="url(#ga)" />
            <text x="585" y="158" textAnchor="middle" fill="#8a93a8" fontSize="11">it became commodity</text>
            <text x="430" y="196" textAnchor="middle" fill="#5a6275" fontSize="11">
              dashed = paths AI made cheaper · prototype with a model, keep the core, re-check vendors every renewal
            </text>
          </svg>
        </div>
      </Panel>

      <WhyGrid
        items={[
          "Most of the movement happens in the middle layers: the fuzzy edges and operations. The core domain and pure commodity barely moved.",
          "Several of the parts that moved left a vendor. When a vendor's value was glue plus a UI over a rules engine, a model or a coding agent can now replace it.",
          "Some parts moved from Build to LLM. Brittle parsers and rules that kept growing with edge cases are a good fit for a model with deterministic checks behind it.",
        ]}
      />
      <NextLink href="/decide">Decide</NextLink>
    </div>
  );
}
