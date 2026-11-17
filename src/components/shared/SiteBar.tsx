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

// The two menus hold every app icon, so they load when first needed, not with the page.
const AppsMenu = dynamic(() => import('./AppsMenu').then((m) => m.AppsMenu), { ssr: false });
const MobileMenu = dynamic(() => import('./MobileMenu').then((m) => m.MobileMenu), { ssr: false });

/**
 * The black bar across the top of every page: the logo, an Apps menu, search (not on the home page, where the big box is),
 * and the account end. On a phone it folds to the logo, a search button and one Menu button.
 */
export function SiteBar({ home, path, currentKey, currentSlug }: { home: boolean; path: string; currentKey?: GroupKey; currentSlug?: string }) {
  const { user, signIn, signOut } = useAccount();
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [sheet, setSheet] = useState(false);
  const root = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Moving to another page closes everything.
  useEffect(() => { setMenu(false); setMobile(false); setSheet(false); }, [path]);

  useEffect(() => {
    if (!menu && !mobile && !sheet) return;
    const away = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setMenu(false); setMobile(false); setSheet(false); } };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (menu) menuBtn.current?.focus(); setMenu(false); setMobile(false); setSheet(false); } };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', key); };
  }, [menu, mobile, sheet]);

  // "/" and Ctrl K: focus the search you can see; on a phone with the bar search folded away, open it.
  useEffect(() => {
    const jump = () => {
      const boxes = Array.from(document.querySelectorAll<HTMLInputElement>('input[data-appsearch]'));
      const seen = boxes.find((b) => b.offsetParent !== null);
      if (seen) { seen.focus(); seen.select(); } else { setMenu(false); setMobile(false); setSheet(true); }
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
    <header className="topbar" ref={root}>
      <div className="bar-in">
        <Link className="bar-logo" href="/" aria-label="PMC Tools, home"><Logo className="bar-mark" /><span className="bar-word d">Tools</span></Link>
        <button ref={menuBtn} type="button" className={`bar-nav bar-apps${menu ? ' on' : ''}`} aria-expanded={menu} aria-controls="apps-menu" onClick={() => { setMenu((v) => !v); setMobile(false); setSheet(false); }}>
          All tools <i className="chev" aria-hidden />
        </button>
        {home ? <span className="bar-sp" /> : <div className="bar-search"><AppSearch variant="bar" /></div>}
        <div className="bar-end">
          <button type="button" className="bar-nav bar-sm" aria-label="Search tools" aria-expanded={sheet} onClick={() => { setSheet((v) => !v); setMobile(false); }}><UiIcon name="search" size={22} /></button>
          <button type="button" className={`bar-nav bar-sm bar-burger${mobile ? ' on' : ''}`} aria-label="Menu" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => { setMobile((v) => !v); setSheet(false); }}>
            <UiIcon name={mobile ? 'close' : 'menu'} size={22} />
          </button>
          <span ref={by} className="bar-by" />
          {user ? (
            <AccountMenu key={user.email + user.image.length} user={user} signOut={signOut} />
          ) : (
            <button type="button" className="pa-btn bar-pfp" aria-label="Sign in with PMC ID" title="Sign in with PMC ID" onClick={AUTH_ENABLED ? signIn : () => { location.assign(`${ACCOUNTS}/signin/?app=tools`); }}><UiIcon name="user" size={24} /></button>
          )}
        </div>
      </div>
      {menu && <AppsMenu currentKey={currentKey} currentSlug={currentSlug} onClose={() => setMenu(false)} />}
      {mobile && <MobileMenu currentKey={currentKey} currentSlug={currentSlug} onClose={() => setMobile(false)} accountLink={accountLink} />}
      {sheet && <div className="bar-sheet"><AppSearch variant="bar" autoFocus onDone={() => setSheet(false)} /></div>}
    </header>
  );
}
