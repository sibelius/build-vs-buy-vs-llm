"use client";

import { useState } from "react";
import { APPROACHES, CRITERIA, type AiEffect, type ApproachId, type Point } from "@/lib/content";
import { NAV } from "@/lib/nav";
import { NextLink, PageHeader, Panel, PanelLabel, WhyGrid } from "./ui";

const EFFECT: Record<AiEffect, { label: string; color: string; glyph: string }> = {
  stronger: { label: "AI makes this stronger", color: "#34d399", glyph: "▲" },
  weaker: { label: "AI makes this weaker", color: "#f87171", glyph: "▼" },
  same: { label: "AI doesn't move this much", color: "#8a93a8", glyph: "●" },
};

function PointCard({ p, kind, showAi }: { p: Point; kind: "pro" | "con"; showAi: boolean }) {
  // For cons, "weaker" is good news, so recolor from the reader's point of view.
  const e = EFFECT[p.ai];
  const good = (kind === "pro" && p.ai === "stronger") || (kind === "con" && p.ai === "weaker");
  const bad = (kind === "pro" && p.ai === "weaker") || (kind === "con" && p.ai === "stronger");
  const tone = good ? "#34d399" : bad ? "#f87171" : "#8a93a8";
  return (
    <div className="rounded-xl border border-line bg-panel-2/60 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium">
          <span className={`mr-2 font-mono text-xs ${kind === "pro" ? "text-ok" : "text-bad"}`}>
            {kind === "pro" ? "+" : "−"}
          </span>
          {p.title}
        </div>
        {showAi && (
          <span className="shrink-0 font-mono text-[11px]" style={{ color: tone }} title={e.label}>
            {e.glyph} {p.ai}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
      {showAi && (
        <p
          className="mt-3 border-l-2 pl-3 text-[13px] leading-relaxed text-ink/90 animate-rise"
          style={{ borderColor: tone }}
        >
          <span className="mr-1 text-accent">✦</span>
          {p.aiNote}
        </p>
      )}
    </div>
  );
}

export function ApproachView({ id }: { id: ApproachId }) {
  const a = APPROACHES[id];
  const [showAi, setShowAi] = useState(true);
  const nav = NAV.find((n) => n.href === `/${id}`)!;
  const next = NAV[NAV.indexOf(nav) + 1];

  return (
    <div>
      <PageHeader n={nav.n} title={`${a.name}: ${a.tagline.replace(/\.$/, "")}`}>
        {a.definition}
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <PanelLabel>Pros & cons</PanelLabel>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={showAi} onChange={(e) => setShowAi(e.target.checked)} className="accent-[#f26b00]" />
              <span>
                Show what <span className="text-accent">AI</span> changes
              </span>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {a.pros.map((p) => (
                <PointCard key={p.title} p={p} kind="pro" showAi={showAi} />
              ))}
            </div>
            <div className="space-y-3">
              {a.cons.map((p) => (
                <PointCard key={p.title} p={p} kind="con" showAi={showAi} />
              ))}
            </div>
          </div>
          {showAi && (
            <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-faint">
              <span><span className="text-ok">green</span> = AI helps this option</span>
              <span><span className="text-bad">red</span> = AI hurts this option</span>
              <span>▲▼ = the point itself gets stronger / weaker</span>
            </div>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelLabel>Score profile</PanelLabel>
            <div className="space-y-2.5">
              {CRITERIA.map((c) => {
                const pre = c.scores.pre[id];
                const ai = c.scores.ai[id];
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">{c.label}</span>
                      <span className="font-mono tabular-nums">
                        <span className="text-faint">{pre}</span>
                        {ai !== pre && <span className={ai > pre ? "text-ok" : "text-bad"}> → {ai}</span>}
                      </span>
                    </div>
                    <div className="relative mt-1 h-1.5 rounded-full bg-bg">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-faint/60" style={{ width: `${pre * 20}%` }} />
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                        style={{ width: `${ai * 20}%`, background: a.color, opacity: 0.85 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] text-faint">Grey = pre-AI (2022). Colour = AI era (2026). 5 = best.</div>
          </Panel>
          <Panel>
            <PanelLabel>Reach for {a.name} when</PanelLabel>
            <ul className="space-y-2 text-sm text-muted">
              {a.bestWhen.map((b) => (
                <li key={b} className="flex gap-2">
                  <span style={{ color: a.color }}>→</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-faint">Examples: {a.examples.join(" · ")}</div>
          </Panel>
        </div>
      </div>

      <WhyGrid items={WHY[id]} />
      <NextLink href={next.href}>{next.title}</NextLink>
    </div>
  );
}

const WHY: Record<ApproachId, string[]> = {
  build: [
    "The price of writing code fell, but the price of owning it didn't fall as much. Budget for review, on-call, security and upgrades, not only the first version.",
    "Build is the only one of the three that produces an asset. Buy gets you a contract, and LLM gets you a dependency on a model provider.",
    "The real cost to watch now is spec quality. Agents build exactly what you asked for, so a vague spec gets you the wrong thing quickly.",
  ],
  buy: [
    "Look at how pricing scales. A $20 seat looks cheap at 10 people and costs more than an engineer at 1,000.",
    "Ask what the vendor's moat is. If it's the UI, a coding agent can rebuild it. If it's licenses, data or network, keep paying them.",
    "Buy the boring layer and own the integration layer. Your glue code is where process fit lives, and it's cheap to write now.",
  ],
  llm: [
    "Treat the prompt as code. Version it, test it with evals, and review changes to it. Otherwise nobody can say what the system does.",
    "LLM output is untrusted input. Validate it with schemas, and put deterministic checks in front of anything that moves money.",
    "Once an LLM flow stabilises and volume grows, have an agent turn the learned behaviour into deterministic code. Keep the model for the long tail.",
  ],
};
