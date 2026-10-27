"use client";
import Link from "next/link";
import { articleDetails } from "@/data/article-details";
import assets from "@/data/article-assets.json";
import { SiteHeader } from "@/components/site-header";
import { Icon, Tag } from "@/components/ui";
import { ArticleContent } from "@/components/article-content";
import { StoryCard } from "@/components/content-cards";
import { PartnershipCallout } from "@/components/partnership-callout";
import "@/components/detail-content.css";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useWebsiteData, useRecordDetail } from './website-data';
import { DetailState } from './detail-state';
import { ContentCover } from './content-cover';
import { postsOf, slugOf } from '@/lib/website/selectors';
import { contentDetail, eventDetail } from '@/lib/website/detail-adapters';
import "@/app/blog/[slug]/article-details.css";

export function ArticleDetailsView({ slug: initialSlug }: { slug: string }) {
  const { feed, loading, error, retry } = useWebsiteData();
  const [slug, setSlug] = useState(initialSlug);
  const pathname = usePathname();
  useEffect(() => { setSlug(initialSlug === '__detail' ? decodeURIComponent(window.location.pathname.split('/').filter(Boolean).at(-1) ?? '') : initialSlug); }, [initialSlug, pathname]);
  const record = postsOf(feed, 'blog').find(item => slugOf(item) === slug);
  const detail = useRecordDetail('posts', record?.id);
  useEffect(() => { if (record) document.title = `${record.title} | AMSUL`; }, [record]);
  if (loading || slug === '__detail') return <DetailState />;
  if (error) return <DetailState error={error} retry={retry} />;
  if (!record) return <DetailState missing />;
  if (detail.error) return <DetailState error={detail.error} retry={detail.retry} />;
  if (!detail.data) return <DetailState />;
  const article = { ...articleDetails[0], ...contentDetail(record, feed, detail.data, 'blog') };
  return <div className="article-details-page" data-node-id="250:4369"><SiteHeader className="detail-header" /><main id="main-content">
    <section className="article-detail-intro section container" aria-labelledby="article-title" data-node-id="250:4409"><div className="article-detail-heading"><Link className="button detail-back-link" href="/blog"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Stories &amp; Insights</Link><div className="article-detail-titles"><div className="article-detail-tags">{article.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><h1 id="article-title">{article.title}</h1><p>{article.description}</p></div><div className="article-detail-meta"><span><span className="author-avatar" aria-hidden="true">{article.avatarUrl && <img src={article.avatarUrl} alt="" loading="lazy" />}</span>{article.author}</span><span><Icon src={assets.imgLetsIconsDateTodayDuotone1} />{article.date}</span><span><span className="reading-time-icon"><Icon src={assets.imgMaskGroup} /></span>{article.readingTime}</span></div></div><div className="detail-cover"  data-node-id="250:4431" ><ContentCover src={article.coverImageUrl} priority /></div></section>
    <section className="article-body-section section container" aria-label="Article content" data-node-id="250:4432"><ArticleContent body={article.body} attachments={article.attachments} /></section>
    <section className="related-articles section container" aria-labelledby="related-articles-title" data-node-id="250:4462"><h2 id="related-articles-title">{article.relatedHeading}</h2><div className="related-article-grid">{article.related.map(story => <StoryCard key={story.id} story={story} dateIconSrc={assets.imgLetsIconsDateTodayDuotone} />)}</div></section>
    <PartnershipCallout nodeId="250:4473" content={article.partnership} actions={article.partnershipActions} />
  </main></div>;
}
