import type { Feed, Post, Event, Program, SponsorRecord } from './contracts';
import type { LeadershipMember } from '@/data/leadership';
export function safeLink(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes(String.fromCharCode(92))) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export const slugOf = (item: { id: string; slug?: string }) => item.slug && /^[a-zA-Z0-9_-]+$/.test(item.slug) ? item.slug : item.id;
export const dateLabel = (value: string | null, timezone = 'Africa/Lagos') => value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: timezone }).format(new Date(value)) : '';
export function dateRangeLabel(start: string | null, end: string | null, timezone = 'Africa/Lagos') {
  const startLabel = dateLabel(start, timezone);
  const endLabel = dateLabel(end, timezone);
  if (!startLabel || !endLabel || !start || !end) return startLabel;
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { ...options, timeZone: timezone });
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (format({ day: 'numeric', month: 'long', year: 'numeric' }).format(startDate) === format({ day: 'numeric', month: 'long', year: 'numeric' }).format(endDate)) return startLabel;
  const sameYear = format({ year: 'numeric' }).format(startDate) === format({ year: 'numeric' }).format(endDate);
  const sameMonth = format({ year: 'numeric', month: 'long' }).format(startDate) === format({ year: 'numeric', month: 'long' }).format(endDate);
  if (sameMonth) return `${format({ day: 'numeric' }).format(startDate)}–${format({ day: 'numeric', month: 'long', year: 'numeric' }).format(endDate)}`;
  if (sameYear) return `${format({ day: 'numeric', month: 'long' }).format(startDate)} – ${endLabel}`;
  return `${startLabel} – ${endLabel}`;
}
const ordered = <T extends { id: string; publishedAt?: string | null }>(items: T[]) => [...items].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || a.id.localeCompare(b.id));
export const postsOf = (feed: Feed, kind: 'blog' | 'reports' | 'highlights') => ordered(feed.posts.filter(post => kind === 'reports' ? post.categories.includes('impact-reports') : kind === 'highlights' ? post.categories.includes('event-highlights') && feed.events.some(event => event.id === post.eventId) : !post.categories.some(category => ['impact-reports', 'event-highlights'].includes(category)) && (!post.hub || post.hub === 'blog')));
const isHealthWeekTitle = (title: string) => /^(?:the\s+)?(?:\d+(?:st|nd|rd|th)\s+)?(?:amsul\s+)?health[\s_-]*week\b/i.test(title.trim());
const isHealthWeekLabel = (label: string) => /^(?:amsul[\s_-]+)?health[\s_-]*week(?:[\s_-]*[’']?\d{2,4})?$/i.test(label.trim());

export function postCard(post: Post, feed: Feed, kind: 'blog' | 'reports' | 'highlights' = 'blog') {
  const showLabel = (label: string) => isHealthWeekTitle(post.title) || !isHealthWeekLabel(label);
  const categoryIds = post.categories.filter(slug => !['impact-reports', 'event-highlights'].includes(slug) && showLabel(slug));
  const categoryNames = categoryIds.map(slug => feed.categories.find(category => category.slug === slug)?.name ?? slug.replaceAll('-', ' '));
  const event = feed.events.find(event => event.id === post.eventId);
  const program = feed.programs.find(program => program.id === event?.programId);
  const labels = [post.contentType?.name, ...categoryNames, ...(post.tags ?? []), kind === 'highlights' ? program?.title : post.contentUnit?.name].filter((value): value is string => !!value && showLabel(value));
  const normalized = (value: string) => value.toLowerCase().replaceAll('-', ' ').replaceAll('_', ' ').trim();
  const tags = labels.filter((value, index) => labels.findIndex(item => normalized(item) === normalized(value)) === index);
  return { id: post.id, slug: slugOf(post), title: post.title, excerpt: post.excerpt ?? post.subtitle ?? '', author: post.author?.name ?? '', avatarUrl: safeLink(post.author?.avatarUrl), date: kind === 'highlights' && event ? dateRangeLabel(event.startDate, event.endDate, event.timezone || 'Africa/Lagos') : dateLabel(post.publishedAt), publishedAt: post.publishedAt ?? (kind === 'highlights' ? event?.endDate ?? event?.startDate : null) ?? '', tags, categoryId: categoryIds[0] ?? '', categoryIds, initiativeId: categoryIds[0] ?? '', initiative: categoryNames[0] ?? '', contentType: post.contentType?.name ?? '', location: event?.location ?? '', coverImageUrl: safeLink(post.coverImageUrl), featuredImageUrl: safeLink(post.featuredImageUrl) ?? safeLink(post.coverImageUrl), href: `/${kind === 'reports' ? 'impact-reports' : kind === 'highlights' ? 'event-highlights' : 'blog'}/${slugOf(post)}` };
}
export function eventCard(event: Event, feed: Feed) {
  const showLabel = (label: string) => isHealthWeekTitle(event.title) || !isHealthWeekLabel(label);
  const programTitle = feed.programs.find(program => program.id === event.programId)?.title;
  const program = programTitle && showLabel(programTitle) ? programTitle : undefined;
  const category = event.category && showLabel(event.category) ? event.category : '';
  return { id: event.id, slug: slugOf(event), title: event.title, excerpt: '', program, category, date: dateRangeLabel(event.startDate, event.endDate, event.timezone || 'Africa/Lagos'), startsAt: event.startDate ?? '', location: event.location ?? '', time: [event.startTime, event.endTime].filter(Boolean).join(' – '), priceLabel: event.registrationType === 'free' ? 'Free' : event.registrationType === 'invite_only' ? 'Invite only' : null, isProgrammeEvent: event.eventType === 'program_event', tags: [category, program].filter((value): value is string => !!value), coverImageUrl: safeLink(event.bannerImageUrl) ?? safeLink(event.posterImageUrl), href: `/programs-events/${slugOf(event)}` };
}
export function programCard(program: Program) {
  return { id: program.id, title: program.title, excerpt: program.description ?? '', count: `${program.eventCount} EVENTS`, date: [dateLabel(program.startDate), dateLabel(program.endDate)].filter(Boolean).join(' – '), coverImageUrl: safeLink(program.bannerImageUrl), href: `/programs-events/${slugOf(program)}` };
}
export const upcomingEvents = (feed: Feed, now = Date.now()) => feed.events.filter(event => (!event.startDate && !event.endDate) || Date.parse(event.endDate ?? event.startDate ?? '') >= now).sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? '') || a.id.localeCompare(b.id));
export const sponsorsFor = (items: SponsorRecord[]) => items.map(item => ({ id: item.id, name: item.name, logo: safeLink(item.logoUrl) ?? '', websiteUrl: safeLink(item.websiteUrl) }));
export function leadershipGroup(feed: Feed, group: 'executive' | 'patron' | 'committee') {
  const records = feed.executives.filter(item => item.group === group).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const executiveCardNames: Record<string, string> = { 'executive-3': 'Apata Oluwatofunmi O.', 'executive-4': 'Yasser Mustapha', 'executive-5': 'Bidmos Sultan A.', 'executive-6': 'Akinpelu Itunuoluwa', 'executive-7': 'Azeez Farouk', 'executive-8': 'Ezeonwuka Ifunanya', 'executive-9': 'Aiyewumi Oluwatosin', 'executive-10': 'Anushiem Paul' };
  const member = (item: typeof records[number]): LeadershipMember => ({ id: item.id, name: item.name, cardName: group === 'executive' ? executiveCardNames[item.id] : undefined, position: item.position ?? '', imageUrl: safeLink(item.imageUrl), bio: item.bio, socialLinks: Array.isArray(item.socialLinks) ? item.socialLinks.flatMap(link => { if (!link || typeof link !== 'object' || typeof link.url !== 'string' || !['instagram', 'linkedin', 'x', 'tiktok'].includes(link.platform)) return []; const url = safeLink(link.url); return url ? [{ platform: link.platform, url }] : []; }) : undefined, nodeId: '' });
  return { featured: records.filter(item => item.featured).map(member), additional: records.filter(item => !item.featured).map(member) };
}
