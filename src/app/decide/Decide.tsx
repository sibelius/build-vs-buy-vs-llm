"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Panel, PanelLabel } from "@/components/ui";
import { APPROACHES, ORDER, QUESTIONS, type ApproachId } from "@/lib/content";

export function Decide() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const done = Object.keys(answers).length;

  const totals = { build: 0, buy: 0, llm: 0 } as Record<ApproachId, number>;
  const reasons: { id: ApproachId; text: string }[] = [];
  for (const q of QUESTIONS) {
    const i = answers[q.id];
    if (i === undefined) continue;
    const o = q.options[i];
    for (const id of ORDER) totals[id] += o.effect[id] ?? 0;
    if (o.reason) {
      const top = ORDER.reduce((a, b) => ((o.effect[b] ?? 0) > (o.effect[a] ?? 0) ? b : a));
      reasons.push({ id: top, text: o.reason });
    }
  }
  const ranked = [...ORDER].sort((a, b) => totals[b] - totals[a]);
  const [first, second] = ranked;
  const close = totals[first] - totals[second] <= 2;
  const min = Math.min(...ORDER.map((id) => totals[id]), 0);
  const max = Math.max(...ORDER.map((id) => totals[id] - min), 1);

  return (
    <div>
      <PageHeader n="08" title="Seven questions, one call">
        Answer these for one specific capability, not your whole company. The recommendation updates as you answer and
        tells you which answers drove it.
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {QUESTIONS.map((q, qi) => (
            <Panel key={q.id} className="!p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">{String(qi + 1).padStart(2, "0")}</span>
                <div>
                  <div className="font-medium">{q.q}</div>
                  <div className="text-xs text-faint">{q.help}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 pl-7">
                {q.options.map((o, oi) => {
                  const on = answers[q.id] === oi;
                  return (
                    <button
                      key={o.label}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setAnswers((a) => {
                          const n = { ...a };
                          if (on) delete n[q.id];
                          else n[q.id] = oi;
                          return n;
                        })
                      }
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        on ? "border-accent/60 bg-accent/10 text-ink" : "border-line bg-panel-2/60 text-muted hover:text-ink"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </Panel>
          ))}
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Panel>
            <PanelLabel>
              Recommendation · {done}/{QUESTIONS.length} answered
            </PanelLabel>
            {done === 0 ? (
              <p className="text-sm text-muted">Pick an answer to start.</p>
            ) : (
              <>
                <div className="text-2xl font-semibold" style={{ color: APPROACHES[first].color }}>
                  {close ? `${APPROACHES[first].name} + ${APPROACHES[second].name}` : APPROACHES[first].name}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {close
                    ? `It's close. Use ${APPROACHES[first].name} for the core of it and ${APPROACHES[second].name} around the edges.`
                    : APPROACHES[first].tagline}
                </p>
                <div className="mt-4 space-y-2">
                  {ranked.map((id) => (
                    <div key={id} className="flex items-center gap-3 text-xs">
                      <span className="w-10 text-muted">{APPROACHES[id].name}</span>
                      <div className="h-2 flex-1 rounded-full bg-bg">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${((totals[id] - min) / max) * 100}%`, background: APPROACHES[id].color }}
                        />
                      </div>
                      <span className="w-6 text-right font-mono tabular-nums">{totals[id]}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>
          {reasons.length > 0 && (
            <Panel>
              <PanelLabel>Because</PanelLabel>
              <ul className="space-y-2 text-sm text-muted">
                {reasons.map((r) => (
                  <li key={r.text} className="flex gap-2">
                    <span style={{ color: APPROACHES[r.id].color }}>→</span>
                    {r.text}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          {done > 0 && (
            <div className="flex gap-3 text-xs">
              <button type="button" onClick={() => setAnswers({})} className="text-faint hover:text-ink">
                reset
              </button>
              <Link href="/hybrid" className="text-accent hover:underline">
                See how the options combine →
              </Link>
            </div>
          )}
        </div>
      </div>

      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {[
          "Ask these questions separately for each capability. One product can reasonably get three different answers.",
          "If both 'core' and 'wrong output costs money' apply, the model can suggest and the code decides. That's often the best of both.",
          "Ask again at every vendor renewal and every model generation. Both inputs keep changing.",
        ].map((t, i) => (
          <li key={i} className="rounded-xl border border-line bg-panel/60 p-4 text-sm leading-relaxed text-muted">
            <span className="mb-2 block font-mono text-xs text-accent">tip</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
