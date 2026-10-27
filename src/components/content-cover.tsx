"use client";
import { useState } from 'react';
export function ContentCover({ src, alt = '', priority = false }: { src?: string | null; alt?: string; priority?: boolean }) {
  const [failed, setFailed] = useState<string | null>(null);
  return src && src !== failed ? <img className="content-cover-image" src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} onError={() => setFailed(src)} /> : null;
}
