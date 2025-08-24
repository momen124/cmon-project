'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PencilIcon, StarIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';
import { User } from '@/types';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, ...formData });
      toast.success(t('Profile updated successfully'));
      setIsEditing(false);
    }
  };

  const mockUser: User = {
    id: 'mock-1',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+20 100 123 4567',
    loyaltyPoints: 850,
    totalOrders: 12,
    totalSpent: 15420,
    memberSince: 'January 2023',
    addresses: [],
    orders: [],
    wishlist: [],
  };

  const currentUser = user || mockUser;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--card-bg-color)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-color)]">{t('My Account')}</h1>
        <p className="text-[var(--secondary-text-color)] mt-2">{t('Manage your account settings and orders')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
       
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-color)]">{t('Profile Information')}</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-[var(--primary-800)]"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>{isEditing ? t('Cancel') : t('Edit')}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('First Name')}
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Last Name')}
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                      {t('Email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                      {t('Phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[var(--primary-color)] text-[var(--cream-white-500)] px-6 py-2 rounded-lg hover:bg-[var(--primary-800)] transition-colors"
                    >
                      {t('Save Changes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-[var(--border-color)] text-[var(--text-color)] px-6 py-2 rounded-lg hover:bg-[var(--hover-bg-color)] transition-colors"
                    >
                      {t('Cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[var(--secondary-text-color)]">{t('Full Name')}</p>
                      <p className="font-medium text-[var(--text-color)]">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--secondary-text-color)]">{t('Email')}</p>
                      <p className="font-medium text-[var(--text-color)]">{currentUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--secondary-text-color)]">{t('Phone')}</p>
                      <p className="font-medium text-[var(--text-color)]">{currentUser.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6 text-center">
                <div className="text-2xl font-bold text-[var(--primary-color)] mb-2">
                  {currentUser.loyaltyPoints}
                </div>
                <div className="text-sm text-[var(--secondary-text-color)]">{t('Loyalty Points')}</div>
              </div>
              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-300 mb-2">
                  {currentUser.totalOrders}
                </div>
                <div className="text-sm text-[var(--secondary-text-color)]">{t('Total Orders')}</div>
              </div>
              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-2">
                  {currentUser.totalSpent.toLocaleString()} EGP
                </div>
                <div className="text-sm text-[var(--secondary-text-color)]">{t('Total Spent')}</div>
              </div>
              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300 mb-2">
                  {t('Gold')}
                </div>
                <div className="text-sm text-[var(--secondary-text-color)]">{t('Member Status')}</div>
              </div>
            </div>

            <div className="bg-[var(--primary-color)] rounded-lg p-6 text-[var(--cream-white-500)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{t('Loyalty Program')}</h3>
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-5 h-5 text-yellow-400 dark:text-yellow-200" />
                  <span className="font-medium">{t('Gold Member')}</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('Progress to Platinum')}</span>
                  <span>{currentUser.loyaltyPoints}/1000 {t('points')}</span>
                </div>
                <div className="w-full bg-[var(--primary-800)] rounded-full h-2">
                  <div
                    className="bg-yellow-400 dark:bg-yellow-200 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentUser.loyaltyPoints / 1000) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-[var(--cream-white-500)]/80">
                {t('Earn 1 point for every 10 EGP spent. Unlock exclusive benefits and early access to sales.')}
              </p>
            </div>

            <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4">{t('Recent Activity')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                  <div>
                    <p className="font-medium text-[var(--text-color)]">{t('Order #12345 delivered')}</p>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('Egyptian Cotton Luxury Sheet Set')}</p>
                  </div>
                  <div className="text-sm text-[var(--secondary-text-color)]">{t('2 days ago')}</div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                  <div>
                    <p className="font-medium text-[var(--text-color)]">{t('Earned 25 loyalty points')}</p>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('From order #12344')}</p>
                  </div>
                  <div className="text-sm text-[var(--secondary-text-color)]">{t('1 week ago')}</div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-[var(--text-color)]">{t('Welcome bonus applied')}</p>
                    <p className="text-sm text-[var(--secondary-text-color)]">{t('100 loyalty points added')}</p>
                  </div>
                  <div className="text-sm text-[var(--secondary-text-color)]">{t('2 weeks ago')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;