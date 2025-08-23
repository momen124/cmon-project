import React from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const CartSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, language, currency } = useStore();
  const isRTL = language === 'ar';

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.14; // 14% VAT in Egypt
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

  return (
    <Transition.Root show={cartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setCartOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-deep-navy-900/75 transition-opacity" />
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-cream-white-50 shadow-xl rounded-lg">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold text-deep-navy-900 font-english">
                          {t('shoppingCart')}
                        </Dialog.Title>
                        <div className={`ml-3 flex h-7 items-center ${isRTL ? 'mr-3 ml-0' : ''}`}>
                          <button
                            type="button"
                            className="p-2 text-sand-beige-600 hover:text-egyptian-blue-600 hover-lift focus:ring-2 focus:ring-gold-accent-500 rounded"
                            onClick={() => setCartOpen(false)}
                            aria-label={t('closeCart')}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        {cart.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-sand-beige-600 mb-4 font-english">{t('cartEmpty')}</p>
                            <Link
                              to="/shop"
                              onClick={() => setCartOpen(false)}
                              className="inline-block bg-egyptian-blue-600 text-cream-white-50 px-6 py-2 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english"
                            >
                              {t('continueShopping')}
                            </Link>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-sand-beige-200">
                              {cart.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-sand-beige-200">
                                    <img
                                      src={item.color.image}
                                      alt={isRTL ? item.product.nameAr : item.product.name}
                                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>

                                  <div className={`ml-4 flex flex-1 flex-col ${isRTL ? 'mr-4 ml-0' : ''}`}>
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-deep-navy-900 font-english">
                                        <h3>
                                          <Link
                                            to={`/product/${item.product.id}`}
                                            onClick={() => setCartOpen(false)}
                                            className="hover:text-egyptian-blue-600 transition-colors"
                                          >
                                            {isRTL ? item.product.nameAr : item.product.name}
                                          </Link>
                                        </h3>
                                        <p className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                                          {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-sand-beige-600 font-english">
                                        {isRTL ? item.color.nameAr : item.color.name} • {item.size}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                                        <button
                                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                          className="p-1 border border-sand-beige-200 rounded hover:bg-sand-beige-100 hover-lift transition-colors"
                                          disabled={item.quantity <= 1}
                                          aria-label={t('decreaseQuantity')}
                                        >
                                          <MinusIcon className="w-4 h-4 text-deep-navy-900" />
                                        </button>
                                        <span className="mx-2 min-w-[2rem] text-center text-deep-navy-900 font-english">
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

                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        className="font-medium text-red-500 hover:text-red-600 transition-colors font-english"
                                        aria-label={t('removeItem')}
                                      >
                                        {t('remove')}
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {cart.length > 0 && (
                      <div className="border-t border-sand-beige-200 px-4 py-6 sm:px-6">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-deep-navy-900 font-english">
                            <span>{t('subtotal')}</span>
                            <span>{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-deep-navy-900 font-english">
                            <span>{t('shipping')}</span>
                            <span>{shipping === 0 ? t('free') : formatPrice(shipping)}</span>
                          </div>
                          <div className="flex justify-between text-deep-navy-900 font-english">
                            <span>{t('tax')}</span>
                            <span>{formatPrice(tax)}</span>
                          </div>
                          <div className="flex justify-between text-base font-semibold text-deep-navy-900 border-t border-sand-beige-200 pt-2 font-english">
                            <span>{t('total')}</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Link
                            to="/checkout"
                            onClick={() => setCartOpen(false)}
                            className="flex items-center justify-center rounded-lg bg-egyptian-blue-600 text-cream-white-50 px-6 py-3 text-base font-medium shadow-sm hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift w-full font-english"
                          >
                            {t('checkout')}
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-sand-beige-600 font-english">
                          <p>
                            {t('or')}{' '}
                            <button
                              type="button"
                              className="font-medium text-egyptian-blue-600 hover:text-gold-accent-500 transition-colors font-english"
                              onClick={() => setCartOpen(false)}
                            >
                              {t('continueShopping')}
                            </button>
                          </p>
                        </div>
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