"use client";

import { useCallback, useEffect, useState } from "react";

import { GalleryView } from "@/components/gallery/gallery-view";
import type { GalleryPhoto, Submission, ToggleResult } from "@/components/gallery/types";

import { DEMO_QUOTA, demoPhotos } from "./demo-data";

const STORAGE_KEY = "kalaatma-demo-gallery-v1";

type DemoState = { selected: string[]; submission: Submission | null };

function loadState(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    const validIds = new Set(demoPhotos.map((photo) => photo.id));
    return {
      selected: parsed.selected.filter((id) => validIds.has(id)).slice(0, DEMO_QUOTA),
      submission: parsed.submission ?? null,
    };
  } catch {
    return null;
  }
}

function saveState(state: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Mode privat / penyimpanan diblokir: demo tetap jalan tanpa menyimpan.
  }
}

/**
 * Versi demo galeri: aturan kuota dan kunci dijalankan di browser, pilihan
 * disimpan di localStorage. Di galeri sungguhan aturan ini ditegakkan server
 * dan database (lihat supabase/migrations).
 */
export function DemoGallery() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loaded, setLoaded] = useState(false);

  // localStorage hanya ada di browser, jadi dibaca setelah halaman tampil.
  useEffect(() => {
    const stored = loadState();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi sekali dari localStorage
      setSelected(new Set(stored.selected));
      setSubmission(stored.submission);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState({ selected: [...selected], submission });
  }, [loaded, selected, submission]);

  const handleToggle = useCallback(
    (photo: GalleryPhoto): ToggleResult => {
      if (submission) return { ok: false, message: "Seleksi sudah diselesaikan dan terkunci." };
      if (selected.has(photo.id)) {
        const next = new Set(selected);
        next.delete(photo.id);
        setSelected(next);
        return { ok: true };
      }
      if (selected.size >= DEMO_QUOTA) {
        return { ok: false, message: `Kuota ${DEMO_QUOTA} foto sudah penuh. Batalkan pilihan lain dulu.` };
      }
      setSelected(new Set(selected).add(photo.id));
      return { ok: true };
    },
    [selected, submission],
  );

  const handleSubmit = useCallback(
    (note: string) => {
      setSubmission({
        codes: demoPhotos.filter((photo) => selected.has(photo.id)).map((photo) => photo.code),
        note,
        submittedAt: new Date().toISOString(),
      });
    },
    [selected],
  );

  function reset() {
    setSelected(new Set());
    setSubmission(null);
  }

  return (
    <>
      <div className="bg-accent/10 text-ink">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            <strong className="font-semibold">Mode demo</strong> — foto contoh (picsum.photos), bukan dari Google
            Drive. Pilihan hanya tersimpan di browser ini.
          </p>
          <button
            type="button"
            onClick={reset}
            className="self-start font-medium underline underline-offset-4 hover:no-underline sm:self-auto"
          >
            Ulangi demo
          </button>
        </div>
      </div>

      <GalleryView
        title="Wedding — Klien Demo"
        subtitle="Galeri demo · Kalaatma Pictures"
        photos={demoPhotos}
        quota={DEMO_QUOTA}
        selectedIds={selected}
        submission={submission}
        onToggle={handleToggle}
        onSubmit={handleSubmit}
      />
    </>
  );
}
