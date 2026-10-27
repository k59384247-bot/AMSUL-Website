"use client";

import { useState } from "react";
import type { AttachmentFile } from "@/data/content";
import assets from "@/data/report-detail-assets.json";
import { Icon } from "./ui";

export function AttachmentDownload({ file, primary = false }: { file: AttachmentFile; primary?: boolean }) {
  const [unavailable, setUnavailable] = useState(false);
  const label = primary ? "Download Report" : "Download";
  const content = <><Icon src={assets.imgMaterialSymbolsDownloadRounded} /><span>{label}</span></>;
  return <div className={`attachment-download ${primary ? "primary-download" : ""}`}>
    <div className="attachment-row"><div className="attachment-name"><span className="file-icon"><Icon src={file.format === "pdf" ? assets.imgMaterialIconThemePdf : assets.imgSelfhstGoogleSlides} /></span>{!primary && <span>{file.title}</span>}</div>
      {file.url ? <a className="button download-button" href={file.url} download={file.title} aria-label={`Download ${file.title}`}>{content}</a> : <button className="button download-button" aria-label={`Download ${file.title}`} onClick={() => setUnavailable(true)}>{content}</button>}
    </div>
    {unavailable && <p className="download-status" role="status">The file for “{file.title}” is not available yet.</p>}
  </div>;
}
