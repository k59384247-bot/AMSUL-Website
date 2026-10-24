import type { ContentSection } from "./content";
import type { GalleryPicture } from "@/components/picture-gallery";
import type { Sponsor } from "@/components/sponsors";
import assets from "./highlight-detail-assets.json";
import { reportSummary } from "./landing";

// shortcut: retain the literal Figma copy and empty media records until approved event content, photographs and sponsor logos are supplied.
export const highlightDetails = [{
  slug: "mr-miss-amsul-2025", title: "MR & MISS AMSUL 2025", tags: ["Category - Social", "PROGRAMME - HealthWeek"],
  date: "Saturday, July 1st", location: "Old Great Hall, LUTH",
  venueSearchUrl: "https://www.google.com/maps/search/?api=1&query=Old%20Great%20Hall%2C%20LUTH",
  sections: [
    { title: "CLINICAL ROTATIONS AND SPECIALTY INFLUENCES DURING MEDICAL SCHOOL", size: 24, paragraphs: ["“I remained undecided about my specialty until I completed the final year (600 level) of my MBBS program. In the final exams, I performed well in both medicine and surgery. Although I struggled with the long case in surgery, I achieved one of the best results in the short case. At that time, we had the traditional four-stage exam, and all stages were mandatory to pass. "] },
    { title: "Choosing a specialty isn’t a race. ", size: 20, paragraphs: ["It’s a hot, blistering Tuesday, the clinic has been running since 9a.m and at 2p.m, exhaustion is palpable among you and your classmates. Waiting for the next patient to come in, your consultant tries to lift the mood, by asking each of you about what they plan to specialize in. ", " ", "As you listen to your classmates give amazing answers, which start to pique your interest, you stand up a little straighter, eager to listen to their answers. "] },
  ] satisfies ContentSection[],
  pictures: Array.from({ length: 5 }, (_, index) => ({ id: `highlight-picture-${index + 1}`, src: null, alt: "" })) satisfies GalleryPicture[],
  sponsors: ["Lagos State Govt.", "Dobic Health", "MobiHealth", "Lagos State Govt.", "Lagos State Govt.", "Lagos State Govt."].map((name, index) => ({ id: `highlight-sponsor-${index + 1}`, name, logo: assets.imgImage48 })) satisfies Sponsor[],
  album: { title: "Event pictures", description: "To join the event, please register below.", label: "View All Pictures", url: null as string | null },
  relatedHeading: "Other PAST events",
  related: [
    { id: "related-mr-miss-2025", title: "MR & MISS AMSUL 2025", tagsBelowImage: false, href: "/event-highlights/mr-miss-amsul-2025" },
    { id: "related-business-2025", title: "BUSINESS SUMMIT 2025", tagsBelowImage: true, href: "/event-highlights/business-summit-2025" },
  ].map(item => ({ ...item, excerpt: reportSummary, tags: ["Category", "Program Name"], date: "July 1st, 2026", location: "Old Great Hall, LUTH" })),
  relatedReport: { id: "related-healthweek-report", title: "AMSUL Health Week 2025", excerpt: reportSummary, href: "/impact-reports/amsul-health-week-2025" },
}];
