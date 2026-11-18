'use client';
import Link from 'next/link';
import type { GroupKey } from '@/lib/types';
import { UiIcon } from './icons';
import { AUTH_ENABLED } from './Providers';
import { AccountMenu, useAccount } from './Account';
import { ACCOUNTS } from '@/lib/pmcAccount';

/**
 * The top of every page: the logo (home) on the left and the PMC account picture on the right, with nothing behind them.
 * Every tool is reached from the home page, so there are no tabs, menus or search here.
 */
export function SiteBar({ currentKey }: { currentKey?: GroupKey }) {
  const { user, signOut, signIn } = useAccount();
  return (
    <header className="topbar" data-g={currentKey}>
      <div className="wrap tbar">
        <Link className="tbar-logo" href="/" aria-label="PMC Tools, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-tools.svg" alt="" width={52} height={52} />
          <b className="d">Tools</b>
        </Link>
        {user ? (
          <AccountMenu key={user.email + user.image.length} user={user} signOut={signOut} />
        ) : (
          <button type="button" className="pa-btn bar-pfp" aria-label="Sign in with PMC ID" title="Sign in with PMC ID" onClick={AUTH_ENABLED ? signIn : () => { location.assign(`${ACCOUNTS}/signin/?app=tools`); }}><UiIcon name="user" size={22} /></button>
        )}
      </div>
    </header>
  );
}
