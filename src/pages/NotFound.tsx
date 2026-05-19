import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20 flex items-center justify-center min-h-screen">
        <div className="container text-center py-20">
          <p className="text-8xl font-display font-bold text-primary/20 mb-4">404</p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
            The page you're looking for doesn't exist, or may have been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md shadow-card hover:shadow-hover transition-smooth"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/25 text-foreground text-sm font-medium rounded-md hover:bg-secondary transition-smooth"
            >
              <Search size={16} />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default NotFound;
