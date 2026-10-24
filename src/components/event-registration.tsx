"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "./ui";
import { FormField } from "./form-field";
import { DetailActionCard } from "./detail-action-card";

export function EventRegistration({ content, external = false, externalIcon }: {
  content: { title: string; description: string }; external?: boolean; externalIcon: string;
}) {
  const id = useId();
  const [message, setMessage] = useState("");
  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(external ? "The external registration link has not been provided yet. Please check back later." : "Registration is not connected yet. Your details have not been sent or saved.");
  }
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
