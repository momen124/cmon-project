'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { UserIcon, ShoppingBagIcon, MapPinIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';

const AccountSidebar: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { language, user, setUser } = useStore();
  const isRTL = language === 'ar';

  const menuItems = [
    { id: 'profile', label: t('Profile'), icon: UserIcon, path: `/${language}/account` },
    { id: 'orders', label: t('Orders'), icon: ShoppingBagIcon, path: `/${language}/account/orders` },
    { id: 'addresses', label: t('Addresses'), icon: MapPinIcon, path: `/${language}/account/addresses` },
    { id: 'settings', label: t('Settings'), icon: CogIcon, path: `/${language}/account/settings` },
  ];

  const handleLogout = () => {
    setUser(null);
    window.location.href = `/${language}/`;
  };

  return (
    <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
      <div className="text-center mb-6 pb-6 border-b border-[var(--border-color)]">
        <div className="w-16 h-16 bg-[var(--primary-50)] dark:bg-[var(--primary-900)] rounded-full flex items-center justify-center mx-auto mb-3">
          <UserIcon className="w-8 h-8 text-[var(--primary-color)] dark:text-[var(--primary-300)]" />
        </div>
        <h3 className="font-semibold text-[var(--text-color)]">
          {user ? `${user.firstName} ${user.lastName}` : t('Guest User')}
        </h3>
        <p className="text-sm text-[var(--secondary-text-color)]">{user?.email || 'guest@example.com'}</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || 
            (item.path === `/${language}/account` && pathname === `/${language}/account`);
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-900)] text-[var(--primary-color)] dark:text-[var(--primary-300)] border-r-2 border-[var(--primary-color)] dark:border-[var(--primary-300)]' 
                  : 'text-[var(--secondary-text-color)] hover:bg-[var(--hover-bg-color)] hover:text-[var(--text-color)]'
              } ${isRTL ? 'space-x-reverse border-r-0 border-l-2' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isRTL ? 'space-x-reverse' : ''}`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>{t('Logout')}</span>
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;