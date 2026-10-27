import snapshot from '@/fixtures/dashboard.json';
import { validateFeed, type Detail, type Event, type Program, type RichNode, type Media, type SponsorRecord } from './contracts';
export const fixtureFeed = validateFeed(snapshot.feed);
export function fixtureDetail(kind: string, id: string): Detail | null {
  const record = kind === 'posts' ? fixtureFeed.posts.find(item => item.id === id) : kind === 'events' ? (snapshot.events as Record<string, { data: Event }>)[id]?.data : (snapshot.programs as Record<string, { data: Program }>)[id]?.data;
  if (!record) return null;
  return { record, body: (snapshot.bodies as Record<string, RichNode>)[id] ?? null, media: (snapshot.media as Record<string, { data: Media[] }>)[id]?.data ?? [], sponsors: (snapshot.sponsors as Record<string, { data: SponsorRecord[] }>)[id]?.data ?? [] };
}
