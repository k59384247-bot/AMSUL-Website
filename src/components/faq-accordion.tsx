"use client";

import { useState } from "react";
import { Icon } from "./ui";

export function FaqAccordion({ items, plusIcon, minusIcon }: { items: { id: string; question: string; paragraphs: string[] }[]; plusIcon: string; minusIcon: string }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);
  return <div className="faq-list">{items.map(item => <section key={item.id} className="faq-item"><h3><button id={`${item.id}-question`} aria-expanded={openId === item.id} aria-controls={`${item.id}-answer`} onClick={() => setOpenId(openId === item.id ? null : item.id)}>{item.question}<span className="faq-icon"><Icon src={openId === item.id ? minusIcon : plusIcon} /></span></button></h3><div id={`${item.id}-answer`} className="faq-answer" role="region" aria-labelledby={`${item.id}-question`} hidden={openId !== item.id}>{item.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>)}</div>;
}
