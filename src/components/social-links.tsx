"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./ui";

export type SocialLink = { label: string; href: string | null; icon: string; iconClassName?: string; newTab?: boolean; unavailableMessage?: string };
export function SocialLinks({ items, className = "social-icons" }: { items: SocialLink[]; className?: string }) {
  const [message, setMessage] = useState("");
  return <div className={className}>{items.map(item => {
    const icon = <Icon src={item.icon} className={item.iconClassName} />;
    return item.href ? item.href.startsWith("/") ? <Link key={item.label} href={item.href} aria-label={item.label}>{icon}</Link> : <a key={item.label} href={item.href} aria-label={item.label} target={item.newTab ? "_blank" : undefined} rel={item.newTab ? "noopener noreferrer" : undefined}>{icon}</a> : <button key={item.label} type="button" aria-label={item.label} onClick={() => setMessage(item.unavailableMessage || "This profile link has not been provided yet.")}>{icon}</button>;
  })}{message && <p className="social-link-status" role="status">{message}</p>}</div>;
}
