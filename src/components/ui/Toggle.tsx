export interface ToggleProps {
  on: boolean;
  onChange: () => void;
  /** Rótulo acessível — o controle em si não tem texto visível. */
  label?: string;
}

export default function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
        on ? "bg-brand-blue" : "bg-gray-200"
      }`}
    >
      <div
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
