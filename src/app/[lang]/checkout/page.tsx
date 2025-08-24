'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { cart, clearCart, language, currency, setCartOpen } = useStore();

  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(shippingInfo).every((value) => value.trim() !== '')) {
      setStep(2);
    } else {
      toast.error(t('fillShippingInfo'));
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      setStep(3);
    } else if (Object.values(cardInfo).every((value) => value.trim() !== '')) {
      setStep(3);
    } else {
      toast.error(t('fillPaymentInfo'));
    }
  };

  const handleOrderSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearCart();
      setCartOpen(false); // Close cart sidebar on successful order
      toast.success(t('orderPlaced'));
      router.push(`/${language}/account/orders`);
    } catch (error) {
      toast.error(t('orderFailed'));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center bg-[var(--card-bg-color)]">
        <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4 font-english">{t('emptyCart')}</h2>
        <p className="text-[var(--secondary-text-color)] mb-8 font-english">{t('addProductsToCheckout')}</p>
        <button
          onClick={() => router.push(`/${language}/shop`)}
          className="bg-[var(--primary-color)] text-[var(--cream-white-500)] px-6 py-3 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors hover-lift font-english"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--card-bg-color)] animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4 font-english">{t('checkout')}</h1>

        <div className={`flex items-center justify-center mb-8 space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-english ${
                  step >= stepNumber
                    ? 'bg-[var(--primary-color)] text-[var(--cream-white-500)]'
                    : 'bg-[var(--border-color)] text-[var(--secondary-text-color)]'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-[var(--primary-color)]' : 'bg-[var(--border-color)]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-color)] mb-6 flex items-center font-english">
                <TruckIcon className="w-6 h-6 mr-2 text-[var(--text-color)]" />
                {t('shippingInfo')}
              </h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('governorate')} *
                    </label>
                    <select
                      required
                      value={shippingInfo.governorate}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, governorate: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    >
                      <option value="">{t('selectGovernorate')}</option>
                      <option value="cairo">{t('cairo')}</option>
                      <option value="giza">{t('giza')}</option>
                      <option value="alexandria">{t('alexandria')}</option>
                      <option value="dakahlia">{t('dakahlia')}</option>
                      <option value="red-sea">{t('redSea')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('postalCode')}
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--primary-color)] text-[var(--cream-white-500)] py-3 px-6 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors hover-lift font-english mt-6"
                >
                  {t('continueToPayment')}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-color)] mb-6 flex items-center font-english">
                <CreditCardIcon className="w-6 h-6 mr-2 text-[var(--text-color)]" />
                {t('paymentMethod')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="space-y-3">
                  <label
                    className={`flex items-center p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--hover-bg-color)] hover-lift font-english ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[var(--primary-color)] focus:ring-[var(--primary-800)]"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <div className="font-medium text-[var(--text-color)]">{t('creditDebitCard')}</div>
                      <div className="text-sm text-[var(--secondary-text-color)]">{t('visaMastercard')}</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--hover-bg-color)] hover-lift font-english ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="fawry"
                      checked={paymentMethod === 'fawry'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[var(--primary-color)] focus:ring-[var(--primary-800)]"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <div className="font-medium text-[var(--text-color)]">{t('fawry')}</div>
                      <div className="text-sm text-[var(--secondary-text-color)]">{t('payAtFawry')}</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--hover-bg-color)] hover-lift font-english ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="vodafone"
                      checked={paymentMethod === 'vodafone'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[var(--primary-color)] focus:ring-[var(--primary-800)]"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <div className="font-medium text-[var(--text-color)]">{t('vodafoneCash')}</div>
                      <div className="text-sm text-[var(--secondary-text-color)]">{t('mobileWallet')}</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--hover-bg-color)] hover-lift font-english ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[var(--primary-color)] focus:ring-[var(--primary-800)]"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                      <div className="font-medium text-[var(--text-color)]">{t('cashOnDelivery')}</div>
                      <div className="text-sm text-[var(--secondary-text-color)]">{t('payOnReceive')}</div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('cardNumber')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo((prev) => ({ ...prev, number: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                        {t('expiryDate')} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo((prev) => ({ ...prev, expiry: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                        {t('cvv')} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo((prev) => ({ ...prev, cvv: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1 font-english">
                      {t('cardholderName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] textირ
                      text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-800)] font-english"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--primary-color)] text-[var(--cream-white-500)] py-3 px-6 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors hover-lift font-english mt-6"
                  >
                    {t('reviewOrder')}
                  </button>
                </form>
              )}

              {paymentMethod !== 'card' && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-[var(--primary-color)] text-[var(--cream-white-500)] py-3 px-6 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors hover-lift font-english"
                >
                  {t('reviewOrder')}
                </button>
              )}

              <button
                onClick={() => setStep(1)}
                className="w-full border border-[var(--border-color)] text-[var(--text-color)] py-3 px-6 rounded-lg hover:bg-[var(--hover-bg-color)] transition-colors hover-lift font-english mt-3"
              >
                {t('backToShipping')}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-xl font-semibold text-[var(--text-color)] mb-6 flex items-center font-english">
                <ShieldCheckIcon className="w-6 h-6 mr-2 text-[var(--text-color)]" />
                {t('reviewOrder')}
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 py-4 border-b border-[var(--border-color)] ${
                      isRTL ? 'space-x-reverse' : ''
                    }`}
                  >
                    <img
                      src={item.color.image}
                      alt={isRTL ? item.product.nameAr : item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--text-color)] font-english">
                        {isRTL ? item.product.nameAr : item.product.name}
                      </h4>
                      <p className="text-sm text-[var(--secondary-text-color)] font-english">
                        {isRTL ? item.color.nameAr : item.color.name} • {item.size}
                      </p>
                      <p className="text-sm text-[var(--secondary-text-color)] font-english">
                        {t('qty')}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[var(--text-color)] font-english">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-[var(--text-color)] mb-2 font-english">{t('shippingAddress')}</h4>
                  <div className="text-sm text-[var(--secondary-text-color)] space-y-1 font-english">
                    <p>
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.governorate}
                    </p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-[var(--text-color)] mb-2 font-english">{t('paymentMethod')}</h4>
                  <p className="text-sm text-[var(--secondary-text-color)] capitalize font-english">
                    {paymentMethod === 'cod'
                      ? t('cashOnDelivery')
                      : paymentMethod === 'fawry'
                      ? t('fawry')
                      : paymentMethod === 'vodafone'
                      ? t('vodafoneCash')
                      : t('creditCard')}
                  </p>
                </div>
              </div>

              <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button
                  onClick={handleOrderSubmit}
                  className="flex-1 bg-[var(--primary-color)] text-[var(--cream-white-500)] py-3 px-6 rounded-lg hover:bg-[var(--primary-800)] hover:text-[var(--cream-white-500)] transition-colors hover-lift font-english"
                >
                  {t('placeOrder')}
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="border border-[var(--border-color)] text-[var(--text-color)] py-3 px-6 rounded-lg hover:bg-[var(--hover-bg-color)] transition-colors hover-lift font-english"
                >
                  {t('back')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4 font-english">{t('orderSummary')}</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[var(--text-color)] font-english">
                <span>
                  {t('subtotal')} ({cart.length} {t('items')})
                </span>
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
              <div className="border-t border-[var(--border-color)] pt-3">
                <div className="flex justify-between text-lg font-semibold text-[var(--text-color)] font-english">
                  <span>{t('total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[var(--secondary-text-color)] font-english">
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                <span>{t('secureSSLEncryption')}</span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <TruckIcon className="w-4 h-4 text-[var(--primary-color)]" />
                <span>{t('freeShippingOver1000')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;