import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import "./about.css";

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover six decades of AMSUL leadership, service and excellence, our mission and vision, and the community shaping tomorrow's healthcare leaders.",
};

export default function About() { return <AboutPage />; }
