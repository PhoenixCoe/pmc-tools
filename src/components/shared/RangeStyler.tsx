'use client';
import { useEffect } from 'react';

/**
 * Tells every slider where its handle is, as a number from 0 to 1 (--f). The page's own CSS cannot read a slider's value,
 * and it draws the fill and the handle from this number, gliding to each new one. A slider's first number is set with no glide,
 * so it never slides in from the left when the page opens.
 */
export function RangeStyler() {
  useEffect(() => {
    const paint = (r: HTMLInputElement) => {
      const min = Number(r.min || 0), max = Number(r.max || 100), v = Number(r.value);
      const f = max > min ? Math.min(1, Math.max(0, (v - min) / (max - min))) : 0;
      const first = !r.dataset.pf;
      if (!first && r.dataset.pv === String(f)) return;
      r.dataset.pv = String(f);
      if (first) {
        r.dataset.pf = '1';
        r.style.transition = 'none';
        r.style.setProperty('--f', String(f));
        r.style.setProperty('--p', `${f * 100}%`);
        void r.offsetWidth; // let the first number land before the glide is switched back on
        requestAnimationFrame(() => { r.style.transition = ''; });
      } else {
        r.style.setProperty('--f', String(f));
        r.style.setProperty('--p', `${f * 100}%`);
      }
    };
    const all = () => document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(paint);
    const onInput = (e: Event) => { const t = e.target; if (t instanceof HTMLInputElement && t.type === 'range') paint(t); };
    all();
    document.addEventListener('input', onInput, true);
    document.addEventListener('change', onInput, true);
    // sliders that appear later, or whose value the page changes itself (checked once per frame, only when something changed)
    let queued = false;
    const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; all(); }); };
    const mo = new MutationObserver(later);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['value', 'min', 'max'] });
    const id = window.setInterval(all, 120);
    return () => { document.removeEventListener('input', onInput, true); document.removeEventListener('change', onInput, true); mo.disconnect(); window.clearInterval(id); };
  }, []);
  return null;
}
