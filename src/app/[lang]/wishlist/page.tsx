'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product } from '@/app/types';
import { useStore } from '@/app/store/useStore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { wishlist, removeFromWishlist, addToCart, language, currency } = useStore();
  const isRTL = language === 'ar';

  const formatPrice = (price: number) => {
    const symbol = currency === 'EGP' ? 'ج.م' : currency === 'USD' ? '$' : '€';
    const convertedPrice = currency === 'EGP' ? price : currency === 'USD' ? price / 30 : price / 32;
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success(t('removedFromWishlist'));
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error(t('outOfStock'));
      return;
    }
    const size = product.sizes ? Object.keys(product.sizes)[0] : 'Standard';
    const color = product.colors ? Object.keys(product.colors)[0] : 'Default';
    try {
      addToCart(product, size, color, 1);
      toast.success(t('addedToCart'));
    } catch (error) {
      toast.error(t('cartError') || 'Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-secondary-50 dark:bg-secondary-900 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-color)] dark:text-secondary-500 mb-2 font-english">{t('wishlist')}</h1>
        <p className="text-base-600 dark:text-base-300 font-english">
          {wishlist.length} {wishlist.length === 1 ? t('item') : t('items')} {t('savedForLater')}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <HeartIcon className="w-24 h-24 mx-auto text-base-600 dark:text-base-300" />
          <h2 className="text-2xl font-semibold text-[var(--text-color)] dark:text-secondary-500 mb-4 font-english">{t('emptyWishlist')}</h2>
          <p className="text-base-600 dark:text-base-300 mb-8 max-w-md mx-auto font-english">{t('emptyWishlistMessage')}</p>
          <Link
            href="/shop"
            className="bg-primary-600 dark:bg-primary-300 text-secondary-50 dark:text-[var(--text-color)] px-8 py-3 rounded-lg hover:bg-highlight-500 dark:hover:bg-highlight-400 hover:text-[var(--text-color)] dark:hover:text-secondary-500 transition-colors inline-block hover-lift font-english"
          >
            {t('startShopping')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="bg-secondary-50 dark:bg-secondary-900 rounded-lg shadow-sm border border-base-200 dark:border-muted-700 hover:shadow-md transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/${language}/product/${product.id}`}>
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={isRTL ? product.name_ar : product.name_en}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className={`absolute top-3 p-2 bg-secondary-50 dark:bg-secondary-900 rounded-full shadow-md hover:shadow-lg hover:bg-base-100 dark:hover:bg-base-800 transition-all duration-200 hover-lift ${isRTL ? 'left-3' : 'right-3'}`}
                  title={t('removeFromWishlist')}
                >
                  <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-300" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/${language}/product/${product.id}`}>
                  <h3 className="font-semibold text-[var(--text-color)] dark:text-secondary-500 mb-2 hover:text-primary-600 dark:hover:text-primary-300 transition-colors line-clamp-2 font-english">
                    {isRTL ? product.name_ar : product.name_en}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[var(--text-color)] dark:text-secondary-500 font-english">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <span className={`text-sm font-medium font-english ${product.stock > 0 ? 'text-green-600' : 'text-red-600 dark:text-red-400'}`}>
                    {product.stock > 0 ? t('inStock') : t('outOfStock')}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-primary-600 dark:bg-primary-300 text-secondary-50 dark:text-[var(--text-color)] py-2 px-4 rounded-lg hover:bg-highlight-500 dark:hover:bg-highlight-400 hover:text-[var(--text-color)] dark:hover:text-secondary-500 transition-colors disabled:bg-base-300 dark:disabled:bg-base-700 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover-lift font-english"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>{t('addToCart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;