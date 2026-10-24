export type GalleryPicture = { id: string; src: string | null; alt: string };

export function PictureGallery({ pictures }: { pictures: GalleryPicture[] }) {
  if (pictures.length === 0) return null;
  return <section className="picture-gallery" aria-labelledby="event-pictures-title"><h2 id="event-pictures-title">Pictures</h2><div className="picture-grid">{pictures.map(picture => <div className="picture-card" key={picture.id}>{picture.src ? <img src={picture.src} alt={picture.alt} loading="lazy" /> : <div className="picture-placeholder" aria-hidden="true" />}</div>)}</div></section>;
}
