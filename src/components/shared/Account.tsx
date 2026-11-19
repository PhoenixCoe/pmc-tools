'use client';
import { useEffect, useRef, useState } from 'react';
import { ACCOUNTS, onAccount, savedUser, signOutHere, startSignIn, type Account } from '@/lib/pmcAccount';

export type { Account };

/** Who is signed in, from this browser. Signing in happens on PMC ID (accounts.pmcstudios.uk), so there is nothing to ask a server here. */
export function useAccount() {
  const [user, setUser] = useState<Account | null>(null);
  useEffect(() => {
    const read = () => setUser(savedUser());
    read();
    return onAccount(read);
  }, []);
  return { user, signIn: () => startSignIn('signin'), signOut: signOutHere };
}

export const initialOf = (u: Account) => (u.name || u.email || '?').trim().charAt(0).toUpperCase();

export function Avatar({ user, size = 36 }: { user: Account; size?: number }) {
  return (
    <span className="avatar d" style={{ width: size, height: size }} aria-hidden>
      {user.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={user.image} alt="" referrerPolicy="no-referrer" /> : initialOf(user)}
    </span>
  );
}

interface PmcAcct { mount: (el: HTMLElement, get: () => unknown) => void; paint: (el: HTMLElement, img: string) => void }

/** The PMC account menu (the same file every PMC app uses): the picture button, and the menu that opens from it. */
export function AccountMenu({ user, signOut }: { user: Account; signOut: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  const live = useRef({ user, signOut });
  live.current = { user, signOut };
  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    const go = () => {
      const w = window as unknown as { PmcAccount?: PmcAcct };
      if (!w.PmcAccount || !btn.current) return false;
      // Mount once. The menu reads who is signed in each time it opens, so a second mount would only add a second click that shuts it again.
      if (!btn.current.classList.contains('pa-btn')) w.PmcAccount.mount(btn.current, () => ({
        user: { name: live.current.user.name, email: live.current.user.email, img: live.current.user.image },
        manage: `${ACCOUNTS}/info/?from=tools`, addAccount: `${ACCOUNTS}/add/?from=tools`,
        onSignOut: () => live.current.signOut(),
      }));
      w.PmcAccount.paint(btn.current, live.current.user.image);
      return true;
    };
    if (!go()) t = setInterval(() => { if (go()) clearInterval(t); }, 50);
    return () => clearInterval(t);
  }, []);
  return <button type="button" ref={btn} className="bar-pfp" />;
}
