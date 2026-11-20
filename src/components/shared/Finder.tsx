'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GroupEntry } from '@/registry';
import type { GroupKey } from '@/lib/types';
import { searchApps } from './AppSearch';
import { AppIcon, UiIcon } from './icons';
import { RecentList } from './Recent';

/**
 * The home page. It does one job: get you to the right tool fast.
 * Say what you need in the box, or pick a group, then pick a tool. Every tool is in the page from the start,
 * so search engines and "find in page" see all of them, and the filter only hides what you did not ask for.
 */
export function Finder({ groups }: { groups: GroupEntry[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [g, setG] = useState<'all' | GroupKey>('all');
  const all = useMemo(() => groups.flatMap((x) => x.apps), [groups]);
  const typed = q.trim().length > 0;
  const found = useMemo(() => (typed ? searchApps(all, q, all.length) : all), [all, q, typed]);
  const list = g === 'all' ? found : found.filter((a) => a.key === g);
  const countIn = (k: GroupKey) => found.filter((a) => a.key === k).length;

  // "/" and Ctrl K jump here, and so does "Find a tool" in the help menu from another page (?find=1).
  useEffect(() => {
    const focus = () => { input.current?.focus(); input.current?.select(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    window.addEventListener('pmc:search', focus);
    try {
      const u = new URL(location.href);
      if (u.searchParams.get('find')) { u.searchParams.delete('find'); history.replaceState(null, '', u.pathname + u.search + u.hash); input.current?.focus(); }
    } catch { /* no address to read */ }
    return () => window.removeEventListener('pmc:search', focus);
  }, []);

  const type = (v: string) => { setQ(v); if (v.trim()) setG('all'); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && typed && list[0]) { e.preventDefault(); router.push(list[0].href); }
    else if (e.key === 'Escape') { if (q) setQ(''); else input.current?.blur(); }
  };
  const count = typed && list.length ? (list.length === 1 ? `1 tool matches “${q.trim()}”` : `${list.length} tools match “${q.trim()}”`) : '';

  return (
    <div className="fd">
      <section className="fd-top" aria-labelledby="home-title">
        <div className="ht" aria-hidden><i /><i /><i /></div>
        <div className="wrap fd-in">
          <h1 id="home-title" className="fd-h">What do you need to do?</h1>
          <p className="fd-sub">{all.length} free tools. No account needed.</p>
          <label className="fd-search" role="search">
            <UiIcon name="search" size={26} />
            <input
              ref={input} data-appsearch="" type="search" value={q} autoComplete="off" spellCheck={false}
              placeholder={`Search ${all.length} tools`} aria-label="Search tools" enterKeyHint="go"
              onChange={(e) => type(e.target.value)} onKeyDown={onKey}
            />
            {q ? <button type="button" className="fd-clear" onClick={() => { setQ(''); input.current?.focus(); }}>Clear</button> : <kbd aria-hidden>/</kbd>}
          </label>
          {typed ? null : <RecentList apps={all.map((a) => ({ slug: a.slug, title: a.title, href: a.href, key: a.key }))} />}
        </div>
      </section>

      <div className="wrap fd-body">
        <ul className="fd-tabs" aria-label="Show tools from">
          <li><button type="button" className="fd-tab all" aria-pressed={g === 'all'} onClick={() => setG('all')}>All <small>{found.length}</small></button></li>
          {groups.map((x) => (
            <li key={x.key} data-g={x.key}>
              <button type="button" className="fd-tab" data-g={x.key} aria-pressed={g === x.key} disabled={typed && countIn(x.key) === 0} onClick={() => setG(g === x.key ? 'all' : x.key)}>
                <i aria-hidden />{x.short} <small>{typed ? countIn(x.key) : x.apps.length}</small>
              </button>
            </li>
          ))}
        </ul>
        <p className="fd-count" aria-live="polite">{count}</p>

        {list.length ? (
          <ul className="fd-grid">
            {list.map((a, i) => (
              <li key={a.slug} data-g={a.key}>
                <Link href={a.href} className="fd-tile">
                  <span className="fd-ic"><AppIcon slug={a.slug} size={62} still /></span>
                  <span className="fd-t"><b>{a.title}</b><small className="tx">{a.tagline}</small></span>
                  {typed && i === 0 ? <kbd className="fd-enter" aria-hidden>Enter</kbd> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="fd-none">
            <b>Nothing matches &ldquo;{q.trim()}&rdquo;</b>
            <p className="tx">Try a shorter word, or <Link href="/suggest">suggest the tool</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
