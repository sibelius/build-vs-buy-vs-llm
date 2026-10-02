import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { CostChart } from "./CostChart";

export const metadata: Metadata = pageMetadata("/cost");

export default function Page() {
  return <CostChart />;
}
