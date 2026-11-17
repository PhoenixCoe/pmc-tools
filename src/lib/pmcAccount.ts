/**
 * Signing in with a PMC ID (id.pmcstudios.uk). The person is sent to that page, signs in there, and comes back here.
 * This site never sees a password. All it keeps is a name, an email and a small picture, to show who is signed in.
 * Nothing to switch on: with no Supabase address in the build, the site has no sign-in and every tool works the same.
 */
export const ACCOUNTS = (process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? 'https://id.pmcstudios.uk').trim().replace(/\/+$/, '');
const URL_ = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
const KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
export const ACCOUNTS_ON = !!(URL_ && KEY);

export interface Account { name: string; email: string; image: string }

const USER = 'pmc:tools:user', ASTATE = 'pmc:tools:astate', NOTE = 'pmc:tools:note', EVENT = 'pmc:tools:account';
/** Keys the old sign-in (its own server and database) left in this browser. They are cleared so nobody looks signed in by mistake. */
const OLD = ['pmc.signedin', 'pmc.user', 'pmc.accounts', 'pmc.via'];

const b64u = (a: Uint8Array) => btoa(String.fromCharCode(...a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const same = (x: string, y: string) => { if (x.length !== y.length) return false; let d = 0; for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i); return d === 0; };
const okImg = (v: unknown): v is string => typeof v === 'string' && /^data:image\/(png|jpe?g|webp);base64,/.test(v) && v.length < 120000;

/** Which PMC site this is, as PMC ID knows it. The address the person goes back to comes from PMC ID's own list, never from here. */
const appId = () => 'tools';

export function savedUser(): Account | null {
  try {
    OLD.forEach((k) => localStorage.removeItem(k));
    const v = JSON.parse(localStorage.getItem(USER) || 'null');
    return v && typeof v.email === 'string' && typeof v.name === 'string' ? { name: v.name.slice(0, 60), email: v.email.slice(0, 254), image: okImg(v.image) ? v.image : '' } : null;
  } catch { return null; }
}
export const onAccount = (fn: () => void) => { window.addEventListener(EVENT, fn); window.addEventListener('storage', fn); return () => { window.removeEventListener(EVENT, fn); window.removeEventListener('storage', fn); }; };
const changed = () => { try { window.dispatchEvent(new Event(EVENT)); } catch { /* no window */ } };

/** Goes to PMC ID. A one-time value is made here and kept in this tab, and the way back is only accepted if it brings the same value. */
export function startSignIn(where: 'signin' | 'create' = 'signin', back = ''): void {
  const a = new Uint8Array(24); crypto.getRandomValues(a);
  const st = b64u(a);
  const here = /^\/sign(in|up)\/?$/.test(location.pathname) ? back : location.pathname + location.search;
  const from = /^\/(?![/\\])/.test(here) ? here : '/';
  try { sessionStorage.setItem(ASTATE, JSON.stringify({ st, at: Date.now(), from })); } catch { return; }
  location.assign(`${ACCOUNTS}/${where === 'create' ? 'create/name' : 'signin'}/?app=${appId()}&state=${st}`);
}

const head = (token: string, extra: Record<string, string> = {}) => ({ apikey: KEY, ...(token.startsWith('sb_') ? {} : { authorization: `Bearer ${token}` }), 'content-type': 'application/json', ...extra });
const withTimeout = <T,>(f: (s: AbortSignal) => Promise<T>) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000); return f(c.signal).finally(() => clearTimeout(t)); };

/**
 * Coming back from PMC ID, the sign-in is in the address. It is taken only if the one-time value matches, and the address is cleaned at once.
 * It is checked with PMC ID's server, the name and picture are read, this site is added to "Apps and sites" on the account page, and then that
 * sign-in is ended: this site only needs to know who you are, so it keeps no token. Returns where to go next ('' = stay), or null if there was nothing to take.
 */
export async function takeReturn(): Promise<{ ok: boolean; from: string } | null> {
  if (!ACCOUNTS_ON || typeof location === 'undefined') return null;
  let h: URLSearchParams; try { h = new URLSearchParams(location.hash.replace(/^#/, '')); } catch { return null; }
  const st = h.get('pmc_state'); if (!st) return null;
  const access = h.get('access_token') || '';
  try { history.replaceState(null, '', location.pathname + location.search); } catch { /* ignore */ }   // out of the address bar and the history before anything else
  let want: { st?: string; at?: number; from?: string } | null = null;
  try { want = JSON.parse(sessionStorage.getItem(ASTATE) || 'null'); sessionStorage.removeItem(ASTATE); } catch { /* ignore */ }
  const from = want && typeof want.from === 'string' && /^\/(?![/\\])/.test(want.from) ? want.from : '/';
  const bad = (): { ok: boolean; from: string } => { try { sessionStorage.setItem(NOTE, 'bad'); } catch { /* ignore */ } return { ok: false, from: '/settings' }; };
  if (!want || !want.st || !same(want.st, st) || Date.now() - (want.at ?? 0) > 15 * 60_000 || !access) return bad();
  try {
    const u = await withTimeout((signal) => fetch(`${URL_}/auth/v1/user`, { headers: head(access), signal }));
    if (!u.ok) return bad();
    const me = await u.json(); const email = typeof me.email === 'string' ? me.email : ''; if (!email) return bad();
    let name = '', image = '';
    try {
      const p = await withTimeout((signal) => fetch(`${URL_}/rest/v1/profiles?select=data`, { headers: head(access), signal }));
      const rows = p.ok ? await p.json() : [];
      const d = Array.isArray(rows) && rows[0] && rows[0].data ? rows[0].data : {};
      name = d.about && typeof d.about.name === 'string' ? d.about.name.trim().slice(0, 30) : '';
      image = d.avatar && okImg(d.avatar.img) ? d.avatar.img : '';
    } catch { /* the name falls back to the start of the email */ }
    await withTimeout((signal) => fetch(`${URL_}/rest/v1/app_access?on_conflict=user_id,app`, { method: 'POST', headers: head(access, { prefer: 'resolution=merge-duplicates,return=minimal' }), body: JSON.stringify({ app: 'tools', label: 'PMC Tools', pmc: true, last_at: new Date().toISOString() }), signal })).catch(() => { /* the list on the account page just misses this site */ });
    try { localStorage.setItem(USER, JSON.stringify({ name: name || email.split('@')[0].slice(0, 30), email, image })); } catch { return bad(); }
    void withTimeout((signal) => fetch(`${URL_}/auth/v1/logout?scope=local`, { method: 'POST', headers: head(access), signal })).catch(() => { /* it runs out by itself */ });
    changed();
    return { ok: true, from };
  } catch { return bad(); }
}
/** What happened on the way back, once: true if it was refused. */
export function takeNote(): boolean { try { const v = sessionStorage.getItem(NOTE); sessionStorage.removeItem(NOTE); return v === 'bad'; } catch { return false; } }

export function signOutHere(): void {
  try { localStorage.removeItem(USER); } catch { /* ignore */ }
  changed();
}
