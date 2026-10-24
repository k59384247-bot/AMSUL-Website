"use client";

import { useState } from "react";
import type { LeadershipMember } from "@/data/leadership";

export function ProfileCard({ member, large = false, showProfile = true }: { member: LeadershipMember; large?: boolean; showProfile?: boolean }) {
  const [opened, setOpened] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  return <article className={`profile-card ${large ? "profile-card-large" : ""}`} data-node-id={member.nodeId}>
    <div className="profile-portrait">{member.imageUrl && !imageFailed && <img src={member.imageUrl} alt={member.name} onError={() => setImageFailed(true)} loading="lazy" />}</div>
    <div className="profile-card-information"><div><h3>{member.name}</h3><p>{member.position}</p></div>{showProfile && <button type="button" className="profile-button" aria-expanded={opened} aria-controls={`${member.id}-bio`} onClick={() => setOpened(!opened)}>View Profile</button>}</div>
    {opened && <p className="profile-bio" id={`${member.id}-bio`} role="status">{member.bio || "Full profile content has not been provided yet."}</p>}
  </article>;
}
