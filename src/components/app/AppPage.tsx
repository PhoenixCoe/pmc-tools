import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { FaqAccordion } from '@/components/shared/FaqAccordion';
import { AppIcon } from '@/components/shared/icons';
import { JsonLd } from '@/components/shared/JsonLd';
import { RecentTracker } from '@/components/shared/Recent';
import { TryRow } from '@/components/shared/TryRow';
import { categoryBySlug } from '@/lib/categories';
import { appJsonLd, appMetadata } from '@/lib/seo';
import { UiIcon } from '@/components/shared/icons';
import { getApp } from '@/registry';

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
 * One app: a slim title block (picture, name, one line), the tool right under it, then a short About with the data note,
 * three questions and four more tools to try.
 * Chat-style apps (fullbleed) have no title block: the tool fills the page under the island.
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
        <header className="th">
          <div className="ht ht-s" aria-hidden><i /><i /><i /></div>
          <div className="wrap th-in">
            <div className="th-plate"><span className="th-ic" aria-hidden><AppIcon slug={m.slug} size={64} still /></span><h1 className="th-t d">{m.title}</h1></div>
            <p className="th-l tx">{m.tagline}</p>
          </div>
        </header>
      )}
      <div className="wrap body">
        {!m.fullbleed && <section id="tool" className="stage" aria-label={m.title}>{children}</section>}
        {!m.fullbleed && (
          <section id="about" className="about" aria-labelledby="about-title">
            <h2 id="about-title" className="sec-t">About this tool</h2>
            <div className="panel about-p">
              <p className="about-lead">{m.description}</p>
              {note ? <p className="about-note tx"><UiIcon name="lock" size={18} />{note}</p> : null}
            </div>
          </section>
        )}
        {m.fullbleed && (m.note ?? NOTE[m.mode]) && <p className="fn tx">{m.note ?? NOTE[m.mode]}</p>}
        <FaqAccordion items={m.faq} />
        <TryRow slug={m.slug} />
      </div>
      <JsonLd data={appJsonLd(m)} />
      {m.built && <RecentTracker slug={m.slug} />}
    </div>
  );
}
