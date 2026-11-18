'use client';
import { useEffect, useState } from 'react';
import type { AppEntry } from '@/registry';
import { useApps } from './AppsContext';
import { Roll } from './Contents';

const hash = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

/**
 * A band at the end of an app page with four more tools: the one before, the one after, and two others.
 * The two others are fixed when the page is built (so the links are always in the page), then shuffled in your browser each visit.
 */
export function TryRow({ slug }: { slug: string }) {
  const { index } = useApps();
  const i = index.findIndex((a) => a.slug === slug);
  const n = index.length;
  const prev = index[(i - 1 + n) % n];
  const next = index[(i + 1) % n];
  const others = index.filter((a) => a.slug !== slug && a.slug !== prev?.slug && a.slug !== next?.slug);
  const [extra, setExtra] = useState<AppEntry[]>(() => {
    if (others.length < 2) return others;
    const a = hash(slug) % others.length;
    const b = (a + 1 + (hash(slug + 'x') % (others.length - 1))) % others.length;
    return [others[a], others[b]];
  });
  useEffect(() => {
    if (others.length < 2) return;
    const pool = [...others];
    const pick = () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    setExtra([pick(), pick()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, n]);
  if (i < 0 || !prev || !next) return null;
  return (
    <section className="bd bd-try" aria-labelledby="try-title">
      <div className="wrap bd-in">
        <div className="bd-h"><h2 id="try-title" className="d">Try next</h2></div>
        <Roll rows={[prev, next, ...extra]} />
      </div>
    </section>
  );
}
