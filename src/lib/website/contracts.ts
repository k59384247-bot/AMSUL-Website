export type Envelope<T> = { success: true; data: T; meta?: { page?: number; limit?: number; total?: number; hasMore?: boolean; nextCursor?: string | null } };
export type Category = { id: string; name: string; slug: string; postCount?: number };
export type Post = { id: string; slug: string; title: string; subtitle?: string | null; excerpt: string | null; coverImageUrl: string | null; featuredImageUrl?: string | null; contentUrl: string | null; attachments: { name: string; url: string; fileType: string }[]; author: { id: string | null; name: string | null; avatarUrl?: string | null }; contentType: { id: string; name: string | null } | null; contentUnit?: { id: string; name: string | null } | null; categories: string[]; tags: string[]; hub?: string | null; featured: boolean; publishedAt: string | null; readTime?: number | null; eventId?: string | null; albumUrl?: string | null; seoTitle?: string | null; seoDescription?: string | null };
export type Event = { id: string; slug?: string; title: string; startDate: string | null; endDate: string | null; startTime: string | null; endTime: string | null; timezone?: string | null; location: string | null; mapLocation?: string | null; bannerImageUrl: string | null; posterImageUrl?: string | null; descriptionUrl?: string | null; eventType: string | null; registrationType: string | null; registrationRequired: boolean; registrationDeadline?: string | null; capacity?: number | null; programId: string | null; category: string | null; tags?: string[]; featured?: boolean; displaySection?: string[]; useExternalRegistration?: boolean; externalRegistrationUrl?: string | null; paymentAmount?: number | null; paymentCurrency?: string | null };
export type Program = { id: string; slug?: string; title: string; description: string | null; bannerImageUrl: string | null; startDate: string | null; endDate: string | null; status: string; eventCount: number; events?: Event[] };
export type Executive = { id: string; name: string; position: string | null; imageUrl: string | null; bio: string | null; tenureStart: string | null; tenureEnd: string | null; order: number; group?: 'executive' | 'patron' | 'committee'; featured?: boolean };
export type Media = { id: string; type: string; url: string; caption: string | null; order: number };
export type SponsorRecord = { id: string; name: string; logoUrl: string | null; tier: string | null; websiteUrl?: string | null };
export type RichNode = { type: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: RichNode[] };
export type Feed = { posts: Post[]; categories: Category[]; events: Event[]; programs: Program[]; executives: Executive[] };
export type Detail = { record: Post | Event | Program; body: RichNode | null; media: Media[]; sponsors: SponsorRecord[] };
export function unwrap<T>(value: unknown): T {
  if (!value || typeof value !== 'object' || (value as { success?: unknown }).success !== true || !('data' in value)) {
    const error = (value as { error?: { code?: string; message?: string } } | null)?.error;
    throw new Error(error?.message || 'Invalid dashboard response.');
  }
  return (value as Envelope<T>).data;
}
export function validateFeed(value: unknown): Feed {
  const feed = unwrap<Feed>(value);
  for (const key of ['posts', 'categories', 'events', 'programs', 'executives'] as const) {
    if (!Array.isArray(feed[key]) || feed[key].some(record => !record || typeof record.id !== 'string')) throw new Error('Invalid dashboard feed.');
  }
  return feed;
}
