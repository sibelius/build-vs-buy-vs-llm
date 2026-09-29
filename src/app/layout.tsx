import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Console } from "@/components/Console";
import { MobileNav, Sidebar } from "@/components/Sidebar";
import { DecisionProvider } from "@/lib/decision";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Build vs Buy vs LLM, visualized",
  description:
    "Interactive visualizations of the build vs buy vs LLM decision: pros, cons, cost curves, and how AI shifts the weights.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <DecisionProvider>
          <div className="flex min-h-dvh">
            <Sidebar />
            <div className="min-w-0 flex-1">
              <MobileNav />
              <main className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-8">{children}</main>
            </div>
          </div>
          <Console />
        </DecisionProvider>
      </body>
    </html>
  );
}
