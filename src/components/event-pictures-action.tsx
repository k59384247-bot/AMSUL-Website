"use client";

import { useState } from "react";
import { DetailActionCard } from "./detail-action-card";
import { Icon } from "./ui";

export function EventPicturesAction({ content, icon }: {
  content: { title: string; description: string; label: string; url: string | null }; icon: string;
}) {
  const [message, setMessage] = useState("");
  const label = <>{content.label}<span className="detail-action-out-icon"><Icon src={icon} /></span></>;
  return <DetailActionCard id="event-album-title" content={content} className="event-pictures-action">
    {content.url ? <a className="button detail-action-button" href={content.url} target="_blank" rel="noopener noreferrer">{label}</a> : <button className="button detail-action-button" onClick={() => setMessage("The event photo album link has not been provided yet. Please check back later.")}>{label}</button>}
    {message && <p className="detail-action-status" role="status">{message}</p>}
  </DetailActionCard>;
}
