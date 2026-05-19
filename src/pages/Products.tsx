import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { products, categories } from '@/data/products';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const saleParam = searchParams.get('sale');
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [selectedFilters, setSelectedFilters] = useState({
    sizes: [] as string[],
    colors: [] as string[],
    priceRange: [0, 500] as [number, number],
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (categoryParam && categoryParam !== 'new') {
      filtered = filtered.filter((p) => p.category === categoryParam);
    }
    if (categoryParam === 'new') {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Sale filter
    if (saleParam === 'true') {
      filtered = filtered.filter((p) => p.isSale);
    }

    // Size filter
    if (selectedFilters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => selectedFilters.sizes.includes(s))
      );
    }

    // Color filter
    if (selectedFilters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((c) => selectedFilters.colors.includes(c))
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.price >= selectedFilters.priceRange[0] &&
        p.price <= selectedFilters.priceRange[1]
    );

    return filtered;
  }, [categoryParam, saleParam, selectedFilters]);

  const currentCategory = categories.find((c) => c.id === categoryParam);
  const pageTitle = saleParam === 'true'
    ? 'Sale'
    : categoryParam === 'new'
    ? 'New Arrivals'
    : currentCategory?.name || 'All Products';

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        {/* Page Header */}
        <section className="py-12 lg:py-16 border-b border-primary/20 gradient-luxury-soft">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground mb-3">
                {pageTitle}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 lg:py-12 bg-background/70">
          <div className="container">
            <div className="flex gap-8 lg:gap-12">
              {/* Filters */}
              <ProductFilters
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
              />

              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                  <button
                    onClick={() => setIsFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium border border-primary/25 rounded-md bg-card/70 hover:bg-secondary transition-smooth"
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                  </button>

                  <div className="hidden lg:flex items-center gap-4 ml-auto">
                    <span className="text-sm text-muted-foreground">View:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setGridCols(2)}
                        className={`p-2 rounded ${
                          gridCols === 2 ? 'bg-primary/15 text-primary' : 'hover:bg-secondary/50'
                        } transition-smooth`}
                      >
                        <Grid3X3 size={16} />
                      </button>
                      <button
                        onClick={() => setGridCols(3)}
                        className={`p-2 rounded ${
                          gridCols === 3 ? 'bg-primary/15 text-primary' : 'hover:bg-secondary/50'
                        } transition-smooth`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid */}
                {filteredProducts.length > 0 ? (
                  <div
                    className={`grid grid-cols-2 gap-4 lg:gap-6 ${
                      gridCols === 2
                        ? 'lg:grid-cols-2'
                        : gridCols === 3
                        ? 'lg:grid-cols-3'
                        : 'lg:grid-cols-4'
                    }`}
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">
                      No products found matching your filters.
                    </p>
                    <button
                      onClick={() =>
                        setSelectedFilters({
                          sizes: [],
                          colors: [],
                          priceRange: [0, 500],
                        })
                      }
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default Products;
