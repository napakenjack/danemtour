import { Hero } from '@/pages/home/Hero';
import { Advantages } from '@/pages/home/Advantages';
import { FeaturedTours } from '@/pages/home/FeaturedTours';
import { ReviewsPreview } from '@/pages/home/ReviewsPreview';
import { FaqPreview } from '@/pages/home/FaqPreview';
import { CtaSection } from '@/pages/home/CtaSection';

export function HomePage() {
  return (
    <>
      <Hero />
      <Advantages />
      <FeaturedTours />
      <ReviewsPreview />
      <FaqPreview />
      <CtaSection />
    </>
  );
}

export default HomePage;
