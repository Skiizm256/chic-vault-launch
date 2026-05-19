import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  const shipping = totalPrice >= 150 ? 0 : 15;
  const total = totalPrice + shipping;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="container py-8 lg:py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-8"
          >
            Shopping Cart
          </motion.h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag size={24} className="text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Discover our collection and find something you love.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-smooth"
              >
                Start Shopping
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 lg:gap-6 p-4 bg-card/85 rounded-lg border border-primary/15 shadow-soft"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.id}`}
                      className="w-24 lg:w-32 aspect-[3/4] rounded-md overflow-hidden bg-secondary flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-display text-sm lg:text-base font-medium text-foreground hover:text-primary transition-smooth line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                            Size: {item.selectedSize}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Color:</span>
                            <span
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="p-1 text-muted-foreground hover:text-foreground transition-smooth"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-4 lg:mt-6">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            }
                            className="p-2 hover:bg-secondary transition-smooth"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:bg-secondary transition-smooth"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-medium text-foreground">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="p-6 bg-card/90 rounded-lg border border-primary/15 shadow-card">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {totalPrice < 150 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(150 - totalPrice).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between py-6 border-b border-border">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 gradient-accent text-primary-foreground text-sm font-medium rounded-md hover:shadow-card transition-smooth"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/products"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-background/35 text-foreground text-sm font-medium border border-primary/20 rounded-md hover:bg-secondary transition-smooth"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Cart;
