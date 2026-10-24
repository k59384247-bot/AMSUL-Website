import type { ReactNode } from "react";
import assets from "@/data/assets.json";
import { SiteHeader } from "./site-header";
import { Icon } from "./ui";

export function HeroBadge({ children }: { children: ReactNode }) {
  return <p className="hero-badge"><Icon src={assets["hero-imgGroup"]} className="stethoscope-icon" />{children}</p>;
}

export function Hero({ badge, title, introduction, description, centered = false, nodeId }: {
  badge: string; title: ReactNode; introduction?: ReactNode; description?: string; centered?: boolean; nodeId: string;
}) {
  return <section className={`hero ${centered ? "hero-centered" : ""} ${description ? "hero-with-description" : ""}`} aria-labelledby="hero-title" data-node-id={nodeId}>
    <div className="hero-inner">
      <div className="hero-image" aria-hidden="true"><img src={assets["hero-imgHb13571"]} alt="" fetchPriority="high" /><div className="hero-shade" /></div>
      <SiteHeader hero />
      <div className="hero-content container">
        <div className="hero-heading"><HeroBadge>{badge}</HeroBadge><h1 id="hero-title">{title}</h1>{description && <p className="hero-subheadline">{description}</p>}</div>
        {introduction && <div className="hero-introduction">{introduction}</div>}
      </div>
    </div>
  </section>;
}
