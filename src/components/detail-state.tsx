'use client';
import Link from 'next/link';
import { SiteHeader } from './site-header';
export function DetailState({ error, missing, retry }: { error?: string; missing?: boolean; retry?: () => void }) {
  return <><SiteHeader className="detail-header" /><main id="main-content" className="container section data-status">{missing ? <><h1>Content not found</h1><p>This record is no longer available.</p><Link className="button" href="/">Return to Home</Link></> : error ? <div role="alert"><h1>Content unavailable</h1><p>{error}</p><button className="button" onClick={retry}>Try again</button></div> : <p role="status">Loading content…</p>}</main></>;
}
