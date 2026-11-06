import { partnershipFormUrl } from "./site";

import type { AttachmentFile } from "./content";

export const reportDetails = [{
  slug: "amsul-health-week-2025",
  badge: "IMPACT REPORT",
  title: "59th AMSUL Health Week Impact Report 2025",
  description: "A two-week programme connecting community health outreach, medical-student development, academic exchange and professional engagement.",
  category: "Category - HealthWeek",
  file: null as AttachmentFile | null,
  attachments: [] as AttachmentFile[],
  related: [],
  partnership: {
    eyebrow: "Partnership", title: "Inspired by what you've seen?",
    description: "Partner with AMSUL to support initiatives that improve communities, empower students, and shape the future of healthcare.",
  },
  partnershipActions: [
    { label: "Become a Partner", href: partnershipFormUrl },
    { label: "Contact Us", href: "/contact", secondary: true, arrow: true },
  ],
}];
