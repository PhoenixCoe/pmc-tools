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
const JOBS: [string, string][] = [
  ['Fix some text', 'case-converter'],
  ['Make a picture smaller', 'image-resizer'],
  ['Make a QR code', 'vector-qr-maker'],
  ['Remove a background', 'background-remover'],
  ['Make a password', 'password-engine'],
  ['Change a PDF', 'pdf-page-manager'],
  ['Start a timer', 'pomodoro-focus-studio'],
  ['Tidy some code', 'code-formatter'],
];

export default function Home() {
  const ready = apps.filter((a) => a.built);
  const jobs = JOBS.map(([say, slug]) => ({ say, a: searchIndex.find((x) => x.slug === slug) })).filter((j): j is { say: string; a: (typeof searchIndex)[number] } => !!j.a);
  return (
    <>
      <section className="cv" aria-labelledby="start-title">
        <div className="ht" aria-hidden><i /><i /><i /></div>
        <div className="wrap cv-in">
          <h1 id="start-title" className="cv-h d">PMC Tools</h1>
          <p className="cv-sub d">{ready.length} free tools. No account needed.</p>
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
          <RecentList apps={searchIndex.map((a) => ({ slug: a.slug, title: a.title, href: a.href }))} />
        </div>
      </section>
      <Contents groups={groupList} />
      <JsonLd data={homeJsonLd(ready)} />
    </>
  );
}
