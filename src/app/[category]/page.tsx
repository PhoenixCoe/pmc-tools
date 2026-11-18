import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Plate } from '@/components/shared/Contents';
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

export default async function CategoryPage({ params }: P) {
  const c = categoryBySlug((await params).category);
  const g = groupList.find((x) => x.slug === c?.slug);
  if (!c || !g) notFound();
  return (
    <div data-g={c.key} className="gscope">
      <header className="th">
        <div className="ht ht-s" aria-hidden><i /><i /><i /></div>
        <div className="wrap th-in">
          <h1 className="th-t d">{c.name}</h1>
          <p className="th-l tx">{c.blurb}</p>
        </div>
      </header>
      <div className="wrap body">
        <Plate g={c.key} rows={g.apps} cols={3} />
      </div>
    </div>
  );
}
