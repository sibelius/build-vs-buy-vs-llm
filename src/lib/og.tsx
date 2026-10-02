import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { ImageResponse } from "next/og";
import { APPROACHES, COLORS, type ApproachId, type Era } from "@/lib/content";
import { DEFAULT_INPUTS, fmtMoney, simulate } from "@/lib/cost";
import { NAV } from "@/lib/nav";

export const SITE_URL = "https://build-vs-buy-vs-llm.vercel.app";
export const SITE_NAME = "Build vs Buy vs LLM, visualized";
const SHORT_NAME = "Build vs Buy vs LLM";
export const SITE_DESCRIPTION =
  "Interactive visualizations of the build vs buy vs LLM decision: pros, cons, cost curves, and how AI shifts the weights.";
export const OG_SIZE = { width: 1200, height: 630 };

const HOME_TITLE = "Build it, buy it, or ask a model to do it?";
const HOME_BLURB = "Pros, cons, cost curves, and how AI shifts the weights.";

const C = {
  bg: "#0a0c11",
  panel: "#11141b",
  line: "#242a38",
  ink: "#e7e9f0",
  muted: "#8a93a8",
  faint: "#5a6275",
  accent: "#f26b00",
};

const IDS: ApproachId[] = ["build", "buy", "llm"];

function navItem(href: string) {
  const i = NAV.findIndex((n) => n.href === href);
  if (i === -1) throw new Error(`No nav item for ${href}`);
  // groups are only set on the first item of each group
  const group = NAV.slice(0, i + 1).findLast((n) => n.group)?.group;
  return { ...NAV[i], group };
}

const approachOf = (href: string) => (IDS as string[]).includes(href.slice(1)) ? (href.slice(1) as ApproachId) : null;

function blurbFor(href: string) {
  if (href === "/") return HOME_BLURB;
  const id = approachOf(href);
  return id ? APPROACHES[id].tagline : `${navItem(href).sub}.`;
}

