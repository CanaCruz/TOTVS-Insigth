export interface LinkBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function LinkBtn({ children, onClick, disabled }: LinkBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-body text-xs text-brand-blue transition-colors hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
    >
      {children}
    </button>
  );
}
