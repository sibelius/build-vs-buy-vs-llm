import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og";
import { Matrix } from "./Matrix";

export const metadata: Metadata = pageMetadata("/matrix");

export default function Page() {
  return <Matrix />;
}
