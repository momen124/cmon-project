'use client';

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { products } from '@/data/mockData';
import { useStore } from '@/store/useStore';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language, currency, addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<{ name: string; cm: string } | null>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find((p) => p.id === id);
  const isRTL = language === 'ar';
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  if (!product) {
    return <div className="text-center py-20 text-[var(--text-color)] font-english">Product not found</div>;
  }

  const formatPrice = (price: number) => {
    const symbol = currency === 'EGP' ? 'ج.م' : currency === 'USD' ? '$' : '€';
    const convertedPrice = currency === 'EGP' ? price : currency === 'USD' ? price / 30 : price / 32;
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t('selectSize'));
      return;
    }
    if (!selectedColor) {
      toast.error(t('selectColor'));
      return;
    }
    addToCart(product, selectedSize.name, selectedColor, quantity);
    toast.success(t('addedToCart'));
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(t('removedFromWishlist'));
    } else {
      addToWishlist(product.id);
      toast.success(t('addedToWishlist'));
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 bg-secondary-50 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-base-100 to-base-200">
            <img
              src={selectedColor ? selectedColor.image : product.images[activeImageIndex]}
              alt={isRTL ? product.nameAr : product.name}
              className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 hover-lift ${
                  activeImageIndex === index ? 'border-primary-600' : 'border-base-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${isRTL ? product.nameAr : product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-base-600 mb-2 font-english">
              {(isRTL ? product.categoryAr : product.category)?.replace("-", " ").toUpperCase()}
            </p>
            <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4 font-english">
              {isRTL ? product.nameAr : product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-base-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-base-600 font-english">
                {product.rating} ({product.reviewCount} {t('reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-[var(--text-color)] font-english">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-base-500 line-through font-english">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-highlight-500 text-[var(--text-color)] text-sm px-2 py-1 rounded-full font-english">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2 font-english">{t('description')}</h3>
            <p className="text-base-600 font-english">
              {isRTL ? product.descriptionAr : product.description}
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3 font-english">{t('selectColor')}</h3>
            <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-12 h-12 rounded-full border-4 hover-lift ${
                    selectedColor?.name === color.name ? 'border-primary-600' : 'border-base-200'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={isRTL ? color.nameAr : color.name}
                >
                  {selectedColor?.name === color.name && (
                    <div className="absolute inset-0 rounded-full border-2 border-secondary-50" />
                  )}
                </button>
              ))}
            </div>
            {selectedColor && (
              <p className="text-sm text-base-600 mt-2 font-english">
                {isRTL ? selectedColor.nameAr : selectedColor.name}
              </p>
            )}
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3 font-english">{t('selectSize')}</h3>
            <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'grid-cols-2-reverse' : ''}`}>
              {product.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 border rounded-lg text-center transition-colors hover-lift flex flex-col items-center font-english ${
                    selectedSize?.name === size.name
                      ? 'border-primary-600 bg-primary-600 text-secondary-50'
                      : 'border-base-200 hover:border-highlight-500'
                  }`}
                >
                  <span className="font-medium">{size.name}</span>
                  <span className="text-xs text-base-600">{size.cm} cm</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3 font-english">{t('quantity')}</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-base-200 rounded-lg hover:bg-base-100 hover-lift"
              >
                -
              </button>
              <span className="px-4 py-2 border border-base-200 rounded-lg min-w-[3rem] text-center text-[var(--text-color)] font-english">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-base-200 rounded-lg hover:bg-base-100 hover-lift"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-english ${product.stock > 0 ? 'text-green-600' : 'text-red-600 dark:text-red-400'}`}>
              {product.stock > 0 ? `${t('inStock')} (${product.stock} available)` : t('outOfStock')}
            </span>
          </div>

          {/* Actions */}
          <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary-600 text-secondary-50 py-3 px-6 rounded-lg hover:bg-highlight-500 hover:text-[var(--text-color)] transition-colors disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover-lift font-english"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span>{t('addToCart')}</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-3 border border-base-200 rounded-lg hover:bg-base-100 transition-colors hover-lift"
            >
              {isInWishlist ? (
                <HeartIconSolid className="w-6 h-6 text-red-500 dark:text-red-300" />
              ) : (
                <HeartIcon className="w-6 h-6 text-base-600" />
              )}
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t border-base-200">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-5 h-5 text-base-600" />
              <span className="text-sm text-base-600 font-english">Free shipping on orders over 1000 EGP</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-base-600" />
              <span className="text-sm text-base-600 font-english">30-day return policy</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-3 pt-6 border-t border-base-200">
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4 font-english">{t('specifications')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-base-600 font-english">{t('material')}</span>
                <span className="font-medium text-[var(--text-color)] font-english">{isRTL ? product.materialAr : product.material}</span>
              </div>
              {product.threadCount && (
                <div className="flex justify-between">
                  <span className="text-base-600 font-english">{t('threadCount')}</span>
                  <span className="font-medium text-[var(--text-color)] font-english">{product.threadCount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-base-600 font-english">{t('careInstructions')}</span>
                <span className="font-medium text-[var(--text-color)] font-english">{isRTL ? product.careInstructionsAr : product.careInstructions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;