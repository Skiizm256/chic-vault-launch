import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import categoryWomen from '@/assets/category-women.jpg';
import categoryMen from '@/assets/category-men.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';

const categories = [
  {
    id: 'women',
    name: 'Women',
    description: 'Elegant essentials',
    image: categoryWomen,
    count: 156,
  },
  {
    id: 'men',
    name: 'Men',
    description: 'Refined classics',
    image: categoryMen,
    count: 124,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Premium details',
    image: categoryAccessories,
    count: 89,
  },
];

export const CategorySection = () => {
  return (
    <section className="py-20 lg:py-28 gradient-luxury-soft">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our curated collections designed for every aspect of your lifestyle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/products?category=${category.id}`}
                className="group block relative aspect-[3/4] rounded-xl overflow-hidden shadow-card ring-1 ring-primary/15"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-rosewood/25 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-primary-foreground/75 uppercase tracking-wider mb-1">
                        {category.count} items
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-primary-foreground/85">
                        {category.description}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary-foreground group-hover:text-foreground transition-all duration-300">
                      <ArrowUpRight size={18} className="text-primary-foreground group-hover:text-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
