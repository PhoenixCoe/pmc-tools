import type { Metadata } from 'next';
import { Band } from '@/components/shared/Band';
import { UiIcon } from '@/components/shared/icons';
import { SuggestForm } from '@/components/shared/SuggestForm';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Suggest a Tool',
  description: 'Tell us which tool you want us to make.',
  alternates: { canonical: `${SITE}/suggest` },
};

export default function Suggest() {
  return (
    <>
      <Band title="Suggest a tool" tone="gold" icon={<UiIcon name="idea" size={40} />} />
      <div className="wrap body"><section className="sec suggest" aria-label="Suggest a tool"><SuggestForm /></section></div>
    </>
  );
}
