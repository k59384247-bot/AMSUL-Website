import { landingImageSrcSet } from "@/lib/landing-image";

type Statistic = { value: string; label: string; tone: string; image?: string };
type ImpactStatisticsProps = {
  statistics: Statistic[];
  nodeId: string;
  repeatFirstRow?: boolean;
  title?: string;
  eyebrow?: string;
  description?: string;
  layout?: "staggered" | "row";
};

export function ImpactStatistics({ statistics, nodeId, repeatFirstRow = false, title = "Impact Changing The World", eyebrow, description, layout = "staggered" }: ImpactStatisticsProps) {
  if (layout === "row") return <section id="impact" className="impact-section impact-section-row" aria-labelledby="impact-title" data-node-id={nodeId}>
    <div className="impact-section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id="impact-title">{title}</h2>
      {description && <p className="impact-section-description">{description}</p>}
    </div>
    <div className="impact-grid impact-grid-row">{statistics.map(stat => <div className={`impact-stat tone-${stat.tone}`} key={stat.label}><p>{stat.value}</p><h3>{stat.label}</h3></div>)}</div>
  </section>;

  return <section id="impact" className="impact-section" aria-labelledby="impact-title" data-node-id={nodeId}>
    <h2 id="impact-title">{title}</h2><div className="impact-grid">{statistics.map((stat, index) => <div className="impact-column" key={stat.label}>
      {index % 2 === 1 && <div className="impact-empty" aria-hidden="true">{stat.image && <img src={stat.image} srcSet={stat.image.startsWith("/assets/landing-2026/") ? landingImageSrcSet(stat.image) : undefined} sizes="(max-width: 700px) 100vw, 720px" alt="" loading="lazy" />}</div>}
      <div className={`impact-stat tone-${stat.tone}`}><p>{stat.value}</p><h3>{stat.label}</h3></div>
      {index % 2 === 0 && <div className="impact-empty" aria-hidden="true">{stat.image && <img src={stat.image} srcSet={stat.image.startsWith("/assets/landing-2026/") ? landingImageSrcSet(stat.image) : undefined} sizes="(max-width: 700px) 100vw, 720px" alt="" loading="lazy" />}</div>}
      {repeatFirstRow && (index % 2 === 0 ? <div className={`impact-stat tone-${stat.tone}`}><p>{stat.value}</p><h3>{stat.label}</h3></div> : <div className="impact-empty" aria-hidden="true">{stat.image && <img src={stat.image} srcSet={stat.image.startsWith("/assets/landing-2026/") ? landingImageSrcSet(stat.image) : undefined} sizes="(max-width: 700px) 100vw, 720px" alt="" loading="lazy" />}</div>)}
    </div>)}</div>
  </section>;
}
