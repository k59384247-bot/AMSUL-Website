'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fixtureFeed, fixtureDetail } from '@/lib/website/fixtures';
import { validateFeed, unwrap, type Feed, type Detail } from '@/lib/website/contracts';
const source = process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE ?? 'local';
const HOUR = 60 * 60 * 1000;
const empty: Feed = { posts: [], categories: [], events: [], programs: [], executives: [] };
let cachedFeed: { data: Feed; at: number; revision: string } | null = null;
const feedRequests = new Map<string, Promise<Feed>>();
let knownRevision: string | null = null;
const details = new Map<string, { data: Detail; at: number }>();
const detailRequests = new Map<string, Promise<Detail>>();
async function read(url: string, onAge?: (age: number) => void) {
  const response = await fetch(url, { credentials: 'omit', cache: 'no-store' });
  const value: unknown = await response.json();
  onAge?.(Math.max(0, Number(response.headers.get("Age")) || 0));
  if (!response.ok) { unwrap(value); throw new Error('Content unavailable.'); }
  return value;
}
function loadFeed(revision: string) {
  if (knownRevision !== revision) { details.clear(); knownRevision = revision; }
  if (cachedFeed?.revision !== revision) cachedFeed = null;
  if (!cachedFeed && typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(sessionStorage.getItem('amsul:public-feed:v2') || 'null');
      if (stored?.revision === revision && Date.now() - stored.at >= 0 && Date.now() - stored.at < HOUR) cachedFeed = { data: validateFeed({ success: true, data: stored.data }), at: stored.at, revision };
    } catch { /* Browser storage is optional. */ }
  }
  if (cachedFeed && Date.now() - cachedFeed.at < HOUR) return Promise.resolve(cachedFeed.data);
  if (!feedRequests.has(revision)) {
    let age = 0;
    const request = read('/api/website/feed', value => { age = value; }).then(value => {
      const data = validateFeed(value);
      if (knownRevision === revision) {
        cachedFeed = { data, at: Date.now() - age * 1000, revision };
        try { sessionStorage.setItem('amsul:public-feed:v2', JSON.stringify(cachedFeed)); } catch { /* Optional public cache. */ }
      }
      return data;
    }).finally(() => { feedRequests.delete(revision); });
    feedRequests.set(revision, request);
  }
  return feedRequests.get(revision)!;
}
const Context = createContext({ feed: empty, loading: true, error: '', revision: '', retry: () => {} });
export function WebsiteDataProvider({ children }: { children: ReactNode }) {
  const local = source === 'local';
  const [feed, setFeed] = useState<Feed>(local ? fixtureFeed : empty);
  const [loading, setLoading] = useState(!local);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [revision, setRevision] = useState(local ? 'local' : '');
  useEffect(() => {
    if (local) return;
    if (source !== 'api') { setLoading(false); setError('The website data source is not configured correctly.'); return; }
    let active = true;
    let refreshing = false;
    const refresh = async () => {
      if (refreshing) return; refreshing = true;
      try {
        const version = unwrap<{ revision: string }>(await read('/api/website/version'));
        if (!/^\d{1,32}$/.test(version.revision)) throw new Error('Invalid content revision.');
        const data = await loadFeed(version.revision);
        if (active) { setFeed(data); setRevision(version.revision); setError(''); }
      } catch { if (active) setError('Content is temporarily unavailable. Please try again.'); }
      finally { refreshing = false; if (active) setLoading(false); }
    };
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    const focus = () => { void refresh(); };
    window.addEventListener('focus', focus);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', focus); };
  }, [local, attempt]);
  const retry = () => { setLoading(true); setAttempt(value => value + 1); };
  return <Context.Provider value={{ feed, loading, error, revision, retry }}>{children}</Context.Provider>;
}
export const useWebsiteData = () => useContext(Context);
export function DataStatus() {
  const { loading, error, retry } = useWebsiteData();
  return loading ? <p className="container data-status" role="status">Loading content…</p> : error ? <div className="container data-status" role="alert"><p>{error}</p><button className="button" onClick={retry}>Try again</button></div> : null;
}
export function useRecordDetail(kind: 'posts' | 'events' | 'programs', id: string | undefined) {
  const { revision } = useWebsiteData();
  const path = `${kind}/${id}`;
  const key = `${revision}:${path}`;
  const initial = id && source === 'local' ? fixtureDetail(kind, id) : details.get(key)?.data ?? null;
  const [result, setResult] = useState<{ key: string; data: Detail | null }>({ key, data: initial });
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!id || source === 'local') return;
    setError('');
    let active = true;
    const cached = details.get(key);
    if (cached && Date.now() - cached.at < HOUR) { setResult({ key, data: cached.data }); return; }
    if (!detailRequests.has(key)) {
      let age = 0;
      detailRequests.set(key, read(`/api/website/${path}`, value => { age = value; }).then(value => { const data = unwrap<Detail>(value); details.set(key, { data, at: Date.now() - age * 1000 }); return data; }).finally(() => { detailRequests.delete(key); }));
    }
    detailRequests.get(key)!.then(data => { if (active) { setResult({ key, data }); setError(''); } }).catch(() => { if (active) setError('This content could not be loaded.'); });
    return () => { active = false; };
  }, [key, kind, id, attempt]);
  return { data: source === 'local' ? initial : result.key === key ? result.data : null, error, retry: () => { setError(''); setAttempt(value => value + 1); } };
}
