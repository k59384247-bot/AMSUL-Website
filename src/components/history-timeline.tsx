import type { CSSProperties } from "react";

type Milestone = { id: string; year: string; title: string; description: string };

const twoSidedLayout = [
  { left: 0, height: 354 }, { left: 441, height: 284 }, { left: 735, height: 354 }, { left: 1176, height: 354 },
  { left: 147, height: 411 }, { left: 588, height: 354 }, { left: 1029, height: 354 }, { left: 1323, height: 354 },
];

export function HistoryTimeline({ milestones, twoSided = false }: { milestones: Milestone[]; twoSided?: boolean }) {
  return <div className={`timeline-window ${twoSided ? "timeline-two-sided" : ""}`} tabIndex={0} role="region" aria-label="AMSUL history timeline. Scroll horizontally for more milestones.">
    <div className="timeline-track">
      <div className="timeline-ticks" aria-hidden="true">{Array.from({ length: 270 }, (_, index) => <i key={index} />)}</div>
      {milestones.map((milestone, index) => {
        const layout = twoSided ? twoSidedLayout[index] : undefined;
        const below = twoSided && index >= 4;
        const style: CSSProperties | undefined = layout ? { left: `calc(var(--gutter) + ${layout.left}px)`, height: layout.height, top: below ? 376 : 411 - layout.height } : undefined;
        return <article className={`milestone milestone-${index} ${below ? "milestone-below" : ""}`} style={style} key={milestone.id}>
          <div className="milestone-copy"><h3>{milestone.title}</h3><p>{milestone.description}</p></div><div className="milestone-stem" aria-hidden="true" /><p className="milestone-year">{milestone.year}<span aria-hidden="true" /></p>
        </article>;
      })}
    </div>
  </div>;
}
