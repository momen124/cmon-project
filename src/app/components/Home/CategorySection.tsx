'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/app/store/useStore';
import { categories } from '@/app/data/mockData';

const CategorySection: React.FC = () => {
  const { language } = useStore();

  const categoryEmojis: Record<string, string> = {
    bedding: '🛏️',
    pillows: '🪶',
    blankets: '🧸',
    bath: '🛁'
  };

  return (
    <section className="py-16 bg-gradient-to-br from-sand-beige-100 to-cream-white-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-deep-navy-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-soft-gray-600">
            Discover our premium collection of home essentials
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${language}/category/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:border-egyptian-blue-200">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {categoryEmojis[category.slug] || '🏠'}
                </div>
                <h3 className="text-xl font-semibold text-deep-navy-800 mb-2 group-hover:text-egyptian-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-soft-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="text-egyptian-blue-600 font-medium group-hover:text-egyptian-blue-700">
                  Shop Now →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Export as named export
export { CategorySection };