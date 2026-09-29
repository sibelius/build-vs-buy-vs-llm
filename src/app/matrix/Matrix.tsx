"use client";

import { EraToggle, NextLink, PageHeader, Panel, PanelLabel, WhyGrid } from "@/components/ui";
import { APPROACHES, CRITERIA, ORDER, PRESETS, scoreFor } from "@/lib/content";
import { useDecision } from "@/lib/decision";

function Dots({ n, color, prev }: { n: number; color: string; prev: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="size-2 rounded-full transition-colors duration-500"
          style={{
            background: i <= n ? color : "#242a38",
            boxShadow: i <= prev && i > n ? "inset 0 0 0 1.5px #f87171" : i > prev && i <= n ? "0 0 0 1.5px #34d39966" : undefined,
          }}
        />
      ))}
    </span>
  );
}

export function Matrix() {
  const { era, weights, setWeight, preset, setPreset, scores } = useDecision();
  const otherEra = era === "ai" ? "pre" : "ai";
  const other = scoreFor(otherEra, weights);
  const leader = ORDER.reduce((a, b) => (scores[b] > scores[a] ? b : a));

  return (
    <div>
      <PageHeader n="05" title="Weight what matters, then let the scores fall out">
        Each option gets a 1–5 score on ten criteria, once for 2022 and once for today. You set how much each criterion
        matters for the decision in front of you. Pick a preset, adjust the weights, and switch eras to see the ranking
        change. Your weights are saved in the decision console at the bottom of every page.
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            title={p.note}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              preset === p.id ? "border-accent/60 bg-accent/10 text-ink" : "border-line bg-panel text-muted hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
        <div className="ml-auto">
          <EraToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="text-left text-xs text-faint">
                <th className="pb-3 font-normal">Criterion</th>
                <th className="pb-3 font-normal">Weight</th>
                {ORDER.map((id) => (
                  <th key={id} className="pb-3 font-normal">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full" style={{ background: APPROACHES[id].color }} />
                      {APPROACHES[id].name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((c) => {
                const w = weights[c.id] ?? 0;
                return (
                  <tr key={c.id} className="border-t border-line align-top">
                    <td className="py-3 pr-3">
                      <div className="font-medium">{c.label}</div>
                      <div className="text-xs text-faint">{c.hint}</div>
                      {era === "ai" && <div className="mt-1 text-[11px] leading-snug text-muted"><span className="text-accent">✦ </span>{c.why}</div>}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={5}
                          step={1}
                          value={w}
                          onChange={(e) => setWeight(c.id, Number(e.target.value))}
                          className="w-24"
                          aria-label={`Weight for ${c.label}`}
                        />
                        <span className="w-3 font-mono text-xs tabular-nums">{w}</span>
                      </div>
                    </td>
                    {ORDER.map((id) => (
                      <td key={id} className="py-3 pr-2" style={{ opacity: w === 0 ? 0.35 : 1 }}>
                        <Dots n={c.scores[era][id]} prev={c.scores[otherEra][id]} color={APPROACHES[id].color} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3 text-[11px] text-faint">
            Green ring = gained a point compared with the other era. Red ring = lost one.
          </div>
        </Panel>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Panel>
            <PanelLabel>Weighted score</PanelLabel>
            <div className="space-y-4">
              {[...ORDER]
                .sort((a, b) => scores[b] - scores[a])
                .map((id) => {
                  const d = scores[id] - other[id];
                  return (
                    <div key={id}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          {APPROACHES[id].name}
                          {id === leader && <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent uppercase">leads</span>}
                        </span>
                        <span className="font-mono tabular-nums">
                          {scores[id]}
                          {d !== 0 && (
                            <span className={`ml-2 text-xs ${d > 0 ? "text-ok" : "text-bad"}`}>
                              {d > 0 ? "+" : ""}
                              {d} vs {otherEra === "pre" ? "2022" : "2026"}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="relative mt-1.5 h-2.5 rounded-full bg-bg">
                        <div className="absolute inset-y-0 left-0 rounded-full border border-faint/50" style={{ width: `${other[id]}%` }} />
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                          style={{ width: `${scores[id]}%`, background: APPROACHES[id].color }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-4 text-[11px] text-faint">Outline = same weights in the other era. 100 = perfect on every weighted criterion.</div>
          </Panel>
          <Panel>
            <PanelLabel>Reading it</PanelLabel>
            <p className="text-sm leading-relaxed text-muted">
              {PRESETS.find((p) => p.id === preset)?.note ?? "Custom weights"}.{" "}
              <span className="text-ink">{APPROACHES[leader].name}</span> leads by{" "}
              {scores[leader] - Math.max(...ORDER.filter((i) => i !== leader).map((i) => scores[i]))} points.
              {scores[leader] - Math.max(...ORDER.filter((i) => i !== leader).map((i) => scores[i])) < 5 &&
                " That's close enough that the real answer is probably a mix of options. See 07."}
            </p>
          </Panel>
        </div>
      </div>

      <WhyGrid
        items={[
          "Try Balanced and switch eras. In 2022 Build and Buy were neck and neck, with LLM more than 20 points behind. In 2026 LLM gains the most and draws level with Buy.",
          "Try Regulated fintech. Determinism and audit still favour Build and Buy, and AI hasn't changed that. It does make Build much cheaper to reach.",
          "Differentiation scores the same in both eras. AI changes how much weight you should give it: when everything else is cheap, differentiation is what's left to compete on.",
        ]}
      />
      <NextLink href="/ai-shift">What AI changes</NextLink>
    </div>
  );
}
