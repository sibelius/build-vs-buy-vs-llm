"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useDecision } from "@/lib/decision";

export function PageHeader({ n, title, children }: { n: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-3xl animate-rise">
      <div className="mb-2 font-mono text-xs text-accent">{n}</div>
      <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
      {children && <div className="mt-3 text-[15px] leading-relaxed text-pretty text-muted">{children}</div>}
    </header>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-w-0 rounded-2xl border border-line bg-panel p-4 sm:p-6 ${className}`}>{children}</div>;
}

export function PanelLabel({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">{children}</div>;
}

export function WhyGrid({ items, label = "why it matters" }: { items: ReactNode[]; label?: string }) {
  return (
    <ul className="mt-8 grid gap-3 md:grid-cols-3">
      {items.map((it, i) => (
        <li key={i} className="rounded-xl border border-line bg-panel/60 p-4 text-sm leading-relaxed text-muted">
          <span className="mb-2 block font-mono text-xs text-accent">{label}</span>
          {it}
        </li>
      ))}
    </ul>
  );
}

export function EraToggle() {
  const { era, setEra } = useDecision();
  return (
    <div className="inline-flex rounded-lg border border-line bg-bg p-0.5 text-xs" role="group" aria-label="Era">
      {(
        [
          ["pre", "Pre-AI (2022)"],
          ["ai", "AI era (2026)"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setEra(id)}
          aria-pressed={era === id}
          className={`rounded-md px-3 py-1.5 transition-colors ${
            era === id ? "bg-panel-2 text-ink" : "text-muted hover:text-ink"
          }`}
        >
          {id === "ai" && <span className="mr-1 text-accent">✦</span>}
          {label}
        </button>
      ))}
    </div>
  );
}

export function NextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-10 flex justify-end">
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2.5 text-sm hover:border-faint"
      >
        Next: {children}
        <span className="text-faint transition group-hover:translate-x-0.5 group-hover:text-ink">→</span>
      </Link>
    </div>
  );
}

export function Chip({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={{ borderColor: `${color}55`, color, background: `${color}14` }}
    >
      {children}
    </span>
  );
}
