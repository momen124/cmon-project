'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

import ProductCard from '../Product/ProductCard';
import { useStore } from '@/store/useStore';
import { products } from '@/data/mockData';

const FeaturedSections: React.FC = () => {
  const { language } = useStore();
  const isRTL = language === 'ar';

  // Temporary translations
  const t = (key: string) => {
    const translations: Record<string, string> = {
      newArrivals: 'New Arrivals',
      bestSellers: 'Best Sellers',
      featured: 'Featured Products',
      viewAll: 'View All',
      discoverLatest: 'Discover our latest premium collections',
      customerFavorites: 'Customer favorites and top-rated products',
      handpicked: 'Handpicked selections from our premium range'
    };
    return translations[key] || key;
  };

  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestseller).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  const Section = ({ 
    title, 
    subtitle,
    products, 
    viewAllLink,
    bgColor = 'bg-white dark:bg-secondary-900',
    index = 0
  }: { 
    title: string;
    subtitle: string;
    products: typeof newArrivals; 
    viewAllLink: string;
    bgColor?: string;
    index?: number;
  }) => (
    <section className={`py-20 ${bgColor}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="inline-block w-12 h-1 bg-highlight-500 dark:bg-highlight-400 mb-4 rounded-full"></span>
            <h2 className="text-4xl lg:text-5xl font-bold text-contrast-800 dark:text-secondary-500 mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-600 dark:text-muted-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href={`/${language}${viewAllLink}`}
            className={`group inline-flex items-center gap-2 bg-primary-600 dark:bg-primary-300 hover:bg-primary-700 dark:hover:bg-primary-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span>{t('viewAll')}</span>
            <ChevronRightIcon className={`w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-highlight-100 dark:bg-highlight-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-3/4 -right-32 w-64 h-64 bg-primary-100 dark:bg-primary-900 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Section 
          title={t('newArrivals')} 
          subtitle={t('discoverLatest')}
          products={newArrivals} 
          viewAllLink="/shop?filter=new"
          bgColor="bg-secondary-50 dark:bg-secondary-900"
          index={0}
        />
        
        <Section 
          title={t('bestSellers')} 
          subtitle={t('customerFavorites')}
          products={bestSellers} 
          viewAllLink="/shop?filter=bestseller"
          bgColor="bg-white dark:bg-secondary-900"
          index={1}
        />
        
        <Section 
          title={t('featured')} 
          subtitle={t('handpicked')}
          products={featured} 
          viewAllLink="/shop?filter=featured"
          bgColor="bg-base-50 dark:bg-base-900"
          index={2}
        />
      </div>
    </div>
  );
};

export { FeaturedSections };