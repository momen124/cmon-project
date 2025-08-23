import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { products } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/Product/ProductCard';

const Search: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useStore();
  const isRTL = language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('relevance');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      const name = isRTL ? product.nameAr : product.name;
      const description = isRTL ? product.descriptionAr : product.description;
      const category = isRTL ? product.categoryAr : product.category;
      const material = isRTL ? product.materialAr : product.material;

      return (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        material.toLowerCase().includes(query) ||
        product.colors.some(color => 
          (isRTL ? color.nameAr : color.name).toLowerCase().includes(query)
        )
      );
    });

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return filtered.sort((a, b) => {
          const aName = isRTL ? a.nameAr : a.name;
          const bName = isRTL ? b.nameAr : b.name;
          const aNameMatch = aName.toLowerCase().includes(query);
          const bNameMatch = bName.toLowerCase().includes(query);
          
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return 0;
        });
    }
  }, [searchQuery, sortBy, isRTL]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-gold-accent-200 px-1 rounded font-english">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-cream-white-50 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-navy-900 mb-4 font-english">
          {searchQuery ? `${t('searchResultsFor')} "${searchQuery}"` : t('searchProducts')}
        </h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search for products...'}
              className={`w-full px-4 py-3 border border-sand-beige-200 rounded-lg bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english ${isRTL ? 'pr-12' : 'pl-12'}`}
            />
            <MagnifyingGlassIcon className={`absolute top-3.5 w-6 h-6 text-sand-beige-600 ${isRTL ? 'right-3' : 'left-3'}`} />
            <button
              type="submit"
              className={`absolute top-2 bottom-2 px-6 bg-egyptian-blue-600 text-cream-white-50 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english ${isRTL ? 'left-2' : 'right-2'}`}
            >
              {t('search')}
            </button>
          </div>
        </form>

        {searchQuery && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-4">
            <div>
              <p className="text-sand-beige-600 font-english">
                {searchResults.length === 0 
                  ? t('noProductsFound')
                  : `${searchResults.length} ${searchResults.length === 1 ? t('product') : t('products')} ${t('found')}`
                }
              </p>
            </div>
            
            {searchResults.length > 0 && (
              <div className={`flex items-center space-x-4 mt-4 sm:mt-0 ${isRTL ? 'space-x-reverse' : ''}`}>
                <span className="text-sm text-sand-beige-600 font-english">{t('sortBy')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-sand-beige-200 rounded-lg text-sm text-deep-navy-900 focus:ring-gold-accent-500 focus:border-egyptian-blue-600 bg-cream-white-50 font-english"
                >
                  <option value="relevance">{t('relevance')}</option>
                  <option value="newest">{t('newest')}</option>
                  <option value="price-low">{t('priceLowToHigh')}</option>
                  <option value="price-high">{t('priceHighToLow')}</option>
                  <option value="rating">{t('highestRated')}</option>
                  <option value="popular">{t('mostPopular')}</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {!searchQuery ? (
        <div className="text-center py-16">
          <MagnifyingGlassIcon className="w-24 h-24 mx-auto text-sand-beige-600" />
          <h2 className="text-2xl font-semibold text-deep-navy-900 mb-4 font-english">{t('searchProducts')}</h2>
          <p className="text-sand-beige-600 mb-8 max-w-md mx-auto font-english">
            {isRTL 
              ? 'اكتشف مجموعتنا الواسعة من منتجات القطن المصري الفاخرة'
              : 'Discover our extensive collection of premium Egyptian cotton products'
            }
          </p>
          
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-deep-navy-900 mb-4 font-english">{t('popularSearches')}</h3>
            <div className={`flex flex-wrap gap-2 justify-center ${isRTL ? 'space-x-reverse' : ''}`}>
              {['bed sheets', 'duvet', 'towels', 'cotton', 'pillows', 'queen size'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setSearchParams({ q: term });
                  }}
                  className="bg-sand-beige-100 hover:bg-gold-accent-200 hover:text-deep-navy-900 px-4 py-2 rounded-full text-sm transition-colors hover-lift font-english"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-16">
          <AdjustmentsHorizontalIcon className="w-24 h-24 mx-auto text-sand-beige-600" />
          <h2 className="text-2xl font-semibold text-deep-navy-900 mb-4 font-english">{t('noResultsFound')}</h2>
          <p className="text-sand-beige-600 mb-8 max-w-md mx-auto font-english">
            {isRTL 
              ? `لم نجد أي منتجات تطابق "${searchQuery}". جرب البحث بكلمات أخرى أو تصفح فئاتنا.`
              : `We couldn't find any products matching "${searchQuery}". Try different keywords or browse our categories.`
            }
          </p>
          
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-deep-navy-900 mb-4 font-english">{t('searchSuggestions')}</h3>
            <ul className="text-sm text-sand-beige-600 space-y-1 font-english">
              <li>{isRTL ? '• تأكد من الإملاء الصحيح' : '• Check your spelling'}</li>
              <li>{isRTL ? '• جرب كلمات أكثر عمومية' : '• Try more general keywords'}</li>
              <li>{isRTL ? '• استخدم كلمات مفتاحية مختلفة' : '• Use different keywords'}</li>
              <li>{isRTL ? '• تصفح فئات المنتجات' : '• Browse product categories'}</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;