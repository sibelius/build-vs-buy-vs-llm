import type { Metadata } from "next";
import { Stack } from "./Stack";

export const metadata: Metadata = { title: "It's a stack · Build vs Buy vs LLM" };

export default function Page() {
  return <Stack />;
}
