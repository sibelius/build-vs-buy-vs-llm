import type { Metadata } from "next";
import { ApproachView } from "@/components/ApproachView";

export const metadata: Metadata = { title: "Build · Build vs Buy vs LLM" };

export default function Page() {
  return <ApproachView id="build" />;
}
