import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, ChevronLeft, Star, Truck, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline">
            Back to products
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success('Added to cart!');
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="container py-8 lg:py-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ChevronLeft size={16} />
              Back to Products
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary shadow-card ring-1 ring-primary/15">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:py-4"
            >
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-espresso text-primary-foreground rounded">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded">
                    Sale
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-muted-foreground'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl font-medium text-foreground">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Color
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-foreground scale-110'
                          : 'border-border hover:border-foreground/50'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check
                          size={16}
                          className={`mx-auto ${
                            color === '#FFFFFF' || color === '#E8DFD5' || color === '#F5E6D3'
                              ? 'text-foreground'
                              : 'text-background'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">Size</p>
                  <button className="text-xs text-muted-foreground hover:text-foreground underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2.5 text-sm font-medium border rounded-md transition-smooth ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background/35 text-foreground border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-border rounded-md bg-card/55">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-smooth"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-smooth"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-8 py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md shadow-card hover:shadow-hover transition-smooth"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-3 border border-border rounded-md hover:bg-secondary transition-smooth"
                >
                  <Heart
                    size={20}
                    className={isLiked ? 'fill-primary text-primary' : 'text-foreground'}
                  />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 py-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck size={18} />
                  <span>Free shipping on orders over $150</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RefreshCw size={18} />
                  <span>30-day free returns</span>
                </div>
              </div>

              {/* Details */}
              <div className="py-6 border-t border-border">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">
                  Product Details
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ProductDetail;
