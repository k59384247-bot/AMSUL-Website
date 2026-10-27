'use client';
import { leadershipPage } from '@/data/leadership';
import { leadershipGroup } from '@/lib/website/selectors';
import { useWebsiteData, DataStatus } from './website-data';
import { LeadershipSection } from './leadership-section';
export function LeadershipGroups() {
  const { feed, loading, error } = useWebsiteData();
  if (loading || error) return <DataStatus variant="leadership" />;
  return <>{(['executive', 'patron', 'committee'] as const).map((group, index) => {
    const key = (['executive', 'patrons', 'committees'] as const)[index];
    const members = leadershipGroup(feed, group);
    return members.featured.length || members.additional.length ? <LeadershipSection key={group} group={{ ...leadershipPage[key], description: '', ...members }} variant={key} /> : null;
  })}{!feed.executives.length && <p className="container data-status">Leadership information will be published here when available.</p>}</>;
}
