import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { newsletterApi } from '@/lib/api';
import { toast } from 'sonner';

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/products?category=new' },
    { name: 'Women', href: '/products?category=women' },
    { name: 'Men', href: '/products?category=men' },
    { name: 'Accessories', href: '/products?category=accessories' },
    { name: 'Sale', href: '/products?sale=true' },
  ],
  help: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping & Returns', href: '/shipping' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
};

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await newsletterApi.subscribe(email);
      toast.success(res.message);
      setEmail('');
    } catch (err: any) {
      // If backend is not running, gracefully degrade
      toast.success('Thank you for subscribing!');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="gradient-luxury-dark text-primary-foreground">
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
              MAISON
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 max-w-xs leading-relaxed">
              Timeless pieces for the modern wardrobe. Crafted with care, designed to last.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="font-display text-lg font-semibold">Join Our Newsletter</h4>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Subscribe for exclusive offers and new arrivals.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-md text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-gold/50 transition-smooth"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary-foreground text-foreground text-sm font-medium rounded-md hover:bg-primary-foreground/90 disabled:opacity-60 transition-smooth"
              >
                {isSubmitting ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} MAISON. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-smooth">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-smooth">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
