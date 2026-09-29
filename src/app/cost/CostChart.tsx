"use client";

import { useMemo, useState } from "react";
import { EraToggle, NextLink, PageHeader, Panel, PanelLabel, WhyGrid } from "@/components/ui";
import { APPROACHES, ORDER, type ApproachId } from "@/lib/content";
import { DEFAULT_INPUTS, ERA_FACTORS, MONTHS, fmtMoney, simulate, type CostInputs } from "@/lib/cost";
import { useDecision } from "@/lib/decision";

const DASH: Record<ApproachId, string | undefined> = { build: undefined, buy: "7 4", llm: "2 3" };

type SliderDef = {
  key: keyof CostInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  log?: boolean;
  group: ApproachId | "all";
};

const SLIDERS: SliderDef[] = [
  { key: "engCost", label: "Engineer cost / month", min: 4000, max: 30000, step: 500, fmt: fmtMoney, group: "all" },
  { key: "growth", label: "Usage growth / month", min: 0, max: 12, step: 0.5, fmt: (v) => `${v}%`, group: "all" },
  { key: "buildEffort", label: "Build effort (pre-AI)", min: 2, max: 48, step: 1, fmt: (v) => `${v} eng-mo`, group: "build" },
  { key: "seats", label: "Seats at start", min: 5, max: 500, step: 5, fmt: (v) => `${v}`, group: "buy" },
  { key: "seatPrice", label: "Price / seat / month", min: 5, max: 200, step: 5, fmt: (v) => `$${v}`, group: "buy" },
  { key: "requestsPerDay", label: "LLM calls / day", min: 2, max: 6, step: 0.05, fmt: (v) => Math.round(10 ** v).toLocaleString(), log: true, group: "llm" },
  { key: "tokensPerRequest", label: "Tokens / call", min: 500, max: 30000, step: 500, fmt: (v) => v.toLocaleString(), group: "llm" },
  { key: "pricePerMTok", label: "$ / 1M tokens (today)", min: 0.2, max: 30, step: 0.1, fmt: (v) => `$${v.toFixed(1)}`, group: "llm" },
];

const W = 760,
  H = 360,
  PAD = { l: 56, r: 64, t: 16, b: 32 };

