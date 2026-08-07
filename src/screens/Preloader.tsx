import { useEffect, useState } from "react";
import { GRADIENT_BRAND } from "@/theme";
import TotvsLogo from "@/components/TotvsLogo";

const FADE_AT_MS = 2200;
const DONE_AT_MS = 2800;

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), FADE_AT_MS);
    const doneTimer = setTimeout(() => onDone(), DONE_AT_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: GRADIENT_BRAND,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease-in-out",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <style>{`
        @keyframes totvs-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(0.88); }
        }
        .totvs-pulse { animation: totvs-pulse 0.9s ease-in-out infinite; }
      `}</style>

      <TotvsLogo className="totvs-pulse h-18 w-18" tone="light" />

      <p className="font-heading mt-6 text-sm tracking-[0.2em] text-white/60 uppercase">
        TOTVS Insight
      </p>
    </div>
  );
}
