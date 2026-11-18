import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Roll } from '@/components/shared/Contents';
import { categories, categoryBySlug } from '@/lib/categories';
import { pageUrl } from '@/lib/seo';
import { groupList } from '@/registry';

type P = { params: Promise<{ category: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = categoryBySlug((await params).category);
  if (!c) return {};
  return { title: c.name, description: c.blurb, alternates: { canonical: pageUrl(c.slug) } };
}

/** A group's own page: the whole page is the group's colour, with its name in huge capitals and every tool listed. */
export default async function CategoryPage({ params }: P) {
  const c = categoryBySlug((await params).category);
  const g = groupList.find((x) => x.slug === c?.slug);
  if (!c || !g) notFound();
  return (
    <div data-g={c.key} className="bd cat">
      <div className="ht ht-ink" aria-hidden><i /><i /><i /></div>
      <div className="wrap cat-in">
        <header className="cat-h">
          <h1 className="d">{c.name}</h1>
          <p className="tx">{c.blurb}</p>
        </header>
        <Roll rows={g.apps} cols={3} label={c.name} />
      </div>
    </div>
  );
}
