'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { UiIcon } from './icons';

/** The same help button as PMC ID: a square with a question mark. It opens a short list of what people ask for most. */
export function HelpMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLSpanElement>(null), btn = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  useEffect(() => setOpen(false), [path]);
  const find = (e: React.MouseEvent) => {
    e.preventDefault(); setOpen(false);
    if ((path.replace(/\/$/, '') || '/') === '/') window.dispatchEvent(new Event('pmc:search'));
    else router.push('/?find=1');
  };
  return (
    <span className="help" ref={box}>
      <button className="tb-help" type="button" ref={btn} aria-label="Help" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}><UiIcon name="qm" size={29} /></button>
      {open ? (
        <div className="help-pop" role="menu" aria-label="Help">
          <p className="help-h">What do you need?</p>
          <a role="menuitem" href="/?find=1" onClick={find}><UiIcon name="search" size={18} />Find a tool</a>
          <Link role="menuitem" href="/suggest" onClick={() => setOpen(false)}><UiIcon name="idea" size={18} />Suggest a tool</Link>
          <Link role="menuitem" href="/settings" onClick={() => setOpen(false)}><UiIcon name="gear" size={18} />Settings</Link>
        </div>
      ) : null}
    </span>
  );
}
