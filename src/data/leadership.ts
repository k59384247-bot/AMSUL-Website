export type LeadershipMember = {
  id: string;
  name: string;
  position: string;
  imageUrl: string | null;
  bio: string | null;
  nodeId: string;
};

const member = (id: string, position: string, nodeId: string): LeadershipMember => ({ id, name: "Michael Ajala", position, imageUrl: null, bio: null, nodeId });
const description = "Whether you have a burning question on your mind or need assistance from AMSUL, we are here to help you out 24/7!";

// shortcut: preserve Figma's repeated names, offices and reserved portraits until approved leadership records are supplied.
export const leadershipPage = {
  hero: { badge: "LEADERSHIP", title: "Leadership Rooted in Service and Excellence", description: "Every generation of AMSUL is shaped by student leaders committed to advancing academic excellence, representing their colleagues, and creating lasting impact. Meet the individuals entrusted with leading the association into its next chapter." },
  executive: { id: "executive-council", title: "executive council", description, nodeId: "460:6121", featured: [member("executive-president", "President", "460:6127"), member("executive-vice-president", "Vice President", "460:6128")], additional: Array.from({ length: 8 }, (_, index) => member(`executive-additional-${index + 1}`, "President", `460:${6130 + index}`)) },
  patrons: { id: "patrons", title: "PATRONS", description, nodeId: "460:6229", featured: Array.from({ length: 3 }, (_, index) => member(`grand-patron-${index + 1}`, "Grand Patron", `460:${6234 + index}`)), additional: Array.from({ length: 10 }, (_, index) => member(`patron-${index + 1}`, "Patron", `460:${6243 + index}`)) },
  committees: { id: "committee-heads", title: "Committee heads", description, nodeId: "460:6253", featured: ["Senate President", "Senate Vice President", "Quiz Club President", "Debate Club President", "Editorial Board President", "Create Club President"].map((position, index) => member(`committee-${index + 1}`, position, `460:${6258 + index}`)), additional: [] as LeadershipMember[] },
};
