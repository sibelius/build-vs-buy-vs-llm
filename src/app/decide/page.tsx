import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { Decide } from "./Decide";

export const metadata: Metadata = pageMetadata("/decide");

export default function Page() {
  return <Decide />;
}
