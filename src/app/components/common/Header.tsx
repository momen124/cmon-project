'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/mockData';
import MegaMenu from '@/components/common/MegaMenu';
import ThemeToggle from './ThemeToggle';

type CurrencyCode = 'EGP' | 'USD' | 'EUR';

interface Currency {
  code: CurrencyCode;
  symbol: string;
}

const MemoizedMegaMenu = React.memo(MegaMenu);

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cart, setCartOpen, language, setLanguage, currency, setCurrency } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const isRTL = language === 'ar';
  const cartItemsCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  }, [language, setLanguage, i18n]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleCartClick = useCallback(() => {
    console.log('Cart button clicked', { cartItemsCount, cartOpen: false }); // Debug log
    setCartOpen(true);
  }, [setCartOpen]);

  const currencies: Currency[] = [
    { code: 'EGP', symbol: 'ج.م' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
  ];

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm relative z-40 animate-slide-up">
        {/* Top Bar */}
        <div className="bg-blue-900 dark:bg-gray-900 text-white py-3">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <span className="font-medium text-blue-200 dark:text-gray-300">
                {t('promotionalBanner') || 'The Finest Threads, The Softest Touch'}
              </span>
            </div>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                onClick={toggleLanguage}
                className="hover-lift text-white hover:text-yellow-400 transition-colors font-medium"
                aria-label={t('toggleLanguage', { lang: language === 'en' ? 'Arabic' : 'English' }) || 'Toggle language'}
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <ThemeToggle />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent border-none text-white hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer font-medium rounded-md"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code} className="text-[var(--text-color)] bg-white">
                    {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${language}`} className="flex items-center space-x-2 hover-lift" title={t('home') || 'Home'}>
              <span className="text-3xl font-bold text-[var(--primary-color)] dark:text-blue-400 font-english">Cmon Elsonon</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <label htmlFor="desktop-search" className="sr-only">
                  {t('search') || 'Search'}
                </label>
                <input
                  id="desktop-search"
                  type="text"
                  placeholder={t('search') || 'Search'}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)] dark:text-gray-100 font-${isRTL ? 'arabic' : 'english'} ${isRTL ? 'pe-10' : 'ps-10'}`}
                />
                <MagnifyingGlassIcon className={`absolute top-3 w-5 h-5 text-[var(--secondary-text-color) dark:text-[var(--secondary-text-color) ${isRTL ? 'right-3' : 'left-3'}`} />
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Link 
                href={`/${language}/account`} 
                className="p-2 hover-lift hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors" 
                aria-label={t('account') || 'Account'}
              >
                <UserIcon className="w-6 h-6 text-gray-600 dark:text-[var(--secondary-text-color)" />
              </Link>
              <Link 
                href={`/${language}/wishlist`} 
                className="p-2 hover-lift hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors" 
                aria-label={t('wishlist') || 'Wishlist'}
              >
                <HeartIcon className="w-6 h-6 text-[var(--text-color)] dark:text-[var(--secondary-text-color)" />
              </Link>
              <button
                onClick={handleCartClick}
                className="p-2 hover-lift hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors relative"
                aria-label={t('openCart', { count: cartItemsCount }) || `Open cart with ${cartItemsCount} items`}
              >
                <ShoppingBagIcon className="w-6 h-6 text-[var(--text-color)] dark:text-[var(--secondary-text-color)" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover-lift"
                aria-label={mobileMenuOpen ? (t('closeMenu') || 'Close menu') : (t('openMenu') || 'Open menu')}
              >
                {mobileMenuOpen ? 
                  <XMarkIcon className="w-6 h-6 text-[var(--text-color)] dark:text-[var(--secondary-text-color)" /> : 
                  <Bars3Icon className="w-6 h-6 text-[var(--text-color)] dark:text-[var(--secondary-text-color)" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200 dark:border-gray-700 hidden md:block" aria-label={t('mainNavigation') || 'Main navigation'}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setActiveCategoryId(category.id)}
                  onMouseLeave={() => setActiveCategoryId(null)}
                >
                  <Link
                    href={`/${language}/shop?category=${category.slug}`}
                    className={`flex items-center py-4 px-2 text-[var(--text-color)] dark:text-gray-100 hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors font-${isRTL ? 'arabic' : 'english'} hover-lift space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}
                  >
                    <span>{isRTL ? category.nameAr : category.name}</span>
                    {category.children && <ChevronDownIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />}
                  </Link>
                  {activeCategoryId === category.id && category.children && <MemoizedMegaMenu category={category} />}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
            {/* Mobile Search */}
            <div className="p-4">
              <div className="relative">
                <label htmlFor="mobile-search" className="sr-only">
                  {t('search') || 'Search'}
                </label>
                <input
                  id="mobile-search"
                  type="text"
                  placeholder={t('search') || 'Search'}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)] dark:text-gray-100 font-${isRTL ? 'arabic' : 'english'} ${isRTL ? 'pe-10' : 'ps-10'}`}
                />
                <MagnifyingGlassIcon className={`absolute top-3 w-5 h-5 text-[var(--secondary-text-color) dark:text-[var(--secondary-text-color) ${isRTL ? 'right-3' : 'left-3'}`} />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="py-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex justify-between px-4 py-3 text-[var(--text-color)] dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors font-medium hover-lift"
                  >
                    <span className={`font-${isRTL ? 'arabic' : 'english'}`}>
                      {isRTL ? category.nameAr : category.name}
                    </span>
                    {category.children && (
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${expandedCategories.includes(category.id) ? 'rotate-180' : ''} ${isRTL ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {category.children && expandedCategories.includes(category.id) && (
                    <div className="ps-6">
                      {category.children.map((subCategory) => (
                        <Link
                          key={subCategory.id}
                          href={`/${language}/shop?category=${subCategory.slug}`}
                          className="block px-4 py-2 text-[var(--text-color)] dark:text-[var(--secondary-text-color) hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors font-medium font-english"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {isRTL ? subCategory.nameAr : subCategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;