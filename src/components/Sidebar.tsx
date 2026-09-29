"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/nav";
import { Logo } from "./Logo";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 overflow-y-auto">
      {NAV.map((item) => {
        const active = path === item.href;
        return (
          <div key={item.href}>
            {item.group && (
              <div className="mt-4 mb-1 px-2 text-[10px] font-semibold tracking-widest text-faint uppercase">
                {item.group}
              </div>
            )}
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`group flex gap-3 rounded-lg px-2 py-1.5 transition-colors ${
                active ? "bg-panel-2 text-ink" : "text-muted hover:bg-panel-2/60 hover:text-ink"
              }`}
            >
              <span className={`mt-0.5 font-mono text-[11px] ${active ? "text-accent" : "text-faint"}`}>{item.n}</span>
              <span className="leading-tight">
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="block text-xs text-faint group-hover:text-muted">{item.sub}</span>
              </span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <Logo />
      <div className="leading-tight">
        <div className="text-sm font-semibold">Build · Buy · LLM</div>
        <div className="text-xs text-muted">the decision, visualized</div>
      </div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-panel/60 px-3 py-5 lg:flex">
      <div className="mb-6">
        <Brand />
      </div>
      <NavLinks />
      <div className="mt-auto px-2 pt-4 pb-10 text-[11px] leading-relaxed text-faint">
        Scores are opinionated defaults. Change the weights to match your situation.
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="max-h-[70dvh] overflow-y-auto border-t border-line px-3 pb-4">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
