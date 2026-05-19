import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { filters } from '@/data/products';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: {
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
  };
  onFilterChange: (filters: {
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
  }) => void;
}

export const ProductFilters = ({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange,
}: ProductFiltersProps) => {
  const handleSizeToggle = (size: string) => {
    const newSizes = selectedFilters.sizes.includes(size)
      ? selectedFilters.sizes.filter((s) => s !== size)
      : [...selectedFilters.sizes, size];
    onFilterChange({ ...selectedFilters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = selectedFilters.colors.includes(color)
      ? selectedFilters.colors.filter((c) => c !== color)
      : [...selectedFilters.colors, color];
    onFilterChange({ ...selectedFilters, colors: newColors });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...selectedFilters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const clearFilters = () => {
    onFilterChange({
      sizes: [],
      colors: [],
      priceRange: [0, 500],
    });
  };

  const hasActiveFilters =
    selectedFilters.sizes.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.priceRange[0] > 0 ||
    selectedFilters.priceRange[1] < 500;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-8 p-5 rounded-lg bg-card/70 border border-primary/15 shadow-soft backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-sm font-medium mb-4">Size</h4>
            <div className="flex flex-wrap gap-2">
              {filters.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1.5 text-xs font-medium border rounded transition-smooth ${
                    selectedFilters.sizes.includes(size)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background/35 text-foreground border-border hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="text-sm font-medium mb-4">Color</h4>
            <div className="space-y-3">
              {filters.colors.map((color) => (
                <label
                  key={color.name}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedFilters.colors.includes(color.value)}
                    onCheckedChange={() => handleColorToggle(color.value)}
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-smooth">
                    {color.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium mb-4">Price</h4>
            <Slider
              value={selectedFilters.priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={500}
              step={10}
              className="mb-3"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${selectedFilters.priceRange[0]}</span>
              <span>${selectedFilters.priceRange[1]}+</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-espresso/50 z-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-background z-50 overflow-y-auto shadow-hover"
            >
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Filters</h3>
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 hover:bg-secondary rounded-full transition-smooth"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Same filter content as desktop */}
                <div>
                  <h4 className="text-sm font-medium mb-4">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded transition-smooth ${
                          selectedFilters.sizes.includes(size)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background/35 text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Color</h4>
                  <div className="space-y-3">
                    {filters.colors.map((color) => (
                      <label
                        key={color.name}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedFilters.colors.includes(color.value)}
                          onCheckedChange={() => handleColorToggle(color.value)}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Price</h4>
                  <Slider
                    value={selectedFilters.priceRange}
                    onValueChange={handlePriceChange}
                    min={0}
                    max={500}
                    step={10}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${selectedFilters.priceRange[0]}</span>
                    <span>${selectedFilters.priceRange[1]}+</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 text-sm font-medium border border-border rounded-md hover:bg-secondary transition-smooth"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-sm font-medium gradient-accent text-primary-foreground rounded-md hover:shadow-card transition-smooth"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
