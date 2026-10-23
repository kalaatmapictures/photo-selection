"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { FinalizeDialog } from "./finalize-dialog";
import { Lightbox } from "./lightbox";
import { PhotoTile } from "./photo-tile";
import type { GalleryPhoto, Submission, ToggleResult } from "./types";

type GalleryViewProps = {
  title: string;
  subtitle: string;
  photos: GalleryPhoto[];
  quota: number;
  selectedIds: ReadonlySet<string>;
  submission: Submission | null;
  onToggle: (photo: GalleryPhoto) => ToggleResult;
  onSubmit: (note: string) => void;
};

type Filter = "all" | "selected";

/**
 * Tampilan galeri klien: penghitung kuota, filter, grid, foto besar, dan
 * finalisasi. Komponen ini tidak tahu dari mana data berasal — demo dan galeri
 * sungguhan cukup memberi handler `onToggle` / `onSubmit` yang berbeda.
 */
export function GalleryView({
  title,
  subtitle,
  photos,
  quota,
  selectedIds,
  submission,
  onToggle,
  onSubmit,
}: GalleryViewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const locked = submission !== null;
  const selectedCount = selectedIds.size;
  const visiblePhotos = useMemo(
    () => (filter === "selected" ? photos.filter((photo) => selectedIds.has(photo.id)) : photos),
    [filter, photos, selectedIds],
  );
  const selectedCodes = useMemo(
    () => photos.filter((photo) => selectedIds.has(photo.id)).map((photo) => photo.code),
    [photos, selectedIds],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggle = useCallback(
    (photo: GalleryPhoto) => {
      const result = onToggle(photo);
      if (!result.ok) setToast(result.message);
    },
    [onToggle],
  );

  const progress = Math.min(100, Math.round((selectedCount / quota) * 100));
  const full = selectedCount >= quota;

  return (
    <>
      <div className="sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{subtitle}</p>
            <p className="text-sm font-semibold tabular-nums sm:text-base" aria-live="polite">
              {selectedCount} / {quota} foto dipilih
              {full && !locked && <span className="ml-2 font-normal text-muted">· kuota penuh</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={locked || selectedCount === 0}
            className="h-10 shrink-0 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:px-5"
          >
            {locked ? "Seleksi selesai" : "Selesaikan Seleksi"}
          </button>
        </div>
        <div className="h-0.5 bg-line">
          <div className="h-full bg-ink transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-20 sm:px-8">
        <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Ketuk lingkaran di pojok foto untuk memilih. Ketuk fotonya untuk melihat lebih besar. Pilihan tersimpan
          otomatis.
        </p>

        {submission && (
          <SubmittedPanel submission={submission} />
        )}

        <div className="mt-8 flex gap-1 border-b border-line" role="tablist" aria-label="Filter foto">
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>
            Semua <span className="text-muted tabular-nums">{photos.length}</span>
          </FilterTab>
          <FilterTab active={filter === "selected"} onClick={() => setFilter("selected")}>
            Terpilih <span className="text-muted tabular-nums">{selectedCount}</span>
          </FilterTab>
        </div>

        {visiblePhotos.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">Belum ada foto yang dipilih.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
            {visiblePhotos.map((photo, index) => (
              <PhotoTile
                key={photo.id}
                photo={photo}
                selected={selectedIds.has(photo.id)}
                locked={locked}
                onOpen={() => setOpenIndex(index)}
                onToggle={() => toggle(photo)}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        photos={visiblePhotos}
        index={openIndex}
        selectedIds={selectedIds}
        locked={locked}
        selectedCount={selectedCount}
        quota={quota}
        onIndexChange={setOpenIndex}
        onToggle={toggle}
      />

      <FinalizeDialog
        open={confirming}
        codes={selectedCodes}
        quota={quota}
        onCancel={() => setConfirming(false)}
        onConfirm={(note) => {
          setConfirming(false);
          onSubmit(note);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-xl bg-ink px-4 py-3 text-center text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </>
  );
}

function FilterTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function SubmittedPanel({ submission }: { submission: Submission }) {
  const [copied, setCopied] = useState(false);
  const text = submission.codes.join(", ");

  return (
    <div className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">Seleksi selesai</p>
      <h2 className="mt-2 text-lg font-semibold">
        Terima kasih! {submission.codes.length} foto telah dikirim ke tim editor.
      </h2>
      <p className="mt-1 text-sm text-muted">
        Dikirim {new Date(submission.submittedAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}.
        Hubungi Kalaatma bila ingin mengubah pilihan.
      </p>
      <div className="mt-4 rounded-lg border border-line bg-canvas p-3">
        <p className="font-mono text-xs leading-relaxed break-words text-ink-soft">{text}</p>
      </div>
      {submission.note && (
        <p className="mt-3 text-sm text-ink-soft">
          <span className="text-muted">Catatan:</span> {submission.note}
        </p>
      )}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
        className="mt-4 h-10 rounded-full border border-line px-5 text-sm font-medium hover:border-ink"
      >
        {copied ? "Kode tersalin" : "Salin kode foto"}
      </button>
    </div>
  );
}
