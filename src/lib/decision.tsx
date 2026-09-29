"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRESETS, scoreFor, type ApproachId, type Era, type Weights } from "./content";

type DecisionState = {
  era: Era;
  setEra: (e: Era) => void;
  weights: Weights;
  setWeight: (id: string, v: number) => void;
  setWeights: (w: Weights) => void;
  preset: string | null;
  setPreset: (id: string) => void;
  scores: Record<ApproachId, number>;
};

const Ctx = createContext<DecisionState | null>(null);
const KEY = "bvb-llm:v1";

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [era, setEra] = useState<Era>("ai");
  const [weights, setWeightsRaw] = useState<Weights>(PRESETS[0].weights);
  const [preset, setPresetId] = useState<string | null>("balanced");
  const [loaded, setLoaded] = useState(false);

  function restore(s: { era?: Era; weights?: Weights; preset?: string | null }) {
    if (s.era === "pre" || s.era === "ai") setEra(s.era);
    if (s.weights) setWeightsRaw(s.weights);
    setPresetId(s.preset ?? null);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // Restore after hydration so server and client render the same defaults first.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) restore(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ era, weights, preset }));
    } catch {}
  }, [era, weights, preset, loaded]);

  const value = useMemo<DecisionState>(
    () => ({
      era,
      setEra,
      weights,
      setWeight: (id, v) => {
        setWeightsRaw((w) => ({ ...w, [id]: v }));
        setPresetId(null);
      },
      setWeights: (w) => {
        setWeightsRaw(w);
        setPresetId(null);
      },
      preset,
      setPreset: (id) => {
        const p = PRESETS.find((x) => x.id === id);
        if (!p) return;
        setWeightsRaw(p.weights);
        setPresetId(id);
      },
      scores: scoreFor(era, weights),
    }),
    [era, weights, preset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDecision() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDecision outside DecisionProvider");
  return v;
}
