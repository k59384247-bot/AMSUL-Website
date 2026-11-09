import { partnershipFormUrl } from "./site";

import type { AttachmentFile } from "./content";
import { safeLink } from "@/lib/website/selectors";

const reportPdfNames = new Map([
  ["amsul-health-week-2025", "59th-amsul-health-week-impact-report.pdf"],
  ["amsul-iwd-2026-impact-report", "amsul-iwd-2026-impact-report.pdf"],
]);

export function primaryReportPdf(slug: string, attachments: AttachmentFile[]): AttachmentFile | null {
  const filename = reportPdfNames.get(slug);
  const attachment = attachments.find(file => file.format === "pdf" && file.url);
  if (!filename) return attachment ?? null;

  const base = process.env.NEXT_PUBLIC_REPORT_PDF_BASE_URL?.trim().replace(/\/+$/, "");
  const hostedUrl = base?.startsWith("https://") ? safeLink(`${base}/${filename}`) : null;
  return hostedUrl ? { title: filename, format: "pdf", url: hostedUrl }
    : attachment ?? { title: filename, format: "pdf", url: null };
}

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