export function CostChart() {
  const { era } = useDecision();
  const [inp, setInp] = useState<CostInputs>(DEFAULT_INPUTS);
  const [ghost, setGhost] = useState(true);
  const [hover, setHover] = useState<number | null>(null);

  const cur = useMemo(() => simulate(inp, era), [inp, era]);
  const other = useMemo(() => simulate(inp, era === "ai" ? "pre" : "ai"), [inp, era]);

  const yMax = useMemo(() => {
    const all = ORDER.flatMap((id) => [cur.series[id][MONTHS], ...(ghost ? [other.series[id][MONTHS]] : [])]);
    const raw = Math.max(...all) * 1.08;
    const mag = 10 ** Math.floor(Math.log10(raw));
    return Math.ceil(raw / (mag / 2)) * (mag / 2);
  }, [cur, other, ghost]);

  const x = (m: number) => PAD.l + (m / MONTHS) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / yMax) * (H - PAD.t - PAD.b);
  const path = (arr: number[]) => arr.map((v, m) => `${m ? "L" : "M"}${x(m).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const cheapestAt = (m: number) => ORDER.reduce((a, b) => (cur.series[b][m] < cur.series[a][m] ? b : a));
  const ticks = Array.from({ length: 5 }, (_, i) => (yMax / 4) * i);

  // direct labels at line end, nudged apart so they never collide
  const ends = ORDER.map((id) => ({ id, y: y(cur.series[id][MONTHS]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const m = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * MONTHS);
    setHover(m >= 0 && m <= MONTHS ? m : null);
  }

  const f = ERA_FACTORS[era];

  return (
    <div>
      <PageHeader n="04" title="Cost over time, not just the first invoice">
        Build costs a lot up front and little per month. Buy costs little up front and more every month as seats grow.
        LLM costs almost nothing to start and then charges per call. Change the inputs and switch eras to see where the
        curves cross.
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <Panel className="space-y-4">
          <EraToggle />
          <div className="rounded-lg border border-line bg-bg/60 p-3 font-mono text-[11px] leading-relaxed text-muted">
            build effort ×{f.buildMult} · maintenance ×{f.maintMult}
            <br />
            integration ×{f.glueMult} · token price −{Math.round(f.tokenDeclinePerYear * 100)}%/yr
          </div>
          {SLIDERS.map((s) => {
            const raw = inp[s.key];
            const val = s.log ? Math.log10(raw) : raw;
            const color = s.group === "all" ? "#f26b00" : APPROACHES[s.group].color;
            return (
              <label key={s.key} className="block text-xs">
                <span className="flex justify-between">
                  <span className="flex items-center gap-1.5 text-muted">
                    <span className="size-1.5 rounded-full" style={{ background: color }} />
                    {s.label}
                  </span>
                  <span className="font-mono text-ink tabular-nums">{s.fmt(val)}</span>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={val}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setInp((p) => ({ ...p, [s.key]: s.log ? Math.round(10 ** v) : v }));
                  }}
                  className="mt-1.5 w-full"
                />
              </label>
            );
          })}
          <div className="flex items-center justify-between gap-2 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={ghost} onChange={(e) => setGhost(e.target.checked)} />
              Ghost the other era
            </label>
            <button type="button" onClick={() => setInp(DEFAULT_INPUTS)} className="text-xs text-faint hover:text-ink">
              reset
            </button>
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PanelLabel>Cumulative cost · 36 months</PanelLabel>
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted">
              {ORDER.map((id) => (
                <span key={id} className="flex items-center gap-1.5">
                  <svg width="22" height="6" aria-hidden="true">
                    <line x1="0" y1="3" x2="22" y2="3" stroke={APPROACHES[id].color} strokeWidth="2" strokeDasharray={DASH[id]} />
                  </svg>
                  {APPROACHES[id].name}
                </span>
              ))}
              {ghost && <span className="text-faint">faint = {era === "ai" ? "pre-AI" : "AI era"}</span>}
            </div>
          </div>
          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full touch-none select-none"
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
              role="img"
              aria-label="Line chart of cumulative cost over 36 months for build, buy and LLM"
            >
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#242a38" strokeWidth="1" />
                  <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fill="#5a6275" fontSize="11">
                    {fmtMoney(t)}
                  </text>
                </g>
              ))}
              {[0, 6, 12, 18, 24, 30, 36].map((m) => (
                <text key={m} x={x(m)} y={H - 10} textAnchor="middle" fill="#5a6275" fontSize="11">
                  {m === 0 ? "start" : `m${m}`}
                </text>
              ))}
              {ghost &&
                ORDER.map((id) => (
                  <path key={`g-${id}`} d={path(other.series[id])} fill="none" stroke={APPROACHES[id].color} strokeOpacity=".22" strokeWidth="1.5" strokeDasharray={DASH[id]} />
                ))}
              {ORDER.map((id) => (
                <path
                  key={id}
                  d={path(cur.series[id])}
                  fill="none"
                  stroke={APPROACHES[id].color}
                  strokeWidth="2"
                  strokeDasharray={DASH[id]}
                  strokeLinejoin="round"
                  style={{ transition: "d 0.4s ease" }}
                />
              ))}
              {ends.map((e) => (
                <text key={e.id} x={W - PAD.r + 8} y={e.y + 4} fill="#e7e9f0" fontSize="11.5" fontWeight="500">
                  {APPROACHES[e.id].name}
                </text>
              ))}
              {hover !== null && (
                <g pointerEvents="none">
                  <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#5a6275" strokeDasharray="3 3" />
                  {ORDER.map((id) => (
                    <circle key={id} cx={x(hover)} cy={y(cur.series[id][hover])} r="4.5" fill={APPROACHES[id].color} stroke="#11141b" strokeWidth="2" />
                  ))}
                </g>
              )}
            </svg>
            {hover !== null && (
              <div
                className="pointer-events-none absolute top-2 rounded-lg border border-line bg-panel-2/95 px-3 py-2 text-xs shadow-xl"
                style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > MONTHS / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
              >
                <div className="mb-1 font-medium text-ink">Month {hover}</div>
                {[...ORDER]
                  .sort((a, b) => cur.series[a][hover] - cur.series[b][hover])
                  .map((id) => (
                    <div key={id} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted">
                        <span className="size-1.5 rounded-full" style={{ background: APPROACHES[id].color }} />
                        {APPROACHES[id].name}
                      </span>
                      <span className="font-mono text-ink tabular-nums">{fmtMoney(cur.series[id][hover])}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[6, 12, 24, 36].map((m) => {
              const w = cheapestAt(m);
              return (
                <div key={m} className="rounded-xl border border-line bg-panel-2/60 p-3">
                  <div className="text-[11px] text-faint">cheapest at month {m}</div>
                  <div className="mt-1 flex items-center gap-1.5 font-medium">
                    <span className="size-2 rounded-full" style={{ background: APPROACHES[w].color }} />
                    {APPROACHES[w].name}
                  </div>
                  <div className="font-mono text-xs text-muted">{fmtMoney(cur.series[w][m])}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-muted">
            Build is usable after about <span className="font-mono text-ink">{cur.launch.build.toFixed(1)} months</span> with a
            team of 3{era === "ai" && <> (pre-AI: {other.launch.build.toFixed(1)} months)</>}. Buy and LLM go live within weeks.
          </div>

          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-faint hover:text-muted">Table view</summary>
            <table className="mt-2 w-full font-mono tabular-nums">
              <thead>
                <tr className="text-left text-faint">
                  <th className="py-1 font-normal">month</th>
                  {ORDER.map((id) => (
                    <th key={id} className="py-1 text-right font-normal">{APPROACHES[id].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 3, 6, 12, 18, 24, 30, 36].map((m) => (
                  <tr key={m} className="border-t border-line text-muted">
                    <td className="py-1">{m}</td>
                    {ORDER.map((id) => (
                      <td key={id} className="py-1 text-right">{fmtMoney(cur.series[id][m])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </Panel>
      </div>

      <WhyGrid
        items={[
          "Switch to Pre-AI and watch the Build curve's up-front slope. That slope is what made Buy the default for anything that wasn't core. In the AI era it's less than half as steep.",
          "Push LLM calls per day up to a million. Per-call pricing grows linearly with volume just like per-seat pricing does. What's different is that token prices keep falling.",
          "Usage growth is the slider that decides the most. At 8% per month, anything you pay per seat or per call ends up costing more than code you own.",
        ]}
      />
      <NextLink href="/matrix">Decision matrix</NextLink>
    </div>
  );
}
