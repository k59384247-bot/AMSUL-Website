import type { ReactNode } from "react";
import "./form-fields.css";

export function FormField({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div className="form-field"><label htmlFor={id}>{label}</label>{children}</div>;
}
