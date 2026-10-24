"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import assets from "@/data/assets.json";
import { contact, navigation } from "@/data/site";
import { Icon } from "./ui";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  const [message, setMessage] = useState("");

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // shortcut: no subscription service is connected; never claim an email was subscribed.
    setMessage("Newsletter signup will be available when the website launches. Your email has not been submitted.");
  }

  return <footer className="site-footer">
    <div className="container">
      <div className="footer-main">
        <div className="footer-contact">
          <Link className="brand" href="/" aria-label="AMSUL home"><img src={assets["footer-imgAmsul60Logo4"]} alt="AMSUL at 60" width="104" height="80" /></Link>
          <div className="contact-row">
            <SocialLinks items={[
              { label: "AMSUL on Instagram", href: "https://www.instagram.com/amsul_unilag/", icon: assets["footer-imgRiInstagramFill"] },
              { label: "AMSUL on X", href: "https://x.com/amsul_unilag", icon: assets["footer-imgFa6BrandsSquareXTwitter"] },
              { label: "AMSUL LinkedIn contact details", href: "/contact", icon: assets["footer-imgGroup"], iconClassName: "linkedin-icon" },
            ]} />
            <span>{contact.socialLabel}</span>
            <a className="email-link" href={`mailto:${contact.email}`}><span className="email-icon"><Icon src={assets["footer-imgDashiconsEmailAlt"]} /></span>{contact.email}</a>
          </div>
          <div className="newsletter">
            <p>{contact.newsletterText}</p>
            <form onSubmit={subscribe} className="newsletter-form">
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="Enter your email" aria-describedby={message ? "newsletter-status" : undefined} />
              <button className="button" type="submit">Subscribe</button>
            </form>
            <p id="newsletter-status" className="newsletter-status" role="status">{message}</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <div className="footer-link-group"><p>{navigation[0].footerLabel}</p>{navigation[0].links.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div>
          <div className="footer-link-group"><p>{navigation[1].footerLabel}</p>{navigation[1].links.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div>
          <div className="footer-link-stack">{navigation.slice(2).map(group => <div className="footer-link-group" key={group.label}><p>{group.footerLabel}</p>{group.links.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div>)}</div>
        </nav>
      </div>
      <img className="footer-divider" src={assets["footer-imgLine3"]} alt="" aria-hidden="true" />
      <div className="footer-bottom"><p>Powered by: <a href="https://strukthq.com">StruktHQ</a></p><p>© 2026 AMSUL. All rights reserved.</p></div>
    </div>
  </footer>;
}
