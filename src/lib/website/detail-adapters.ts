import type { Feed, Post, Event, Program, Detail } from './contracts';
import { postCard, eventCard, postsOf, upcomingEvents, safeLink, sponsorsFor, dateLabel } from './selectors';
import type { AttachmentFile } from '@/data/content';
export const postAttachments = (post: Post): AttachmentFile[] => (post.attachments ?? []).filter(file => safeLink(file.url)).map(file => ({ title: file.name, url: safeLink(file.url), format: file.fileType === 'pdf' ? 'pdf' : 'slides' }));
export function contentDetail(post: Post, feed: Feed, detail: Detail, kind: 'blog' | 'reports' | 'highlights') {
  const card = postCard(post, feed, kind);
  const event = feed.events.find(item => item.id === post.eventId);
  const attachments = postAttachments(post);
  return { ...card, description: post.subtitle ?? post.excerpt ?? '', readingTime: post.readTime ? `${post.readTime} min. read` : '', badge: 'IMPACT REPORT', category: card.initiative, body: detail.body, attachments, file: attachments[0] ?? null, related: postsOf(feed, kind).filter(item => item.id !== post.id).slice(0, 3).map(item => ({ ...postCard(item, feed, kind), tagsBelowImage: false })), relatedReport: postsOf(feed, 'reports').filter(item => item.id !== post.id && item.categories.some(category => !['impact-reports', 'event-highlights'].includes(category) && post.categories.includes(category))).map(item => postCard(item, feed, 'reports'))[0] ?? null, pictures: detail.media.filter(item => item.type === 'photo' && safeLink(item.url)).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)).map(item => ({ id: item.id, src: safeLink(item.url), alt: item.caption ?? '' })), sponsors: sponsorsFor(detail.sponsors), venueSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.location ?? '')}`, album: { title: 'Event pictures', description: 'Explore more photographs from this event.', label: 'View All Pictures', url: safeLink(post.albumUrl) } };
}
export function eventDetail(record: Event | Program, feed: Feed, detail: Detail, program = false) {
  const event = record as Event;
  const card = eventCard(event, feed);
  return { ...card, date: dateLabel(record.startDate), location: event.location ?? '', venueSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location ?? '')}`, bodyDate: dateLabel(record.startDate), bodyTime: event.startTime ?? '', body: detail.body, sponsors: sponsorsFor(detail.sponsors), registration: { title: 'Registration', description: 'Register for this event.' }, registrationRecord: program ? null : event, related: (program ? feed.events.filter(item => item.programId === record.id) : upcomingEvents(feed).filter(item => item.id !== record.id).slice(0, 3)).map(item => eventCard(item, feed)), relatedHeading: program ? 'Programme events' : 'Other upcoming events' };
}
