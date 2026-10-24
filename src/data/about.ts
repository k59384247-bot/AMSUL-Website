import { reportSummary } from "./landing";

const introduction = "The Association of Medical Students, University of Lagos (AMSUL) is the official representative body of medical students at the College of Medicine, University of Lagos.";
const background = "Founded over six decades ago, AMSUL has grown into a thriving community of over 5,000 student members and a global alumni network of more than 10,000 medical professionals. Beyond representing students, the association creates platforms that promote academic excellence, leadership, innovation, advocacy, and community service while preparing future healthcare professionals to thrive in an ever-evolving world.";

export const about = {
  hero: { badge: "About Us", title: "Six Decades of", subtitle: "Leadership, Service and Excellence" },
  introduction: { eyebrow: "Who We Are", title: "More Than a Student Association.", paragraphs: [introduction, background, introduction, background] },
  statistics: { students: "5,000+", studentLabel: "Medical Students", rank: "1", rankUnit: "st", rankLabels: ["Medical Student Association", "in Sub-Saharan Africa"], alumni: "10", alumniUnit: "k", alumniLabel: "Alumni" },
  purpose: {
    eyebrow: "Purpose", title: "OUR PURPOSE", photoAlt: "An AMSUL speaker addressing an audience at a lectern",
    mission: { title: "MISSION", description: "To build platforms that promote academic excellence, foster meaningful partnerships, and create sustainable opportunities that empower medical students to thrive throughout their careers." },
    vision: { title: "VISION", description: "To be an association at the forefront of academic & clinical excellence, sustainable healthcare innovation, and leadership development, equipping future medical professionals to make lasting contributions to healthcare and society by leveraging partnerships and alumni network." },
  },
  history: {
    eyebrow: "1966 — 2026", title: "A Legacy Built Across Generations",
    description: "Every generation of AMSUL members has contributed to a legacy of academic excellence, leadership, advocacy, and service. From its founding in 1966 to its 60th anniversary, the association has continued to evolve while remaining committed to empowering future healthcare professionals.",
    milestones: Array.from({ length: 8 }, (_, index) => ({ id: `about-milestone-${index + 1}`, year: "1966", title: "Born From God", description: "We are so proud to be made by God, from God and in his in image" })),
  },
  activities: {
    eyebrow: "What We Do", title: "Building Better Medical Professionals Beyond the Classroom",
    description: "AMSUL creates opportunities that extend beyond academic training—developing leaders, serving communities, fostering innovation, and preparing future healthcare professionals to make meaningful contributions throughout their careers.",
    items: ["01", "02", "03", "03", "03"].map((number, index) => ({ id: `activity-${index + 1}`, number, title: "AMSUL Health Week 2025", description: reportSummary, additionalText: "Explore reports documenting the outcomes,\nreach," })),
  },
  initiatives: {
    eyebrow: "Flagship Initiatives", title: "Flagship EVENTS Creating Lasting Impact",
    description: "Throughout the year, AMSUL delivers initiatives that strengthen medical education, empower students, improve communities and foster meaningful partnerships across healthcare and society.",
    featured: { title: "AMSUL BUSINESS SUMMIT 2026", excerpt: reportSummary, additionalText: "Explore reports documenting the outcomes, reach,", href: "/programs-events/amsul-business-summit-2026", tags: [{ label: "NAME OF PROGRAMME", dot: true }, { label: "Category", dot: false }] },
    items: Array.from({ length: 3 }, (_, index) => ({ id: `initiative-${index + 1}`, title: "AMSUL BUSINESS SUMMIT 2026", excerpt: reportSummary, additionalText: "Explore reports documenting the outcomes, reach,", href: "/programs-events/amsul-business-summit-2026" })),
  },
};
