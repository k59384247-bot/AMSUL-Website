"use client";
import { landingImageSrcSet } from "@/lib/landing-image";
import { useState } from 'react';
export function ContentCover({ src, alt = '', priority = false }: { src?: string | null; alt?: string; priority?: boolean }) {
  const [failed, setFailed] = useState<string | null>(null);
  return src && src !== failed ? <img className="content-cover-image" src={src} srcSet={src === "/assets/about-2026/iwd.jpg" ? landingImageSrcSet(src) : undefined} sizes="(max-width: 700px) 100vw, 1248px" alt={alt} loading={priority ? 'eager' : 'lazy'} onError={() => setFailed(src)} /> : null;
}
