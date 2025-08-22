'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { ThemeToggle } from './ThemeToggle';

type CurrencyCode = 'EGP' | 'USD' | 'EUR';
interface Currency {
  code: CurrencyCode;
  symbol: string;
}

const MemoizedMegaMenu = React.memo(MegaMenu);

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
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

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/${language}/shop?q=${encodeURIComponent(searchQuery)}`);
        setMobileMenuOpen(false);
      }
    },
    [searchQuery, language, router]
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleCartOpen = () => {
    console.log('Opening cart sidebar');
    setCartOpen(true);
  };

  const currencies: Currency[] = [
    { code: 'EGP', symbol: 'ج.م' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
  ];

  return (
    <>
      <header className="bg-primary-50 shadow-sm relative z-50 animate-slide-up">
        {/* Top Bar */}
        <div className="bg-text-primary-900 text-primary-50 py-3">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <span className="font-medium text-accent-300 font-english">{t('promotionalBanner')}</span>
            </div>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button
                onClick={toggleLanguage}
                className="hover-lift text-primary-50 hover:text-accent-500 transition-colors font-medium font-english"
                aria-label={t('toggleLanguage', { lang: language === 'en' ? 'Arabic' : 'English' })}
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <ThemeToggle />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent border-none text-primary-50 hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer font-medium rounded-md font-english"
                aria-label={t('selectCurrency')}
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code} className="text-text-primary-600 bg-primary-50">
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
            <Link href={`/${language}`} className="flex items-center space-x-2 hover-lift" title={t('home')}>
              <span className="text-3xl font-bold text-text-primary-600 font-english">Cmon Elsonon</span>
            </Link>
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="relative w-full bg-primary-50/80 backdrop-blur-md rounded-md">
                <label htmlFor="desktop-search" className="sr-only">
                  {t('search')}
                </label>
                <input
                  id="desktop-search"
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-4 py-2 bg-transparent border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary-600 font-${isRTL ? 'arabic' : 'english'} ${isRTL ? 'pr-10' : 'pl-10'}`}
                />
                <button
                  type="submit"
                  className="absolute top-1/2 -translate-y-1/2 text-neutral-600 hover:text-text-primary-600 ${isRTL ? 'right-3' : 'left-3'}"
                  aria-label={t('search')}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
            {/* Actions */}
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Link href={`/${language}/account`} className="p-2 hover-lift hover:text-accent-500 transition-colors" aria-label={t('account')}>
                <UserIcon className="w-6 h-6 text-neutral-600" />
              </Link>
              <Link href={`/${language}/wishlist`} className="p-2 hover-lift hover:text-accent-500 transition-colors" aria-label={t('wishlist')}>
                <HeartIcon className="w-6 h-6 text-neutral-600" />
              </Link>
              <button
                onClick={handleCartOpen}
                className="p-2 hover-lift hover:text-accent-500 transition-colors relative"
                aria-label={t('openCart', { count: cartItemsCount })}
              >
                <ShoppingBagIcon className="w-6 h-6 text-neutral-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-primary-50 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-glow">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover-lift"
                aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-neutral-600" /> : <Bars3Icon className="w-6 h-6 text-neutral-600" />}
              </button>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="border-t border-neutral-200 hidden md:block" aria-label={t('mainNavigation')}>
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
                    className={`flex items-center py-4 px-2 text-text-primary-600 hover:text-accent-500 transition-colors font-${isRTL ? 'arabic' : 'english'} hover-lift space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}
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
          <div className="md:hidden bg-primary-50 border-t border-neutral-200 animate-slide-up">
            {/* Mobile Search */}
            <div className="p-4">
              <form onSubmit={handleSearchSubmit} className="relative bg-primary-50/80 backdrop-blur-md rounded-md">
                <label htmlFor="mobile-search" className="sr-only">
                  {t('search')}
                </label>
                <input
                  id="mobile-search"
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-4 py-2 bg-transparent border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary-600 font-${isRTL ? 'arabic' : 'english'} ${isRTL ? 'pr-10' : 'pl-10'}`}
                />
                <button
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 text-neutral-600 hover:text-text-primary-600 ${isRTL ? 'right-3' : 'left-3'}`}
                  aria-label={t('search')}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
            {/* Mobile Navigation */}
            <div className="py-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex justify-between px-4 py-3 text-text-primary-600 hover:bg-neutral-100 hover:text-accent-500 transition-colors font-medium hover-lift"
                  >
                    <span className={`font-${isRTL ? 'arabic' : 'english'}`}>{isRTL ? category.nameAr : category.name}</span>
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
                          className="block px-4 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-accent-500 transition-colors font-medium font-english"
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