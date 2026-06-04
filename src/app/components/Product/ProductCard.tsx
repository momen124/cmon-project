'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { useStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

/** Extract a usable image src from a StaticImageData object or plain string */
function getImageSrc(image: any, fallback: string): string {
  if (!image) return fallback;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.src) return image.src as string;
  return fallback;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, wishlist, addToWishlist, removeFromWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const isRTL = language === 'ar';

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.length ? product.sizes[0].name : 'Standard';
    const color = product.colors?.length ? product.colors[0].name : 'Default';
    addToCart(product, size, color, 1);
  };

  return (
    <Link href={`/${language}/product/${product.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center overflow-hidden">
          <img src={getImageSrc(product.images?.[0], 'https://placehold.co/800x800/1f2937/e5e7eb/png?text=Product+Image')} alt={isRTL ? product.nameAr : product.name} className="w-full h-full object-cover"/>
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlistToggle();
            }}
            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500 dark:text-red-300" />
            ) : (
              <HeartIcon className="w-4 h-4 text-[var(--text-color)]" />
            )}
          </button>

          {/* Quick Add to Cart */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              className="bg-white text-[var(--text-color)] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-[var(--text-color)] mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {isRTL ? product.nameAr : product.name}
          </h3>
          <p className="text-sm text-[var(--text-color)] mb-2 line-clamp-2">
            {isRTL ? product.descriptionAr : product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[var(--text-color)]">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;