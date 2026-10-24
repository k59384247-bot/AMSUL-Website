import { sampleEditorialParagraphs, type ContentSection } from "./content";

// shortcut: the conflicting dates, sample editorial copy and both registration variants are literal Figma content; confirm the event record before connecting registration.
export const eventDetails = [{
  slug: "amsul-business-summit-2026", title: "AMSUL BUSINESS SUMMIT 2026",
  tags: ["Category - Business", "PROGRAMME - HealthWeek"],
  date: "Saturday, August 1", time: "9:00 AM - 3:00 PM", location: "Old Great Hall, LUTH",
  venueSearchUrl: "https://www.google.com/maps/search/?api=1&query=Old%20Great%20Hall%2C%20LUTH",
  bodyDate: "July 1st, 2026", bodyTime: "9:00 AM",
  sections: [
    { title: "CLINICAL ROTATIONS AND SPECIALTY INFLUENCES DURING MEDICAL SCHOOL", size: 24, paragraphs: ["“I remained undecided about my specialty until I completed the final year (600 level) of my MBBS program. In the final exams, I performed well in both medicine and surgery. Although I struggled with the long case in surgery, I achieved one of the best results in the short case. At that time, we had the traditional four-stage exam, and all stages were mandatory to pass. "] },
    { title: "Choosing a specialty isn’t a race. ", size: 20, paragraphs: ["It’s a hot, blistering Tuesday, the clinic has been running since 9a.m and at 2p.m, exhaustion is palpable among you and your classmates. Waiting for the next patient to come in, your consultant tries to lift the mood, by asking each of you about what they plan to specialize in. ", " ", "As you listen to your classmates give amazing answers, which start to pique your interest, you stand up a little straighter, eager to listen to their answers. "] },
    { title: "The List That Started It All ", size: 18, paragraphs: sampleEditorialParagraphs.slice(0, 4).map(paragraph => paragraph.replace("Movement 2026.", "Movement\n2026.")) },
  ] satisfies ContentSection[],
  sponsors: ["Lagos State Govt.", "Dobic Health", "MobiHealth", "Lagos State Govt.", "Lagos State Govt.", "Lagos State Govt."],
  registration: { title: "Registration", description: "To join the event, please register below." },
  relatedHeading: "Other UPCOMING events",
  related: [
    { id: "related-mr-miss", title: "MR & MISS AMSUL 2026", program: "PROGRAMME", category: "Category", date: "Wed.,  July 1st", href: "/programs-events/mr-miss-amsul-2026" },
    { id: "related-business-summit", title: "AMSUL BUSINESS SUMMIT 2026", category: "Entrepreneurship", date: "Wed.,  July 1st, 2026", href: "/programs-events/amsul-business-summit-2026" },
  ].map(event => ({ ...event, location: "Old Great Hall, LUTH", time: "10:00AM - 2:00PM", priceLabel: "$5000" })),
}];
