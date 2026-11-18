import Link from 'next/link';
import { Surprise } from '@/components/shared/Surprise';
import { Contents } from '@/components/shared/Contents';
import { AppIcon } from '@/components/shared/icons';
import { JsonLd } from '@/components/shared/JsonLd';
import { RecentList } from '@/components/shared/Recent';
import { AppSearch } from '@/components/shared/AppSearch';
import { homeJsonLd } from '@/lib/seo';
import { apps, groupList, searchIndex } from '@/registry';

/** The common jobs, said the way a person would say them. Each one goes straight to its tool. */
const JOBS: [string, string, string][] = [
  ['Fix some text', 'Change the case, clean it up', 'case-converter'],
  ['Make a picture smaller', 'Resize and shrink', 'image-resizer'],
  ['Make a QR code', 'For a link, a Wi-Fi or a card', 'vector-qr-maker'],
  ['Remove a background', 'Cut a picture out', 'background-remover'],
  ['Make a password', 'Strong and easy to say', 'password-engine'],
  ['Change a PDF', 'Move, split and join pages', 'pdf-page-manager'],
  ['Start a timer', 'Focus and break', 'pomodoro-focus-studio'],
  ['Tidy some code', 'Format and check it', 'code-formatter'],
];

export default function Home() {
  const ready = apps.filter((a) => a.built);
  const jobs = JOBS.map(([say, , slug]) => ({ say, a: searchIndex.find((x) => x.slug === slug) })).filter((j): j is { say: string; a: (typeof searchIndex)[number] } => !!j.a);
  return (
    <>
      <section className="cv" aria-labelledby="start-title">
        <div className="ht" aria-hidden><i /><i /><i /></div>
        <div className="wrap cv-in">
          <img className="cv-mark" src="/logo-tools.svg" alt="" width={240} height={240} aria-hidden />
          <h1 id="start-title" className="cv-h d">PMC Tools</h1>
          <p className="cv-sub tx">{ready.length} free tools for text, pictures, homework, code and your website. Nothing to sign up for, nothing to install.</p>
          <AppSearch variant="hero" />
          <div className="cv-jobsw">
            <p className="cv-lab d">Common jobs</p>
            <ul className="cv-jobs">
              {jobs.map(({ say, a }) => (
                <li key={a.slug} data-g={a.key}><Link href={a.href} className="btn small cv-chip"><span className="ic"><AppIcon slug={a.slug} size={24} still /></span>{say}</Link></li>
              ))}
              <li><Surprise hrefs={searchIndex.map((a) => a.href)} /></li>
            </ul>
          </div>
        </div>
      </section>
      <div className="wrap body">
        <RecentList apps={searchIndex.map((a) => ({ slug: a.slug, title: a.title, href: a.href }))} />
        <Contents groups={groupList} />
      </div>
      <JsonLd data={homeJsonLd(ready)} />
    </>
  );
}
