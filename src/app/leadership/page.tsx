import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { LeadershipGroups } from "@/components/leadership-groups";
import { leadershipPage } from "@/data/leadership";
import "./leadership.css";

export const metadata: Metadata = { title: "Leadership", description: leadershipPage.hero.description };

export default function LeadershipPage() {
  return <main id="main-content" className="leadership-page"><Hero {...leadershipPage.hero} centered nodeId="459:4739" /><LeadershipGroups /></main>;
}
