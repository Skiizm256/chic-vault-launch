import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';

export const FeaturedProducts = () => {
  const featuredProducts = products.filter((p) => p.isNew || p.isSale).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-champagne/70">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 lg:mb-16"
        >
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              Featured Pieces
            </h2>
            <p className="text-muted-foreground max-w-md">
              Handpicked selections from our latest collection and seasonal favorites.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-smooth"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
