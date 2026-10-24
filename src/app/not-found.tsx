import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return <><SiteHeader /><main id="main-content" className="temporary-page container"><p className="eyebrow">404</p><h1>Page not found</h1><p>We couldn't find that page.</p><ButtonLink href="/">Back to the homepage</ButtonLink></main></>;
}
