"use client";

import type { FormEvent } from "react";
import assets from "@/data/assets.json";
import { SelectControl } from "./select-control";
import { Icon } from "./ui";

export function CategoryFilters({ items, value, onChange, id, mobile = false }: {
  items: { id: string; name: string }[]; value: string; onChange: (id: string) => void; id: string; mobile?: boolean;
}) {
  if (mobile) return <div className="mobile-category-filter"><ListingSelect label="Category:" value={value} onChange={onChange} options={items.map(item => ({ value: item.id, label: item.name }))} icon={assets["listing-imgChevronDown"]} className="category-select" /></div>;
  return <div className="listing-categories"><p id={id}>Categories</p><div className="filter-chips" role="group" aria-labelledby={id}>{items.map(item => <button key={item.id} className="filter-chip" aria-pressed={value === item.id} onClick={() => onChange(item.id)}>{item.name}</button>)}</div></div>;
}

export function ListingSearch({ id, label, placeholder, value, onChange, onSubmit, icon }: {
  id: string; label: string; placeholder: string; value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; icon: string;
}) {
  return <form className="listing-search" role="search" aria-label={label} onSubmit={onSubmit}><Icon src={icon} /><label className="sr-only" htmlFor={id}>{label}</label><input id={id} type="search" placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} /><button className="button" type="submit">Search</button></form>;
}

export function ListingSelect({ label, value, onChange, options, icon, className = "" }: {
  label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; icon: string; className?: string;
}) {
  return <div className="listing-select-label"><span>{label}</span><SelectControl label={label.replace(/:$/, "")} value={value} onChange={onChange} options={options} icon={icon} className={`listing-select ${className}`} /></div>;
}
