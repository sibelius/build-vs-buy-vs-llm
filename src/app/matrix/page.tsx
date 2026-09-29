import type { Metadata } from "next";
import { Matrix } from "./Matrix";

export const metadata: Metadata = { title: "Decision matrix · Build vs Buy vs LLM" };

export default function Page() {
  return <Matrix />;
}
