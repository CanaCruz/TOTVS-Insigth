import { CheckIcon } from "@/icons";

/** Item de checklist usado na validação de força de senha. */
export default function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-white transition-colors ${
          ok ? "bg-green-500" : "bg-gray-200"
        }`}
      >
        {ok && <CheckIcon />}
      </div>
      <span
        className={`font-body text-xs transition-colors ${ok ? "text-green-600" : "text-gray-500"}`}
      >
        {label}
      </span>
    </div>
  );
}
