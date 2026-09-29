import type { Metadata } from "next";
import { ShiftView } from "./Shift";

export const metadata: Metadata = { title: "What AI changes · Build vs Buy vs LLM" };

export default function Page() {
  return <ShiftView />;
}
