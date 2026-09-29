"use client";

import Link from "next/link";
import { useState } from "react";
import { APPROACHES, CRITERIA, ORDER, PRESETS } from "@/lib/content";
import { useDecision } from "@/lib/decision";
import { EraToggle } from "./ui";

export function Console() {
  const { scores, era, weights, preset } = useDecision();
  const [open, setOpen] = useState(false);
  const leader = ORDER.reduce((a, b) => (scores[b] > scores[a] ? b : a));
  const presetLabel = PRESETS.find((p) => p.id === preset)?.label ?? "Custom";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:left-64">
      <div className="border-t border-line bg-panel/95 backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-full items-center gap-4 overflow-hidden px-4 text-xs whitespace-nowrap text-muted hover:text-ink"
        >
          <span className="font-semibold tracking-wide text-ink uppercase">Decision console</span>
          <span className="hidden sm:inline">{presetLabel}</span>
          <span className="hidden sm:inline">{era === "ai" ? "AI era" : "Pre-AI"}</span>
          {ORDER.map((id) => (
            <span key={id} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full" style={{ background: APPROACHES[id].color }} />
              <span className={id === leader ? "text-ink" : ""}>
                {APPROACHES[id].name} {scores[id]}
              </span>
            </span>
          ))}
          <span className="ml-auto">{open ? "▾ hide" : "▴ show"}</span>
        </button>
        {open && (
          <div className="grid gap-4 border-t border-line px-4 py-4 text-xs sm:grid-cols-[auto_1fr]">
            <div className="space-y-3">
              <EraToggle />
              <Link href="/matrix" className="block text-accent hover:underline">
                Edit weights →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-5">
              {CRITERIA.map((c) => (
                <div key={c.id} className="flex justify-between gap-2">
                  <span className="truncate text-muted">{c.label}</span>
                  <span className="font-mono text-ink tabular-nums">{weights[c.id] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
