import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, clearCart, language, currency } = useStore();

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

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
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
    if (Object.values(shippingInfo).every(value => value.trim() !== '')) {
      setStep(2);
    } else {
      toast.error(t('fillShippingInfo'));
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      setStep(3);
    } else if (Object.values(cardInfo).every(value => value.trim() !== '')) {
      setStep(3);
    } else {
      toast.error(t('fillPaymentInfo'));
    }
  };

  const handleOrderSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      toast.success(t('orderPlaced'));
      navigate('/account/orders');
    } catch (error) {
      toast.error(t('orderFailed'));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center bg-cream-white-50">
        <h2 className="text-2xl font-bold text-deep-navy-900 mb-4 font-english">{t('emptyCart')}</h2>
        <p className="text-sand-beige-600 mb-8 font-english">{t('addProductsToCheckout')}</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-egyptian-blue-600 text-cream-white-50 px-6 py-3 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-cream-white-50 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-navy-900 mb-4 font-english">{t('checkout')}</h1>

        <div className={`flex items-center justify-center mb-8 space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-english ${
                  step >= stepNumber
                    ? 'bg-egyptian-blue-600 text-cream-white-50'
                    : 'bg-sand-beige-200 text-sand-beige-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-egyptian-blue-600' : 'bg-sand-beige-200'
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
            <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-6">
              <h2 className="text-xl font-semibold text-deep-navy-900 mb-6 flex items-center font-english">
                <TruckIcon className="w-6 h-6 mr-2 text-deep-navy-900" />
                {t('shippingInfo')}
              </h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('firstName')} *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('lastName')} *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('email')} *</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('phone')} *</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('address')} *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('city')} *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('governorate')} *</label>
                    <select
                      required
                      value={shippingInfo.governorate}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, governorate: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
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
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('postalCode')}</label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-egyptian-blue-600 text-cream-white-50 py-3 px-6 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english mt-6"
                >
                  {t('continueToPayment')}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-6">
              <h2 className="text-xl font-semibold text-deep-navy-900 mb-6 flex items-center font-english">
                <CreditCardIcon className="w-6 h-6 mr-2 text-deep-navy-900" />
                {t('paymentMethod')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-sand-beige-200 rounded-lg cursor-pointer hover:bg-sand-beige-100 hover-lift font-english">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-egyptian-blue-600 focus:ring-gold-accent-500"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      <div className="font-medium text-deep-navy-900">{t('creditDebitCard')}</div>
                      <div className="text-sm text-sand-beige-600">{t('visaMastercard')}</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-sand-beige-200 rounded-lg cursor-pointer hover:bg-sand-beige-100 hover-lift font-english">
                    <input
                      type="radio"
                      name="payment"
                      value="fawry"
                      checked={paymentMethod === 'fawry'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-egyptian-blue-600 focus:ring-gold-accent-500"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      <div className="font-medium text-deep-navy-900">{t('fawry')}</div>
                      <div className="text-sm text-sand-beige-600">{t('payAtFawry')}</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-sand-beige-200 rounded-lg cursor-pointer hover:bg-sand-beige-100 hover-lift font-english">
                    <input
                      type="radio"
                      name="payment"
                      value="vodafone"
                      checked={paymentMethod === 'vodafone'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-egyptian-blue-600 focus:ring-gold-accent-500"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      <div className="font-medium text-deep-navy-900">{t('vodafoneCash')}</div>
                      <div className="text-sm text-sand-beige-600">{t('mobileWallet')}</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-sand-beige-200 rounded-lg cursor-pointer hover:bg-sand-beige-100 hover-lift font-english">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-egyptian-blue-600 focus:ring-gold-accent-500"
                    />
                    <div className={`ml-3 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      <div className="font-medium text-deep-navy-900">{t('cashOnDelivery')}</div>
                      <div className="text-sm text-sand-beige-600">{t('payOnReceive')}</div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('cardNumber')} *</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('expiryDate')} *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo(prev => ({ ...prev, expiry: e.target.value }))}
                        className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('cvv')} *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-navy-900 mb-1 font-english">{t('cardholderName')} *</label>
                    <input
                      type="text"
                      required
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-sand-beige-200 rounded-lg px-3 py-2 bg-cream-white-50 text-deep-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-accent-500 font-english"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-egyptian-blue-600 text-cream-white-50 py-3 px-6 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english mt-6"
                  >
                    {t('reviewOrder')}
                  </button>
                </form>
              )}

              {paymentMethod !== 'card' && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-egyptian-blue-600 text-cream-white-50 py-3 px-6 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english"
                >
                  {t('reviewOrder')}
                </button>
              )}

              <button
                onClick={() => setStep(1)}
                className="w-full border border-sand-beige-200 text-deep-navy-900 py-3 px-6 rounded-lg hover:bg-sand-beige-100 transition-colors hover-lift font-english mt-3"
              >
                {t('backToShipping')}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-6">
              <h2 className="text-xl font-semibold text-deep-navy-900 mb-6 flex items-center font-english">
                <ShieldCheckIcon className="w-6 h-6 mr-2 text-deep-navy-900" />
                {t('reviewOrder')}
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-sand-beige-200">
                    <img
                      src={item.color.image}
                      alt={isRTL ? item.product.nameAr : item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-deep-navy-900 font-english">
                        {isRTL ? item.product.nameAr : item.product.name}
                      </h4>
                      <p className="text-sm text-sand-beige-600 font-english">
                        {isRTL ? item.color.nameAr : item.color.name} • {item.size}
                      </p>
                      <p className="text-sm text-sand-beige-600 font-english">{t('qty')}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-deep-navy-900 font-english">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-deep-navy-900 mb-2 font-english">{t('shippingAddress')}</h4>
                  <div className="text-sm text-sand-beige-600 space-y-1 font-english">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.governorate}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-deep-navy-900 mb-2 font-english">{t('paymentMethod')}</h4>
                  <p className="text-sm text-sand-beige-600 capitalize font-english">
                    {paymentMethod === 'cod' ? t('cashOnDelivery') : 
                     paymentMethod === 'fawry' ? t('fawry') :
                     paymentMethod === 'vodafone' ? t('vodafoneCash') : t('creditCard')}
                  </p>
                </div>
              </div>

              <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button
                  onClick={handleOrderSubmit}
                  className="flex-1 bg-egyptian-blue-600 text-cream-white-50 py-3 px-6 rounded-lg hover:bg-gold-accent-500 hover:text-deep-navy-900 transition-colors hover-lift font-english"
                >
                  {t('placeOrder')}
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="border border-sand-beige-200 text-deep-navy-900 py-3 px-6 rounded-lg hover:bg-sand-beige-100 transition-colors hover-lift font-english"
                >
                  {t('back')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-cream-white-50 rounded-lg shadow-sm border border-sand-beige-200 p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-deep-navy-900 mb-4 font-english">{t('orderSummary')}</h3>

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
              <div className="border-t border-sand-beige-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-deep-navy-900 font-english">
                  <span>{t('total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-sand-beige-600 font-english">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                <span>{t('secureSSLEncryption')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="w-4 h-4 text-egyptian-blue-600" />
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
