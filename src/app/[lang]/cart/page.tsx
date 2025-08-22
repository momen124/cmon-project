import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, language, currency } = useStore();
  const isRTL = language === 'ar';

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    const symbol = currency === 'EGP' ? 'ج.م' : currency === 'USD' ? '$' : '€';
    const convertedPrice = currency === 'EGP' ? price : currency === 'USD' ? price / 30 : price / 32;
    return `${convertedPrice.toFixed(2)} ${symbol}`;
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    toast.success(t('quantityUpdated'));
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    toast.success(t('removedFromCart'));
  };

  const handleClearCart = () => {
    if (window.confirm(t('confirmClearCart'))) {
      clearCart();
      toast.success(t('cartCleared'));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center bg-cream-white-50 animate-slide-up">
        <ShoppingBagIcon className="w-24 h-24 mx-auto text-sand-beige-600" />
        <h2 className="text-2xl font-bold text-deep-navy-900 mb-4 font-english">{t('emptyCart')}</h2>
        <p className="text-sand-beige-600 mb-8 font-english">{t('cartEmptyMessage')}</p>
        <Link
          to="/shop"
          className="bg-egyptian-blue-600 text-cream-white-50 px-8 py-3 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift inline-block font-english"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-cream-white-50 animate-slide-up">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-navy-900 mb-2 font-english">{t('shoppingCart')}</h1>
          <p className="text-sand-beige-600 font-english">
            {cart.length} {cart.length === 1 ? t('item') : t('items')} {t('inYourCart')}
          </p>
        </div>
        
        {/* Clear Cart Button */}
        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-200 hover:border-red-300 font-english"
        >
          <TrashIcon className="w-5 h-5" />
          {t('clearCart')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200">
            <div className="p-6">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-6 border-b border-sand-beige-200 last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
                      <img
                        src={item.color.image}
                        alt={isRTL ? item.product.nameAr : item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-lg font-semibold text-deep-navy-900 hover:text-egyptian-blue-600 transition-colors font-english">
                          {isRTL ? item.product.nameAr : item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-sand-beige-600 mt-1 font-english">
                        {isRTL ? item.color.nameAr : item.color.name} • {item.size}
                      </p>
                      <p className="text-sm text-sand-beige-600 mt-1 font-english">
                        {isRTL ? item.product.materialAr : item.product.material}
                      </p>
                      <div className="mt-2 lg:hidden">
                        <p className="text-lg font-bold text-deep-navy-900 font-english">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 border border-sand-beige-200 rounded hover:bg-sand-beige-100 hover-lift transition-colors"
                        disabled={item.quantity <= 1}
                        aria-label={t('decreaseQuantity')}
                      >
                        <MinusIcon className="w-4 h-4 text-deep-navy-900" />
                      </button>
                      <span className="text-center min-w-[2rem] font-medium text-deep-navy-900 font-english">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 border border-sand-beige-200 rounded hover:bg-sand-beige-100 hover-lift transition-colors"
                        disabled={item.quantity >= item.product.stock}
                        aria-label={t('increaseQuantity')}
                      >
                        <PlusIcon className="w-4 h-4 text-deep-navy-900" />
                      </button>
                    </div>

                    <div className="hidden lg:block text-right min-w-[100px]">
                      <p className="text-lg font-bold text-deep-navy-900 font-english">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-sand-beige-600 font-english">
                          {formatPrice(item.product.price)} {t('each')}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-sand-beige-100 rounded transition-colors hover-lift"
                      aria-label={t('removeItem')}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/shop"
              className="text-egyptian-blue-600 hover:text-gold-accent-500 transition-colors inline-flex items-center font-english"
            >
              {isRTL ? t('continueShopping') + ' ←' : '← ' + t('continueShopping')}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-deep-navy-900 mb-4 font-english">{t('orderSummary')}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-deep-navy-900 font-english">
                <span>{t('subtotal')} ({cart.length} {t('items')})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-deep-navy-900 font-english">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-deep-navy-900 font-english">
                <span>{t('tax')} (VAT 14%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-3 border-sand-beige-200">
                <div className="flex justify-between text-lg font-semibold text-deep-navy-900 font-english">
                  <span>{t('total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-egyptian-blue-600 text-cream-white-50 py-3 px-6 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift block text-center font-english"
            >
              {t('proceedToCheckout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;