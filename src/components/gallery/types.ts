/** Foto seperti yang dilihat klien di galeri. */
export type GalleryPhoto = {
  id: string;
  /** Kode unik yang dicatat editor, mis. "DSC_1234". */
  code: string;
  thumbUrl: string;
  fullUrl: string;
};

/**
 * Hasil memilih/membatalkan foto. Di galeri sungguhan (Tahap 4) hasil ini
 * berasal dari server; di demo dihitung di browser.
 */
export type ToggleResult = { ok: true } | { ok: false; message: string };

export type Submission = {
  codes: string[];
  note: string;
  submittedAt: string;
};
