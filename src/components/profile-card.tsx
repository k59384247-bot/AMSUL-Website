"use client";

import { useEffect, useId, useRef, useState } from "react";
import responsiveImages from "@/data/leadership-responsive.json";
import type { LeadershipMember, LeadershipSocialPlatform } from "@/data/leadership";

const socialLabels: Record<LeadershipSocialPlatform, string> = { instagram: "Instagram", linkedin: "LinkedIn", x: "X", tiktok: "TikTok" };
function SocialIcon({ platform }: { platform: LeadershipSocialPlatform }) {
  if (platform === "linkedin") return <span className="profile-social-icon"><img src="/assets/leadership-2026/linkedin.svg" alt="" /></span>;
  return <span className="profile-social-icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{platform === "instagram" ? <><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.7" r="1.2" fill="currentColor" /></> : platform === "x" ? <path fill="currentColor" d="M18.9 3h2.8l-6.1 7 7.2 11h-5.6l-4.4-6.8L6.9 21H4l6.5-7.5L3.6 3h5.8l4 6.2L18.9 3Zm-1 16h1.5L8.1 4.9H6.5L17.9 19Z" /> : <path fill="currentColor" d="M14.2 3h3.1c.2 2.2 1.5 3.7 3.7 4v3.2a9.6 9.6 0 0 1-3.7-1.1v6.6a5.8 5.8 0 1 1-5.8-5.8c.5 0 1 .1 1.4.2v3.3a2.6 2.6 0 1 0 1.3 2.3V3Z" />}</svg></span>;
}

// Balance the complete portrait against the actual biography before limiting scrolling to the viewport.
function fitProfileDialog(node: HTMLDialogElement) {
  const image = node.querySelector<HTMLImageElement>(".profile-dialog-portrait img");
  const heading = node.querySelector<HTMLElement>(".profile-dialog-heading")!;
  const biography = node.querySelector<HTMLElement>(".profile-bio")!;
  const content = node.querySelector<HTMLElement>(".profile-dialog-content")!;
  const mobile = window.matchMedia("(max-width:700px)").matches;
  const style = getComputedStyle(node);
  const padding = parseFloat(style.paddingTop) * 2 + parseFloat(style.borderTopWidth) * 2;
  const gap = parseFloat(style.gap);
  const contentGap = parseFloat(getComputedStyle(content).gap);
  const ratio = image?.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1;
  const maxWidth = window.innerWidth - (mobile ? 32 : 48);
  const maxHeight = window.innerHeight - (mobile ? 32 : 64);
  const setSize = (width: number, height: number, portraitWidth: number) => {
    node.style.setProperty("--profile-width", `${width}px`);
    node.style.setProperty("--profile-height", `${height}px`);
    node.style.setProperty("--profile-portrait-width", `${portraitWidth}px`);
  };
  const textHeight = () => heading.getBoundingClientRect().height + contentGap + biography.scrollHeight;
  if (mobile) {
    let portraitWidth = maxWidth - padding;
    // On shorter screens, shrink the entire modal with the full portrait, keeping room for its text.
    for (let step = 0; step < 4; step++) {
      setSize(portraitWidth + padding, maxHeight, portraitWidth);
      const available = Math.max(0, maxHeight - padding - gap - heading.getBoundingClientRect().height - contentGap - 80);
      const fittedWidth = Math.min(portraitWidth, available * ratio);
      if (fittedWidth >= portraitWidth - 1) break;
      portraitWidth = fittedWidth;
    }
    setSize(portraitWidth + padding, Math.min(maxHeight, portraitWidth / ratio + gap + textHeight() + padding), portraitWidth);
    return;
  }
  const minTextWidth = Math.min(320, (maxWidth - padding - gap) / 2);
  const maxPortraitHeight = Math.min(maxHeight - padding, (maxWidth - padding - gap - minTextWidth) / ratio);
  let portraitHeight = Math.min(320, maxPortraitHeight);
  for (let step = 0; step < 12; step++) {
    const portraitWidth = portraitHeight * ratio;
    setSize(Math.min(maxWidth, portraitWidth + Math.max(440, portraitHeight * 1.1) + gap + padding), portraitHeight + padding, portraitWidth);
    const needed = textHeight();
    if (needed <= portraitHeight + 1 || portraitHeight >= maxPortraitHeight) break;
    portraitHeight = Math.min(maxPortraitHeight, Math.max(portraitHeight + 32, Math.min(needed, portraitHeight * 1.25)));
  }
}

export function ProfileCard({ member, large = false, executive = false }: { member: LeadershipMember; large?: boolean; executive?: boolean }) {
  const [opened, setOpened] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const responsive = member.imageUrl ? responsiveImages[member.imageUrl as keyof typeof responsiveImages] : undefined;
  useEffect(() => {
    if (!opened) return;
    const node = dialog.current;
    const previousOverflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    if (!node) return;
    let frame = 0;
    let disposed = false;
    const resize = () => { cancelAnimationFrame(frame); if (!disposed) frame = requestAnimationFrame(() => fitProfileDialog(node)); };
    const image = node.querySelector(".profile-dialog-portrait img");
    resize();
    window.addEventListener("resize", resize);
    image?.addEventListener("load", resize);
    void document.fonts.ready.then(resize);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      image?.removeEventListener("load", resize);
      node.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [opened, member.bio, member.name, member.position, imageFailed]);
  return <article className={`profile-card ${large ? "profile-card-large" : ""}`} data-node-id={member.nodeId}>
    <div className="profile-portrait">{member.imageUrl && !imageFailed && <img src={member.imageUrl} srcSet={responsive ? `${responsive.src} ${responsive.width}w, ${member.imageUrl} ${responsive.fullWidth}w` : undefined} sizes="(max-width: 700px) 100vw, 400px" alt={member.name} onError={() => setImageFailed(true)} loading="lazy" />}</div>
    <div className="profile-card-information"><div><h3>{member.cardName ?? member.name}</h3><p>{member.position}</p></div>{executive && <div className="profile-actions"><button type="button" className="profile-action" aria-haspopup="dialog" onClick={() => setOpened(true)}>Read Bio</button>{member.socialLinks?.map(({ platform, url }) => <a key={`${platform}-${url}`} className="profile-social-action" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on ${socialLabels[platform]}`}><SocialIcon platform={platform} /></a>)}</div>}</div>
    {executive && <dialog ref={dialog} className="profile-dialog" aria-labelledby={titleId} onClose={() => setOpened(false)} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpened(false); } }}>
      <button type="button" className="profile-dialog-close" autoFocus onClick={() => setOpened(false)} aria-label="Close profile"><span aria-hidden="true">×</span></button>
      <div className="profile-dialog-portrait">{member.imageUrl && !imageFailed ? <img src={member.imageUrl} alt={member.name} onError={() => setImageFailed(true)} /> : <span aria-hidden="true">{member.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("")}</span>}</div>
      <div className="profile-dialog-content"><div className="profile-dialog-heading"><p>{member.position}</p><h2 id={titleId}>{member.name}</h2></div>
        <div className="profile-bio-scroll" tabIndex={0} role="region" aria-label={`${member.name} biography`}><p className="profile-bio">{member.bio || "Full profile content has not been provided yet."}</p></div>
      </div>
    </dialog>}
  </article>;
}
