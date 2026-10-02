import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { Stack } from "./Stack";

export const metadata: Metadata = pageMetadata("/hybrid");

export default function Page() {
  return <Stack />;
}
