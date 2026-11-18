import type { Metadata } from 'next';
import Link from 'next/link';
import { Band } from '@/components/shared/Band';
import { UiIcon, type UiName } from '@/components/shared/icons';
import { AUTH_ENABLED } from '@/components/shared/Providers';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What PMC Tools keeps and what it never sees.',
  alternates: { canonical: `${SITE}/privacy` },
};

const ACCOUNTS = AUTH_ENABLED;

const Tile = ({ n }: { n: UiName }) => <span className="dec-i" aria-hidden><UiIcon name={n} size={30} /></span>;

export default function Privacy() {
  return (
    <>
      <Band title="Privacy" tone="cream" icon={<UiIcon name="lock" size={40} />} />
      <div className="wrap body"><section className="sec" aria-label="Privacy details">
        <div className="panel"><ul className="decisions">
          <li>
            <Tile n="file" /><h2 className="d">Your text and files</h2>
            <p className="tx">What you type, paste or open stays in your browser. We never get it. If a tool loads something from a web address, like a picture, your browser asks that site for it.</p>
          </li>
          <li>
            <Tile n="device" /><h2 className="d">Saved on your device</h2>
            <p className="tx">Your settings, the tools you opened lately and some unfinished work are remembered on this device only. <Link href="/settings"><u>Settings</u></Link> has a button that clears all of it.</p>
          </li>
          <li>
            <Tile n="unseen" /><h2 className="d">Adverts and tracking</h2>
            <p className="tx">No adverts and no tracking. The fonts come from this site. Whoever hosts the site may keep normal server logs, like your IP address and the pages you asked for.</p>
          </li>
          {ACCOUNTS && (
            <li>
              <Tile n="user" /><h2 className="d">Accounts</h2>
              <p className="tx">You don't need an account. If you sign in, you do it on PMC ID, so PMC Tools never sees your password. This browser keeps your name, email and picture to show who is signed in, and PMC ID notes that you used PMC Tools. Signing out clears them from this device.</p>
            </li>
          )}
          <li>
            <Tile n="idea" /><h2 className="d">Suggestions</h2>
            <p className="tx">A suggestion goes to ideas@pmcstudios.uk with your description, and your email if you add one. We only use the email to tell you if we build it.</p>
          </li>
          <li>
            <Tile n="mail" /><h2 className="d">Questions</h2>
            <p className="tx">Email <a href="mailto:ideas@pmcstudios.uk"><u>ideas@pmcstudios.uk</u></a>. Updated 12 November 2026.</p>
          </li>
        </ul></div>
      </section></div>
    </>
  );
}
