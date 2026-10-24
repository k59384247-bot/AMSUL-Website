import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ImpactReportHub } from "@/components/impact-report-hub";
import { PartnershipCallout } from "@/components/partnership-callout";
import { impactHub } from "@/data/impact-reports";
import "@/components/listing.css";
import "./impact-reports.css";

export const metadata: Metadata = { title: "Impact Reports", description: impactHub.hero.description };

export default function ImpactReports() {
  return <main id="main-content" className="impact-hub-page"><Hero badge={impactHub.hero.badge} title={<>{impactHub.hero.title}<br />{impactHub.hero.subtitle}</>} description={impactHub.hero.description} centered nodeId="212:1645" /><ImpactReportHub /><PartnershipCallout nodeId="212:2118" /></main>;
}
