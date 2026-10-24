import Link from "next/link";
import type { ReactNode } from "react";
import assets from "@/data/assets.json";

export function Icon({ src, className = "" }: { src: string; className?: string }) {
  return <img className={`icon ${className}`} src={src} alt="" aria-hidden="true" />;
}

export function ButtonLink({ href, children, secondary = false, arrow = false, arrowSrc, className = "" }: {
  href: string; children: ReactNode; secondary?: boolean; arrow?: boolean; arrowSrc?: string; className?: string;
}) {
  return <Link href={href} className={`button ${secondary ? "button-secondary" : ""} ${className}`}>
    <span>{children}</span>
    {arrow && <Icon src={arrowSrc || assets[secondary ? "hero-imgPajamasArrowRight1" : "hero-imgPajamasArrowRight"]} />}
  </Link>;
}

export function SectionHeading({ eyebrow, title, description, centered = false, children }: {
  eyebrow: string; title: string; description?: string; centered?: boolean; children?: ReactNode;
}) {
  return <div className={`section-heading-row ${centered ? "heading-centered" : ""}`}>
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
    {children}
  </div>;
}

export function Tag({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
  return <span className="tag">{dot && <span className="tag-dot" aria-hidden="true" />}{children}</span>;
}

export function ReservedSection({ id }: { id: string }) {
  return <section className="reserved-section container" aria-label="Reserved content" data-node-id={id}>
    <div className="reserved-panel" aria-hidden="true" />
  </section>;
}
