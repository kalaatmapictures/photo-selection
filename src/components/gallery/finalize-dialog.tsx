"use client";

import { useEffect, useRef, useState } from "react";

type FinalizeDialogProps = {
  open: boolean;
  codes: string[];
  quota: number;
  onCancel: () => void;
  onConfirm: (note: string) => void;
};

/** Konfirmasi sebelum klien menyelesaikan seleksi. */
export function FinalizeDialog({ open, codes, quota, onCancel, onConfirm }: FinalizeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const remaining = quota - codes.length;

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-surface p-0 text-ink backdrop:bg-ink/40"
    >
      <form
        method="dialog"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm(note.trim());
        }}
        className="p-6 sm:p-7"
      >
        <h2 className="font-display text-3xl font-medium tracking-tight">Selesaikan seleksi?</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Anda memilih <strong>{codes.length}</strong> dari {quota} foto
          {remaining > 0 && <> (masih bisa memilih {remaining} lagi)</>}. Setelah diselesaikan, pilihan tidak bisa
          diubah kecuali dibuka kembali oleh Kalaatma.
        </p>

        <div className="mt-5 max-h-36 overflow-y-auto rounded-lg border border-line bg-canvas p-3">
          <p className="font-mono text-xs leading-relaxed break-words text-ink-soft">{codes.join(", ")}</p>
        </div>

        <label className="mt-5 block text-sm font-medium" htmlFor="finalize-note">
          Catatan untuk editor <span className="font-normal text-muted">(opsional)</span>
        </label>
        <textarea
          id="finalize-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Mis. mohon kulit dibuat lebih cerah"
          className="mt-2 w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        />

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-full px-5 text-sm font-medium text-ink-soft hover:bg-canvas"
          >
            Kembali memilih
          </button>
          <button type="submit" className="h-11 rounded-full bg-ink px-6 text-sm font-medium text-white hover:bg-ink-soft">
            Ya, selesaikan
          </button>
        </div>
      </form>
    </dialog>
  );
}
