import assets from "./contact-assets.json";

const assistance = "Whether you have a burning question on your mind or need assistance from AMSUL, we are here to help you out 24/7!";
export const contactPage = {
  hero: { backgroundImage: "/assets/contact-2026/hero.jpg", badge: "CONTACT US", title: "Let's Start a Conversation.", description: "Whether you're a student, alumnus, healthcare professional, organization or prospective partner, we're always happy to connect and answer your questions." },
  introduction: { title: "REACH OUT TO US", description: assistance },
  channels: [
    { id: "address", label: "3, Library Alley, College of Medicine, University of Lagos, Idi-Araba, Lagos", href: "https://www.google.com/maps/search/?api=1&query=3%2C%20Library%20Alley%2C%20College%20of%20Medicine%2C%20University%20of%20Lagos%2C%20Idi-Araba%2C%20Lagos", icon: assets.imgPhBuildingOfficeFill, newTab: true },
    { id: "email", label: "amsul_cmul@yahoo.com", href: "mailto:amsul_cmul@yahoo.com", icon: assets.imgDashiconsEmailAlt1, newTab: false },
    { id: "whatsapp", label: "+234 907 803 5715", href: "https://wa.me/2349078035715", icon: assets.imgRiWhatsappFill, newTab: true },
    { id: "phone", label: "+234 902 968 6642", href: "tel:+2349029686642", icon: assets.imgMaterialSymbolsCall, newTab: false },
  ],
  social: { title: "CONNECT WITH amSUL", description: "Connect with us on social media to stay updated.", handle: "@amsul_unilag", items: [
    { label: "AMSUL on Instagram", href: "https://www.instagram.com/amsul_unilag/", icon: assets.imgRiInstagramFill1, newTab: true },
    { label: "AMSUL on LinkedIn", href: null, icon: assets.imgGroup3, iconClassName: "contact-linkedin-icon", unavailableMessage: "The AMSUL LinkedIn profile link has not been provided yet." },
    { label: "AMSUL on X", href: "https://x.com/amsul_unilag", icon: assets.imgFa6BrandsSquareXTwitter1, newTab: true },
  ] },
  form: { title: "GOT A QUESTION", description: assistance, buttonLabel: "Send Message", responseNote: "You’ll get a response to your enquiry within 24-48hrs.",
    // shortcut: the frame supplies only the category placeholder; these local options need approval before integration.
    categories: ["General enquiry", "Partnerships", "Programs & Events"],
  },
  faq: { eyebrow: "FAQs", title: "FREQUENTLY ASKED QUESTIONS", description: "Find answers to common questions about AMSUL, our activities, services, and how to get involved.", items: [
    { id: "contact-faq-1", question: "What is AMSUL and what does it do?", paragraphs: ["The Association of Medical Students, University of Lagos (AMSUL) is the representative body for medical students at the University of Lagos. AMSUL works to promote the academic, professional, social and general welfare of medical students while creating opportunities for leadership, innovation, collaboration and personal development."] },
    { id: "contact-faq-2", question: "How can my organisation partner with AMSUL?", paragraphs: ["Organisations can partner with AMSUL through sponsorships, collaborations, educational initiatives, student development programmes, health-focused projects, brand activations and other mutually beneficial engagements. Interested organisations can contact the AMSUL executive team to discuss available partnership opportunities."] },
    { id: "contact-faq-3", question: "What value does AMSUL offer sponsors and partners?", paragraphs: ["AMSUL provides partners with access to a diverse community of medical students and opportunities for meaningful engagement with emerging healthcare professionals. Depending on the partnership, organisations may benefit from brand visibility, event presence, talent engagement, access to student audiences and association with initiatives focused on healthcare, innovation, leadership and community impact."] },
    { id: "contact-faq-4", question: "How can students get involved in AMSUL activities?", paragraphs: ["Students can participate by attending AMSUL programmes and events, joining committees and projects, volunteering, participating in competitions and contributing to initiatives across academics, welfare, sports, creativity, innovation and professional development. Information about opportunities is shared through AMSUL's official communication channels."] },
    { id: "contact-faq-5", question: "Who can attend AMSUL events?", paragraphs: ["Eligibility varies by programme. Some AMSUL events are exclusively for University of Lagos medical students, while others are open to students from other faculties, universities, healthcare professionals, industry partners or members of the general public. Each event announcement will state the intended audience and registration requirements."] },
    { id: "contact-faq-6", question: "How can I contact AMSUL for enquiries or collaboration?", paragraphs: ["For enquiries, partnership proposals, sponsorship opportunities or other official correspondence, you can fill the form above or reach out through AMSUL's official communication channels: amsul_cmul@yahoo.com or social media. Please provide details about your organisation, the purpose of your enquiry and the nature of the proposed collaboration so the appropriate team can respond."] },
  ] },
};
