export type Sponsor = { id: string; name: string; logo: string; websiteUrl?: string | null };

export function Sponsors({ sponsors, id = "event-sponsors-title" }: { sponsors: Sponsor[]; id?: string }) {
  if (sponsors.length === 0) return null;
  return <section className="event-sponsors" aria-labelledby={id}><h2 id={id}>SPONSORS</h2><div className="event-sponsor-grid">{sponsors.map(sponsor => <div className="event-sponsor" key={sponsor.id}>{sponsor.logo && <img src={sponsor.logo} alt="" width={56} height={56} loading="lazy" />}<p>{sponsor.websiteUrl ? <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">{sponsor.name}</a> : sponsor.name}</p></div>)}</div></section>;
}
