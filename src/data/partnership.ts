import assets from "./partnership-assets.json";
import type { AttachmentFile } from "./content";

const quote = "“Before Jali Africa, I had the product but no voice. Now I close more clients because I finally know how to speak their language.”";
const continuation = "Before Jali Africa, I had the product but no voice. Now I close more clients because I finally know how to speak their language.";

// shortcut: retain Figma's repeated statistics, marks and unrelated Jali Africa testimonials until approved AMSUL content is supplied.
export const partnershipPage = {
  hero: { badge: "PARTNERSHIPS", title: "Building Partnerships That Create Lasting Impact.", introduction: "For over sixty years, AMSUL has collaborated with organizations, institutions and alumni to advance medical education, improve community health and empower future healthcare professionals. Together, we create initiatives that leave lasting impact far beyond the classroom." },
  brochure: { title: "Partnership Brochure", format: "pdf", url: null } as AttachmentFile,
  statistics: [ { value: "5000+", label: "Alumni", tone: "wine" }, { value: "25+", label: "Annual Events", tone: "gold" }, { value: "20+", label: "Awards", tone: "gold" }, { value: "100+", label: "Community Outreaches", tone: "wine" } ],
  benefits: { eyebrow: "What Partner With Us", title: "Why Organizations Choose AMSUL", description: "Partnering with AMSUL goes beyond sponsorship. It creates opportunities to engage with one of Nigeria's most respected medical student communities while supporting initiatives that improve healthcare, education and leadership development.", items: [
    { id: "professionals", number: "01", title: "Access to Healthcare Professionals", description: "Engage directly with Nigeria’s most vibrant medical student communities and healthcare personnel." },
    { id: "visibility", number: "02", title: "Strengthen Brand Visibility", description: "Associate your brand with innovation, leadership, and youth empowerment in healthcare" },
    { id: "showcase", number: "03", title: "Showcase your Product & Services", description: "Through exhibitions, branding opportunities & sponsored session" },
    { id: "relationships", number: "03", title: "Build Long-Term Relationships", description: "Create meaningful partnerships that extend beyond a single event." },
    { id: "impact", number: "03", title: "Demonstrate Social Impact", description: "Support initiatives that improve community health and education." },
  ] },
  partners: { eyebrow: "Partners", title: "Trusted By Leading Organizations", description: "AMSUL has collaborated with organizations committed to advancing healthcare, education, and community development.", items: Array.from({ length: 12 }, (_, index) => ({ id: `partner-${index + 1}`, name: "Partner organization — sample logo", image: assets.imgImage48 })) },
  testimonials: { eyebrow: "Testimonials", title: "Hear from Clients we’ve helped tell their Stories", items: [
    { id: "finding-story", label: "Finding Story X", quote, continuation, name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgDownload15, logoVariant: "standard" },
    { id: "public-speaking", label: "Public Speaking", quote, continuation: "Before Jali Africa, I had the product but no voice. Now I close more clients.", name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgDownload15, logoVariant: "standard" },
    { id: "jali-advanced", label: "Jali Advanced", quote, continuation, name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgDownload15, logoVariant: "standard" },
    { id: "founder", label: "Founder X", quote, continuation, name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgImage123, logoVariant: "founder" },
  ] },
};
export type Testimonial = typeof partnershipPage.testimonials.items[number];
