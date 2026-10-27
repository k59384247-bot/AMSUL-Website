import type { Metadata } from 'next';
import { ReportDetailsView } from '@/components/report-details-view';
import { fixtureFeed } from '@/lib/website/fixtures';
import { postsOf, slugOf } from '@/lib/website/selectors';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
const records = postsOf(fixtureFeed, 'reports');
export function generateStaticParams() { return [...new Set(['__detail', ...records.map(slugOf)])].map(slug => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const record = process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE === 'api' ? null : records.find(item => slugOf(item) === slug);
  return { title: record?.title ?? 'Report details', ...(slug === '__detail' && process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE !== 'api' && { robots: { index: false, follow: false } }) };
}
export default async function Page({ params }: Props) { return <ReportDetailsView slug={(await params).slug} />; }
