import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PromoSection = () => {
  return (
    <section className="py-20 lg:py-28 gradient-luxury-dark text-primary-foreground overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary-foreground bg-primary/80 border border-gold/25 rounded-full mb-6 shadow-soft">
              Limited Time
            </span>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight mb-6">
              Winter Sale{' '}
              <span className="italic text-gold">Up to 40% Off</span>
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg leading-relaxed">
              Discover exceptional savings on premium pieces from our winter collection. 
              Elevate your wardrobe with timeless essentials at unbeatable prices.
            </p>
            <Link
              to="/products?sale=true"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-foreground text-sm font-medium rounded-md hover:bg-primary-foreground/90 shadow-card transition-smooth"
            >
              Shop the Sale
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-lg bg-primary-foreground/10 overflow-hidden ring-1 ring-primary-foreground/10">
                  <div className="w-full h-full bg-gradient-to-br from-primary/35 to-accent/35" />
                </div>
                <div className="aspect-square rounded-lg bg-primary-foreground/10 overflow-hidden ring-1 ring-primary-foreground/10">
                  <div className="w-full h-full bg-gradient-to-br from-gold/30 to-primary/35" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-lg bg-primary-foreground/10 overflow-hidden ring-1 ring-primary-foreground/10">
                  <div className="w-full h-full bg-gradient-to-br from-primary/25 to-gold/35" />
                </div>
                <div className="aspect-[3/4] rounded-lg bg-primary-foreground/10 overflow-hidden ring-1 ring-primary-foreground/10">
                  <div className="w-full h-full bg-gradient-to-br from-accent/45 to-primary/25" />
                </div>
              </div>
            </div>

            {/* Floating discount badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-primary flex flex-col items-center justify-center shadow-lg ring-4 ring-gold/20"
            >
              <span className="text-3xl font-display font-bold text-primary-foreground">40%</span>
              <span className="text-xs uppercase tracking-wider text-primary-foreground/80">Off</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
