import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { LeadershipSection } from "@/components/leadership-section";
import { leadershipPage } from "@/data/leadership";
import "./leadership.css";

export const metadata: Metadata = { title: "Leadership", description: leadershipPage.hero.description };

export default function LeadershipPage() {
  return <main id="main-content" className="leadership-page"><Hero {...leadershipPage.hero} centered nodeId="459:4739" /><LeadershipSection group={leadershipPage.executive} variant="executive" /><LeadershipSection group={leadershipPage.patrons} variant="patrons" /><LeadershipSection group={leadershipPage.committees} variant="committees" /></main>;
}
