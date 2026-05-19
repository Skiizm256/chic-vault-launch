import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'New Arrivals', href: '/products?category=new' },
  { name: 'Women', href: '/products?category=women' },
  { name: 'Men', href: '/products?category=men' },
  { name: 'Accessories', href: '/products?category=accessories' },
  { name: 'Sale', href: '/products?sale=true' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/82 backdrop-blur-md border-b border-primary/20 shadow-soft">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-smooth"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl lg:text-2xl font-semibold tracking-tight text-foreground hover:text-primary transition-smooth"
          >
            MAISON
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-smooth hover:text-primary ${
                  location.pathname + location.search === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              className="p-2 text-foreground hover:text-primary transition-smooth"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/account"
              className="hidden lg:block p-2 text-foreground hover:text-primary transition-smooth"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <Link
              to="/cart"
              className="relative p-2 text-foreground hover:text-primary transition-smooth"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-medium bg-primary text-primary-foreground rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-primary/20 bg-background/95 backdrop-blur-md"
          >
            <nav className="container py-6 space-y-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-4 border-t border-border"
              >
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <User size={20} />
                  Account
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
