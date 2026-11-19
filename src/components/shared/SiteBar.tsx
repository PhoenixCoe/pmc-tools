'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { UiIcon } from './icons';
import { Logo } from './Logo';
import { HelpMenu } from './HelpMenu';
import { AUTH_ENABLED } from './Providers';
import { AccountMenu, useAccount } from './Account';
import { ACCOUNTS } from '@/lib/pmcAccount';

interface PmcByApi { mount: (el: HTMLElement) => void }

/**
 * The top of every page, the same bar as PMC ID: black, the PMC letters and a TOOLS box on the left,
 * then help, the PMC apps menu and your picture on the right. The two menus on the right are the shared PMC toolkit.
 */
export function SiteBar() {
  const { user, signOut, signIn } = useAccount();
  const by = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    const go = () => {
      const w = window as unknown as { PmcBy?: PmcByApi };
      if (!w.PmcBy || !by.current) return false;
      if (!by.current.childElementCount) w.PmcBy.mount(by.current);
      return true;
    };
    if (!go()) t = setInterval(() => { if (go()) clearInterval(t); }, 40);
    return () => clearInterval(t);
  }, []);
  return (
    <header className="gt">
      <Link className="gt-brand" href="/" aria-label="PMC Tools, home">
        <Logo className="mark" label="PMC" /><span className="gt-tag">Tools</span>
      </Link>
      <div className="gt-end">
        <HelpMenu />
        <span id="by" ref={by} />
        {user ? (
          <AccountMenu key={user.email + user.image.length} user={user} signOut={signOut} />
        ) : (
          <button type="button" className="pa-btn bar-pfp" aria-label="Sign in with PMC ID" title="Sign in with PMC ID" onClick={AUTH_ENABLED ? signIn : () => { location.assign(`${ACCOUNTS}/signin/?app=tools`); }}><UiIcon name="user" size={22} /></button>
        )}
      </div>
    </header>
  );
}
