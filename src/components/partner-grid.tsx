export function PartnerGrid({ partners }: { partners: { id: string; name: string; image: string }[] }) {
  return <div className="partner-grid">{partners.map(partner => <div className="partner-cell" key={partner.id}><img src={partner.image} width="80" height="80" alt={partner.name} /></div>)}</div>;
}
