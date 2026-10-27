import { Fragment, type ReactNode } from 'react';
import type { RichNode } from '@/lib/website/contracts';
import { safeLink } from '@/lib/website/selectors';
function renderNode(node: RichNode, key: number, depth = 0): ReactNode {
  if (!node || depth > 40) return null;
  const children = node.content?.map((child, index) => renderNode(child, index, depth + 1));
  if (node.type === 'text') {
    let text: ReactNode = node.text ?? '';
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') text = <strong>{text}</strong>;
      if (mark.type === 'italic') text = <em>{text}</em>;
      if (mark.type === 'underline') text = <u>{text}</u>;
      if (mark.type === 'strike') text = <s>{text}</s>;
      if (mark.type === 'code') text = <code>{text}</code>;
      if (mark.type === 'link') { const href = safeLink(String(mark.attrs?.href ?? '')); if (href) text = <a href={href} rel="noopener noreferrer">{text}</a>; }
    }
    return <Fragment key={key}>{text}</Fragment>;
  }
  switch (node.type) {
    case 'doc': return <Fragment key={key}>{children}</Fragment>;
    case 'paragraph': return <p key={key}>{children}</p>;
    case 'heading': { const Heading = `h${Math.max(2, Math.min(6, Number(node.attrs?.level) || 2))}` as 'h2'; return <Heading key={key}>{children}</Heading>; }
    case 'bulletList': return <ul key={key}>{children}</ul>;
    case 'orderedList': return <ol key={key}>{children}</ol>;
    case 'listItem': return <li key={key}>{children}</li>;
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>;
    case 'codeBlock': return <pre key={key}><code>{children}</code></pre>;
    case 'hardBreak': return <br key={key} />;
    case 'horizontalRule': return <hr key={key} />;
    case 'image': { const src = safeLink(String(node.attrs?.src ?? '')); return src ? <img key={key} src={src} alt={String(node.attrs?.alt ?? '')} loading="lazy" /> : null; }
    default: return <Fragment key={key}>{children}</Fragment>;
  }
}
export function RichContent({ body }: { body: RichNode | null }) {
  return <div className="rich-content editorial-text-block editorial-text-24">{body ? renderNode(body, 0) : <p>The full content is not available yet.</p>}</div>;
}
