"use client";
import { useEffect, useState } from "react";
import { landingImageSrcSet } from "@/lib/landing-image";

export function HeroSlideshow({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reducedMotion || images.length < 2) return;
    const timer = window.setTimeout(() => { setPrevious(active); setActive((active + 1) % images.length); }, 5000);
    return () => window.clearTimeout(timer);
  }, [active, images.length, reducedMotion]);
  useEffect(() => {
    if (previous === null) return;
    const timer = window.setTimeout(() => setPrevious(null), 650);
    return () => window.clearTimeout(timer);
  }, [previous, active]);
  return <>
    <div className="hero-image hero-slideshow-image" aria-hidden="true">{images.map((src, index) => <img key={src} src={src} srcSet={landingImageSrcSet(src)} sizes="100vw" alt="" className={index === active ? "is-active" : index === previous ? "is-previous" : ""} fetchPriority={index === 0 ? "high" : "low"} />)}<div className="hero-shade" /></div>
    <div className="hero-thumbnails" data-autoplay={!reducedMotion} role="group" aria-label="Choose a hero image">{images.map((src, index) => <button key={src} type="button" className={index === active ? "is-active" : ""} aria-label={`Show image ${index + 1}`} aria-pressed={index === active} onClick={() => { if (index !== active) { setPrevious(active); setActive(index); } }}><img src={src.replace(/\.jpg$/, "-thumb.webp")} alt="" /></button>)}</div>
  </>;
}
