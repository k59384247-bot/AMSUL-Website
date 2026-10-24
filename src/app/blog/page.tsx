import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { BlogListing } from "@/components/blog-listing";
import { blog } from "@/data/blog";
import "@/components/listing.css";
import "./blog.css";

export const metadata: Metadata = { title: "Blog & News", description: blog.hero.description };

export default function BlogPage() {
  return <main id="main-content" className="blog-page"><Hero {...blog.hero} centered nodeId="246:3186" /><BlogListing /></main>;
}
