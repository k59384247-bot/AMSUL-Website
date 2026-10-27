"use client";

import type { Event } from "@/lib/website/contracts";
import { useId, useState, type FormEvent } from "react";
import { Icon } from "./ui";
import { FormField } from "./form-field";
import { DetailActionCard } from "./detail-action-card";

export function EventRegistration({ content, external = false, externalIcon, record }: {
  content: { title: string; description: string }; external?: boolean; externalIcon: string; record?: Event;
}) {
  const id = useId();
  const local = process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE !== 'api';
  external = record?.useExternalRegistration ?? external;
  const [message, setMessage] = useState("");
  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(external ? "The external registration link has not been provided yet. Please check back later." : "Registration is not connected yet. Your details have not been sent or saved.");
  }
  if (record && !record.registrationRequired) return null;
  if (record && !local) return <DetailActionCard id={`${id}-title`} content={content} className="event-registration">
    {external ? <a className="button detail-action-button" href={`/api/website/events/${encodeURIComponent(record.id)}/register`}>Register<Icon src={externalIcon} /></a> : <p>Online registration is not available here yet. Please contact the event organizer.</p>}
  </DetailActionCard>;
  return <DetailActionCard id={`${id}-title`} content={content} className="event-registration" registration={external ? "external" : "form"}>
    <form onSubmit={register} onInput={() => setMessage("")}>
      {!external && <div className="registration-fields">
        <FormField id={`${id}-name`} label="Name"><input id={`${id}-name`} name="name" autoComplete="name" placeholder="John Doe" required pattern={String.raw`.*\S.*`} maxLength={160} /></FormField>
        <FormField id={`${id}-email`} label="Email Address"><input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="Johndoe@gmail.com" required maxLength={254} /></FormField>
        <FormField id={`${id}-phone`} label="Phone Number"><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="+2348000000000" required pattern={String.raw`\+?[0-9 ]{7,25}`} /></FormField>
      </div>}
      <button className="button detail-action-button" type="submit">Register{external && <span className="detail-action-out-icon"><Icon src={externalIcon} /></span>}</button>
      {message && <p className="registration-status" role="status">{message}</p>}
    </form>
  </DetailActionCard>;
}
