import { SiteHeader } from "./site-header";
import { ButtonLink } from "./ui";

export function PlannedPage({ title }: { title: string }) {
  return <><SiteHeader /><main id="main-content" className="temporary-page container"><p className="eyebrow">Page coming soon</p><h1>{title}</h1><p>This page is planned. Its design and content will be added as the AMSUL website takes shape.</p><ButtonLink href="/">Back to the homepage</ButtonLink></main></>;
}
