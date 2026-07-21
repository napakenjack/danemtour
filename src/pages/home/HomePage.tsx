import { Hero } from '@/pages/home/Hero';
import { FeaturedTours } from '@/pages/home/FeaturedTours';
import { Advantages } from '@/pages/home/Advantages';
import { Stats } from '@/pages/home/Stats';
import { Experience } from '@/pages/home/Experience';
import { ReviewsPreview } from '@/pages/home/ReviewsPreview';
import { FaqPreview } from '@/pages/home/FaqPreview';
import { CtaSection } from '@/pages/home/CtaSection';

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTours />
      <Advantages />
      <Stats />
      <Experience />
      <ReviewsPreview />
      <FaqPreview />
      <CtaSection />
    </>
  );
}

export default HomePage;
