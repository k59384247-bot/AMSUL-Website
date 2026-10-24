import type { AttachmentFile, ContentSection } from "@/data/content";
import { AttachmentDownload } from "./attachment-download";

export function ArticleContent({ sections, attachments = [] }: { sections: ContentSection[]; attachments?: AttachmentFile[] }) {
  return <article className="editorial-content">{sections.map((section, index) => <section className={`editorial-text-block editorial-text-${section.size}`} key={index}>{index === 0 ? <h2>{section.title}</h2> : index === 1 ? <h3>{section.title}</h3> : <h4>{section.title}</h4>}<div>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>)}{attachments.length > 0 && <section className="editorial-attachments" aria-labelledby="attachments-title"><h2 id="attachments-title">Attachments</h2><div className="attachment-list">{attachments.map(file => <AttachmentDownload key={file.title} file={file} />)}</div></section>}</article>;
}
