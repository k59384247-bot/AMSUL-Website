import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import "./report-details.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return reportDetails.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = reportDetails.find(item => item.slug === slug);
  return { title: report?.title || "Report not found", description: report?.description };
}

export default async function ReportDetailsPage({ params }: Props) {
  const { slug } = await params;
  const report = reportDetails.find(item => item.slug === slug);
  if (!report) notFound();
  return <div className="report-details-page" data-node-id="236:1787"><SiteHeader className="detail-header report-details-header" />
    <main id="main-content">
      <section className="report-detail-intro section container" aria-labelledby="report-title" data-node-id="236:1945">
        <div className="report-detail-heading"><Link className="button detail-back-link" href="/impact-reports"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Reports</Link><div className="report-detail-titles"><HeroBadge>{report.badge}</HeroBadge><h1 id="report-title">{report.title}</h1><p>{report.description}</p></div><Tag>{report.category}</Tag></div>
        <div className="detail-cover report-cover" aria-hidden="true" data-node-id="236:2870" />
        <AttachmentDownload file={report.file} primary />
      </section>
      <section className="report-article-section section container" aria-label="Report content" data-node-id="236:2788"><ArticleContent sections={report.sections} attachments={report.attachments} /></section>
      <section className="related-reports section container" aria-labelledby="related-reports-title" data-node-id="243:3086"><h2 id="related-reports-title">related reports</h2><div className="related-report-grid">{report.related.map(item => <ReportCard key={item.id} report={item} />)}</div></section>
      <PartnershipCallout nodeId="243:3146" content={report.partnership} actions={report.partnershipActions} />
    </main>
  </div>;
}
