"use client";

import { useState } from "react";
import { leadershipPage, type LeadershipMember } from "@/data/leadership";
import assets from "@/data/leadership-assets.json";
import { Icon, SectionHeading } from "./ui";
import { ProfileCard } from "./profile-card";

type LeadershipGroup = { id: string; title: string; description: string; nodeId: string; featured: LeadershipMember[]; additional: LeadershipMember[] };

export function LeadershipSection({ group, variant }: { group: LeadershipGroup; variant: "executive" | "patrons" | "committees" }) {
  const [expanded, setExpanded] = useState(variant === "patrons");
  const canExpand = group.featured.length > 0 && group.additional.length > 0;
  return <section className={`leadership-section leadership-${variant} section`} aria-label={group.title} data-node-id={group.nodeId}>
    <div className="leadership-featured">{variant === "executive" ? <div className="leadership-executive-intro"><SectionHeading eyebrow="" title={group.title} description={group.description} /><a className="button button-secondary leadership-past-presidents" href={leadershipPage.pastPresidentsUrl} target="_blank" rel="noopener noreferrer" aria-label="View Past Presidents (opens in a new tab)"><span>View Past Presidents</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg></a></div> : <SectionHeading eyebrow="" title={group.title} description={group.description} centered />}<div className="leadership-featured-cards">{(group.featured.length ? group.featured : group.additional).map(member => <ProfileCard key={member.id} member={member} large={variant !== "committees"} executive={variant === "executive"} />)}</div></div>
    {canExpand && <div id={`${group.id}-additional`} className="leadership-additional" hidden={!expanded}>{group.additional.map(member => <ProfileCard key={member.id} member={member} executive={variant === "executive"} />)}</div>}
    {canExpand && <button type="button" className="leadership-view-all" aria-expanded={expanded} aria-controls={`${group.id}-additional`} onClick={() => setExpanded(value => !value)}><span>{expanded ? "View Less" : "View All"}</span><span className={expanded ? "leadership-chevron expanded" : "leadership-chevron"}><Icon src={assets.imgOcticonChevronDown12} /></span></button>}
  </section>;
}
