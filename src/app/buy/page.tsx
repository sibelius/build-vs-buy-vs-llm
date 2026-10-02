import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { ApproachView } from "@/components/ApproachView";

export const metadata: Metadata = pageMetadata("/buy");

export default function Page() {
  return <ApproachView id="buy" />;
}
