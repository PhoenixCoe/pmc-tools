import { Finder } from '@/components/shared/Finder';
import { JsonLd } from '@/components/shared/JsonLd';
import { homeJsonLd } from '@/lib/seo';
import { apps, groupList } from '@/registry';

export default function Home() {
  return (
    <>
      <Finder groups={groupList} />
      <JsonLd data={homeJsonLd(apps.filter((a) => a.built))} />
    </>
  );
}
