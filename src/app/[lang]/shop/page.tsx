"use client";

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Product, Category } from '@/app/types';
import { useStore } from '@/app/store/useStore';
import ProductCard from '@/app/components/Product/ProductCard';
import ProductListItem from '@/app/components/Product/ProductListItem';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Shop: React.FC = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { language } = useStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    inStock: false,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        ]);
        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const isRTL = language === 'ar';

  const currentCategory = categories.find(cat => cat.id === slug);
  
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (currentCategory) {
      filtered = filtered.filter(product => product.category_id === currentCategory.id);
    }

    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      filtered = filtered.filter(product =>
        (isRTL ? product.name_ar : product.name_en)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (isRTL ? product.description_ar : product.description_en)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    return filtered;
  }, [products, currentCategory, searchParams, filters, isRTL]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      inStock: false,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-secondary-50 animate-slide-up">
      <nav className="mb-8" aria-label="Breadcrumb">
        <div className={`flex items-center space-x-2 text-sm text-base-600 ${isRTL ? 'space-x-reverse' : ''} font-english`}>
          <Link href="/" className="hover:text-primary-600">{t('home')}</Link>
          <span>/</span>
          {currentCategory ? (
            <span className="text-[var(--text-color)] font-english">
              {isRTL ? currentCategory.name_ar : currentCategory.name_en}
            </span>
          ) : (
            <span className="text-[var(--text-color)] font-english">{t('sop')}</span>
          )}
        </div>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--text-color)] mb-4 font-english">
          {currentCategory 
            ? (isRTL ? currentCategory.name_ar : currentCategory.name_en)
            : t('shop')
          }
        </h1>
        <p className="text-base-600 font-english">
          {sortedProducts.length} {sortedProducts.length === 1 ? t('product') : t('products')} {t('found')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-secondary-50 rounded-lg shadow-sm border border-base-200 p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-color)] font-english">{t('filters')}</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-highlight-500 font-english"
              >
                {t('clearAll')}
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-[var(--text-color)] mb-3 font-english">{t('priceRange')}</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-sm text-base-600 font-english">
                  <span>0 EGP</span>
                  <span>{filters.priceRange[1]} EGP</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-[var(--text-color)] mb-3 font-english">{t('availability')}</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-base-200 text-primary-600 focus:ring-highlight-500"
                  />
                  <span className={`text-sm font-english ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('inStockOnly')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-secondary-50 rounded-lg shadow-sm border border-base-200 p-4">
            <div className={`flex items-center space-x-4 mb-4 sm:mb-0 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 text-base-600 hover:text-primary-600 hover-lift font-english"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>{t('filters')}</span>
              </button>
              
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg hover-lift ${
                    viewMode === 'grid' ? 'bg-primary-600 text-secondary-50' : 'text-base-600 hover:text-primary-600'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg hover-lift ${
                    viewMode === 'list' ? 'bg-primary-600 text-secondary-50' : 'text-base-600 hover:text-primary-600'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <span className="text-sm text-base-600 font-english">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-base-200 rounded-lg text-sm text-[var(--text-color)] focus:ring-highlight-500 focus:border-primary-600 bg-secondary-50 font-english"
              >
                <option value="price-low">{t('priceLowToHigh')}</option>
                <option value="price-high">{t('priceHighToLow')}</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <AdjustmentsHorizontalIcon className="w-16 h-16 mx-auto text-base-600" />
              <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2 font-english">{t('noProductsFound')}</h3>
              <p className="text-base-600 mb-4 font-english">{t('adjustFilters')}</p>
              <button
                onClick={clearFilters}
                className="bg-primary-600 text-secondary-50 px-6 py-2 rounded-lg hover:bg-highlight-500 hover:text-[var(--text-color)] transition-colors hover-lift font-english"
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
                <button className="px-3 py-2 text-sm text-base-600 hover:text-primary-600 hover-lift font-english">{t('previous')}</button>
                <button className="px-3 py-2 text-sm bg-primary-600 text-secondary-50 rounded hover:bg-highlight-500 hover:text-[var(--text-color)] font-english">1</button>
                <button className="px-3 py-2 text-sm text-[var(--text-color)] hover:text-primary-600 hover-lift font-english">2</button>
                <button className="px-3 py-2 text-sm text-[var(--text-color)] hover:text-primary-600 hover-lift font-english">3</button>
                <button className="px-3 py-2 text-sm text-base-600 hover:text-primary-600 hover-lift font-english">{t('next')}</button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
