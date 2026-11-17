import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { FaqAccordion } from '@/components/shared/FaqAccordion';
import { AppIcon } from '@/components/shared/icons';
import { JsonLd } from '@/components/shared/JsonLd';
import { RecentTracker } from '@/components/shared/Recent';
import { TryRow } from '@/components/shared/TryRow';
import { categoryBySlug } from '@/lib/categories';
import { appJsonLd, appMetadata } from '@/lib/seo';
import { UiIcon } from '@/components/shared/icons';
import { getApp, groupList } from '@/registry';

export const appPageMetadata = (category: string, slug: string): Metadata => {
  const m = getApp(category, slug);
  return m ? appMetadata(m) : {};
};

const MODE_LABEL = { local: 'Runs in your browser', network: 'Needs the internet for one step', server: 'Saved on the PMC server' } as const;
const MODE_ICON = { local: 'lock', network: 'cloud', server: 'cloud' } as const;

const NOTE = {
  local: undefined,
  network: 'This tool contacts an outside service only to fetch what it needs, such as exchange rates. What you type stays on your device.',
  server: 'What you make here is stored on the PMC server for as long as you choose, and you can delete it at any time.',
} as const;

/**
 * One app: a coloured band with its name, the tool, three questions, and four more apps to try.
 * The whole page carries its group's colour (data-g), so the tool's shadows and buttons take it too.
 * Chat-style apps (fullbleed) have no band: the tool fills the page under the top bar.
 */
export function AppPage({ category, slug, children }: { category: string; slug: string; children: ReactNode }) {
  const m = getApp(category, slug);
  const c = categoryBySlug(category);
  if (!m || !c) notFound();
  const note = m.note ?? NOTE[m.mode] ?? 'What you type or open stays on your device. Nothing is uploaded.';

  return (
    <div data-g={c.key} className="gscope">
      {m.fullbleed ? (
        <>
          <h1 className="sr">{m.title}</h1>
          <section id="tool" className="bleed" aria-label={m.title}>{children}</section>
        </>
      ) : (
        <header className="ahero gtone">
          <div className="wrap ahero-in">
            <nav className="crumbs" aria-label="You are here">
              <Link href="/">All tools</Link><i aria-hidden>/</i><Link href={`/${c.slug}/`}>{c.name}</Link>
            </nav>
            <div className="ahero-row">
              <span className="ahero-ic" aria-hidden><AppIcon slug={m.slug} size={96} still /></span>
              <div className="ahero-t">
                <h1 className="d">{m.title}</h1>
                <p>{m.tagline}</p>
              </div>
            </div>
            <ul className="achips">
              <li className="achip"><UiIcon name={MODE_ICON[m.mode]} size={18} />{MODE_LABEL[m.mode]}</li>
              <li className="achip"><UiIcon name="check" size={18} />Free, no sign-in</li>
            </ul>
            <nav className="jump" aria-label="On this page">
              <a href="#tool">Use it</a><a href="#about">About</a><a href="#faq-title">Questions</a><a href="#more">More tools</a>
            </nav>
          </div>
        </header>
      )}
      <div className="wrap body">
        {!m.fullbleed && <section id="tool" className="stage" aria-label={m.title}>{children}</section>}
        {!m.fullbleed && (
          <section id="about" className="sec about" aria-labelledby="about-title">
            <div className="sec-h"><h2 id="about-title" className="d">About this tool</h2></div>
            <div className="about-grid">
              <div className="panel about-main">
                <p className="about-lead">{m.description}</p>
                {m.features && m.features.length > 0 ? (
                  <ul className="about-list">{m.features.map((f) => <li key={f}><UiIcon name="check" size={20} />{f}</li>)}</ul>
                ) : (
                  <ul className="about-tags" aria-label="Good for">{m.keywords.slice(0, 8).map((k) => <li key={k}>{k}</li>)}</ul>
                )}
              </div>
              {note ? (
                <aside className="panel about-data" aria-label="Your data">
                  <h3 className="d"><UiIcon name="lock" size={22} />Your data</h3>
                  <p className="tx">{note}</p>
                </aside>
              ) : null}
            </div>
          </section>
        )}
        {m.fullbleed && (m.note ?? NOTE[m.mode]) && <p className="fn tx">{m.note ?? NOTE[m.mode]}</p>}
        <FaqAccordion items={m.faq} />
        {!m.fullbleed && (
          <section id="more" className="sec more" aria-labelledby="more-title">
            <div className="sec-h"><h2 id="more-title" className="d">More from {c.short}</h2></div>
            <ul className="moreg">
              {(groupList.find((g) => g.key === c.key)?.apps ?? []).filter((a) => a.slug !== m.slug).map((a) => (
                <li key={a.slug}>
                  <Link href={a.href} className="moreg-a"><span className="ic"><AppIcon slug={a.slug} size={40} still /></span><span className="moreg-t"><b className="d">{a.title}</b><small>{a.tagline}</small></span></Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <TryRow slug={m.slug} />
      </div>
      <JsonLd data={appJsonLd(m)} />
      {m.built && <RecentTracker slug={m.slug} />}
    </div>
  );
}
