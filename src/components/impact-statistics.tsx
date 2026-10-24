type Statistic = { value: string; label: string; tone: string };

export function ImpactStatistics({ statistics, nodeId, repeatFirstRow = false, title = "Impact Changing The World" }: { statistics: Statistic[]; nodeId: string; repeatFirstRow?: boolean; title?: string }) {
  return <section id="impact" className="impact-section" aria-labelledby="impact-title" data-node-id={nodeId}>
    <h2 id="impact-title">{title}</h2><div className="impact-grid">{statistics.map((stat, index) => <div className="impact-column" key={stat.label}>
      {index % 2 === 1 && <div className="impact-empty" aria-hidden="true" />}
      <div className={`impact-stat tone-${stat.tone}`}><p>{stat.value}</p><h3>{stat.label}</h3></div>
      {index % 2 === 0 && <div className="impact-empty" aria-hidden="true" />}
      {repeatFirstRow && (index % 2 === 0 ? <div className={`impact-stat tone-${stat.tone}`}><p>{stat.value}</p><h3>{stat.label}</h3></div> : <div className="impact-empty" aria-hidden="true" />)}
    </div>)}</div>
  </section>;
}
