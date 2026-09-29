import type { Metadata } from "next";
import { Decide } from "./Decide";

export const metadata: Metadata = { title: "Decide · Build vs Buy vs LLM" };

export default function Page() {
  return <Decide />;
}
