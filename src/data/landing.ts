// Static landing-page editorial content; reports, events, and stories come from the shared website feed.
export const reportSummary = "Explore reports documenting the outcomes, reach, and achievements of AMSUL initiatives and programs.";

export const landing = {
  hero: {
    images: [1, 2, 3, 4].map(index => `/assets/landing-2026/hero-${index}.jpg`),
    badge: "MEDICINE BEYOND TIME",
    title: "Shaping Medical Leaders. Creating Impact.",
    since: "Since 1966",
    description: "For six decades, the Association of Medical Students, University of Lagos has nurtured generations of healthcare professionals through leadership, advocacy, service, and excellence.",
  },
  partners: {
    eyebrow: "Partners", title: "Trusted By Leading Organizations",
    description: "AMSUL has collaborated with organizations committed to advancing healthcare, education, and community development.",
    items: [
      { id: "arise", name: "ARise", image: "/assets/landing-2026/partners/partner-arise.png", width: 175, height: 80, crop: { width: 128.4, height: 100, left: -12.96, top: 0 } },
      { id: "fidson", name: "Fidson", image: "/assets/landing-2026/partners/partner-fidson.png", width: 96, height: 96 },
      { id: "mobihealth", name: "MobiHealth", image: "/assets/landing-2026/partners/partner-mobihealth.jpg", width: 147.975, height: 96 },
      { id: "dobic-health", name: "Dobic Health", image: "/assets/landing-2026/partners/partner-dobic-health.jpg", width: 88, height: 88 },
      { id: "redus", name: "REDUS", image: "/assets/landing-2026/partners/partner-redus.jpg", width: 88, height: 88 },
      { id: "7up", name: "7UP", image: "/assets/landing-2026/partners/partner-7up.png", width: 128.303, height: 88, crop: { width: 124.78, height: 136.55, left: -13.98, top: -16.6 } },
      { id: "pillsplus", name: "PillsPlus Pharmacy", image: "/assets/landing-2026/partners/partner-pillsplus.png", width: 176, height: 88 },
      { id: "eight-medical", name: "EightMedical", image: "/assets/landing-2026/partners/partner-eight-medical.png", width: 184.649, height: 80, crop: { width: 100, height: 229.73, left: 0, top: -64.86 } },
      { id: "leadway-health", name: "Leadway Health", image: "/assets/landing-2026/partners/partner-leadway-health.png", width: 171.429, height: 100 },
      { id: "nectar-beauty-hub", name: "Nectar Beauty Hub", image: "/assets/landing-2026/partners/partner-nectar-beauty-hub.png", width: 106.667, height: 80 },
      { id: "fajim-foundation", name: "Fajim Medical Care Foundation", image: "/assets/landing-2026/partners/partner-fajim-foundation.png", width: 161.29, height: 80 },
      { id: "bt-book", name: "BT Book", image: "/assets/landing-2026/partners/partner-bt-book.png", width: 88, height: 88, crop: { width: 132.28, height: 132.28, left: -16.14, top: -16.14 } },
    ],
  },
  photos: ["/assets/landing-2026/section-1.jpg", "/assets/landing-2026/section-2.jpg"],
  statistics: [
    { value: "50+", label: "Community Outreaches", tone: "wine", image: "/assets/landing-2026/impact-1.jpg" },
    { value: "15+", label: "Annual Events", tone: "gold", image: "/assets/landing-2026/impact-2.jpg" },
    { value: "20+", label: "Impact Awards", tone: "gold", image: "/assets/landing-2026/impact-3.jpg" },
    { value: "15k+", label: "Alumni Community", tone: "wine", image: "/assets/landing-2026/impact-4.jpg" },
  ],
  history: {
    eyebrow: "1966 — 2026", title: "A Legacy Six Decades Strong",
    description: "From generations of student leaders to thousands of medical professionals impacting lives across the world, AMSUL has remained a symbol of leadership, advocacy, and excellence.",
    milestones: [
      { id: "1960s", year: "1960s - 1970s", title: "The MSA Era: Building the Foundation", description: "The association operated as the Medical Students' Association (MSA), laying the foundation for decades of student leadership, representation, camaraderie and collective development. During this formative period, the association established its identity within the growing medical student community and nurtured the traditions that would shape its future." },
      { id: "1962", year: "1962", title: "The Beginning of Medical Education at UNILAG", description: "The College of Medicine began its journey with the admission of its pioneer class of 28 medical students, who commenced lectures on 3 October 1962. This marked the beginning of a legacy of medical education, research and healthcare development that continues to shape generations of healthcare professionals." },
      { id: "1966", year: "1966", title: "The Establishment of the Medical Students' Association (MSA)", description: "Emerging from the early medical student community, the Medical Students' Association (MSA) was established in 1966 as a platform for student representation, collective engagement, welfare and the advancement of shared interests. This marked the beginning of an organised student community whose legacy would evolve across generations." },
      { id: "1967", year: "1967", title: "Integration into the University of Lagos Structure", description: "Following the 1967 restructuring of the University, the Medical School became an integral part of the University of Lagos, adopting the collegiate structure that gave rise to the present College of Medicine. This marked an important institutional transition in the development of medical education at UNILAG." },
      { id: "1980s", year: "1980s", title: "The LUMSA Era: A New Institutional Identity", description: "In the 1980s, the association evolved from the Medical Students' Association (MSA) into the Lagos University Medical Students' Association (LUMSA). This transition represented an important stage in its institutional identity, further establishing its connection with the University of Lagos while sustaining its commitment to student welfare, representation, unity and leadership." },
      { id: "1986", year: "1986", title: "Development of the College's Institutional Infrastructure", description: "The Old Great Hall, now one of the familiar landmarks of the College community, was recorded in University infrastructure documentation as having been commissioned in 1986. It has since served as an important venue for academic, social and institutional gatherings." },
      { id: "1990s", year: "1990s", title: "The Emergence of AMSUL: A Renewed Identity", description: "The association transitioned from the Lagos University Medical Students' Association (LUMSA) to the Association of Medical Students, University of Lagos (AMSUL), adopting the identity it proudly bears today. This evolution reflected its continued growth, institutional development and expanding vision for medical student representation, leadership, academic excellence and service." },
      { id: "2000s", year: "2000s", title: "The Modern Era – A Community Beyond the Classroom", description: "Over the years, AMSUL has grown into a vibrant and influential student organisation with a broad portfolio of initiatives spanning academic excellence, professional development, sports, gender inclusion, leadership, healthcare advocacy and community outreach. Its flagship programmes have become important platforms for student engagement, institutional visibility and meaningful community impact." },
      { id: "2026", year: "2026", title: "AMSUL @60: Celebrating Six Decades of Impact", description: "As AMSUL marks its Diamond Jubilee, the association celebrates 60 years of impact, leadership and excellence. This milestone provides an opportunity to honour its rich legacy, recognise the contributions of past and present leaders, strengthen alumni relationships and build a more impactful future for generations of medical students." },
    ],
  },
  reports: {
    eyebrow: "Impact Reports", title: "Impact You Can Measure", description: reportSummary,
    items: [],
  },
  events: {
    eyebrow: "Upcoming Events", title: "What's Happening Next",
    description: "Discover upcoming events, conferences, and initiatives shaping the AMSUL experience.",
    featured: {
      title: "AMSUL HEALTHWEEK 2026", category: "Category", excerpt: reportSummary,
      additionalText: "Explore reports documenting the outcomes, reach,",
      href: "/programs-events/amsul-healthweek-2026",
    },
    items: Array.from({ length: 3 }, (_, index) => ({
      id: `event-${index + 1}`, title: "AMSUL BUSINESS SUMMIT 2026",
      program: index === 0 ? "NAME OF PROGRAMME" : "AMSUL HEALTHWEEK", category: index === 0 ? "Category" : "Entrepreneurship",
      date: index === 1 ? "Wed.,  July 1st" : "Wed.,  July 1st, 2026",
      location: "Old Great Hall, LUTH", time: "10:00AM - 2:00PM", priceLabel: index === 1 ? null : "$5000",
      href: "/programs-events/amsul-business-summit-2026",
    })),
  },
  stories: {
    eyebrow: "Stories & Insights", title: "Stories That Matter",
    description: "From student achievements to public health awareness and opportunities, discover stories shaping our community.",
    items: Array.from({ length: 5 }, (_, index) => ({
      id: `story-${index + 1}`, title: "Mortality rate, neonatal (per 1000 live births) - Nigeria",
      excerpt: reportSummary, author: "Ajala Michael", date: "July 1st, 2026",
      tags: index === 0 ? ["Content Type", "Category", "Content Unit"] : index === 1 ? ["Publication", "Research", "Editorial Board"] : ["News", "Election", "Electoral Committee"],
      href: "/blog/dear-future-doctor-it-is-okay-to-be-undecided",
    })),
  },
  partnership: {
    eyebrow: "Partnership", title: "Partner With A Legacy Of Excellence",
    paragraphs: [
      "Join us in advancing medical education, leadership development, public health advocacy, and community impact.",
      "Together, we can create the next chapter of AMSUL's story.",
    ],
    benefits: [
      { number: "01", title: "Get Access to Healthcare Professionals", description: "Engage directly with Nigeria’s most vibrant medical student communities and healthcare personnel." },
      { number: "02", title: "Strengthen your Brand Visibility", description: "Associate your brand with innovation, leadership, and youth empowerment in healthcare" },
      { number: "03", title: "Demonstrate Social Impact", description: "Support initiatives that improve community health and education contributing to your yearly CSR" },
    ],
  },
};
