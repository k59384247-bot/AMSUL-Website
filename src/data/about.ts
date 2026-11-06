import { landing, reportSummary } from "./landing";

export const about = {
  hero: { image: "/assets/about-2026/hero.jpg", badge: "About Us", title: "Six Decades of", subtitle: "Leadership, Service and Excellence" },
  introduction: { eyebrow: "Who We Are", title: "More Than a Student Association.", paragraphs: [
    "The Association of Medical Students, University of Lagos (AMSUL) is the second medical student association in Nigeria, representing over 5,000 student members and supported by an alumni network of more than 10,000 graduates.",
    "Rooted in the College of Medicine, University of Lagos — widely recognized as the leading medical school in Sub-Saharan Africa — AMSUL has, for over 59 years, remained committed to the development, empowerment, and welfare of its members.",
    "As a key stakeholder in the academic and social ecosystem of the college, AMSUL plays a critical role in supporting the holistic growth of medical students, nurturing them with the skills, knowledge, and exposure needed to thrive within and beyond the walls of medical school. With over 99% of members actively engaged in academics, AMSUL remains the student-led force driving excellence both in the classroom and in clinical practice.",
    "As the official representative body of medical students at the leading medical school in Sub-Saharan Africa, AMSUL is committed to recognizing, celebrating, and nurturing both academic and social excellence through intentional platforms — one of which is AMSUL Health Week, a flagship event that has, for 59 years, delivered impactful programming aimed at empowering the modern medical student. Now in its 59th edition, Health Week continues to be a hub of innovation, dialogue, and development, curating events designed to equip future physicians for the evolving landscape of global healthcare."
  ] },
  statistics: { students: "5,000+", studentLabel: "Medical Students", rank: "2", rankUnit: "nd", rankLabels: ["Medical Student Association", "in Nigeria"], alumni: "10", alumniUnit: "k", alumniLabel: "Alumni" },
  calloutImage: "/assets/about-2026/callout.jpg",
  classes: [
    { id: "ad-astra", label: "Ad Astra", image: null, width: 0 },
    { id: "genezens", label: "Genezens", image: "/assets/about-2026/genezens.jpg", width: 1440 },
    { id: "class-x", label: "Class X", image: "/assets/about-2026/class-x.jpg", width: 2560 },
    { id: "nexus", label: "Nexus", image: null, width: 0 },
    { id: "elixir", label: "Elixir", image: "/assets/about-2026/elixir.jpg", width: 1280 },
  ],
  purpose: {
    eyebrow: "Purpose", title: "OUR PURPOSE", photoAlt: "An AMSUL speaker addressing an audience at a lectern",
    mission: { title: "MISSION", description: "To build platforms that promote academic excellence, foster meaningful partnerships, and create sustainable opportunities that empower medical students to thrive throughout their careers." },
    vision: { title: "VISION", description: "To be an association at the forefront of academic & clinical excellence, sustainable healthcare innovation, and leadership development, equipping future medical professionals to make lasting contributions to healthcare and society by leveraging partnerships and alumni network." },
  },
  history: {
    eyebrow: "1966 — 2026", title: "A Legacy Built Across Generations",
    description: "Every generation of AMSUL members has contributed to a legacy of academic excellence, leadership, advocacy, and service. From its founding in 1966 to its 60th anniversary, the association has continued to evolve while remaining committed to empowering future healthcare professionals.",
    milestones: landing.history.milestones,
  },
  activities: {
    eyebrow: "What We Do", title: "Building Better Medical Professionals Beyond the Classroom",
    description: "AMSUL creates opportunities that extend beyond academic training—developing leaders, serving communities, fostering innovation, and preparing future healthcare professionals to make meaningful contributions throughout their careers.",
    items: [
      { id: "academics", number: "01", title: "Academics", image: "/assets/about-2026/academics.jpg" },
      { id: "professional", number: "02", title: "Professional Development", image: "/assets/about-2026/professional.jpg" },
      { id: "philanthropy", number: "03", title: "Philanthropy", image: "/assets/about-2026/philanthropy.jpg" },
      { id: "sports", number: "04", title: "Sports", image: "/assets/about-2026/sports.jpg" },
      { id: "socials", number: "05", title: "Socials", image: "/assets/about-2026/socials.jpg" },
    ],
  },
  initiatives: {
    eyebrow: "Flagship Initiatives", title: "Flagship EVENTS Creating Lasting Impact",
    description: "Throughout the year, AMSUL delivers initiatives that strengthen medical education, empower students, improve communities and foster meaningful partnerships across healthcare and society.",
    featured: { title: "AMSUL BUSINESS SUMMIT 2026", excerpt: reportSummary, additionalText: "Explore reports documenting the outcomes, reach,", href: "/programs-events/amsul-business-summit-2026", tags: [{ label: "NAME OF PROGRAMME", dot: true }, { label: "Category", dot: false }] },
    items: Array.from({ length: 3 }, (_, index) => ({ id: `initiative-${index + 1}`, title: "AMSUL BUSINESS SUMMIT 2026", excerpt: reportSummary, additionalText: "Explore reports documenting the outcomes, reach,", href: "/programs-events/amsul-business-summit-2026" })),
  },
};
