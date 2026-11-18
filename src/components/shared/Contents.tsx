import Link from 'next/link';
import type { GroupEntry } from '@/registry';
import { AppIcon, UiIcon, type UiName } from './icons';

type Row = { slug: string; href: string; title: string; tagline: string; key?: string; ui?: UiName };

/**
 * One framed plate: a title bar in the group's colour, then its tools as plain rows (a small drawing, the name, what it does).
 * `cols` lays the rows out in 2 or 3 columns on a wide screen. With no title there is no bar (a group's own page already says the name).
 * `mixed` is for a list that holds tools from several groups: each row then takes its own group's colour.
 */
export function Plate({ title, g, href, count, rows, cols = 1, id, mixed, neutral }: { title?: string; g?: string; href?: string; count?: number; rows: Row[]; cols?: 1 | 2 | 3; id?: string; mixed?: boolean; neutral?: boolean }) {
  return (
    <section className={`cp cols-${cols}${neutral ? ' neutral' : ''}`} data-g={g} aria-labelledby={title ? id : undefined} aria-label={title ? undefined : 'Tools'}>
      {title && (
        <header className="cp-h">
          <h2 id={id} className="d">{href ? <Link href={href}>{title}</Link> : title}</h2>
          {count != null && <span className="cp-n">{count}</span>}
        </header>
      )}
      <ul className="cp-l">
        {rows.map((a) => (
          <li key={a.slug} data-g={mixed ? a.key : undefined}>
            <Link href={a.href} className="cp-a">
              <span className={`ic${a.ui ? ' ic-ui' : ''}`}>{a.ui ? <UiIcon name={a.ui} size={26} /> : <AppIcon slug={a.slug} size={46} still />}</span>
              <span><b className="d">{a.title}</b><small className="tx">{a.tagline}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Every tool, as five plates. Everything is in the page, so search engines and "find in page" see every tool. */
export function Contents({ groups }: { groups: GroupEntry[] }) {
  return (
    <div className="cts">
      {groups.map((g) => <Plate key={g.key} id={`g-${g.key}`} g={g.key} title={g.name} href={`/${g.slug}`} count={g.apps.length} rows={g.apps} />)}
      <Plate id="g-more" title="Missing one?" neutral rows={[{ slug: 'suggest', href: '/suggest', title: 'Suggest a tool', tagline: 'Tell us what you need', ui: 'idea' }]} />
    </div>
  );
}
