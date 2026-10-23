import { PhotoImage } from "./photo-image";
import { SelectButton } from "./select-button";
import type { GalleryPhoto } from "./types";

type PhotoTileProps = {
  photo: GalleryPhoto;
  selected: boolean;
  locked: boolean;
  onOpen: () => void;
  onToggle: () => void;
};

export function PhotoTile({ photo, selected, locked, onOpen, onToggle }: PhotoTileProps) {
  return (
    <figure>
      <div
        className={`relative overflow-hidden rounded-lg ring-offset-2 ring-offset-canvas transition-shadow ${
          selected ? "ring-2 ring-ink" : ""
        }`}
      >
        <button type="button" onClick={onOpen} className="block w-full" aria-label={`Lihat ${photo.code} lebih besar`}>
          <PhotoImage src={photo.thumbUrl} alt={`Foto ${photo.code}`} className="aspect-square w-full" />
        </button>
        <SelectButton
          selected={selected}
          disabled={locked}
          code={photo.code}
          onClick={onToggle}
          className="absolute top-2 right-2"
        />
      </div>
      <figcaption className="mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="font-mono tracking-tight text-ink-soft">{photo.code}</span>
        {selected && <span className="font-medium text-ink">Terpilih</span>}
      </figcaption>
    </figure>
  );
}
