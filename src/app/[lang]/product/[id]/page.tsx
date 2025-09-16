'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { StarIcon, HeartIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Product } from '@/app/types';
import { useStore } from '@/app/store/useStore';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id:string }>();
  const { t } = useTranslation();
  const { language, currency, addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  React.useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
            if (data.sizes) {
              setSelectedSize(Object.keys(data.sizes)[0]);
            }
            if (data.colors) {
              setSelectedColor(Object.keys(data.colors)[0]);
            }
          } else {
            setProduct(null);
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setProduct(null);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const isRTL = language === 'ar';
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2 font-english">Product Not Found</h2>
          <p className="text-[var(--secondary-text-color)] font-english">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    const symbol = currency === 'EGP' ? 'ج.م' : currency === 'USD' ? '$' : '€';
    const convertedPrice = currency === 'EGP' ? price : currency === 'USD' ? price / 30 : price / 32;
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t('selectSize') || 'Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error(t('selectColor') || 'Please select a color');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success(t('addedToCart') || 'Added to cart');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(t('removedFromWishlist') || 'Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success(t('addedToWishlist') || 'Added to wishlist');
    }
  };

  const getCurrentImage = () => {
    if (product.images && product.images[activeImageIndex]) {
      return product.images[activeImageIndex];
    }
    return 'https://placehold.co/800x800/1f2937/e5e7eb/png?text=Product+Image';
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--background-color)] animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border border-[var(--border-color)]">
            <img
              src={getCurrentImage()}
              alt={isRTL ? product.name_ar : product.name_en}
              className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/800x800/1f2937/e5e7eb/png?text=Product+Image';
              }}
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 hover:bg-[var(--hover-bg-color)] transition-all ${
                    activeImageIndex === index ? 'border-[var(--primary-color)]' : 'border-[var(--border-color)]'
                  }`}
                >
                  <img
                    src={image || 'https://placehold.co/200x200/1f2937/e5e7eb/png?text=Thumbnail'}
                    alt={`${isRTL ? product.name_ar : product.name_en} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x200/1f2937/e5e7eb/png?text=Thumbnail';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4 font-english">
              {isRTL ? product.name_ar : product.name_en}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-[var(--text-color)] font-english">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2 font-english">
              {t('description') || 'Description'}
            </h3>
            <p className="text-[var(--secondary-text-color)] font-english leading-relaxed">
              {isRTL ? product.description_ar : product.description_en}
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3 font-english">
                {t('selectColor') || 'Select Color'}
              </h3>
              <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                {Object.keys(product.colors).map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-4 hover:bg-[var(--hover-bg-color)] transition-all ${
                      selectedColor === color ? 'border-[var(--primary-color)]' : 'border-[var(--border-color)]'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <div className="absolute inset-0 rounded-full border-2 border-[var(--cream-white-500)]/80" />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-[var(--secondary-text-color)] mt-2 font-english">
                  {selectedColor}
                </p>
              )}
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3 font-english">
                {t('selectSize') || 'Select Size'}
              </h3>
              <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'direction-rtl' : ''}`}>
                {Object.keys(product.sizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border rounded-lg text-center transition-all hover:bg-[var(--hover-bg-color)] flex flex-col items-center font-english ${
                      selectedSize === size
                        ? 'bg-[var(--primary-color)] text-[var(--cream-white-500)] border-[var(--primary-color)]'
                        : 'border-[var(--border-color)] text-[var(--text-color)]'
                    }`}
                  >
                    <span className="font-medium">{size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3 font-english">
              {t('quantity') || 'Quantity'}
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-bg-color)] w-10 h-10 flex items-center justify-center"
              >
                <span className="text-[var(--text-color)]">-</span>
              </button>
              <span className="px-4 py-2 border border-[var(--border-color)] rounded-lg min-w-[3rem] text-center text-[var(--text-color)] font-english bg-[var(--card-bg-color)]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-bg-color)] w-10 h-10 flex items-center justify-center"
              >
                <span className="text-[var(--text-color)]">+</span>
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'}`} />
            <span className={`text-sm font-english ${
              product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {product.stock > 0 
                ? `${t('inStock') || 'In Stock'} (${product.stock} available)` 
                : t('outOfStock') || 'Out of Stock'
              }
            </span>
          </div>

          {/* Actions */}
          <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-[var(--primary-color)] text-[var(--cream-white-500)] py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:bg-[var(--primary-800)] transition-all font-english"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span>{t('addToCart') || 'Add to Cart'}</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-4 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-bg-color)] transition-all"
            >
              {isInWishlist ? (
                <HeartIconSolid className="w-6 h-6 text-red-500 dark:text-red-400" />
              ) : (
                <HeartIcon className="w-6 h-6 text-[var(--text-color)]" />
              )}
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-5 h-5 text-[var(--secondary-text-color)]" />
              <span className="text-sm text-[var(--secondary-text-color)] font-english">Free shipping on orders over 1000 EGP</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-[var(--secondary-text-color)]" />
              <span className="text-sm text-[var(--secondary-text-color)] font-english">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;