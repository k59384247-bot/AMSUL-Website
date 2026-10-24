import { blogPosts } from "./blog";
import { sampleEditorialParagraphs, type AttachmentFile, type ContentSection } from "./content";

// shortcut: preserve the Figma copy, including mismatched introduction, sample final section and attachments; replace with approved editorial content before launch.
export const articleDetails = [{
  slug: "dear-future-doctor-it-is-okay-to-be-undecided",
  title: "DEAR FUTURE DOCTOR: IT IS OKAY TO BE UNDECIDED",
  description: "As part of World Hypertension Day, AMSUL joined healthcare professionals and students in raising awareness about prevention, early detection and healthier lifestyles.",
  tags: ["Category - HealthWeek", "Content Type - Academic"],
  author: "Ajala Michael", date: "July 1st, 2026", readingTime: "5 mins. read",
  sections: [
    { title: "Choosing a specialty isn’t a race.", size: 24, paragraphs: [
      "It’s a hot, blistering Tuesday, the clinic has been running since 9a.m and at 2p.m, exhaustion is palpable among you and your classmates. Waiting for the next patient to come in, your consultant tries to lift the mood, by asking each of you about what they plan to specialize in. ",
      " ",
      "As you listen to your classmates give amazing answers, which start to pique your interest, you stand up a little straighter, eager to listen to their answers. One person says orthopaedic surgery, he explains that he really connected with the specialty while he rotated through it and nothing else interested him as much as it did. You nod your head, ‘that’s very sensible’ you think. The next person says oncology, they explain how a relative of theirs died of cancer and the reason they got into medicine was so they could do some cancer research, you sympathize with them. Another classmate responds ‘I think I’d like to specialize in dermatology, it’s always fascinated me how there aren’t a lot of dermatologists in the country, but the largest organ in the body is the skin, it just doesn’t add up’, she says.",
    ] },
    { title: "CLINICAL ROTATIONS AND SPECIALTY INFLUENCES DURING MEDICAL SCHOOL", size: 20, paragraphs: [
      "“I remained undecided about my specialty until I completed the final year (600 level) of my MBBS program. In the final exams, I performed well in both medicine and surgery. Although I struggled with the long case in surgery, I achieved one of the best results in the short case. At that time, we had the traditional four-stage exam, and all stages were mandatory to pass. ",
      " ",
      "Even after medical school, I was still torn between medicine and surgery. ",
      " ",
      "My decision was influenced by two key factors. While assisting with surgery as a medical student, I frequently experienced needle pricks. When I researched this, I came across a case where a surgeon contracted hepatitis and was advised to stop operating. This was a deal-breaker for me, as a surgeon who cannot operate is fundamentally limited. Although I had initially considered becoming an orthopedic surgeon, this experience made me reconsider. ",
      " ",
      "Secondly, a cardiologist shared a piece of advice that resonated with me: 60% to 70% of hospital patients are medical cases. This observation is verifiable and confirmed my lean toward medicine.”",
    ] },
    { title: "The List That Started It All", size: 18, paragraphs: sampleEditorialParagraphs },
  ] satisfies ContentSection[],
  attachments: [
    { title: "AMSUL HealthWeek Proposal 2026", format: "pdf", url: null },
    { title: "HealthWeek Impact Report 2025", format: "slides", url: null },
  ] satisfies AttachmentFile[],
  related: blogPosts.slice(0, 3).map(post => ({ ...post, tags: ["Publication", "Research", "Editorial Board"] })),
  relatedHeading: "related reports",
  partnership: {
    eyebrow: "Partnership", title: "Inspired by what you've seen?",
    description: "Partner with AMSUL to support initiatives that improve communities, empower students, and shape the future of healthcare.",
  },
  partnershipActions: [
    { label: "Become a Partner", href: "/partnerships/become-a-partner" },
    { label: "Contact Us", href: "/contact", secondary: true, arrow: true },
  ],
}];
