import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandFeatures } from '@/components/home/BrandFeatures';
import { PromoSection } from '@/components/home/PromoSection';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 lg:pt-20">
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <BrandFeatures />
        <PromoSection />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
