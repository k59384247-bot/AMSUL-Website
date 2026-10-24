"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/partnership";

export function TestimonialCard({ testimonials, initialIndex }: { testimonials: Testimonial[]; initialIndex: number }) {
  const [selected, setSelected] = useState(0);
  const testimonial = testimonials[(initialIndex + selected) % testimonials.length];
  const groupId = `testimonial-${initialIndex}`;
  return <article className={`testimonial-card testimonial-panel-${initialIndex}`} aria-label={`${testimonials[initialIndex].label} testimonials`}>
    <div className="testimonial-top"><p className="testimonial-tag">{testimonial.label}</p><div className="testimonial-dots" role="group" aria-label="Choose a testimonial">{testimonials.map((item, index) => <button key={item.id} type="button" className={index === selected ? "is-active" : ""} aria-label={`Show testimonial ${index + 1}`} aria-pressed={index === selected} aria-controls={groupId} onClick={() => setSelected(index)} />)}</div></div>
    <div className="testimonial-content" id={groupId} aria-live="polite"><blockquote><p>{testimonial.quote}</p><p>{testimonial.continuation}</p></blockquote><div className="testimonial-footer"><div className="testimonial-person"><div className="testimonial-portrait"><img src={testimonial.portrait} alt={testimonial.name} /></div><div><p>{testimonial.name}</p><p>{testimonial.position}</p></div></div><div className={`testimonial-mark ${testimonial.logoVariant === "founder" ? "testimonial-mark-founder" : ""}`}><div><img src={testimonial.logo} alt="Jali Africa sample organization" /></div></div></div></div>
  </article>;
}
