"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./ui";
import "./select-control.css";

export function SelectControl({ id, label, value, onChange, options, icon, className = "", placeholder, name, required = false, light = false }: {
  id?: string; label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[];
  icon: string; className?: string; placeholder?: string; name?: string; required?: boolean; light?: boolean;
}) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const listId = `${controlId}-options`;
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({ visibility: "hidden" });
  const selected = options.findIndex(option => option.value === value);

  useLayoutEffect(() => {
    if (!open) return;
    function placeMenu() {
      const box = trigger.current?.getBoundingClientRect();
      if (!box) return;
      const width = Math.min(Math.max(box.width, 180), window.innerWidth - 24);
      const below = window.innerHeight - box.bottom - 16;
      const above = box.top - 16;
      const upward = below < Math.min(240, options.length * 44 + 12) && above > below;
      setPosition({ width, left: Math.max(12, Math.min(box.left, window.innerWidth - width - 12)), maxHeight: Math.max(44, Math.min(280, upward ? above : below)), ...(upward ? { bottom: window.innerHeight - box.top + 8 } : { top: box.bottom + 8 }) });
    }
    function outside(event: PointerEvent) {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !menu.current?.contains(target)) setOpen(false);
    }
    function scroll(event: Event) { if (!menu.current?.contains(event.target as Node)) placeMenu(); }
    placeMenu();
    document.addEventListener("pointerdown", outside);
    document.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", placeMenu);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("scroll", scroll, true); window.removeEventListener("resize", placeMenu); };
  }, [open, options.length]);

  useLayoutEffect(() => {
    const panel = menu.current;
    const option = panel?.children[active] as HTMLElement | undefined;
    if (open && panel && option) {
      if (option.offsetTop < panel.scrollTop) panel.scrollTop = option.offsetTop;
      else if (option.offsetTop + option.offsetHeight > panel.scrollTop + panel.clientHeight) panel.scrollTop = option.offsetTop + option.offsetHeight - panel.clientHeight;
    }
  }, [open, active]);

  function choose(index: number) {
    if (!options[index]) return;
    onChange(options[index].value);
    setInvalid(false);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function toggle() {
    setActive(Math.max(0, selected));
    typed.current = { text: "", time: 0 };
    setOpen(!open);
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key;
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(key)) event.preventDefault();
    if (key === "Escape" || key === "Tab") { setOpen(false); return; }
    if (key === "Enter" || key === " ") { if (open) choose(active); else toggle(); return; }
    if (key === "Home" || key === "End") { setOpen(true); setActive(key === "Home" ? 0 : options.length - 1); return; }
    if (key === "ArrowDown" || key === "ArrowUp") {
      setOpen(true);
      setActive(open ? (active + (key === "ArrowDown" ? 1 : -1) + options.length) % options.length : selected >= 0 ? selected : key === "ArrowDown" ? 0 : options.length - 1);
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = now - typed.current.time < 600 ? typed.current.text + key.toLowerCase() : key.toLowerCase();
      typed.current = { text, time: now };
      const start = open ? active : selected;
      const match = options.map((_, offset) => (Math.max(0, start) + offset + 1) % options.length).find(index => options[index].label.toLowerCase().startsWith(text));
      if (match !== undefined) { setOpen(true); setActive(match); }
    }
  }

  return <div className={`custom-select ${className} ${invalid ? "custom-select-invalid" : ""}`}>
    <button ref={trigger} id={controlId} type="button" role="combobox" className={`custom-select-trigger ${selected < 0 ? "custom-select-placeholder" : ""}`} aria-label={label} aria-expanded={open} aria-controls={listId} aria-haspopup="listbox" aria-activedescendant={open ? `${listId}-${active}` : undefined} aria-required={required || undefined} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${controlId}-error` : undefined} onClick={toggle} onKeyDown={keyDown} onBlur={() => setOpen(false)}><span className="custom-select-value">{selected >= 0 ? options[selected].label : placeholder}</span><Icon src={icon} /></button>
    {name && <input className="custom-select-validation" aria-hidden="true" tabIndex={-1} name={name} value={value} required={required} onChange={() => {}} onInvalid={event => { event.preventDefault(); setInvalid(true); trigger.current?.focus(); }} />}
    {invalid && <p className="custom-select-error" id={`${controlId}-error`} role="alert">Please select an option.</p>}
    {open && createPortal(<div ref={menu} id={listId} className={`custom-select-menu ${light ? "custom-select-menu-light" : ""}`} role="listbox" aria-label={label} style={position}>{options.map((option, index) => <div key={option.value} id={`${listId}-${index}`} role="option" aria-selected={value === option.value} data-active={active === index} onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(index)} onClick={() => choose(index)}>{option.label}</div>)}</div>, document.body)}
  </div>;
}
