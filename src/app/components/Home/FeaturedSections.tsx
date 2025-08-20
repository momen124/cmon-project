'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/app/store/useStore';
import { products } from '@/app/data/mockData';
import ProductCard from '../Product/ProductCard';

const FeaturedSections: React.FC = () => {
  const { language } = useStore();
  const isRTL = language === 'ar';

  // Temporary translations
  const t = (key: string) => {
    const translations: Record<string, string> = {
      newArrivals: 'New Arrivals',
      bestSellers: 'Best Sellers',
      myCuteBsbs: 'Featured Products'
    };
    return translations[key] || key;
  };

  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestseller).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  const Section = ({ 
    title, 
    products, 
    viewAllLink,
    bgColor = 'bg-cream-white-50'
  }: { 
    title: string; 
    products: typeof newArrivals; 
    viewAllLink: string;
    bgColor?: string;
  }) => (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-deep-navy-800">{title}</h2>
          <Link
            href={`/${language}${viewAllLink}`}
            className={`flex items-center text-egyptian-blue-600 hover:text-egyptian-blue-700 transition-colors space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}
          >
            <span>View All</span>
            <ChevronRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div>
      <Section 
        title={t('newArrivals')} 
        products={newArrivals} 
        viewAllLink="/shop?filter=new"
        bgColor="bg-cream-white-50"
      />
      <Section 
        title={t('bestSellers')} 
        products={bestSellers} 
        viewAllLink="/shop?filter=bestseller"
        bgColor="bg-sand-beige-50"
      />
      <Section 
        title={t('myCuteBsbs')} 
        products={featured} 
        viewAllLink="/shop?filter=featured"
        bgColor="bg-cream-white-50"
      />
    </div>
  );
};

// Export as named export
export { FeaturedSections };