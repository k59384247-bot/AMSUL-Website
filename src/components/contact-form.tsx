"use client";

import { useState, type FormEvent } from "react";
import { contactPage } from "@/data/contact-page";
import assets from "@/data/contact-assets.json";
import { DetailActionCard } from "./detail-action-card";
import { FormField } from "./form-field";
import { SelectControl } from "./select-control";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const content = contactPage.form;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Message submission is not connected yet. Your enquiry has not been sent or saved.");
  }
  return <DetailActionCard id="contact-form-title" content={content} className="contact-form-card"><form aria-label="Contact enquiry" onSubmit={submit} onInput={() => setMessage("")}>
    <div className="contact-form-fields">
      <FormField id="contact-name" label="Full Name/Company Name"><input id="contact-name" name="name" placeholder="John Doe" autoComplete="name" required pattern={String.raw`.*\S.*`} maxLength={160} /></FormField>
      <div className="contact-email-phone"><FormField id="contact-email" label="Email Address"><input id="contact-email" name="email" type="email" placeholder="Johndoe@gmail.com" autoComplete="email" required maxLength={254} /></FormField><FormField id="contact-phone" label="Phone Number"><input id="contact-phone" name="phone" type="tel" placeholder="+2348000000000" autoComplete="tel" pattern={String.raw`\+?[0-9 ]{7,25}`} /></FormField></div>
      <FormField id="contact-category" label="Enquiry Category"><SelectControl id="contact-category" name="category" label="Enquiry Category" required value={category} onChange={value => { setCategory(value); setMessage(""); }} placeholder="Select a category" options={content.categories.map(item => ({ value: item, label: item }))} icon={assets.imgOcticonChevronDown12} light /></FormField>
      <FormField id="contact-subject" label="Subject"><input id="contact-subject" name="subject" placeholder="What do you need help with?" required pattern={String.raw`.*\S.*`} maxLength={200} /></FormField>
      <FormField id="contact-message" label="Message"><textarea id="contact-message" name="message" placeholder="Write a message" required maxLength={5000} onChange={event => event.currentTarget.setCustomValidity(event.currentTarget.value.trim() ? "" : "Please enter a message.")} /></FormField>
    </div>
    <div className="contact-form-actions"><button className="button detail-action-button" type="submit">{content.buttonLabel}</button><p>{content.responseNote}</p></div>
    {message && <p className="detail-action-status" role="status">{message}</p>}
  </form></DetailActionCard>;
}
