'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AUTH_ENABLED } from '@/components/shared/Providers';
import { startSignIn } from '@/lib/pmcAccount';

/** What the old /signin and /signup addresses show now: the way into PMC ID, where signing in and making an account happen. */
export function ToAccount({ where }: { where: 'signin' | 'create' }) {
  const from = useSearchParams().get('from') ?? '';
  if (!AUTH_ENABLED) return <div><p className="tx auth-note">Accounts are not switched on in this copy of the site, so there is nothing to sign in to here. Every app works without one, and your settings are saved on this device.</p><Link className="btn primary auth-back" href="/">Back to the apps</Link></div>;
  return (
    <div className="auth-stack">
      <p className="tx auth-note">{where === 'create' ? 'Make your PMC ID on its own page. It then works on every PMC site.' : 'You sign in with your PMC ID, on its own page. It then works on every PMC site.'}</p>
      <button type="button" className="btn primary" onClick={() => startSignIn(where, from)}>{where === 'create' ? 'Create a PMC ID' : 'Continue to PMC ID'}</button>
      <Link className="btn auth-back" href="/">Back to the apps</Link>
    </div>
  );
}
