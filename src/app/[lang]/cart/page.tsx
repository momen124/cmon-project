'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';
import AccountSidebar from '../account/AccountSidebar';

const Cart: React.FC = () => {
  const { t } = useTranslation();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--card-bg-color)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-color)] font-english">{t('shoppingCart')}</h1>
          <p className="text-[var(--secondary-text-color)] mt-2 font-english">
            {cart.length} {cart.length === 1 ? t('item') : t('items')} {t('inYourCart')}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className={`flex items-center gap-2 text-red-600 dark:text-red-400 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors border border-red-200 dark:border-red-900/50 font-english ${isRTL ? 'space-x-reverse' : ''}`}
          >
            <TrashIcon className="w-5 h-5" />
            {t('clearCart')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar />
        </div>
        <div className="lg:col-span-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)]">
              <ShoppingBagIcon className="w-24 h-24 mx-auto text-[var(--secondary-text-color)]" />
              <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4 font-english">{t('emptyCart')}</h2>
              <p className="text-[var(--secondary-text-color)] mb-8 font-english">{t('cartEmptyMessage')}</p>
              <Link
                href={`/${language}/shop`}
                className="bg-[var(--primary-color)] text-[var(--cream-white-500)] px-8 py-3 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors inline-block font-english"
              >
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-6 border-b border-[var(--border-color)] last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg border border-[var(--border-color)]">
                        <img
                          src={item.color.image}
                          alt={isRTL ? item.product.nameAr : item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link href={`/${language}/product/${item.product.id}`}>
                          <h3 className="text-lg font-semibold text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors font-english">
                            {isRTL ? item.product.nameAr : item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-[var(--secondary-text-color)] mt-1 font-english">
                          {isRTL ? item.color.nameAr : item.color.name} • {item.size}
                        </p>
                        <p className="text-sm text-[var(--secondary-text-color)] mt-1 font-english">
                          {isRTL ? item.product.materialAr : item.product.material}
                        </p>
                        <div className="mt-2 lg:hidden">
                          <p className="text-lg font-bold text-[var(--text-color)] font-english">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 border border-[var(--border-color)] rounded hover:bg-[var(--hover-bg-color)] transition-colors"
                          disabled={item.quantity <= 1}
                          aria-label={t('decreaseQuantity')}
                        >
                          <MinusIcon className="w-4 h-4 text-[var(--text-color)]" />
                        </button>
                        <span className="text-center min-w-[2rem] font-medium text-[var(--text-color)] font-english">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 border border-[var(--border-color)] rounded hover:bg-[var(--hover-bg-color)] transition-colors"
                          disabled={item.quantity >= item.product.stock}
                          aria-label={t('increaseQuantity')}
                        >
                          <PlusIcon className="w-4 h-4 text-[var(--text-color)]" />
                        </button>
                      </div>

                      <div className="hidden lg:block text-right min-w-[100px]">
                        <p className="text-lg font-bold text-[var(--text-color)] font-english">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-[var(--secondary-text-color)] font-english">
                            {formatPrice(item.product.price)} {t('each')}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-2 text-red-600 dark:text-red-400 dark:text-red-300 hover:bg-[var(--hover-bg-color)] rounded transition-colors"
                        aria-label={t('removeItem')}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-[var(--text-color)] mb-4 font-english">{t('orderSummary')}</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[var(--text-color)] font-english">
                    <span>{t('subtotal')} ({cart.length} {t('items')})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-color)] font-english">
                    <span>{t('shipping')}</span>
                    <span>{shipping === 0 ? t('free') : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-color)] font-english">
                    <span>{t('tax')} (VAT 14%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-3 border-[var(--border-color)]">
                    <div className="flex justify-between text-lg font-semibold text-[var(--text-color)] font-english">
                      <span>{t('total')}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/${language}/checkout`}
                  className="w-full bg-[var(--primary-color)] text-[var(--cream-white-500)] py-3 px-6 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors block text-center font-english"
                >
                  {t('proceedToCheckout')}
                </Link>
              </div>

              <div className="mt-6">
                <Link
                  href={`/${language}/shop`}
                  className="text-[var(--primary-color)] hover:text-[var(--primary-800)] transition-colors inline-flex items-center font-english"
                >
                  {isRTL ? t('continueShopping') + ' ←' : '← ' + t('continueShopping')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;