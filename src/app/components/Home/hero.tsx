'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';

const Hero: React.FC = () => {
  const { language } = useStore();
  const isRTL = language === 'ar';

  const handleShopNowClick = useCallback(() => {
    document.querySelector('#shop-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Temporary translations - replace with actual i18n setup
  const t = (key: string) => {
    const translations: Record<string, string> = {
      heroTitle: 'Luxury Egyptian Cotton Bedding',
      heroSubtitle: 'Experience the finest comfort with our premium cotton collections',
      shopNow: 'Shop Now',
      learnMore: 'Learn More',
      customerRating: 'Rated 4.9/5 by 10k+ customers',
      premiumBedding: 'Premium Bedding',
      egyptianCotton: 'Egyptian Cotton Collection',
      yearsExperience: '40+ Years',
      craftsmanship: 'of Craftsmanship'
    };
    return translations[key] || key;
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-egyptian-blue-900 via-egyptian-blue-800 to-deep-navy-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-8 ${isRTL ? 'lg:order-2 text-right' : ''}`}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xl lg:text-2xl text-cream-white-200 leading-relaxed max-w-2xl">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link
                href={`/${language}/shop`}
                onClick={handleShopNowClick}
                className="group bg-gold-accent-500 hover:bg-gold-accent-600 text-deep-navy-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label={t('shopNow')}
              >
                <ShoppingBagIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>{t('shopNow')}</span>
              </Link>
              
              <Link
                href={`/${language}/about`}
                className="border-2 border-cream-white-300 hover:border-gold-accent-500 text-white hover:text-gold-accent-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center gap-3 backdrop-blur-sm hover:bg-white/10"
                aria-label={t('learnMore')}
              >
                <span>{t('learnMore')}</span>
              </Link>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex text-gold-accent-400 text-lg">
                {'★'.repeat(5)}
              </div>
              <span className="text-cream-white-200 font-medium">
                {t('customerRating')}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`${isRTL ? 'lg:order-1' : ''} relative`}>
            <div className="relative group">
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-cream-white-100 to-sand-beige-200 rounded-2xl p-8 lg:p-12 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="text-center">
                  <div className="text-8xl lg:text-9xl mb-6 transform group-hover:rotate-6 transition-transform duration-500">
                    🛏️
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-deep-navy-800 mb-2">
                    {t('premiumBedding')}
                  </h3>
                  <p className="text-lg text-soft-gray-600">
                    {t('egyptianCotton')}
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gold-accent-500 text-deep-navy-900 p-6 rounded-xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold">{t('yearsExperience')}</div>
                  <div className="text-sm font-medium">{t('craftsmanship')}</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-nile-teal-400 rounded-full opacity-80 animate-pulse" />
              <div className="absolute top-1/4 -right-2 w-6 h-6 bg-gold-accent-400 rounded-full opacity-60 animate-pulse delay-300" />
              <div className="absolute -bottom-2 left-1/4 w-4 h-4 bg-egyptian-blue-300 rounded-full opacity-70 animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream-white-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cream-white-300 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export { Hero };