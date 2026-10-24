"use client";

import { useState } from "react";
import type { AttachmentFile } from "@/data/content";
import { Icon } from "./ui";

export function BrochureDownload({ file, arrowSrc }: { file: AttachmentFile; arrowSrc: string }) {
  const [unavailable, setUnavailable] = useState(false);
  const content = <><span>Download Partnership Brochure</span><Icon src={arrowSrc} /></>;
  return <div className="brochure-download">{file.url ? <a className="button button-secondary" href={file.url} download>{content}</a> : <button type="button" className="button button-secondary" onClick={() => setUnavailable(true)}>{content}</button>}{unavailable && <p role="status">The partnership brochure file has not been provided yet.</p>}</div>;
}
