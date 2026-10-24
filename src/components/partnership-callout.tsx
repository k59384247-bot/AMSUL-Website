import { partnershipCallout } from "@/data/site";
import { ButtonLink, SectionHeading } from "./ui";

const defaultActions = [
  { label: "Meet Our Leadership", href: "/leadership" },
  { label: "Partner With AMSUL", href: "/partnerships/become-a-partner", secondary: true, arrow: true },
];

export function PartnershipCallout({ nodeId, content = partnershipCallout, actions = defaultActions }: {
  nodeId: string; content?: typeof partnershipCallout;
  actions?: { label: string; href: string; secondary?: boolean; arrow?: boolean }[];
}) {
  return <section className="partnership-callout container" data-node-id={nodeId}><div className="partnership-callout-panel"><SectionHeading {...content} centered /><div className="button-row">{actions.map(({ label, ...action }) => <ButtonLink key={action.href} {...action}>{label}</ButtonLink>)}</div></div></section>;
}
