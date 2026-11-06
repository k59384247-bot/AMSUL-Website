'use client';
import { leadershipPage } from '@/data/leadership';
import { leadershipGroup } from '@/lib/website/selectors';
import { useWebsiteData, DataStatus } from './website-data';
import { LeadershipSection } from './leadership-section';
export function LeadershipGroups() {
  const { feed, loading, error } = useWebsiteData();
  if (loading || error) return <DataStatus variant="leadership" />;
  const groups = ([['executive', 'executive'], ['committee', 'committees']] as const).map(([group, key]) => ({ key, members: leadershipGroup(feed, group) }));
  return <>{groups.map(({ key, members }) => members.featured.length || members.additional.length ? <LeadershipSection key={key} group={{ ...leadershipPage[key], ...members }} variant={key} /> : null)}{groups.every(({ members }) => !members.featured.length && !members.additional.length) && <p className="container data-status">Leadership information will be published here when available.</p>}</>;
}
