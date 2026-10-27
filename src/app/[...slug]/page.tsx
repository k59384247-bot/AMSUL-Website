import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { reportDetails } from "@/data/report-details";
import { routes } from "@/data/site";
import { PlannedPage } from "@/components/planned-page";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return routes.filter(route => !["/partnerships", "/leadership", "/about", "/impact-reports", "/blog", "/programs-events", "/event-highlights", "/contact", ...reportDetails.map(report => `/impact-reports/${report.slug}`)].includes(route.href) && !route.href.startsWith("/impact-reports/") && !route.href.startsWith("/blog/") && !route.href.startsWith("/programs-events/") && !route.href.startsWith("/event-highlights/")).map(route => ({ slug: route.href.slice(1).split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = routes.find(route => route.href === `/${slug.join("/")}`);
  return { title: route?.label || "Page not found", robots: { index: false, follow: false } };
}

export default async function UpcomingPage({ params }: Props) {
  const { slug } = await params;
  const route = routes.find(route => route.href === `/${slug.join("/")}`);
  if (!route) notFound();
  return <PlannedPage title={route.label} />;
}