export function pageMetadata(href: string): Metadata {
  const item = navItem(href);
  const title = href === "/" ? SITE_NAME : `${item.title} · ${SHORT_NAME}`;
  const description = href === "/" ? SITE_DESCRIPTION : `${blurbFor(href)} ${SITE_DESCRIPTION}`;
  return {
    title,
    description,
    openGraph: { title, description, url: href, siteName: SITE_NAME, type: href === "/" ? "website" : "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function ogAlt(href: string) {
  if (href === "/") return `${SITE_NAME}: ${HOME_TITLE}`;
  return `${navItem(href).title}: ${blurbFor(href)} ${SITE_NAME}`;
}

const W = 1080;
const H = 150;
const PLOT_W = 930;

function chartModel(compare: boolean) {
  const runs: Record<Era, ReturnType<typeof simulate>["series"]> = {
    ai: simulate(DEFAULT_INPUTS, "ai").series,
    pre: simulate(DEFAULT_INPUTS, "pre").series,
  };
  const eras: Era[] = compare ? ["pre", "ai"] : ["ai"];
  const max = Math.max(...eras.flatMap((e) => IDS.flatMap((id) => runs[e][id])));
  const n = runs.ai.build.length - 1;
  const x = (m: number) => (m / n) * PLOT_W;
  const y = (v: number) => H - 6 - (v / max) * (H - 16);
  return { runs, max, n, x, y };
}

/** Cumulative cost over 36 months, straight from the site's own cost model. */
function Curves({ focus, compare }: { focus: ApproachId | null; compare: boolean }) {
  const { runs, max, n, x, y } = chartModel(compare);
  const path = (s: number[]) => s.map((v, m) => `${m ? "L" : "M"}${x(m).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  // end labels, nudged apart so they never overlap
  const ends = IDS.map((id) => ({ id, v: runs.ai[id][n], top: y(runs.ai[id][n]) - 13 })).sort((a, b) => a.top - b.top);
  for (let i = 1; i < ends.length; i++) ends[i].top = Math.max(ends[i].top, ends[i - 1].top + 27);
  const overflow = ends[ends.length - 1].top + 26 - H;
  if (overflow > 0) ends.forEach((e) => (e.top -= overflow));

  return (
    <div style={{ display: "flex", position: "relative", width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={0} x2={PLOT_W} y1={y(max * t)} y2={y(max * t)} stroke={C.line} strokeWidth={1} strokeDasharray="2 6" />
        ))}
        {[12, 24].map((m) => (
          <line key={m} x1={x(m)} x2={x(m)} y1={4} y2={H - 6} stroke={C.line} strokeWidth={1} />
        ))}
        <line x1={0} x2={PLOT_W} y1={H - 5.5} y2={H - 5.5} stroke={C.line} strokeWidth={1} />
        {focus && (
          <path d={`${path(runs.ai[focus])} L${x(n)},${H - 6} L0,${H - 6} Z`} fill={COLORS[focus]} fillOpacity={0.12} />
        )}
        {compare &&
          IDS.map((id) => (
            <path key={`pre-${id}`} d={path(runs.pre[id])} fill="none" stroke={COLORS[id]} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="5 6" />
          ))}
        {IDS.map((id) => {
          const dim = focus && focus !== id;
          return (
            <path key={id} d={path(runs.ai[id])} fill="none" stroke={COLORS[id]} strokeOpacity={dim ? 0.3 : 1} strokeWidth={dim ? 2 : 3.5} />
          );
        })}
        {IDS.map((id) => {
          const dim = focus && focus !== id;
          return <circle key={id} cx={x(n)} cy={y(runs.ai[id][n])} r={dim ? 4 : 6} fill={COLORS[id]} fillOpacity={dim ? 0.4 : 1} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, display: "flex", fontSize: 18, color: C.faint }}>
        {compare ? "cumulative cost · solid = with AI, dashed = before" : "cumulative cost · 36 months"}
      </div>
      {ends.map((e) => (
        <div
          key={e.id}
          style={{
            position: "absolute",
            left: PLOT_W + 18,
            top: e.top,
            width: W - PLOT_W - 18,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 19,
            opacity: focus && focus !== e.id ? 0.45 : 1,
          }}
        >
          <span style={{ color: COLORS[e.id] }}>{e.id}</span>
          <span style={{ color: C.muted }}>{fmtMoney(e.v)}</span>
        </div>
      ))}
    </div>
  );
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#171b24" />
      <circle cx="9" cy="10" r="3.2" fill={COLORS.build} />
      <circle cx="23" cy="10" r="3.2" fill={COLORS.buy} />
      <circle cx="16" cy="23" r="3.2" fill={COLORS.llm} />
      <path d="M9 10 L23 10 L16 23 Z" fill="none" stroke="#e7e9f0" strokeOpacity=".5" strokeWidth="1.2" />
    </svg>
  );
}

const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));

export async function renderOg(href: string) {
  const [semi, sans, mono] = await Promise.all([
    font("Inter-SemiBold.woff"),
    font("Inter-Regular.woff"),
    font("JetBrainsMono-Medium.woff"),
  ]);
  const home = href === "/";
  const item = navItem(href);
  const focus = approachOf(href);
  const color = focus ? COLORS[focus] : C.accent;
  const title = home ? HOME_TITLE : item.title;
  const blurb = blurbFor(href);
  const titleSize = title.length > 30 ? 72 : title.length > 14 ? 88 : 112;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: C.bg,
          backgroundImage: `radial-gradient(circle at 92% 0%, ${color}26, transparent 45%)`,
          color: C.ink,
          padding: "54px 60px 44px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "JetBrains Mono", fontSize: 24 }}>
          <div style={{ width: 4, height: 26, borderRadius: 2, background: color }} />
          <span style={{ color }}>{item.n}</span>
          <span style={{ color: C.muted }}>{home ? "three ways to get software" : (item.group ?? "Start").toLowerCase()}</span>
        </div>

        <div
          style={{
            marginTop: 30,
            fontWeight: 600,
            fontSize: titleSize,
            lineHeight: 1.06,
            letterSpacing: titleSize > 90 ? -4 : -2.5,
            maxWidth: 1060,
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 18, fontSize: 31, lineHeight: 1.35, color: C.muted, maxWidth: 980 }}>{blurb}</div>

        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", fontFamily: "JetBrains Mono" }}>
          <Curves focus={focus} compare={href === "/ai-shift"} />
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 21,
            color: C.faint,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.ink }}>
            <Mark size={36} />
            <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 23 }}>{SITE_NAME}</span>
          </div>
          <span>build-vs-buy-vs-llm.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: semi, weight: 600, style: "normal" },
        { name: "Inter", data: sans, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
