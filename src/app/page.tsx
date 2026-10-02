import Link from "next/link";
import { APPROACHES, ORDER } from "@/lib/content";
import { NAV } from "@/lib/nav";
import { pageMetadata } from "@/lib/og";

export const metadata = pageMetadata("/");

const LANES = [
  { id: "build", y: 40, pay: "engineer-months", what: "code you own", run: "your infra, your on-call", href: "/build" },
  { id: "buy", y: 120, pay: "subscription / seats", what: "vendor product", run: "their infra, their SLA", href: "/buy" },
  { id: "llm", y: 200, pay: "tokens per call", what: "prompt + tools + evals", run: "model decides at runtime", href: "/llm" },
] as const;

function PathsDiagram() {
  return (
    <svg
      viewBox="0 0 894 260"
      className="min-w-[720px]"
      role="img"
      aria-label="A capability can be built as owned code, bought as a vendor product, or delegated to an LLM at runtime; each path has a different cost shape"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5a6275" />
        </marker>
      </defs>
      <rect x="0" y="96" width="150" height="72" rx="12" fill="#171b24" stroke="#242a38" />
      <rect x="0" y="96" width="4" height="72" rx="2" fill="#f26b00" />
      <text x="16" y="124" fill="#e7e9f0" fontSize="14" fontWeight="600">A capability</text>
      <text x="16" y="146" fill="#8a93a8" fontSize="11.5">you need to ship</text>

      {LANES.map((l) => {
        const a = APPROACHES[l.id];
        const cy = l.y + 30;
        return (
          <a key={l.id} href={l.href}>
            <g className="cursor-pointer [&:hover_rect.box]:stroke-[#e7e9f0]">
              <path d={`M 154 132 C 190 132, 190 ${cy}, 226 ${cy}`} fill="none" stroke="#5a6275" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <rect className="box" x="230" y={l.y} width="152" height="60" rx="12" fill="#171b24" stroke="#242a38" />
              <rect x="230" y={l.y} width="4" height="60" rx="2" fill={a.color} />
              <text x="246" y={l.y + 26} fill="#e7e9f0" fontSize="14" fontWeight="600">{a.name}</text>
              <text x="246" y={l.y + 45} fill="#8a93a8" fontSize="11.5">pay: {l.pay}</text>

              <line x1="386" y1={cy} x2="436" y2={cy} stroke={a.color} strokeWidth="1.5" strokeDasharray="5 6" strokeOpacity=".8">
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.2s" repeatCount="indefinite" />
              </line>

              <rect className="box" x="440" y={l.y} width="190" height="60" rx="12" fill="#11141b" stroke="#242a38" />
              <text x="456" y={l.y + 26} fill="#e7e9f0" fontSize="13" fontWeight="500">{l.what}</text>
              <text x="456" y={l.y + 45} fill="#8a93a8" fontSize="11.5">{l.run}</text>
              <path d={`M 634 ${cy} C 680 ${cy}, 680 132, 726 132`} fill="none" stroke="#5a6275" strokeWidth="1.5" markerEnd="url(#arrow)" />
            </g>
          </a>
        );
      })}

      <rect x="730" y="96" width="164" height="72" rx="12" fill="#171b24" stroke="#242a38" />
      <rect x="730" y="96" width="4" height="72" rx="2" fill="#34d399" />
      <text x="746" y="124" fill="#e7e9f0" fontSize="14" fontWeight="600">Value to users</text>
      <text x="746" y="146" fill="#8a93a8" fontSize="11.5">same goal, different bill</text>
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      <header className="max-w-3xl animate-rise">
        <div className="mb-3 font-mono text-xs text-accent">build vs buy vs llm, visualized</div>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Build it, buy it, or ask a model to do it?
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">
          For decades this was a two-way call between writing the software yourself and paying a vendor. Now
          there&apos;s a third option: describe the job and let an LLM do it at runtime. AI also changed the cost of the
          first two. These pages lay out the pros and cons of each path and show how the weights moved.
        </p>
      </header>

      <div className="mt-10 rounded-2xl border border-line bg-panel p-4 sm:p-6">
        <div className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">Three paths to the same capability</div>
        <div className="overflow-x-auto">
          <PathsDiagram />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {ORDER.map((id) => {
          const a = APPROACHES[id];
          return (
            <Link
              key={id}
              href={`/${id}`}
              className="group rounded-xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-faint"
            >
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: a.color }} />
                <span className="font-medium">{a.name}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.tagline}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="mb-1 font-mono text-ok">+ strongest</div>
                  <div className="text-muted">{a.pros[0].title}</div>
                  <div className="text-muted">{a.pros[1].title}</div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-bad">− weakest</div>
                  <div className="text-muted">{a.cons[0].title}</div>
                  <div className="text-muted">{a.cons[1].title}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NAV.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-faint"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-accent">{item.n}</span>
              <span className="text-faint transition group-hover:translate-x-0.5 group-hover:text-ink">→</span>
            </div>
            <div className="mt-3 font-medium">{item.title}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.sub}</p>
          </Link>
        ))}
      </div>

      <ul className="mt-10 grid gap-3 md:grid-cols-3">
        {[
          "Building got cheap. Coding agents cut the cost of writing and maintaining code, so the Build side weighs less than it used to.",
          "Commodity SaaS got weaker. A thin CRUD tool can be rebuilt in days. Vendors whose moat is trust, data or a network are stronger than before.",
          "LLMs became an option of their own. Messy, open-ended work that used to need people or brittle rules can be handed to a model, as long as you can check the output.",
        ].map((t, i) => (
          <li key={i} className="rounded-xl border border-line bg-panel/60 p-4 text-sm leading-relaxed text-muted">
            <span className="mb-2 block font-mono text-xs text-accent">the short version</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
