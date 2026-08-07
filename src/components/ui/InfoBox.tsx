import { InfoIcon } from "@/icons";

export default function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <span className="mt-0.5 flex-shrink-0 text-brand-blue">
        <InfoIcon size={14} />
      </span>
      <p className="font-body text-xs leading-relaxed text-brand-blue">{children}</p>
    </div>
  );
}
