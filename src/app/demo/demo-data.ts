import type { GalleryPhoto } from "@/components/gallery/types";

/**
 * DATA CONTOH untuk halaman /demo. Bukan dari Google Drive dan tidak disimpan
 * di database. Gambar diambil dari layanan foto contoh picsum.photos.
 */
export const DEMO_QUOTA = 10;
export const DEMO_PHOTO_COUNT = 36;

export const demoPhotos: GalleryPhoto[] = Array.from({ length: DEMO_PHOTO_COUNT }, (_, i) => {
  const n = i + 1;
  return {
    id: `demo-${n}`,
    code: `DEMO_${String(n).padStart(4, "0")}`,
    thumbUrl: `https://picsum.photos/seed/kalaatma-${n}/480/480`,
    fullUrl: `https://picsum.photos/seed/kalaatma-${n}/1600/1067`,
  };
});
