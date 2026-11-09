"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Milestone = { id: string; year: string; title: string; description: string };

const twoSidedLayout = [
  { left: 0, height: 354 }, { left: 441, height: 284 }, { left: 735, height: 354 }, { left: 1176, height: 354 },
  { left: 147, height: 411 }, { left: 588, height: 354 }, { left: 1029, height: 354 }, { left: 1323, height: 354 },
];

function MobileTimeline({ milestones }: { milestones: Milestone[] }) {
  const region = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [slide, setSlide] = useState({ current: 0, previous: -1, direction: 1 });
  const [paused, setPaused] = useState(false);
  const count = milestones.length;

  function move(direction: number) {
    setSlide(({ current }) => ({
      current: (current + direction + count) % count,
      previous: current,
      direction,
    }));
  }

  useEffect(() => {
    if (paused || count < 2 || !region.current) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!visible || document.hidden || motion.matches) return;
      timer = window.setTimeout(() => {
        setSlide(({ current }) => ({ current: (current + 1) % count, previous: current, direction: 1 }));
      }, 5000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }, { threshold: 0.25 });
    observer.observe(region.current);
    motion.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      motion.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [count, paused, slide]);

  return <div ref={region} className="timeline-mobile" role="region" aria-roledescription="carousel" aria-label="AMSUL history timeline">
    <div className={`timeline-mobile-slides${slide.previous >= 0 ? " has-transition" : ""}`} tabIndex={count > 1 ? 0 : undefined}
      aria-label="Milestones. Use the left and right arrow keys to navigate."
      aria-live={paused ? "polite" : "off"}
      onFocus={event => setPaused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setPaused(false)}
      onKeyDown={event => {
        if (count < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
        event.preventDefault();
        setPaused(true);
        move(event.key === "ArrowRight" ? 1 : -1);
      }}
      style={{ "--slide-direction": slide.direction } as CSSProperties}
      onTouchStart={event => {
        const touch = event.touches[0];
        touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
      }}
      onTouchEnd={event => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || count < 2) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      }}
      onTouchCancel={() => { touchStart.current = null; }}>
      <div className="timeline-ticks" aria-hidden="true" />
      {milestones.map((milestone, index) => {
        const active = index === slide.current;
        const outgoing = index === slide.previous;
        return <article key={milestone.id} className={`timeline-mobile-slide ${active ? "is-current" : outgoing ? "is-outgoing" : ""}`} aria-hidden={!active}>
          <div className="milestone-copy"><h3>{milestone.title}</h3><p>{milestone.description}</p></div>
          <p className="milestone-year">{milestone.year}<span aria-hidden="true" /></p>
        </article>;
      })}
    </div>
  </div>;
}

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

  return <>
    <MobileTimeline milestones={milestones} />
    <div ref={timelineRef} className={`timeline-window ${twoSided ? "timeline-two-sided" : ""}`} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="AMSUL history timeline. Scroll horizontally for more milestones.">
      <div className="timeline-loop">
        <div className="timeline-ticks" aria-hidden="true" />
        {[false, true].map(duplicate => <div className="timeline-track" ref={duplicate ? undefined : sequenceRef} key={String(duplicate)} aria-hidden={duplicate || undefined}>
          {milestones.map((milestone, index) => {
            const layout = twoSided ? twoSidedLayout[index] : undefined;
            const below = twoSided && index >= 4;
            const style: CSSProperties | undefined = layout ? { left: `calc(var(--gutter) + ${layout.left}px)`, height: layout.height, top: below ? 376 : 411 - layout.height } : undefined;
            return <article className={`milestone milestone-${index} ${below ? "milestone-below" : ""}`} style={style} key={milestone.id}>
              <div className="milestone-copy"><h3>{milestone.title}</h3><p>{milestone.description}</p></div><div className="milestone-stem" aria-hidden="true" /><p className="milestone-year">{milestone.year}<span aria-hidden="true" /></p>
            </article>;
          })}
        </div>)}
      </div>
    </div>
  </>;
}
