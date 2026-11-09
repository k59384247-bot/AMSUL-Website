"use client";

import { useState } from "react";
import type { LeadershipMember } from "@/data/leadership";
import assets from "@/data/leadership-assets.json";
import { Icon, SectionHeading } from "./ui";
import { ProfileCard } from "./profile-card";

type LeadershipGroup = { id: string; title: string; description: string; nodeId: string; featured: LeadershipMember[]; additional: LeadershipMember[] };

export function LeadershipSection({ group, variant }: { group: LeadershipGroup; variant: "executive" | "patrons" | "committees" }) {
  const [expanded, setExpanded] = useState(variant === "patrons");
  const canExpand = group.featured.length > 0 && group.additional.length > 0;
  return <section className={`leadership-section leadership-${variant} section`} aria-label={group.title} data-node-id={group.nodeId}>
    <div className="leadership-featured"><SectionHeading eyebrow="" title={group.title} description={group.description} centered={variant !== "executive"} /><div className="leadership-featured-cards">{(group.featured.length ? group.featured : group.additional).map(member => <ProfileCard key={member.id} member={member} large={variant !== "committees"} executive={variant === "executive"} />)}</div></div>
    {canExpand && <div id={`${group.id}-additional`} className="leadership-additional" hidden={!expanded}>{group.additional.map(member => <ProfileCard key={member.id} member={member} executive={variant === "executive"} />)}</div>}
    {canExpand && <button type="button" className="leadership-view-all" aria-expanded={expanded} aria-controls={`${group.id}-additional`} onClick={() => setExpanded(value => !value)}><span>{expanded ? "View Less" : "View All"}</span><span className={expanded ? "leadership-chevron expanded" : "leadership-chevron"}><Icon src={assets.imgOcticonChevronDown12} /></span></button>}
  </section>;
}
