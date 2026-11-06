"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Milestone = { id: string; year: string; title: string; description: string };

const twoSidedLayout = [
  { left: 0, height: 354 }, { left: 441, height: 284 }, { left: 735, height: 354 }, { left: 1176, height: 354 },
  { left: 147, height: 411 }, { left: 588, height: 354 }, { left: 1029, height: 354 }, { left: 1323, height: 354 },
];

export function HistoryTimeline({ milestones, twoSided = false }: { milestones: Milestone[]; twoSided?: boolean }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const sequence = sequenceRef.current;
    if (!timeline || !sequence || milestones.length < 2) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let position = timeline.scrollLeft;
    let inView = false;
    let hovered = false;
    let focused = false;
    let dragging = false;
    let pauseUntil = 0;

    const tick = (now: number) => {
      const elapsed = previousTime ? Math.min(now - previousTime, 100) : 0;
      previousTime = now;
      const loopWidth = sequence.offsetWidth;
      if (hovered || focused || dragging || now < pauseUntil) position = timeline.scrollLeft;
      else if (loopWidth > timeline.clientWidth) {
        // Keep fractional pixels between frames, while accepting manual scrolling.
        if (Math.abs(timeline.scrollLeft - position) > 1) position = timeline.scrollLeft;
        position = (position + elapsed * 24 / 1000) % loopWidth;
        timeline.scrollLeft = position;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const updatePlayback = () => {
      window.cancelAnimationFrame(frame);
      previousTime = 0;
      position = timeline.scrollLeft;
      if (inView && !motion.matches && !document.hidden) frame = window.requestAnimationFrame(tick);
    };
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") hovered = true; };
    const leave = () => { hovered = false; };
    const focus = () => { focused = timeline.matches(":focus-visible"); };
    const blur = () => { focused = false; };
    const press = () => { dragging = true; };
    const release = () => { if (dragging) { dragging = false; pauseUntil = performance.now() + 1500; } };
    const wheel = () => { pauseUntil = performance.now() + 1500; };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.1 });
    observer.observe(timeline);
    timeline.addEventListener("pointerenter", enter);
    timeline.addEventListener("pointerleave", leave);
    timeline.addEventListener("focusin", focus);
    timeline.addEventListener("focusout", blur);
    timeline.addEventListener("pointerdown", press);
    timeline.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      timeline.removeEventListener("pointerenter", enter);
      timeline.removeEventListener("pointerleave", leave);
      timeline.removeEventListener("focusin", focus);
      timeline.removeEventListener("focusout", blur);
      timeline.removeEventListener("pointerdown", press);
      timeline.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, [milestones.length]);

  return <div ref={timelineRef} className={`timeline-window ${twoSided ? "timeline-two-sided" : ""}`} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="AMSUL history timeline. Scroll horizontally for more milestones.">
    <div className="timeline-loop">{[false, true].map(duplicate => <div className="timeline-track" ref={duplicate ? undefined : sequenceRef} key={String(duplicate)} aria-hidden={duplicate || undefined}>
      <div className="timeline-ticks" aria-hidden="true">{Array.from({ length: 270 }, (_, index) => <i key={index} />)}</div>
      {milestones.map((milestone, index) => {
        const layout = twoSided ? twoSidedLayout[index] : undefined;
        const below = twoSided && index >= 4;
        const style: CSSProperties | undefined = layout ? { left: `calc(var(--gutter) + ${layout.left}px)`, height: layout.height, top: below ? 376 : 411 - layout.height } : undefined;
        return <article className={`milestone milestone-${index} ${below ? "milestone-below" : ""}`} style={style} key={milestone.id}>
          <div className="milestone-copy"><h3>{milestone.title}</h3><p>{milestone.description}</p></div><div className="milestone-stem" aria-hidden="true" /><p className="milestone-year">{milestone.year}<span aria-hidden="true" /></p>
        </article>;
      })}
    </div>)}</div>
  </div>;
}
