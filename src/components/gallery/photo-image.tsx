"use client";

import { useState } from "react";

type PhotoImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
};

/**
 * <img> biasa dengan cadangan: bila gambar gagal dimuat, area tetap berwarna
 * netral dan menampilkan keterangan, bukan ikon gambar rusak.
 */
export function PhotoImage({ src, alt, className = "", loading = "lazy" }: PhotoImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center bg-gradient-to-br from-line to-canvas text-xs text-muted ${className}`}
      >
        Gambar tidak dapat dimuat
      </div>
    );
  }

  return (
    // Thumbnail galeri berasal dari URL yang sudah diatur ukurannya, jadi <img> cukup.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={`bg-line object-cover ${className}`}
    />
  );
}
