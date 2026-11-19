'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppIcon } from './icons';

const KEY = 'pmc:recent';
const read = (): string[] => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; } };

/** Put on every app page: remembers (on this device only) which apps you opened, newest first. */
export function RecentTracker({ slug }: { slug: string }) {
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify([slug, ...read().filter((s) => s !== slug)].slice(0, 6))); } catch { /* storage blocked */ } }, [slug]);
  return null;
}

/** The home page row of tools you opened lately. It stays out of the way until you have opened one. */
export function RecentList({ apps, max = 4 }: { apps: { slug: string; title: string; href: string; key: string }[]; max?: number }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => setSlugs(read()), []);
  const list = slugs.map((s) => apps.find((a) => a.slug === s)).filter((a): a is NonNullable<typeof a> => !!a).slice(0, max);
  if (!list.length) return null;
  return (
    <div className="fd-recent">
      <p id="recent-title">Opened lately</p>
      <ul aria-labelledby="recent-title">
        {list.map((a) => (
          <li key={a.slug} data-g={a.key}><Link href={a.href}><span className="ic"><AppIcon slug={a.slug} size={22} still /></span>{a.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}
