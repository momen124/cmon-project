'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/mockData';

const CategorySection: React.FC = () => {
  const { language } = useStore();

  const categoryConfig = {
    bedding: {
      emoji: '🛏️',
      gradient: 'from-primary-100 to-primary-200',
      hoverGradient: 'group-hover:from-primary-200 group-hover:to-primary-300',
      iconColor: 'text-primary-600 dark:text-primary-300'
    },
    pillows: {
      emoji: '🪶',
      gradient: 'from-highlight-100 to-highlight-200',
      hoverGradient: 'group-hover:from-highlight-200 group-hover:to-highlight-300',
      iconColor: 'text-highlight-600 dark:text-highlight-400'
    },
    blankets: {
      emoji: '🧸',
      gradient: 'from-neutral-100 to-neutral-200',
      hoverGradient: 'group-hover:from-neutral-200 group-hover:to-neutral-300',
      iconColor: 'text-neutral-600 dark:text-neutral-400'
    },
    bath: {
      emoji: '🛁',
      gradient: 'from-base-200 to-base-300',
      hoverGradient: 'group-hover:from-base-300 group-hover:to-base-400',
      iconColor: 'text-base-700 dark:text-base-500'
    }
  };

  const t = (key: string) => {
    const translations: Record<string, string> = {
      shopByCategory: 'Shop by Category',
      discoverPremium: 'Discover our premium collection of home essentials',
      shopNow: 'Shop Now'
    };
    return translations[key] || key;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-secondary-50 to-white dark:bg-gradient-to-br dark:from-secondary-900 dark:to-accent-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0bc94' fill-opacity='0.3' dark:fill='%23b3afac' dark:fill-opacity='0.3'%3E%3Cpath d='m25 25 25 25-25 25-25-25z' /%3E%3Cpath d='m75 25 25 25-25 25-25-25z' /%3E%3Cpath d='m25 75 25 25-25 25-25-25z' /%3E%3Cpath d='m75 75 25 25-25 25-25-25z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="inline-block w-16 h-1 bg-highlight-500 dark:bg-highlight-400 mb-6 rounded-full"></span>
            <h2 className="text-4xl lg:text-5xl font-bold text-contrast-800 dark:text-secondary-500 mb-6">
              {t('shopByCategory')}
            </h2>
            <p className="text-xl text-muted-600 dark:text-muted-300 max-w-3xl mx-auto leading-relaxed">
              {t('discoverPremium')}
            </p>
          </div>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const config = categoryConfig[category.slug as keyof typeof categoryConfig] || {
              emoji: '🏠',
              gradient: 'from-gray-100 to-gray-200',
              hoverGradient: 'group-hover:from-gray-200 group-hover:to-gray-300',
              iconColor: 'text-gray-600 dark:text-gray-400'
            };
            
            return (
              <Link
                key={category.id}
                href={`/${language}/category/${category.slug}`}
                className="group block"
              >
                <div 
                  className="bg-white dark:bg-secondary-900 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-muted-700 transform hover:scale-105 hover:-rotate-1 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Category Icon with Background */}
                  <div className={`relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} ${config.hoverGradient} transition-all duration-500 flex items-center justify-center mb-6 group-hover:scale-110`}>
                    <div className={`text-5xl transform group-hover:rotate-12 transition-transform duration-500 ${config.iconColor}`}>
                      {config.emoji}
                    </div>
                    
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                  
                  {/* Category Info */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-contrast-800 dark:text-secondary-500 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-muted-600 dark:text-muted-300 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Call to Action */}
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-300 font-semibold group-hover:text-highlight-600 dark:group-hover:text-highlight-400 transition-colors duration-300">
                        <span>{t('shopNow')}</span>
                        <svg 
                          className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Bottom Decoration */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 text-muted-400 dark:text-muted-600">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-highlight-300 dark:bg-gradient-to-r dark:from-transparent dark:to-highlight-600"></div>
            <div className="w-2 h-2 bg-highlight-400 dark:bg-highlight-600 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-highlight-300 dark:bg-gradient-to-l dark:from-transparent dark:to-highlight-600"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CategorySection };