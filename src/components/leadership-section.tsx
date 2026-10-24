"use client";

import { useState } from "react";
import type { LeadershipMember } from "@/data/leadership";
import assets from "@/data/leadership-assets.json";
import { Icon, SectionHeading } from "./ui";
import { ProfileCard } from "./profile-card";

type LeadershipGroup = { id: string; title: string; description: string; nodeId: string; featured: LeadershipMember[]; additional: LeadershipMember[] };

export function LeadershipSection({ group, variant }: { group: LeadershipGroup; variant: "executive" | "patrons" | "committees" }) {
  const [expanded, setExpanded] = useState(false);
  const [allShown, setAllShown] = useState(false);
  const showProfile = variant !== "patrons";
  return <section className={`leadership-section leadership-${variant} section`} aria-label={group.title} data-node-id={group.nodeId}>
    <div className="leadership-featured"><SectionHeading eyebrow="" title={group.title} description={group.description} centered={variant !== "executive"} /><div className="leadership-featured-cards">{group.featured.map(member => <ProfileCard key={member.id} member={member} large={variant !== "committees"} showProfile={showProfile} />)}</div></div>
    <button type="button" className="leadership-view-all" aria-expanded={group.additional.length ? expanded : undefined} aria-controls={group.additional.length ? `${group.id}-additional` : undefined} onClick={() => group.additional.length ? setExpanded(!expanded) : setAllShown(true)}><span>{expanded ? "View Less" : "View All"}</span><span className={expanded ? "leadership-chevron expanded" : "leadership-chevron"}><Icon src={assets.imgOcticonChevronDown12} /></span></button>
    {group.additional.length > 0 && <div id={`${group.id}-additional`} className="leadership-additional" hidden={!expanded}>{group.additional.map(member => <ProfileCard key={member.id} member={member} showProfile={showProfile} />)}</div>}
    {allShown && <p className="leadership-status" role="status">All {group.featured.length} available committee heads are shown.</p>}
  </section>;
}
