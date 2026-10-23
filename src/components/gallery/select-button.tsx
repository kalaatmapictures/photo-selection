type SelectButtonProps = {
  selected: boolean;
  disabled?: boolean;
  code: string;
  onClick: () => void;
  className?: string;
};

/** Tombol bulat centang untuk memilih / membatalkan satu foto. */
export function SelectButton({ selected, disabled, code, onClick, className = "" }: SelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={selected ? `Batalkan pilihan ${code}` : `Pilih ${code}`}
      className={`grid size-10 place-items-center rounded-full border transition-colors disabled:cursor-not-allowed ${
        selected
          ? "border-ink bg-ink text-white"
          : "border-white/70 bg-white/85 text-ink/40 backdrop-blur hover:text-ink"
      } ${className}`}
    >
      <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden>
        <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
