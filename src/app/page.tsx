import Link from 'next/link';
import { Surprise } from '@/components/shared/Surprise';
import { Browse } from '@/components/shared/Browse';
import { AppIcon } from '@/components/shared/icons';
import { JsonLd } from '@/components/shared/JsonLd';
import { RecentList } from '@/components/shared/Recent';
import { AppSearch } from '@/components/shared/AppSearch';
import { homeJsonLd } from '@/lib/seo';
import { apps, groupList, searchIndex } from '@/registry';

/** The common jobs, said the way a person would say them. Each one goes straight to its tool. */
const JOBS: [string, string][] = [
  ['Fix some text', 'case-converter'],
  ['Make a picture smaller', 'image-resizer'],
  ['Make a QR code', 'vector-qr-maker'],
  ['Remove a background', 'background-remover'],
  ['Make a password', 'password-engine'],
  ['Change a PDF', 'pdf-page-manager'],
  ['Start a timer', 'pomodoro-focus-studio'],
  ['Make an invoice', 'invoice-builder'],
  ['Tidy some code', 'code-formatter'],
];

export default function Home() {
  const ready = apps.filter((a) => a.built);
  const jobs = JOBS.map(([say, slug]) => ({ say, a: searchIndex.find((x) => x.slug === slug) })).filter((j): j is { say: string; a: (typeof searchIndex)[number] } => !!j.a);
  return (
    <>
      <section className="start" aria-labelledby="start-title">
        <div className="wrap start-in">
          <h1 id="start-title" className="d">{ready.length} free tools</h1>
          <p className="for d" aria-hidden>
            for
            <span className="cyc">
              <b data-g="text">text</b><b data-g="file">pictures</b><b data-g="prod">homework</b><b data-g="dev">code</b><b data-g="biz">your site</b><b data-g="file">PDFs</b>
            </span>
          </p>
          <div className="start-row">
            <AppSearch variant="hero" />
            <Surprise hrefs={searchIndex.map((a) => a.href)} />
          </div>
        </div>
      </section>
      <section className="wrap gblocks" aria-label="Kinds of tool">
        <ul>
          {groupList.map((g) => (
            <li key={g.key} data-g={g.key}>
              <Link href={`/${g.slug}/`} className="gb gtone">
                <span className="gb-ics" aria-hidden>{g.apps.slice(0, 4).map((a) => <span key={a.slug} className="gb-i"><AppIcon slug={a.slug} size={36} still /></span>)}</span>
                <b className="d">{g.name}</b>
                <span className="gb-b">{g.blurb}</span>
                <i className="gb-n d">{g.apps.length} tools</i>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="wrap body">
        <section className="newband" aria-label="New">
          <div className="nb-in">
            <span className="nb-tag d">New</span>
            <h2 className="d">Timer, stopwatch and countdown</h2>
            <p>Set a time with big buttons, run laps, or count down to a date.</p>
            <Link href="/pomodoro-focus-studio/" className="btn nb-btn">Open the timer</Link>
          </div>
          <dl className="nb-stats">
            <div><dt className="d">{ready.length}</dt><dd>free tools</dd></div>
            <div><dt className="d">0</dt><dd>sign-ins needed</dd></div>
            <div><dt className="d">0</dt><dd>files uploaded</dd></div>
          </dl>
        </section>
        <RecentList apps={searchIndex.map((a) => ({ slug: a.slug, title: a.title, href: a.href }))} />
        <section className="picks" aria-labelledby="picks-title">
          <h2 id="picks-title" className="d">Start here</h2>
          <ul className="jobs">
            {jobs.map(({ say, a }) => (
              <li key={a.slug}>
                <Link href={a.href} className="job" data-g={a.key}>
                  <span className="ic"><AppIcon slug={a.slug} size={44} still /></span>
                  <b className="d">{say}</b>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <Browse groups={groupList} />
      </div>
      <JsonLd data={homeJsonLd(ready)} />
    </>
  );
}
