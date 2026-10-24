import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { EventListing } from "@/components/event-listing";
import { eventsPage } from "@/data/events";
import "@/components/listing.css";
import "./events.css";

export const metadata: Metadata = { title: "Programs & Events", description: eventsPage.hero.description };
export default function EventsPage() {
  return <main id="main-content" className="programs-events-page"><Hero {...eventsPage.hero} centered nodeId="265:2080" /><EventListing /></main>;
}
