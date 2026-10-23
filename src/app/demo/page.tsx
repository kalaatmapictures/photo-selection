import type { Metadata } from "next";

import { DemoGallery } from "./demo-gallery";

export const metadata: Metadata = {
  title: "Demo galeri",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <main className="flex-1">
      <DemoGallery />
    </main>
  );
}
