export type NavItem = { href: string; n: string; title: string; sub: string; group?: string };

export const NAV: NavItem[] = [
  { href: "/", n: "00", title: "Overview", sub: "Three ways to get software" },
  { href: "/build", n: "01", title: "Build", sub: "Own the code", group: "Approaches" },
  { href: "/buy", n: "02", title: "Buy", sub: "Rent the product" },
  { href: "/llm", n: "03", title: "LLM", sub: "Let a model do the job" },
  { href: "/cost", n: "04", title: "Cost over time", sub: "TCO curves & break-even", group: "Compare" },
  { href: "/matrix", n: "05", title: "Decision matrix", sub: "Weight what matters to you" },
  { href: "/ai-shift", n: "06", title: "What AI changes", sub: "How the weights moved", group: "The shift" },
  { href: "/hybrid", n: "07", title: "It's a stack", sub: "Buy, build & LLM together" },
  { href: "/decide", n: "08", title: "Decide", sub: "Seven questions → a call" },
];
