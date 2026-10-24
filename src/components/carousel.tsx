"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import assets from "@/data/assets.json";
import { Icon } from "./ui";

export function Carousel({ children, label, controls = false, className = "", arrowSrc = assets["80-2022-imgPajamasArrowRight1"], dots = false }: {
  children: ReactNode; label: string; controls?: boolean; className?: string; arrowSrc?: string; dots?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

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

  return <div className={`carousel ${className}`} role="region" aria-label={label} aria-roledescription="carousel">
    <div ref={track} className="carousel-track" tabIndex={0} aria-label={`${label}. Use left and right arrow keys to scroll.`}
      onScroll={event => {
        const node = event.currentTarget;
        const max = node.scrollWidth - node.clientWidth;
        setPosition(max > 0 ? node.scrollLeft / max : 0);
        setAtEnd(node.scrollLeft >= max - 2);
        if (dots && node.firstElementChild) setActiveSlide(Math.round(node.scrollLeft / (node.firstElementChild.getBoundingClientRect().width + 24)));
      }}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
      }}>
      {Children.toArray(children)}
    </div>
    {controls && <div className="carousel-controls">
      {dots ? <div className="carousel-dots">{Children.toArray(children).map((_, index) => <button key={index} className={`carousel-dot ${index === activeSlide ? "is-active" : ""}`} aria-label={`Show ${label.toLowerCase()} slide ${index + 1}`} aria-pressed={index === activeSlide} onClick={() => goToSlide(index)} />)}</div> : <div className="carousel-progress" aria-hidden="true"><span style={{ transform: `translateX(${position * 100}%)` }} /></div>}
      <div className="carousel-arrows">
        <button type="button" className="round-button" aria-label={`Previous ${label.toLowerCase()}`} disabled={position <= 0.001} onClick={() => move(-1)}><Icon className="arrow-back" src={arrowSrc} /></button>
        <button type="button" className="round-button" aria-label={`Next ${label.toLowerCase()}`} disabled={atEnd} onClick={() => move(1)}><Icon src={arrowSrc} /></button>
      </div>
    </div>}
  </div>;
}
