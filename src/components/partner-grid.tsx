import type { CSSProperties } from "react";

type Partner = {
  id: string;
  name: string;
  image: string;
  width?: number;
  height?: number;
  crop?: { width: number; height: number; left: number; top: number };
};

export function PartnerGrid({ partners, className = "" }: { partners: Partner[]; className?: string }) {
  return <div className={`partner-grid ${className}`.trim()}>{partners.map(partner => <div className="partner-cell" key={partner.id}>{partner.width && partner.height ? <div className="partner-logo-frame" style={{ "--logo-width": `${partner.width / 188 * 100}%`, "--logo-ratio": `${partner.width} / ${partner.height}` } as CSSProperties}><img src={partner.image} alt={partner.name} style={partner.crop ? { width: `${partner.crop.width}%`, height: `${partner.crop.height}%`, left: `${partner.crop.left}%`, top: `${partner.crop.top}%` } : undefined} /></div> : <img src={partner.image} width="80" height="80" alt={partner.name} />}</div>)}</div>;
}
