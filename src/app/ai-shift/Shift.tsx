"use client";

import { useEffect, useRef, useState } from "react";
import { NextLink, PageHeader, Panel, PanelLabel, WhyGrid } from "@/components/ui";
import { APPROACHES, ORDER, SHIFTS, type ApproachId, type Shift } from "@/lib/content";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function ShiftRow({ s, t }: { s: Shift; t: number }) {
  const v = lerp(s.before, s.after, ease(t));
  const color = s.direction === "down" ? "#60a5fa" : "#f26b00";
  return (
    <div className="group rounded-xl border border-line bg-panel-2/50 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-medium">{s.factor}</div>
        <div className="flex shrink-0 gap-1">
          {s.affects.map((id) => (
            <span key={id} className="size-2 rounded-full" style={{ background: APPROACHES[id].color }} title={APPROACHES[id].name} />
          ))}
        </div>
      </div>
      <div className="relative mt-2.5 h-2 rounded-full bg-bg">
        <div className="absolute top-1/2 h-3.5 w-px -translate-y-1/2 bg-faint" style={{ left: `${s.before}%` }} title="2022" />
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${v}%`, background: color }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
        <span>2022: {s.before}</span>
        <span style={{ color: t > 0.02 ? color : undefined }}>
          {s.direction === "down" ? "▼" : "▲"} {Math.round(v)}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.summary}</p>
    </div>
  );
}

export function ShiftView() {
  const [t, setT] = useState(1);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const t0 = t >= 1 ? 0 : t;
    const tick = (now: number) => {
      const nt = Math.min(1, t0 + (now - start) / 3000);
      setT(nt);
      if (nt < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const down = SHIFTS.filter((s) => s.direction === "down");
  const up = SHIFTS.filter((s) => s.direction === "up");

  const net = Object.fromEntries(
    ORDER.map((id) => [
      id,
      SHIFTS.filter((s) => s.affects.includes(id)).reduce(
        (sum, s) => sum + (s.impact ?? 1) * Math.abs(s.after - s.before) * ease(t),
        0,
      ),
    ]),
  ) as Record<ApproachId, number>;
  const netMax = 320;
  const year = Math.round(lerp(2022, 2026, t) * 10) / 10;

  return (
    <div>
      <PageHeader n="06" title="What AI changes in the weights">
        The criteria for the decision are the same as before: cost, speed, fit, risk, differentiation. What changed is
        how much each one costs and how much each one is worth. Some costs dropped sharply. A few things became much more
        valuable. Scrub from 2022 to 2026 to watch the weights move.
      </PageHeader>

      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-line bg-panel-2 px-3 py-1.5 text-xs hover:border-faint"
          >
            {playing ? "❚❚ pause" : t >= 1 ? "↺ replay" : "▶ play"}
          </button>
          <span className="font-mono text-xs text-faint">2022</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value));
            }}
            className="min-w-40 flex-1"
            aria-label="Year"
          />
          <span className="font-mono text-xs text-faint">2026</span>
          <span className="w-14 text-right font-mono text-sm text-accent tabular-nums">{year.toFixed(1)}</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {ORDER.map((id) => {
            const v = net[id];
            const pct = (Math.abs(v) / netMax) * 50;
            return (
              <div key={id} className="rounded-xl border border-line bg-bg/50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="size-2 rounded-full" style={{ background: APPROACHES[id].color }} />
                    {APPROACHES[id].name}
                  </span>
                  <span className={`font-mono tabular-nums ${v >= 0 ? "text-ok" : "text-bad"}`}>
                    {v >= 0 ? "+" : ""}
                    {Math.round(v)}
                  </span>
                </div>
                <div className="relative mt-2 h-2 rounded-full bg-panel-2">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-faint" />
                  <div
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      background: APPROACHES[id].color,
                      left: v >= 0 ? "50%" : `${50 - pct}%`,
                      width: `${pct}%`,
                    }}
                  />
                </div>
                <div className="mt-1.5 text-[11px] text-faint">net shift in its favour</div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelLabel>
            <span className="text-[#60a5fa]">▼</span> Costs that collapsed
          </PanelLabel>
          <div className="space-y-3">
            {down.map((s) => (
              <ShiftRow key={s.factor} s={s} t={t} />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelLabel>
            <span className="text-accent">▲</span> Things that got more valuable
          </PanelLabel>
          <div className="space-y-3">
            {up.map((s) => (
              <ShiftRow key={s.factor} s={s} t={t} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelLabel>The new rule of thumb</PanelLabel>
        <div className="grid gap-4 text-sm leading-relaxed md:grid-cols-3">
          <div>
            <div className="mb-1 font-medium" style={{ color: APPROACHES.build.color }}>Build more than you used to</div>
            <p className="text-muted">
              The line between &ldquo;core, so build it&rdquo; and &ldquo;commodity, so buy it&rdquo; has moved. Internal tools, glue
              and thin workflow apps are now cheap enough to own. Pricing engines, ledgers and your data model are still
              the parts that matter most.
            </p>
          </div>
          <div>
            <div className="mb-1 font-medium" style={{ color: APPROACHES.buy.color }}>Buy trust, not features</div>
            <p className="text-muted">
              Pay vendors for things AI can&apos;t produce: licenses, certifications, networks, proprietary datasets and
              someone who carries the pager. Be more sceptical of seat-based feature bundles.
            </p>
          </div>
          <div>
            <div className="mb-1 font-medium" style={{ color: APPROACHES.llm.color }}>LLM where the spec is fuzzy</div>
            <p className="text-muted">
              Use models for unstructured input and the long tail, and wrap them in evals and deterministic checks. Once a
              behaviour is stable and high-volume, turn it into code.
            </p>
          </div>
        </div>
      </Panel>

      <WhyGrid
        label="what didn't change"
        items={[
          "Someone still owns it. AI makes code cheaper to write, but every line still needs an owner, an on-call rotation and a security review.",
          "Correctness where money moves. A ledger has to balance every time. Probabilistic output needs deterministic checks around it.",
          "Knowing what to build. Agents make execution cheap, so choosing the right problem is where most of the value is now.",
        ]}
      />
      <NextLink href="/hybrid">It&apos;s a stack</NextLink>
    </div>
  );
}
