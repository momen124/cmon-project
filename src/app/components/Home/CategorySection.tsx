'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/app/store/useStore';
import { categories } from '@/app/data/mockData';

const CategorySection: React.FC = () => {
  const { language } = useStore();

  const categoryConfig = {
    bedding: {
      emoji: '🛏️',
      gradient: 'from-egyptian-blue-100 to-egyptian-blue-200',
      hoverGradient: 'group-hover:from-egyptian-blue-200 group-hover:to-egyptian-blue-300',
      iconColor: 'text-egyptian-blue-600'
    },
    pillows: {
      emoji: '🪶',
      gradient: 'from-gold-accent-100 to-gold-accent-200',
      hoverGradient: 'group-hover:from-gold-accent-200 group-hover:to-gold-accent-300',
      iconColor: 'text-gold-accent-600'
    },
    blankets: {
      emoji: '🧸',
      gradient: 'from-nile-teal-100 to-nile-teal-200',
      hoverGradient: 'group-hover:from-nile-teal-200 group-hover:to-nile-teal-300',
      iconColor: 'text-nile-teal-600'
    },
    bath: {
      emoji: '🛁',
      gradient: 'from-sand-beige-200 to-sand-beige-300',
      hoverGradient: 'group-hover:from-sand-beige-300 group-hover:to-sand-beige-400',
      iconColor: 'text-sand-beige-700'
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
    <section className="py-20 bg-gradient-to-br from-cream-white-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0bc94' fill-opacity='0.3'%3E%3Cpath d='m25 25 25 25-25 25-25-25z' /%3E%3Cpath d='m75 25 25 25-25 25-25-25z' /%3E%3Cpath d='m25 75 25 25-25 25-25-25z' /%3E%3Cpath d='m75 75 25 25-25 25-25-25z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="inline-block w-16 h-1 bg-gold-accent-500 mb-6 rounded-full"></span>
            <h2 className="text-4xl lg:text-5xl font-bold text-deep-navy-800 mb-6">
              {t('shopByCategory')}
            </h2>
            <p className="text-xl text-soft-gray-600 max-w-3xl mx-auto leading-relaxed">
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
              iconColor: 'text-gray-600'
            };
            
            return (
              <Link
                key={category.id}
                href={`/${language}/category/${category.slug}`}
                className="group block"
              >
                <div 
                  className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 transform hover:scale-105 hover:-rotate-1 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Category Icon with Background */}
                  <div className={`relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} ${config.hoverGradient} transition-all duration-500 flex items-center justify-center mb-6 group-hover:scale-110`}>
                    <div className="text-5xl transform group-hover:rotate-12 transition-transform duration-500">
                      {config.emoji}
                    </div>
                    
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                  
                  {/* Category Info */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-deep-navy-800 group-hover:text-egyptian-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-soft-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Call to Action */}
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 text-egyptian-blue-600 font-semibold group-hover:text-gold-accent-600 transition-colors duration-300">
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
          <div className="inline-flex items-center gap-4 text-soft-gray-400">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-accent-300"></div>
            <div className="w-2 h-2 bg-gold-accent-400 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-accent-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CategorySection };