import assets from "./partnership-assets.json";
import type { AttachmentFile } from "./content";
import { landing } from "./landing";

const quote = "“Before Jali Africa, I had the product but no voice. Now I close more clients because I finally know how to speak their language.”";
const continuation = "Before Jali Africa, I had the product but no voice. Now I close more clients because I finally know how to speak their language.";

// Testimonials stay hidden until AMSUL-approved quotes and attribution are supplied.
export const partnershipPage = {
  hero: { badge: "PARTNERSHIPS", title: "Building Partnerships That Create Lasting Impact.", introduction: "For over sixty years, AMSUL has collaborated with organizations, institutions and alumni to advance medical education, improve community health and empower future healthcare professionals. Together, we create initiatives that leave lasting impact far beyond the classroom." },
  photo: "/assets/partnership-2026/hero.jpg",
  brochure: { title: "Partnership Brochure", format: "pdf", url: null } as AttachmentFile,
  statistics: [ { value: "20k+", label: "UNILAG Students", tone: "wine" }, { value: "300+", label: "Healthcare Professionals", tone: "gold" }, { value: "15k+", label: "Medical Doctor Alumni", tone: "wine" }, { value: "10k+", label: "Social Media Followers", tone: "gold" } ],
  benefits: { eyebrow: "What Partner With Us", title: "Why Organizations Choose AMSUL", description: "Partnering with AMSUL goes beyond sponsorship. It creates opportunities to engage with one of Nigeria's most respected medical student communities while supporting initiatives that improve healthcare, education and leadership development.", items: [
    { id: "professionals", number: "01", title: "Access to Healthcare Professionals", description: "Engage directly with Nigeria’s most vibrant medical student communities and healthcare personnel." },
    { id: "visibility", number: "02", title: "Strengthen Brand Visibility", description: "Associate your brand with innovation, leadership, and youth empowerment in healthcare" },
    { id: "showcase", number: "03", title: "Showcase your Product & Services", description: "Through exhibitions, branding opportunities & sponsored session" },
    { id: "relationships", number: "04", title: "Build Long-Term Relationships", description: "Create meaningful partnerships that extend beyond a single event." },
    { id: "impact", number: "05", title: "Demonstrate Social Impact", description: "Support initiatives that improve community health contributing to your yearly CSR" },
  ] },
  partners: { eyebrow: "Partners", title: "Trusted By Leading Organizations", description: "AMSUL has collaborated with organizations committed to advancing healthcare, education, and community development.", items: landing.partners.items },
  calloutImage: "/assets/partnership-2026/callout.jpg",
  callout: { eyebrow: "Partnership", title: "Building the Next Generation of Healthcare Leaders", description: "For sixty years, AMSUL has remained committed to empowering medical students to lead with compassion, excellence and purpose. As we celebrate our legacy, we look forward to building an even stronger future through innovation, collaboration and service." },
  testimonials: { eyebrow: "Testimonials", title: "Hear from Clients we’ve helped tell their Stories", items: [
    { id: "finding-story", label: "Finding Story X", quote, continuation, name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgDownload15, logoVariant: "standard" },
    { id: "public-speaking", label: "Public Speaking", quote, continuation: "Before Jali Africa, I had the product but no voice. Now I close more clients.", name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgDownload15, logoVariant: "standard" },
    { id: "jali-advanced", label: "Jali Advanced", quote, continuation, name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgDownload15, logoVariant: "standard" },
    { id: "founder", label: "Founder X", quote, continuation, name: "Ajala Michael", position: "Product Designer, ET", portrait: assets.img202504210500321, logo: assets.imgImage123, logoVariant: "founder" },
  ] },
};
export type Testimonial = typeof partnershipPage.testimonials.items[number];
