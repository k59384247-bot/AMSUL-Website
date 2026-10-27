import type { AttachmentFile, ContentSection } from "@/data/content";
import { RichContent } from "./rich-content";
import type { RichNode } from "@/lib/website/contracts";
import { AttachmentDownload } from "./attachment-download";

export function ArticleContent({ sections = [], attachments = [], body }: { sections?: ContentSection[]; attachments?: AttachmentFile[]; body?: RichNode | null }) {
  return <article className="editorial-content">{body !== undefined && <RichContent body={body} />}{sections.map((section, index) => <section className={`editorial-text-block editorial-text-${section.size}`} key={index}>{index === 0 ? <h2>{section.title}</h2> : index === 1 ? <h3>{section.title}</h3> : <h4>{section.title}</h4>}<div>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>)}{attachments.length > 0 && <section className="editorial-attachments" aria-labelledby="attachments-title"><h2 id="attachments-title">Attachments</h2><div className="attachment-list">{attachments.map(file => <AttachmentDownload key={file.title} file={file} />)}</div></section>}</article>;
}
