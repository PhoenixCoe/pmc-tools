import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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

const NOTE = {
  local: 'Nothing leaves your device.',
  network: 'Needs the internet for one thing. What you type stays on your device.',
  server: 'Saved on the PMC server until you delete it.',
} as const;

/**
 * One tool: a title band in the group's colour (picture, name, a few words), the tool right under it, a one-line note,
 * then a band with more tools. Chat-style tools (fullbleed) have no title band: the tool fills the page.
 */
export function AppPage({ category, slug, children }: { category: string; slug: string; children: ReactNode }) {
  const m = getApp(category, slug);
  const c = categoryBySlug(category);
  if (!m || !c) notFound();
  const note = m.note ?? NOTE[m.mode] ?? NOTE.local;

  return (
    <div data-g={c.key} className="gscope">
      {m.fullbleed ? (
        <>
          <h1 className="sr">{m.title}</h1>
          <section id="tool" className="bleed" aria-label={m.title}>{children}</section>
        </>
      ) : (
        <header className="tt">
          <div className="wrap tt-in">
            <span className="tt-ic" aria-hidden><AppIcon slug={m.slug} size={72} still /></span>
            <div className="tt-t">
              <h1 className="d">{m.title}</h1>
              <p className="tx">{m.tagline}</p>
            </div>
          </div>
        </header>
      )}
      <div className="wrap body">
        {!m.fullbleed && <section id="tool" className="stage" aria-label={m.title}>{children}</section>}
        {!m.fullbleed && note ? <p className="tnote tx"><UiIcon name="lock" size={18} />{note}</p> : null}
        {m.fullbleed && m.mode !== 'local' && <p className="tnote tx"><UiIcon name="lock" size={18} />{note}</p>}
      </div>
      <TryRow slug={m.slug} />
      <JsonLd data={appJsonLd(m)} />
      {m.built && <RecentTracker slug={m.slug} />}
    </div>
  );
}
