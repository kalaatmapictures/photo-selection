"use client";

import { useEffect, useRef } from "react";

import { PhotoImage } from "./photo-image";
import type { GalleryPhoto } from "./types";

type LightboxProps = {
  photos: GalleryPhoto[];
  index: number | null;
  selectedIds: ReadonlySet<string>;
  locked: boolean;
  selectedCount: number;
  quota: number;
  onIndexChange: (index: number | null) => void;
  onToggle: (photo: GalleryPhoto) => void;
};

/** Tampilan foto besar. Navigasi: tombol, panah kiri/kanan keyboard, Esc untuk menutup. */
export function Lightbox({
  photos,
  index,
  selectedIds,
  locked,
  selectedCount,
  quota,
  onIndexChange,
  onToggle,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = index === null ? null : photos[index];
  const isOpen = photo !== null && photo !== undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (index === null) return;
    function onKey(event: KeyboardEvent) {
      if (index === null) return;
      if (event.key === "ArrowRight" && index < photos.length - 1) onIndexChange(index + 1);
      if (event.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onIndexChange]);

  const selected = photo ? selectedIds.has(photo.id) : false;

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onIndexChange(null)}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
    >
      {photo && index !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 text-sm sm:px-6">
            <span className="text-white/60 tabular-nums">
              {index + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => onIndexChange(null)}
              className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              Tutup
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <PhotoImage
              key={photo.id}
              src={photo.fullUrl}
              alt={`Foto ${photo.code}`}
              loading="eager"
              className="max-h-full max-w-full !bg-transparent !object-contain"
            />
            <NavButton
              direction="prev"
              disabled={index === 0}
              onClick={() => onIndexChange(index - 1)}
            />
            <NavButton
              direction="next"
              disabled={index === photos.length - 1}
              onClick={() => onIndexChange(index + 1)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div>
              <p className="font-mono text-base">{photo.code}</p>
              <p className="text-xs text-white/60 tabular-nums">
                {selectedCount} / {quota} foto dipilih
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(photo)}
              disabled={locked}
              aria-pressed={selected}
              className={`h-11 rounded-full px-6 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                selected ? "bg-white text-ink hover:bg-white/90" : "border border-white/40 hover:bg-white/10"
              }`}
            >
              {selected ? "✓ Terpilih — batalkan" : "Pilih foto ini"}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Foto sebelumnya" : "Foto berikutnya"}
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-xl text-white/80 hover:bg-black/60 hover:text-white disabled:invisible ${
        direction === "prev" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}
