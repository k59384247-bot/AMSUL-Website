import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/data/site";
import { PlannedPage } from "@/components/planned-page";
import { articleDetails } from "@/data/article-details";
import assets from "@/data/article-assets.json";
import { SiteHeader } from "@/components/site-header";
import { Icon, Tag } from "@/components/ui";
import { ArticleContent } from "@/components/article-content";
import { StoryCard } from "@/components/content-cards";
import { PartnershipCallout } from "@/components/partnership-callout";
import "@/components/detail-content.css";
import "./article-details.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return routes.filter(route => route.href.startsWith("/blog/")).map(route => ({ slug: route.href.slice("/blog/".length) })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleDetails.find(item => item.slug === slug);
  return { title: article?.title || routes.find(route => route.href === `/blog/${slug}`)?.label || "Article not found", description: article?.description, ...(!article && { robots: { index: false, follow: false } }) };
}

export default async function ArticleDetailsPage({ params }: Props) {
  const { slug } = await params;
  const article = articleDetails.find(item => item.slug === slug);
  if (!article) {
    const route = routes.find(route => route.href === `/blog/${slug}`);
    if (!route) notFound();
    return <PlannedPage title={route.label} />;
  }
  return <div className="article-details-page" data-node-id="250:4369"><SiteHeader className="detail-header" /><main id="main-content">
    <section className="article-detail-intro section container" aria-labelledby="article-title" data-node-id="250:4409"><div className="article-detail-heading"><Link className="button detail-back-link" href="/blog"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Stories &amp; Insights</Link><div className="article-detail-titles"><div className="article-detail-tags">{article.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><h1 id="article-title">{article.title}</h1><p>{article.description}</p></div><div className="article-detail-meta"><span><span className="author-avatar" aria-hidden="true" />{article.author}</span><span><Icon src={assets.imgLetsIconsDateTodayDuotone1} />{article.date}</span><span><span className="reading-time-icon"><Icon src={assets.imgMaskGroup} /></span>{article.readingTime}</span></div></div><div className="detail-cover" aria-hidden="true" data-node-id="250:4431" /></section>
    <section className="article-body-section section container" aria-label="Article content" data-node-id="250:4432"><ArticleContent sections={article.sections} attachments={article.attachments} /></section>
    <section className="related-articles section container" aria-labelledby="related-articles-title" data-node-id="250:4462"><h2 id="related-articles-title">{article.relatedHeading}</h2><div className="related-article-grid">{article.related.map(story => <StoryCard key={story.id} story={story} dateIconSrc={assets.imgLetsIconsDateTodayDuotone} />)}</div></section>
    <PartnershipCallout nodeId="250:4473" content={article.partnership} actions={article.partnershipActions} />
  </main></div>;
}
