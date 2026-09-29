import type { Metadata } from "next";
import { CostChart } from "./CostChart";

export const metadata: Metadata = { title: "Cost over time · Build vs Buy vs LLM" };

export default function Page() {
  return <CostChart />;
}
