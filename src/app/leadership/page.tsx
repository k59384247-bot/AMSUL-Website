import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { LeadershipGroups } from "@/components/leadership-groups";
import { landingImageSrcSet } from "@/lib/landing-image";
import { leadershipPage } from "@/data/leadership";
import "./leadership.css";

export const metadata: Metadata = { title: "Leadership", description: leadershipPage.hero.description };

export default function LeadershipPage() {
  return <main id="main-content" className="leadership-page"><Hero {...leadershipPage.hero} centered plain nodeId="459:4739" /><div className="leadership-hero-photo container"><img src={leadershipPage.photo} srcSet={landingImageSrcSet(leadershipPage.photo)} sizes="(max-width: 700px) 100vw, 1248px" alt="AMSUL student leaders together" fetchPriority="high" /></div><LeadershipGroups /></main>;
}
