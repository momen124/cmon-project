'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon, UserIcon, ShoppingBagIcon, MapPinIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const CartSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, clearCart, language, currency, user, setUser } = useStore();
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
    toast.success(t('quantityUpdated') || 'Quantity updated');
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    toast.success(t('removedFromCart') || 'Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success(t('cartCleared') || 'Cart cleared successfully');
  };

  const handleLogout = () => {
    setUser(null);
    setCartOpen(false);
    window.location.href = `/${language}/`;
  };

  const menuItems = [
    { id: 'profile', label: t('profile') || 'Profile', icon: UserIcon, path: `/${language}/account` },
    { id: 'orders', label: t('orders') || 'Orders', icon: ShoppingBagIcon, path: `/${language}/account/orders` },
    { id: 'addresses', label: t('addresses') || 'Addresses', icon: MapPinIcon, path: `/${language}/account/addresses` },
    { id: 'settings', label: t('settings') || 'Settings', icon: CogIcon, path: `/${language}/account/settings` },
  ];

  return (
    <Transition.Root show={cartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={() => {
        console.log('Closing cart, setting cartOpen to false');
        setCartOpen(false);
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[var(--contrast-900)]/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed inset-y-0 flex max-w-full ${isRTL ? 'left-0' : 'right-0'}`}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom={isRTL ? '-translate-x-full' : 'translate-x-full'}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo={isRTL ? '-translate-x-full' : 'translate-x-full'}
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[var(--card-bg-color)] shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold text-[var(--text-color)] font-english">
                          {t('shoppingCart') || 'Shopping Cart'}
                        </Dialog.Title>
                        <div className={`ml-3 flex h-7 items-center ${isRTL ? 'mr-3 ml-0' : ''}`}>
                          <button
                            type="button"
                            className="p-2 text-[var(--secondary-text-color)] hover:text-[var(--primary-800)] focus:ring-2 focus:ring-[var(--primary-800)] rounded"
                            onClick={() => {
                              console.log('Close button clicked, setting cartOpen to false');
                              setCartOpen(false);
                            }}
                            aria-label={t('closeCart') || 'Close cart'}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        {cart.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingBagIcon className="w-16 h-16 mx-auto text-[var(--secondary-text-color)] mb-4" />
                            <p className="text-[var(--secondary-text-color)] mb-4 font-english">
                              {t('cartEmpty') || 'Your cart is empty'}
                            </p>
                            <Link
                              href={`/${language}/shop`}
                              onClick={() => setCartOpen(false)}
                              className="inline-block bg-[var(--primary-color)] text-[var(--cream-white-500)] px-6 py-2 rounded-lg hover:bg-[var(--primary-800)] transition-colors font-english"
                            >
                              {t('continueShopping') || 'Continue Shopping'}
                            </Link>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-[var(--border-color)]">
                              {cart.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border-color)]">
                                    <div className="h-full w-full bg-gradient-to-br from-[var(--background-color)] to-[var(--hover-bg-color)] flex items-center justify-center">
                                      <span className="text-2xl">🛏️</span>
                                    </div>
                                  </div>

                                  <div className={`ml-4 flex flex-1 flex-col ${isRTL ? 'mr-4 ml-0' : ''}`}>
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-[var(--text-color)] font-english">
                                        <h3>
                                          <Link
                                            href={`/${language}/product/${item.product.id}`}
                                            onClick={() => setCartOpen(false)}
                                            className="hover:text-[var(--primary-800)] transition-colors"
                                          >
                                            {isRTL ? item.product.nameAr : item.product.name}
                                          </Link>
                                        </h3>
                                        <p className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                                          {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-[var(--secondary-text-color)] font-english">
                                        {isRTL ? item.color.nameAr : item.color.name} • {item.size}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                                        <button
                                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                          className="p-1 border border-[var(--border-color)] rounded hover:bg-[var(--hover-bg-color)] transition-colors"
                                          disabled={item.quantity <= 1}
                                          aria-label={t('decreaseQuantity') || 'Decrease quantity'}
                                        >
                                          <MinusIcon className="w-4 h-4 text-[var(--text-color)]" />
                                        </button>
                                        <span className="mx-2 min-w-[2rem] text-center text-[var(--text-color)] font-english">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                          className="p-1 border border-[var(--border-color)] rounded hover:bg-[var(--hover-bg-color)] transition-colors"
                                          disabled={item.quantity >= item.product.stock}
                                          aria-label={t('increaseQuantity') || 'Increase quantity'}
                                        >
                                          <PlusIcon className="w-4 h-4 text-[var(--text-color)]" />
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        className="font-medium text-red-600 dark:text-red-400 dark:text-red-400 hover:text-red-500 dark:text-red-300 dark:hover:text-red-300 transition-colors font-english"
                                        aria-label={t('removeItem') || 'Remove item'}
                                      >
                                        {t('remove') || 'Remove'}
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6">
                              <button
                                onClick={handleClearCart}
                                className="w-full bg-red-600 text-[var(--cream-white-500)] py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-english"
                              >
                                {t('clearCart') || 'Clear Cart'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {cart.length > 0 && (
                      <div className="border-t border-[var(--border-color)] px-4 py-6 sm:px-6">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-[var(--text-color)] font-english">
                            <span>{t('subtotal') || 'Subtotal'}</span>
                            <span>{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-[var(--text-color)] font-english">
                            <span>{t('shipping') || 'Shipping'}</span>
                            <span>{shipping === 0 ? (t('free') || 'Free') : formatPrice(shipping)}</span>
                          </div>
                          <div className="flex justify-between text-[var(--text-color)] font-english">
                            <span>{t('tax') || 'Tax'}</span>
                            <span>{formatPrice(tax)}</span>
                          </div>
                          <div className="flex justify-between text-base font-semibold text-[var(--text-color)] border-t border-[var(--border-color)] pt-2 font-english">
                            <span>{t('total') || 'Total'}</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Link
                            href={`/${language}/checkout`}
                            onClick={() => setCartOpen(false)}
                            className="flex items-center justify-center rounded-lg bg-[var(--primary-color)] text-[var(--cream-white-500)] px-6 py-3 text-base font-medium shadow-sm hover:bg-[var(--primary-800)] transition-colors w-full font-english"
                          >
                            {t('checkout') || 'Checkout'}
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-[var(--secondary-text-color)] font-english">
                          <p>
                            {t('or') || 'or'}{' '}
                            <button
                              type="button"
                              className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-800)] transition-colors font-english"
                              onClick={() => setCartOpen(false)}
                            >
                              {t('continueShopping') || 'Continue Shopping'}
                            </button>
                          </p>
                        </div>
                      </div>
                    )}

                    {user && (
                      <div className="border-t border-[var(--border-color)] px-4 py-6 sm:px-6">
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4 font-english">
                          {t('account') || 'Account'}
                        </h3>
                        <nav className="space-y-2">
                          {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.id}
                                href={item.path}
                                onClick={() => setCartOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-[var(--secondary-text-color)] hover:bg-[var(--hover-bg-color)] hover:text-[var(--text-color)] ${isRTL ? 'space-x-reverse' : ''}`}
                              >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isRTL ? 'space-x-reverse' : ''}`}
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <span>{t('logout') || 'Logout'}</span>
                          </button>
                        </nav>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartSidebar;