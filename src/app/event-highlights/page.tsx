import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { HighlightsListing } from "@/components/highlights-listing";
import { highlightsPage } from "@/data/event-highlights";
import "@/components/listing.css";
import "./highlights.css";

export const metadata: Metadata = { title: "Event Highlights", description: highlightsPage.hero.description };

export default function EventHighlightsPage() {
  return <main id="main-content" className="highlights-page"><Hero {...highlightsPage.hero} centered plain nodeId="992:28075" /><HighlightsListing /></main>;
}
