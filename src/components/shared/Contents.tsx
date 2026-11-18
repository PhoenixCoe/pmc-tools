import Link from 'next/link';
import type { GroupEntry } from '@/registry';
import { AppIcon, UiIcon } from './icons';

type Row = { slug: string; href: string; title: string; tagline: string };

/**
 * A plain list of tools: a small picture, the name, and what it does in a few words.
 * It takes its colours from the band it sits in, so it works on every group colour.
 */
export function Roll({ rows, cols = 2, label }: { rows: Row[]; cols?: 2 | 3; label?: string }) {
  return (
    <ul className={`rl-l rl-${cols}`} aria-label={label}>
      {rows.map((a) => (
        <li key={a.slug}>
          <Link href={a.href} className="rl">
            <span className="rl-ic"><AppIcon slug={a.slug} size={52} still /></span>
            <span className="rl-t"><b className="d">{a.title}</b><small className="tx">{a.tagline}</small></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** A full-width band in one group's colour: the group's name on the left, its tools on the right. */
export function GroupBand({ g, id }: { g: GroupEntry; id: string }) {
  return (
    <section className="bd" data-g={g.key} aria-labelledby={id}>
      <div className="wrap bd-in">
        <div className="bd-h">
          <h2 id={id} className="d"><Link href={`/${g.slug}`}>{g.short}<UiIcon name="arrow" size={40} strokeWidth={3.2} /></Link></h2>
          <p className="tx">{g.blurb}</p>
          <span className="bd-n tx">{g.apps.length} tools</span>
        </div>
        <Roll rows={g.apps} label={g.name} />
      </div>
    </section>
  );
}

/** The home page: every tool, one band per group. Everything is in the page, so search engines and "find in page" see every tool. */
export function Contents({ groups }: { groups: GroupEntry[] }) {
  return (
    <>
      {groups.map((g) => <GroupBand key={g.key} g={g} id={`g-${g.key}`} />)}
      <section className="bd bd-more" aria-labelledby="g-more">
        <div className="wrap bd-more-in">
          <h2 id="g-more" className="d">Need another?</h2>
          <p className="tx">Tell us which tool is missing.</p>
          <Link href="/suggest" className="btn">Suggest a tool</Link>
        </div>
      </section>
    </>
  );
}
