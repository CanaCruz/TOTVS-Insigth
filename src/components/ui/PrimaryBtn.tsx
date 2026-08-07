export interface PrimaryBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Exibe um spinner e bloqueia o clique. */
  loading?: boolean;
}

export default function PrimaryBtn({
  children,
  onClick,
  type = "button",
  disabled,
  loading,
}: PrimaryBtnProps) {
  const blocked = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={blocked}
      className="font-heading flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-blue"
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
