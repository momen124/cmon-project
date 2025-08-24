'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useStore();
  const isRTL = language === 'ar';

  return (
    <footer className="bg-secondary-50 text-contrast-900 border-t border-base-200 animate-slide-up">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary-600 mb-4 font-english hover-lift">
              Cmon Elsonon
            </h3>
            <p className="text-base-600 mb-4 font-english line-clamp-3">{t('brandDescription')}</p>
            <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <a
                href="#"
                className="text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-contrast-900 font-english">{t('customerService')}</h4>
            <div className="space-y-2">
              <Link
                href={`/${language}/static/about`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('aboutUs')}
              </Link>
              <Link
                href={`/${language}/shipping`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('shippingInfo')}
              </Link>
              <Link
                href={`/${language}/returns`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('returnPolicy')}
              </Link>
              <Link
                href={`/${language}/size-guide`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('sizeGuide')}
              </Link>
              <Link
                href={`/${language}/static/contact`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('contactUs')}
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-contrast-900 font-english">{t('quickLinks')}</h4>
            <div className="space-y-2">
              <Link
                href={`/${language}/shop?category=bed-sheets`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('bedSheetsSets')}
              </Link>
              <Link
                href={`/${language}/shop?category=duvets`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('duvets')}
              </Link>
              <Link
                href={`/${language}/shop?category=towels-bathrobes`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('towelsBathrobes')}
              </Link>
              <Link
                href={`/${language}/shop?sale=true`}
                className="block text-base-600 hover:text-highlight-500 transition-colors hover-lift font-medium font-english"
              >
                {t('sale')}
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-contrast-900 font-english">{t('newsletter')}</h4>
            <p className="text-base-600 mb-4 font-english line-clamp-3">{t('newsletterDiscount')}</p>
            <div className="flex glass rounded-md">
              <input
                type="email"
                placeholder={t('email')}
                className={`flex-1 px-3 py-2 bg-transparent border border-base-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-highlight-500 text-contrast-900 font-${isRTL ? 'arabic' : 'english'} ${isRTL ? 'rounded-l-none rounded-r-md' : ''}`}
              />
              <button
                className={`px-4 py-2 bg-primary-600 text-secondary-50 rounded-r-md hover:bg-highlight-500 hover:text-contrast-900 transition-colors hover-lift font-medium font-english ${isRTL ? 'rounded-r-none rounded-l-md' : ''}`}
              >
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-base-200 mt-8 pt-8 text-center">
          <p className="text-base-600 font-english">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;