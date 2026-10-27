import type { Feed, Post, Event, Program, SponsorRecord } from './contracts';
import type { LeadershipMember } from '@/data/leadership';
export function safeLink(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes(String.fromCharCode(92))) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export const slugOf = (item: { id: string; slug?: string }) => item.slug && /^[a-zA-Z0-9_-]+$/.test(item.slug) ? item.slug : item.id;
export const dateLabel = (value: string | null, timezone = 'Africa/Lagos') => value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: timezone }).format(new Date(value)) : '';
const ordered = <T extends { id: string; publishedAt?: string | null }>(items: T[]) => [...items].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || a.id.localeCompare(b.id));
export const postsOf = (feed: Feed, kind: 'blog' | 'reports' | 'highlights') => ordered(feed.posts.filter(post => kind === 'reports' ? post.categories.includes('impact-reports') : kind === 'highlights' ? post.categories.includes('event-highlights') && feed.events.some(event => event.id === post.eventId) : !post.categories.some(category => ['impact-reports', 'event-highlights'].includes(category)) && (!post.hub || post.hub === 'blog')));
export function postCard(post: Post, feed: Feed, kind: 'blog' | 'reports' | 'highlights' = 'blog') {
  const categoryIds = post.categories.filter(slug => !['impact-reports', 'event-highlights'].includes(slug));
  const categoryNames = categoryIds.map(slug => feed.categories.find(category => category.slug === slug)?.name ?? slug.replaceAll('-', ' '));
  const event = feed.events.find(event => event.id === post.eventId);
  const program = feed.programs.find(program => program.id === event?.programId);
  const labels = [post.contentType?.name, ...categoryNames, ...(post.tags ?? []), kind === 'highlights' ? program?.title : post.contentUnit?.name].filter((value): value is string => !!value);
  const normalized = (value: string) => value.toLowerCase().replaceAll('-', ' ').replaceAll('_', ' ').trim();
  const tags = labels.filter((value, index) => labels.findIndex(item => normalized(item) === normalized(value)) === index);
  return { id: post.id, slug: slugOf(post), title: post.title, excerpt: post.excerpt ?? post.subtitle ?? '', author: post.author?.name ?? '', avatarUrl: safeLink(post.author?.avatarUrl), date: dateLabel(kind === 'highlights' ? event?.startDate ?? post.publishedAt : post.publishedAt), publishedAt: post.publishedAt ?? '', tags, categoryId: categoryIds[0] ?? '', categoryIds, initiativeId: categoryIds[0] ?? '', initiative: categoryNames[0] ?? '', contentType: post.contentType?.name ?? '', location: event?.location ?? '', coverImageUrl: safeLink(post.coverImageUrl), featuredImageUrl: safeLink(post.featuredImageUrl) ?? safeLink(post.coverImageUrl), href: `/${kind === 'reports' ? 'impact-reports' : kind === 'highlights' ? 'event-highlights' : 'blog'}/${slugOf(post)}` };
}
export function eventCard(event: Event, feed: Feed) {
  const program = feed.programs.find(program => program.id === event.programId);
  return { id: event.id, slug: slugOf(event), title: event.title, excerpt: '', program: program?.title, category: event.category ?? '', date: dateLabel(event.startDate, event.timezone || 'Africa/Lagos'), startsAt: event.startDate ?? '', location: event.location ?? '', time: [event.startTime, event.endTime].filter(Boolean).join(' – '), priceLabel: event.registrationType === 'free' ? 'Free' : event.registrationType === 'invite_only' ? 'Invite only' : null, isProgrammeEvent: event.eventType === 'program_event', tags: [event.category, program?.title].filter((value): value is string => !!value), coverImageUrl: safeLink(event.bannerImageUrl) ?? safeLink(event.posterImageUrl), href: `/programs-events/${slugOf(event)}` };
}
export function programCard(program: Program) {
  return { id: program.id, title: program.title, excerpt: program.description ?? '', count: `${program.eventCount} EVENTS`, date: [dateLabel(program.startDate), dateLabel(program.endDate)].filter(Boolean).join(' – '), coverImageUrl: safeLink(program.bannerImageUrl), href: `/programs-events/${slugOf(program)}` };
}
export const upcomingEvents = (feed: Feed, now = Date.now()) => feed.events.filter(event => Date.parse(event.endDate ?? event.startDate ?? '') >= now).sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? '') || a.id.localeCompare(b.id));
export const sponsorsFor = (items: SponsorRecord[]) => items.map(item => ({ id: item.id, name: item.name, logo: safeLink(item.logoUrl) ?? '', websiteUrl: safeLink(item.websiteUrl) }));
export function leadershipGroup(feed: Feed, group: 'executive' | 'patron' | 'committee') {
  const records = feed.executives.filter(item => item.group === group).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const member = (item: typeof records[number]): LeadershipMember => ({ id: item.id, name: item.name, position: item.position ?? '', imageUrl: safeLink(item.imageUrl), bio: item.bio, nodeId: '' });
  return { featured: records.filter(item => item.featured).map(member), additional: records.filter(item => !item.featured).map(member) };
}
