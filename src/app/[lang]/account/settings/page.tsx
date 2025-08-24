'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, CurrencyDollarIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';
import AccountSidebar from '../AccountSidebar';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, currency, setCurrency } = useStore();
  
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: false,
    shareData: false,
    trackingCookies: true,
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    toast.success(t('Language changed to', { lang: newLang === 'ar' ? 'Arabic' : 'English' }));
  };

  const handleCurrencyChange = (newCurrency: 'EGP' | 'USD' | 'EUR') => {
    setCurrency(newCurrency);
    toast.success(t('Currency changed to', { currency: newCurrency }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success(t('Notification preferences updated'));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success(t('Privacy settings updated'));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error(t('New passwords do not match'));
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error(t('Password must be at least 8 characters long'));
      return;
    }
    
    toast.success(t('Password updated successfully'));
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--card-bg-color)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-color)]">{t('My Account')}</h1>
        <p className="text-[var(--secondary-text-color)] mt-2">{t('Manage your account settings and orders')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar />
        </div>
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[var(--text-color)]">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-[var(--secondary-text-color)]" />
                {t('Language & Region')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                    {t('Language')}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={language === 'en'}
                        onChange={() => handleLanguageChange('en')}
                        className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      />
                      <span className="ml-2 text-[var(--text-color)]">{t('English')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        value="ar"
                        checked={language === 'ar'}
                        onChange={() => handleLanguageChange('ar')}
                        className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      />
                      <span className="ml-2 text-[var(--text-color)]">{t('Arabic')}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                    {t('Currency')}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value as 'EGP' | 'USD' | 'EUR')}
                    className="border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  >
                    <option value="EGP">{t('Egyptian Pound (EGP)')}</option>
                    <option value="USD">{t('US Dollar (USD)')}</option>
                    <option value="EUR">{t('Euro (EUR)')}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[var(--text-color)]">
                <BellIcon className="w-5 h-5 mr-2 text-[var(--secondary-text-color)]" />
                {t('Notification Preferences')}
              </h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-[var(--text-color)] capitalize">
                        {t(key.replace(/([A-Z])/g, ' $1').trim())}
                      </label>
                      <p className="text-sm text-[var(--secondary-text-color)]">
                        {key === 'orderUpdates' && t('Get notified about your order status')}
                        {key === 'promotions' && t('Receive special offers and discounts')}
                        {key === 'newsletter' && t('Weekly newsletter with new products')}
                        {key === 'smsAlerts' && t('SMS notifications for important updates')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[var(--hover-bg-color)] rounded-full peer peer-focus:ring-4 peer-focus:ring-[var(--primary-color)]/50 peer-checked:after:translate-x-full peer-checked:after:border-[var(--border-color)] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--card-bg-color)] after:border after:border-[var(--border-color)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[var(--text-color)]">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-[var(--secondary-text-color)]" />
                {t('Privacy Settings')}
              </h3>
              <div className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-[var(--text-color)] capitalize">
                        {t(key.replace(/([A-Z])/g, ' $1').trim())}
                      </label>
                      <p className="text-sm text-[var(--secondary-text-color)]">
                        {key === 'profileVisible' && t('Make your profile visible to other users')}
                        {key === 'shareData' && t('Share anonymized data for product recommendations')}
                        {key === 'trackingCookies' && t('Allow cookies for personalized experience')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[var(--hover-bg-color)] rounded-full peer peer-focus:ring-4 peer-focus:ring-[var(--primary-color)]/50 peer-checked:after:translate-x-full peer-checked:after:border-[var(--border-color)] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--card-bg-color)] after:border after:border-[var(--border-color)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[var(--text-color)]">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-[var(--secondary-text-color)]" />
                {t('Security')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[var(--text-color)]">{t('Password')}</h4>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('Change your account password')}</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="text-[var(--primary-color)] hover:text-[var(--primary-800)] transition-colors"
                  >
                    {t('Change Password')}
                  </button>
                </div>
                {showPasswordForm && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 p-4 bg-[var(--hover-bg-color)] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Current Password')}
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.current}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('New Password')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Confirm New Password')}
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-[var(--primary-color)] text-[var(--cream-white-500)] px-4 py-2 rounded-lg hover:bg-[var(--primary-800)] transition-colors"
                      >
                        {t('Update Password')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="border border-[var(--border-color)] text-[var(--text-color)] px-4 py-2 rounded-lg hover:bg-[var(--hover-bg-color)] transition-colors"
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </form>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                  <div>
                    <h4 className="font-medium text-[var(--text-color)]">{t('Two-Factor Authentication')}</h4>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('Add an extra layer of security to your account')}</p>
                  </div>
                  <button className="text-[var(--primary-color)] hover:text-[var(--primary-800)] transition-colors">
                    {t('Enable 2FA')}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">{t('Account Actions')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[var(--text-color)]">{t('Export Data')}</h4>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('Download a copy of your account data')}</p>
                  </div>
                  <button className="text-[var(--primary-color)] hover:text-[var(--primary-800)] transition-colors">
                    {t('Download Data')}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-300">{t('Delete Account')}</h4>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('Permanently delete your account and all data')}</p>
                  </div>
                  <button className="text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 transition-colors">
                    {t('Delete Account')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;