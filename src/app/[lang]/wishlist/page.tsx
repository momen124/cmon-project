import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline';
import { products } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { wishlist, removeFromWishlist, addToCart, language, currency } = useStore();
  const isRTL = language === 'ar';

  const wishlistProducts = products.filter(product => wishlist.includes(product.id));

  const formatPrice = (price: number) => {
    const symbol = currency === 'EGP' ? 'ج.م' : currency === 'USD' ? '$' : '€';
    const convertedPrice = currency === 'EGP' ? price : currency === 'USD' ? price / 30 : price / 32;
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success(t('removedFromWishlist'));
  };

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error(t('outOfStock'));
      return;
    }
    try {
      addToCart(product, product.sizes[0], product.colors[0], 1);
      toast.success(t('addedToCart'));
    } catch (error) {
      toast.error(t('cartError') || 'Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-secondary-50 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-contrast-900 mb-2 font-english">{t('wishlist')}</h1>
        <p className="text-base-600 font-english">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? t('item') : t('items')} {t('savedForLater')}
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <HeartIcon className="w-24 h-24 mx-auto text-base-600" />
          <h2 className="text-2xl font-semibold text-contrast-900 mb-4 font-english">{t('emptyWishlist')}</h2>
          <p className="text-base-600 mb-8 max-w-md mx-auto font-english">{t('emptyWishlistMessage')}</p>
          <Link
            to="/shop"
            className="bg-primary-600 text-secondary-50 px-8 py-3 rounded-lg hover:bg-highlight-500 hover:text-contrast-900 transition-colors inline-block hover-lift font-english"
          >
            {t('startShopping')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="bg-secondary-50 rounded-lg shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={isRTL ? product.nameAr : product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className={`absolute top-3 p-2 bg-secondary-50 rounded-full shadow-md hover:shadow-lg hover:bg-base-100 transition-all duration-200 hover-lift ${isRTL ? 'left-3' : 'right-3'}`}
                  title={t('removeFromWishlist')}
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>

                <div className={`absolute top-3 flex flex-col gap-2 ${isRTL ? 'right-3' : 'left-3'}`}>
                  {product.newArrival && (
                    <span className="bg-neutral-500 text-white text-xs px-2 py-1 rounded-full font-english">
                      {t('new')}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-highlight-500 text-contrast-900 text-xs px-2 py-1 rounded-full font-english">
                      {t('sale')}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-sm text-base-600 font-english">
                    {(isRTL ? product.categoryAr : product.category)?.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-contrast-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2 font-english">
                    {isRTL ? product.nameAr : product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-contrast-900 font-english">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-base-500 line-through font-english">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium font-english ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? t('inStock') : t('outOfStock')}
                  </span>
                </div>

                <div className={`flex space-x-2 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  {product.colors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-base-200"
                      style={{ backgroundColor: color.hex }}
                      title={isRTL ? color.nameAr : color.name}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <div className="w-6 h-6 rounded-full border-2 border-base-200 bg-secondary-50 flex items-center justify-center">
                      <span className="text-xs text-base-600 font-english">+{product.colors.length - 4}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-primary-600 text-secondary-50 py-2 px-4 rounded-lg hover:bg-highlight-500 hover:text-contrast-900 transition-colors disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover-lift font-english"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>{t('addToCart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {wishlistProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-contrast-900 mb-6 font-english">{t('youMightAlsoLike')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(product => !wishlist.includes(product.id))
              .slice(0, 4)
              .map(product => (
                <div key={product.id} className="bg-secondary-50 rounded-lg shadow-sm border border-base-200">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={isRTL ? product.nameAr : product.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-contrast-900 mb-2 line-clamp-2 font-english">
                      {isRTL ? product.nameAr : product.name}
                    </h3>
                    <p className="text-lg font-bold text-contrast-900 font-english">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
