export interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  /** Ícone opcional exibido à direita, dentro do campo. */
  icon?: React.ReactNode;
  onIconClick?: () => void;
  /** Mensagem de erro. Quando presente, o campo ganha destaque vermelho. */
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  onIconClick,
  error,
  disabled,
  autoComplete,
  onKeyDown,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs font-medium text-brand-text">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          className={`font-body w-full rounded-lg border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none transition-all disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          } ${icon ? "pr-10" : ""}`}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            tabIndex={-1}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
          >
            {icon}
          </button>
        )}
      </div>
      {error && <p className="font-body text-meta leading-tight text-red-500">{error}</p>}
    </div>
  );
}
