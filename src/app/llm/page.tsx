import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { ApproachView } from "@/components/ApproachView";

export const metadata: Metadata = pageMetadata("/llm");

export default function Page() {
  return <ApproachView id="llm" />;
}
