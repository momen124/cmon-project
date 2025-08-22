"use client";

import React, { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { products, categories } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/Product/ProductCard';
import ProductListItem from '@/components/Product/ProductListItem';

const Shop: React.FC = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { language } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    colors: [] as string[],
    sizes: [] as string[],
    materials: [] as string[],
    inStock: false,
    onSale: false,
  });

  const isRTL = language === 'ar';

  const currentCategory = categories.find(cat => cat.slug === slug);
  
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (currentCategory) {
      filtered = filtered.filter(product => 
        isRTL 
          ? product.categoryAr === currentCategory.nameAr
          : product.category === currentCategory.name
      );
    }

    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      filtered = filtered.filter(product =>
        (isRTL ? product.nameAr : product.name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (isRTL ? product.descriptionAr : product.description)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => 
          filters.colors.includes(isRTL ? color.nameAr : color.name)
        )
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size.name))
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    if (filters.onSale) {
      filtered = filtered.filter(product => product.originalPrice);
    }

    return filtered;
  }, [currentCategory, searchParams, filters, isRTL]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(product => {
      product.colors.forEach(color => {
        colors.add(isRTL ? color.nameAr : color.name);
      });
    });
    return Array.from(colors);
  }, [isRTL]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(product => {
      product.sizes.forEach(size => sizes.add(size.name));
    });
    return Array.from(sizes);
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      colors: [],
      sizes: [],
      materials: [],
      inStock: false,
      onSale: false,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-cream-white-50 animate-slide-up">
      <nav className="mb-8" aria-label="Breadcrumb">
        <div className={`flex items-center space-x-2 text-sm text-sand-beige-600 ${isRTL ? 'space-x-reverse' : ''} font-english`}>
          <Link to="/" className="hover:text-egyptian-blue-600">{t('home')}</Link>
          <span>/</span>
          {currentCategory ? (
            <span className="text-deep-navy-900 font-english">
              {isRTL ? currentCategory.nameAr : currentCategory.name}
            </span>
          ) : (
            <span className="text-deep-navy-900 font-english">{t('shop')}</span>
          )}
        </div>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-navy-900 mb-4 font-english">
          {currentCategory 
            ? (isRTL ? currentCategory.nameAr : currentCategory.name)
            : t('shop')
          }
        </h1>
        <p className="text-sand-beige-600 font-english">
          {sortedProducts.length} {sortedProducts.length === 1 ? t('product') : t('products')} {t('found')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-deep-navy-900 font-english">{t('filters')}</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-egyptian-blue-600 hover:text-gold-accent-500 font-english"
              >
                {t('clearAll')}
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-deep-navy-900 mb-3 font-english">{t('priceRange')}</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full accent-egyptian-blue-600"
                />
                <div className="flex justify-between text-sm text-sand-beige-600 font-english">
                  <span>0 EGP</span>
                  <span>{filters.priceRange[1]} EGP</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-deep-navy-900 mb-3 font-english">{t('colors')}</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableColors.map(color => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('colors', [...filters.colors, color]);
                        } else {
                          handleFilterChange('colors', filters.colors.filter(c => c !== color));
                        }
                      }}
                      className="rounded border-sand-beige-200 text-egyptian-blue-600 focus:ring-gold-accent-500"
                    />
                    <span className={`text-sm font-english ${isRTL ? 'mr-2' : 'ml-2'}`}>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-deep-navy-900 mb-3 font-english">{t('sizes')}</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSizes.map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('sizes', [...filters.sizes, size]);
                        } else {
                          handleFilterChange('sizes', filters.sizes.filter(s => s !== size));
                        }
                      }}
                      className="rounded border-sand-beige-200 text-egyptian-blue-600 focus:ring-gold-accent-500"
                    />
                    <span className={`text-sm font-english ${isRTL ? 'mr-2' : 'ml-2'}`}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-deep-navy-900 mb-3 font-english">{t('availability')}</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-sand-beige-200 text-egyptian-blue-600 focus:ring-gold-accent-500"
                  />
                  <span className={`text-sm font-english ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('inStockOnly')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    className="rounded border-sand-beige-200 text-egyptian-blue-600 focus:ring-gold-accent-500"
                  />
                  <span className={`text-sm font-english ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('onSale')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-4">
            <div className={`flex items-center space-x-4 mb-4 sm:mb-0 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 text-sand-beige-600 hover:text-egyptian-blue-600 hover-lift font-english"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>{t('filters')}</span>
              </button>
              
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg hover-lift ${
                    viewMode === 'grid' ? 'bg-egyptian-blue-600 text-cream-white-50' : 'text-sand-beige-600 hover:text-egyptian-blue-600'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg hover-lift ${
                    viewMode === 'list' ? 'bg-egyptian-blue-600 text-cream-white-50' : 'text-sand-beige-600 hover:text-egyptian-blue-600'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <span className="text-sm text-sand-beige-600 font-english">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-sand-beige-200 rounded-lg text-sm text-deep-navy-900 focus:ring-gold-accent-500 focus:border-egyptian-blue-600 bg-cream-white-50 font-english"
              >
                <option value="featured">{t('featured')}</option>
                <option value="newest">{t('newest')}</option>
                <option value="price-low">{t('priceLowToHigh')}</option>
                <option value="price-high">{t('priceHighToLow')}</option>
                <option value="rating">{t('highestRated')}</option>
                <option value="popular">{t('mostPopular')}</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <AdjustmentsHorizontalIcon className="w-16 h-16 mx-auto text-sand-beige-600" />
              <h3 className="text-lg font-semibold text-deep-navy-900 mb-2 font-english">{t('noProductsFound')}</h3>
              <p className="text-sand-beige-600 mb-4 font-english">{t('adjustFilters')}</p>
              <button
                onClick={clearFilters}
                className="bg-egyptian-blue-600 text-cream-white-50 px-6 py-2 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }`}>
              {sortedProducts.map(product => (
                viewMode === 'grid' ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductListItem key={product.id} product={product} />
                )
              ))}
            </div>
          )}

          {sortedProducts.length > 12 && (
            <div className="mt-12 flex justify-center">
              <nav className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button className="px-3 py-2 text-sm text-sand-beige-600 hover:text-egyptian-blue-600 hover-lift font-english">{t('previous')}</button>
                <button className="px-3 py-2 text-sm bg-egyptian-blue-600 text-cream-white-50 rounded hover:bg-gold-accent-500 hover:text-deep-navy-900 font-english">1</button>
                <button className="px-3 py-2 text-sm text-deep-navy-900 hover:text-egyptian-blue-600 hover-lift font-english">2</button>
                <button className="px-3 py-2 text-sm text-deep-navy-900 hover:text-egyptian-blue-600 hover-lift font-english">3</button>
                <button className="px-3 py-2 text-sm text-sand-beige-600 hover:text-egyptian-blue-600 hover-lift font-english">{t('next')}</button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
