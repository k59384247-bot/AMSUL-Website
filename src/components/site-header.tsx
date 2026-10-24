"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import assets from "@/data/assets.json";
import { navigation } from "@/data/site";
import { ButtonLink, Icon } from "./ui";

export function SiteHeader({ hero = false, className = "" }: { hero?: boolean; className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function closeMenus(event: MouseEvent | KeyboardEvent) {
      if ((event instanceof KeyboardEvent && event.key === "Escape") ||
        (event instanceof MouseEvent && !root.current?.contains(event.target as Node))) {
        if (event instanceof KeyboardEvent) {
          const trigger = root.current?.querySelector(".main-navigation.is-open")
            ? root.current?.querySelector<HTMLButtonElement>(".menu-toggle")
            : document.activeElement?.closest("details")?.querySelector("summary");
          trigger?.focus();
        }
        root.current?.querySelectorAll("details[open]").forEach(node => node.removeAttribute("open"));
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", closeMenus);
    return () => {
      document.removeEventListener("click", closeMenus);
      document.removeEventListener("keydown", closeMenus);
    };
  }, []);

  function closeOnNavigate() {
    setMobileOpen(false);
    root.current?.querySelectorAll("details[open]").forEach(node => node.removeAttribute("open"));
  }

  return <header ref={root} className={`site-header ${hero ? "header-hero" : ""} ${className}`}>
    <div className="header-inner container">
      <Link href="/" className="brand" aria-label="AMSUL home" onClick={closeOnNavigate}>
        <img src={assets["hero-imgAmsul60Logo4"]} alt="AMSUL at 60" width="104" height="80" />
      </Link>
      <button className="menu-toggle" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="main-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
        <span className={`menu-toggle-icon ${mobileOpen ? "is-open" : ""}`} aria-hidden="true"><i /><i /><i /></span>
      </button>
      <nav id="main-navigation" className={`main-navigation ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {navigation.map(group => <details key={group.label} className="nav-group" name="main-navigation-group">
          <summary>{group.label}<Icon src={assets["hero-imgChevron"]} className="chevron" /></summary>
          <div className="nav-dropdown">
            {group.links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={closeOnNavigate}>{link.label}</Link>)}
          </div>
        </details>)}
        <div className="mobile-partner" onClick={closeOnNavigate}><ButtonLink href="/partnerships/become-a-partner">Partner With AMSUL</ButtonLink></div>
      </nav>
      <ButtonLink href="/partnerships/become-a-partner" className="header-partner">Partner With AMSUL</ButtonLink>
    </div>
  </header>;
}
