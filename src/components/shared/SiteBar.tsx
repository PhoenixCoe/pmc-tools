'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { GroupKey } from '@/lib/types';
import { AppSearch } from './AppSearch';
import { UiIcon } from './icons';
import { Logo } from './Logo';
import { AUTH_ENABLED } from './Providers';
import { AccountMenu, useAccount } from './Account';
import { ACCOUNTS } from '@/lib/pmcAccount';
import { categories } from '@/lib/categories';

// The two menus hold every app icon, so they load when first needed, not with the page.
const AppsMenu = dynamic(() => import('./AppsMenu').then((m) => m.AppsMenu), { ssr: false });
const MobileMenu = dynamic(() => import('./MobileMenu').then((m) => m.MobileMenu), { ssr: false });

/**
 * The black bar across the top of every page: the logo (home), the Tools menu, search, the PMC apps button and the account picture.
 * On the home page there is no search in the bar, because the big box is right there. On a phone the search and the Tools menu become two small buttons.
 */
export function SiteBar({ home, path, currentKey, currentSlug }: { home: boolean; path: string; currentKey?: GroupKey; currentSlug?: string }) {
  const { user, signIn, signOut } = useAccount();
  const [menu, setMenu] = useState<GroupKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const [sheet, setSheet] = useState(false);
  const root = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const toggle = (k: GroupKey, el: HTMLElement) => { opener.current = el; setMenu((v) => (v === k ? null : k)); setMobile(false); setSheet(false); };

  // Moving to another page closes everything.
  useEffect(() => { setMenu(null); setMobile(false); setSheet(false); }, [path]);

  useEffect(() => {
    if (!menu && !mobile && !sheet) return;
    const away = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setMenu(null); setMobile(false); setSheet(false); } };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (menu) opener.current?.focus(); setMenu(null); setMobile(false); setSheet(false); } };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', key); };
  }, [menu, mobile, sheet]);

  // "/" and Ctrl K: focus the search you can see; on a phone with the bar search folded away, open it.
  useEffect(() => {
    const jump = () => {
      const boxes = Array.from(document.querySelectorAll<HTMLInputElement>('input[data-appsearch]'));
      const seen = boxes.find((b) => b.offsetParent !== null);
      if (seen) { seen.focus(); seen.select(); } else { setMenu(null); setMobile(false); setSheet(true); }
    };
    window.addEventListener('pmc:search', jump);
    return () => window.removeEventListener('pmc:search', jump);
  }, []);

  const accountLink = !AUTH_ENABLED ? null : user
    ? <button type="button" onClick={signOut}>Sign out ({user.name || user.email})</button>
    : <button type="button" onClick={signIn}>Sign in</button>;

  // The shared PMC apps button, from the same file every PMC site uses.
  const by = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    const go = () => { const w = window as unknown as { PmcBy?: { mount: (el: HTMLElement) => void } }; if (!w.PmcBy || !by.current) return false; if (!by.current.firstChild) w.PmcBy.mount(by.current); return true; };
    if (!go()) t = setInterval(() => { if (go()) clearInterval(t); }, 50);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="topbar" ref={root} data-g={currentKey}>
      <div className="isl">
        <Link className="isl-b isl-logo" href="/" aria-label="PMC Tools, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="isl-mark" src="/logo-tools.svg" alt="" width={44} height={44} />
          <span className="isl-name d">Tools</span>
        </Link>
        <nav className="isl-groups" aria-label="Tool groups">
          {categories.map((c) => (
            <button key={c.key} type="button" data-g={c.key} className={`isl-g${menu === c.key ? ' on' : ''}${currentKey === c.key ? ' cur' : ''}`} aria-expanded={menu === c.key} aria-controls="apps-menu" onClick={(e) => toggle(c.key, e.currentTarget)}>
              <i className="isl-sq" aria-hidden />{c.short}
            </button>
          ))}
        </nav>
        <button type="button" className={`isl-title isl-desk${menu ? ' on' : ''}`} aria-expanded={!!menu} aria-controls="apps-menu" onClick={(e) => toggle(currentKey ?? 'text', e.currentTarget)}>
          All tools <i className="chev" aria-hidden />
        </button>
        {home ? <span className="isl-sp" /> : <div className="isl-search"><AppSearch variant="bar" /></div>}
        <button type="button" className="isl-b isl-sm" aria-label="Search tools" aria-expanded={sheet} onClick={() => { if (home) window.dispatchEvent(new Event('pmc:search')); else { setSheet((v) => !v); setMobile(false); setMenu(null); } }}><UiIcon name="search" size={22} /></button>
        <button type="button" className={`isl-b isl-burger${mobile ? ' on' : ''}`} aria-label="All tools" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => { setMobile((v) => !v); setSheet(false); setMenu(null); }}>
          <UiIcon name={mobile ? 'close' : 'menu'} size={22} />
        </button>
        <Link className="isl-b isl-set" href="/settings" aria-label="Settings" title="Settings"><UiIcon name="gear" size={22} /></Link>
        <span className="isl-cell"><span ref={by} className="isl-by" /></span>
        <span className="isl-cell">
          {user ? (
            <AccountMenu key={user.email + user.image.length} user={user} signOut={signOut} />
          ) : (
            <button type="button" className="pa-btn bar-pfp" aria-label="Sign in with PMC ID" title="Sign in with PMC ID" onClick={AUTH_ENABLED ? signIn : () => { location.assign(`${ACCOUNTS}/signin/?app=tools`); }}><UiIcon name="user" size={22} /></button>
          )}
        </span>
      </div>
      {menu && <AppsMenu key={menu} groupKey={menu} currentKey={currentKey} currentSlug={currentSlug} onClose={() => setMenu(null)} />}
      {mobile && <MobileMenu currentKey={currentKey} currentSlug={currentSlug} onClose={() => setMobile(false)} accountLink={accountLink} />}
      {sheet && <div className="isl-sheet"><AppSearch variant="bar" autoFocus onDone={() => setSheet(false)} /></div>}
    </header>
  );
}
