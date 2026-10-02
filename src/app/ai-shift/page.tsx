import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { ShiftView } from "./Shift";

export const metadata: Metadata = pageMetadata("/ai-shift");

export default function Page() {
  return <ShiftView />;
}
