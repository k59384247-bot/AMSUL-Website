"use client";

import { Children, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import assets from "@/data/assets.json";
import { Icon } from "./ui";

export function Carousel({ children, label, controls = false, className = "", arrowSrc = assets["80-2022-imgPajamasArrowRight1"], dots = false, initialIndex = 0, autoplay = false }: {
  children: ReactNode; label: string; controls?: boolean; className?: string; arrowSrc?: string; dots?: boolean; initialIndex?: number; autoplay?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useLayoutEffect(() => {
    const node = track.current;
    const item = node?.firstElementChild as HTMLElement | null;
    if (initialIndex > 0 && node && item) node.scrollLeft = initialIndex * (item.getBoundingClientRect().width + 24);
  }, [initialIndex]);

  useEffect(() => {
    if (!autoplay) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (motion.matches) return;
      timer = setTimeout(() => {
        const node = track.current;
        if (!node) return;
        const slides = Array.from(node.children) as HTMLElement[];
        const available = slides.map((slide, index) => slide.querySelector("img") ? index : -1).filter(index => index >= 0);
        if (available.length < 2) return;
        const next = available.find(index => index > activeSlide) ?? available[0];
        node.scrollTo({ left: slides[next].offsetLeft - slides[0].offsetLeft, behavior: "smooth" });
      }, 5000);
    };
    schedule();
    motion.addEventListener("change", schedule);
    return () => { clearTimeout(timer); motion.removeEventListener("change", schedule); };
  }, [activeSlide, autoplay]);

  function goToSlide(index: number) {
    const node = track.current;
    const item = node?.firstElementChild as HTMLElement | null;
    if (node && item) node.scrollTo({ left: index * (item.getBoundingClientRect().width + 24), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function move(direction: number) {
    const node = track.current;
    if (!node) return;
    const item = node.firstElementChild as HTMLElement | null;
    const step = item ? item.getBoundingClientRect().width + 24 : node.clientWidth;
    node.scrollBy({ left: direction * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  if (Children.count(children) === 0) return null;
  return <div className={`carousel ${className}`} role="region" aria-label={label} aria-roledescription="carousel">
    <div ref={track} className="carousel-track" tabIndex={0} aria-label={`${label}. Use left and right arrow keys to scroll.`}
      onScroll={event => {
        const node = event.currentTarget;
        const max = node.scrollWidth - node.clientWidth;
        setPosition(max > 0 ? node.scrollLeft / max : 0);
        setAtEnd(node.scrollLeft >= max - 2);
        if ((dots || autoplay) && node.firstElementChild) setActiveSlide(Math.round(node.scrollLeft / (node.firstElementChild.getBoundingClientRect().width + 24)));
      }}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
      }}>
      {Children.toArray(children)}
    </div>
    {controls && Children.count(children) > 1 && <div className="carousel-controls">
      {dots ? <div className="carousel-dots">{Children.toArray(children).map((_, index) => <button key={index} className={`carousel-dot ${index === activeSlide ? "is-active" : ""}`} aria-label={`Show ${label.toLowerCase()} slide ${index + 1}`} aria-pressed={index === activeSlide} onClick={() => goToSlide(index)} />)}</div> : <div className="carousel-progress" aria-hidden="true"><span style={{ transform: `translateX(${position * 100}%)` }} /></div>}
      <div className="carousel-arrows">
        <button type="button" className="round-button" aria-label={`Previous ${label.toLowerCase()}`} disabled={position <= 0.001} onClick={() => move(-1)}><Icon className="arrow-back" src={arrowSrc} /></button>
        <button type="button" className="round-button" aria-label={`Next ${label.toLowerCase()}`} disabled={atEnd} onClick={() => move(1)}><Icon src={arrowSrc} /></button>
      </div>
    </div>}
  </div>;
}
