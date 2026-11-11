export type LeadershipSocialPlatform = "instagram" | "linkedin" | "x" | "tiktok";
export type LeadershipSocialLink = { platform: LeadershipSocialPlatform; url: string };

export type LeadershipMember = {
  id: string;
  name: string;
  cardName?: string;
  position: string;
  imageUrl: string | null;
  bio: string | null;
  socialLinks?: LeadershipSocialLink[];
  nodeId: string;
};

export const leadershipPage = {
  hero: { badge: "LEADERSHIP", title: "Leadership Rooted in Service and Excellence", description: "Every generation of AMSUL is shaped by student leaders committed to advancing academic excellence, representing their colleagues, and creating lasting impact. Meet the individuals entrusted with leading the association into its next chapter." },
  photo: "/assets/leadership-2026/hero.jpg",
  pastPresidentsUrl: "https://drive.google.com/drive/folders/1vxj5W5Ax2twXbWikr7QyyB8VlqDnCNZe",
  executive: { id: "executive-council", title: "executive council", description: "Meet the elected representatives leading AMSUL's affairs, driving its vision and advancing the interests of the medical student community.", nodeId: "921:24659" },
  committees: { id: "committee-heads", title: "Committee heads", description: "", nodeId: "921:24705" },
  patrons: { id: "patrons", title: "Patrons", description: "", nodeId: "1079:5709" },
};
