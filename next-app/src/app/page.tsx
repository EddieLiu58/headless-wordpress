import {
  getHeroSettings,
  getWhoWeAre,
  getProducts,
  getWhatWeDo,
  getPhilosophy,
  getFooterSettings,
} from '@/lib/wordpress';
import Hero from '@/components/Hero';
import WhoWeAre from '@/components/WhoWeAre';
import Products from '@/components/Products';
import WhatWeDo from '@/components/WhatWeDo';
import Philosophy from '@/components/Philosophy';
import SiteFooter from '@/components/SiteFooter';

export default async function HomePage() {
  const [hero, whoWeAre, products, whatWeDo, philosophy, footer] = await Promise.all([
    getHeroSettings(),
    getWhoWeAre(),
    getProducts(),
    getWhatWeDo(),
    getPhilosophy(),
    getFooterSettings(),
  ]);

  return (
    <>
      <Hero settings={hero} />
      <WhoWeAre data={whoWeAre} />
      <Products items={products} />
      <WhatWeDo data={whatWeDo} />
      <Philosophy data={philosophy} />
      <SiteFooter data={footer} />
    </>
  );
}
