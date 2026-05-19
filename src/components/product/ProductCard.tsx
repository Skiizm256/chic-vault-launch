import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary shadow-card ring-1 ring-primary/10">
          {/* Product Image */}
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-espresso text-primary-foreground rounded">
                New
              </span>
            )}
            {product.isSale && (
              <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-primary/10 transition-smooth"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className={isLiked ? 'fill-primary text-primary' : 'text-foreground'}
            />
          </motion.button>

          {/* Quick View Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-espresso/70 to-transparent"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground">
              Quick View
            </span>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          <h3 className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {/* Color Options */}
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
