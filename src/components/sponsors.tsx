export type Sponsor = { id: string; name: string; logo: string };

export function Sponsors({ sponsors, id = "event-sponsors-title" }: { sponsors: Sponsor[]; id?: string }) {
  if (sponsors.length === 0) return null;
  return <section className="event-sponsors" aria-labelledby={id}><h2 id={id}>SPONSORS</h2><div className="event-sponsor-grid">{sponsors.map(sponsor => <div className="event-sponsor" key={sponsor.id}><img src={sponsor.logo} alt="" width={56} height={56} /><p>{sponsor.name}</p></div>)}</div></section>;
}
