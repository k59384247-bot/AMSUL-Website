import type { Metadata, Viewport } from "next";
import assets from "@/data/assets.json";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import { WebsiteDataProvider } from "@/components/website-data";

export const metadata: Metadata = {
  title: { default: "AMSUL — Medicine Beyond Time", template: "%s | AMSUL" },
  icons: { icon: [{ url: assets["hero-imgAmsul60Logo4"], type: "image/png" }], apple: assets["hero-imgAmsul60Logo4"] },
  description: "The Association of Medical Students, University of Lagos. Shaping medical leaders and creating impact since 1966.",
};
export const viewport: Viewport = { themeColor: "#090909" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main-content">Skip to content</a><WebsiteDataProvider>{children}<SiteFooter /></WebsiteDataProvider></body></html>;
}
