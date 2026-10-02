import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { ApproachView } from "@/components/ApproachView";

export const metadata: Metadata = pageMetadata("/build");

export default function Page() {
  return <ApproachView id="build" />;
}
