import { about } from "@/data/about";
import { landingImageSrcSet } from "@/lib/landing-image";
import { partnershipCallout, partnershipFormUrl } from "@/data/site";
import { ButtonLink, SectionHeading } from "./ui";

const defaultActions = [
  { label: "Meet Our Leadership", href: "/leadership" },
  { label: "Partner With AMSUL", href: partnershipFormUrl, secondary: true, arrow: true },
];

export function PartnershipCallout({ nodeId, content = partnershipCallout, actions = defaultActions, backgroundImage = about.calloutImage }: {
  nodeId: string; content?: typeof partnershipCallout; backgroundImage?: string;
  actions?: { label: string; href: string; secondary?: boolean; arrow?: boolean }[];
}) {
  return <section className="partnership-callout container" data-node-id={nodeId}><div className={`partnership-callout-panel ${backgroundImage ? "has-background" : ""}`}>{backgroundImage && <img className="partnership-callout-background" src={backgroundImage} srcSet={landingImageSrcSet(backgroundImage)} sizes="(max-width: 700px) 100vw, 1248px" alt="" loading="lazy" />}<SectionHeading {...content} centered /><div className="button-row">{actions.map(({ label, ...action }) => <ButtonLink key={action.href} {...action}>{label}</ButtonLink>)}</div></div></section>;
}
