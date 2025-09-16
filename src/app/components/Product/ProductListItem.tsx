'use client';

import React from 'react';
import Link from 'next/link';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/app/types';
import { useStore } from '@/app/store/useStore';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { t } = useTranslation();
  const { language, currency, wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();
  const isRTL = language === 'ar';
  const isInWishlist = wishlist.includes(product.id);

  const formatPrice = (price: number) => {
    const symbol = currency === 'EGP' ? 'ج.م' : currency === 'USD' ? '$' : '€';
    const convertedPrice = currency === 'EGP' ? price : currency === 'USD' ? price / 30 : price / 32;
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(t('removedFromWishlist'));
    } else {
      addToWishlist(product.id);
      toast.success(t('addedToWishlist'));
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
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
      console.error('Add to cart error:', error);
    }
  };

  return (
    <div className="group bg-secondary-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-base-200 animate-slide-up">
      <div className="flex p-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-48 h-48 relative overflow-hidden rounded-lg bg-gradient-to-br from-base-100 to-base-200">
          <Link href={`/${language}/product/${product.id}`}>
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={isRTL ? product.name_ar : product.name_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className={`flex-1 flex flex-col justify-between ${isRTL ? 'mr-4' : 'ml-4'}`}>
          <div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <Link href={`/${language}/product/${product.id}`}>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-4 group-hover:text-primary-600 transition-colors font-english">
                    {isRTL ? product.name_ar : product.name_en}
                  </h3>
                </Link>
              </div>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 border border-base-200 rounded-lg hover:bg-base-100 transition-colors hover-lift ${isRTL ? 'ml-2' : 'mr-2'}`}
              >
                {isInWishlist ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500 dark:text-red-300" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-base-600" />
                )}
              </button>
            </div>

            <p className="text-base-600 mb-4 line-clamp-2 font-english">
              {isRTL ? product.description_ar : product.description_en}
            </p>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[var(--text-color)] font-english">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <span className={`text-sm font-english ${product.stock > 0 ? 'text-green-600' : 'text-red-600 dark:text-red-400'}`}>
                {product.stock > 0 ? t('inStock') : t('outOfStock')}
              </span>
              <button
                onClick={handleQuickAdd}
                disabled={product.stock === 0}
                className="bg-primary-600 text-secondary-50 py-3 px-6 rounded-lg hover:bg-highlight-500 hover:text-[var(--text-color)] transition-colors disabled:bg-base-300 disabled:cursor-not-allowed flex items-center space-x-2 hover-lift font-english"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>{t('quickAdd')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;