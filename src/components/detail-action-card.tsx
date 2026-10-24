import type { ReactNode } from "react";

export function DetailActionCard({ id, content, children, className = "", registration }: {
  id: string; content: { title: string; description: string }; children: ReactNode; className?: string; registration?: "form" | "external";
}) {
  return <section className={`detail-action-card ${className}`} aria-labelledby={id} data-registration={registration}>
    <div className="detail-action-heading"><h2 id={id}>{content.title}</h2><p>{content.description}</p></div>{children}
  </section>;
}
