import assets from "./contact-assets.json";

const assistance = "Whether you have a burning question on your mind or need assistance from AMSUL, we are here to help you out 24/7!";
const sampleAnswer = ["The eco-learn project focuses on integrating climate education into primary and secondary schools in Lagos State.", "Equipping the youths/students with requisite climate knowledge, skills, resources to thrive for a sustainable future."];

// shortcut: preserve the Figma contact details, response promises and repeated eco-learn FAQs; confirm these before launch.
export const contactPage = {
  hero: { badge: "CONTACT US", title: "Let's Start a Conversation.", description: "Whether you're a student, alumnus, healthcare professional, organization or prospective partner, we're always happy to connect and answer your questions." },
  introduction: { title: "REACH OUT TO US", description: assistance },
  channels: [
    { id: "address", label: "College of Medicine, University of Lagos, Idiaraba, Lagos State", href: "https://www.google.com/maps/search/?api=1&query=College%20of%20Medicine%2C%20University%20of%20Lagos%2C%20Idiaraba%2C%20Lagos%20State", icon: assets.imgPhBuildingOfficeFill, newTab: true },
    { id: "email", label: "contactsupport@amsul.org", href: "mailto:contactsupport@amsul.org", icon: assets.imgDashiconsEmailAlt1, newTab: false },
    { id: "whatsapp", label: "+234-810-079-5517", href: "https://wa.me/2348100795517", icon: assets.imgRiWhatsappFill, newTab: true },
    { id: "phone", label: "+234-810-011-2345", href: "tel:+2348100112345", icon: assets.imgMaterialSymbolsCall, newTab: false },
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
  faq: { eyebrow: "FAQs", title: "FREQUENTLY ASKED QUESTIONS", description: "Explore reports documenting the outcomes, reach, and achievements of AMSUL initiatives and programs.", items: [
    { id: "contact-faq-1", question: "Can organizations partner with AMSUL?", paragraphs: sampleAnswer },
    ...Array.from({ length: 3 }, (_, index) => ({ id: `contact-faq-${index + 2}`, question: "What is the project about?", paragraphs: sampleAnswer })),
  ] },
};
