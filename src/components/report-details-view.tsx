"use client";
import Link from "next/link";
import { reportDetails } from "@/data/report-details";
import assets from "@/data/report-detail-assets.json";
import { SiteHeader } from "@/components/site-header";
import { HeroBadge } from "@/components/hero";
import { Icon, Tag } from "@/components/ui";
import { ArticleContent } from "@/components/article-content";
import { AttachmentDownload } from "@/components/attachment-download";
import { ReportCard } from "@/components/content-cards";
import { PartnershipCallout } from "@/components/partnership-callout";
import "@/components/detail-content.css";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useWebsiteData, useRecordDetail } from './website-data';
import { DetailState } from './detail-state';
import { ContentCover } from './content-cover';
import { postsOf, slugOf } from '@/lib/website/selectors';
import { contentDetail, eventDetail } from '@/lib/website/detail-adapters';
import "@/app/impact-reports/[slug]/report-details.css";

export function ReportDetailsView({ slug: initialSlug }: { slug: string }) {
  const { feed, loading, error, retry } = useWebsiteData();
  const [slug, setSlug] = useState(initialSlug);
  const pathname = usePathname();
  useEffect(() => { setSlug(initialSlug === '__detail' ? decodeURIComponent(window.location.pathname.split('/').filter(Boolean).at(-1) ?? '') : initialSlug); }, [initialSlug, pathname]);
  const record = postsOf(feed, 'reports').find(item => slugOf(item) === slug);
  const detail = useRecordDetail('posts', record?.id);
  useEffect(() => { if (record) document.title = `${record.title} | AMSUL`; }, [record]);
  if (loading || slug === '__detail') return <DetailState />;
  if (error) return <DetailState error={error} retry={retry} />;
  if (!record) return <DetailState missing />;
  if (detail.error) return <DetailState error={detail.error} retry={detail.retry} />;
  if (!detail.data) return <DetailState />;
  const report = { ...reportDetails[0], ...contentDetail(record, feed, detail.data, 'reports') };
  return <div className="report-details-page" data-node-id="236:1787"><SiteHeader className="detail-header report-details-header" />
    <main id="main-content">
      <section className="report-detail-intro section container" aria-labelledby="report-title" data-node-id="236:1945">
        <div className="report-detail-heading"><Link className="button detail-back-link" href="/impact-reports"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Reports</Link><div className="report-detail-titles"><HeroBadge>{report.badge}</HeroBadge><h1 id="report-title">{report.title}</h1><p>{report.description}</p></div><Tag>{report.category}</Tag></div>
        <div className="detail-cover report-cover"  data-node-id="236:2870" ><ContentCover src={report.coverImageUrl} priority /></div>
        {report.file && <AttachmentDownload file={report.file} primary />}
      </section>
      <section className="report-article-section section container" aria-label="Report content" data-node-id="236:2788"><ArticleContent body={report.body} attachments={report.attachments} /></section>
      <section className="related-reports section container" aria-labelledby="related-reports-title" data-node-id="243:3086"><h2 id="related-reports-title">related reports</h2><div className="related-report-grid">{report.related.map(item => <ReportCard key={item.id} report={item} />)}</div></section>
      <PartnershipCallout nodeId="243:3146" content={report.partnership} actions={report.partnershipActions} />
    </main>
  </div>;
}
