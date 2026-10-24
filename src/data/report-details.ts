import { impactReports } from "./impact-reports";

import { sampleEditorialParagraphs, type AttachmentFile } from "./content";

// shortcut: preserve the supplied design samples until approved report copy, cover and files are provided.
export const reportDetails = [{
  slug: "amsul-health-week-2025",
  badge: "IMPACT REPORT",
  title: "Health Week Impact Report 2025",
  description: "An overview of AMSUL Health Week 2026, documenting programme activities, community outreach, partnerships, participation metrics and outcomes.",
  category: "Category - HealthWeek",
  file: { title: "Health Week Impact Report 2025", format: "pdf", url: null } satisfies AttachmentFile,
  sections: [24, 20, 18].map(size => ({ title: "The List That Started It All", size, paragraphs: sampleEditorialParagraphs })),
  attachments: [
    { title: "AMSUL HealthWeek Proposal 2026", format: "pdf", url: null },
    { title: "HealthWeek Impact Report 2025", format: "slides", url: null },
  ] satisfies AttachmentFile[],
  related: impactReports.slice(0, 3),
  partnership: {
    eyebrow: "Partnership", title: "Inspired by what you've seen?",
    description: "Partner with AMSUL to support initiatives that improve communities, empower students, and shape the future of healthcare.",
  },
  partnershipActions: [
    { label: "Become a Partner", href: "/partnerships/become-a-partner" },
    { label: "Contact Us", href: "/contact", secondary: true, arrow: true },
  ],
}];
