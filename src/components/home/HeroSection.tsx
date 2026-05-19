import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-fashion.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary bg-primary/15 border border-primary/20 rounded-full mb-6 shadow-soft"
            >
              Winter Collection 2025
            </motion.span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] text-foreground mb-6">
              Timeless Elegance,{' '}
              <span className="italic text-primary">Modern Style</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Discover our curated collection of premium essentials designed for the contemporary wardrobe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 gradient-accent text-primary-foreground text-sm font-medium rounded-md shadow-card hover:shadow-hover transition-smooth"
              >
                Shop Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?category=new"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background/35 text-foreground text-sm font-medium border border-primary/25 rounded-md hover:bg-background/55 backdrop-blur-sm transition-smooth"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-hover ring-1 ring-primary/20">
              <img
                src={heroImage}
                alt="Fashion collection hero"
                className="w-full h-full object-cover"
              />
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 p-4 bg-background/80 backdrop-blur-md rounded-lg shadow-soft border border-primary/15"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Featured
                </p>
                <p className="font-display text-sm font-medium text-foreground">
                  Oversized Linen Blazer — $189
                </p>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gold/35 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
