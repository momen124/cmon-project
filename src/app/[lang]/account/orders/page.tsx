'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import AccountSidebar from '../AccountSidebar';

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useStore();

  const mockOrders = [
    {
      id: '12345',
      userId: 'mock-1',
      items: [
        {
          id: 'item-1',
          product: {
            id: 'prod-1',
            name: t('Egyptian Cotton Luxury Sheet Set'),
            nameAr: 'مجموعة ملاءات قطنية مصرية فاخرة',
            price: 1500,
            images: [],
            category: 'Bedding',
            categoryAr: 'الفراش',
            sizes: [{ name: 'Queen', cm: '160x200' }],
            colors: [{ name: 'White', nameAr: 'أبيض', hex: '#FFFFFF', image: '' }],
            stock: 10,
            material: 'Cotton',
            materialAr: 'قطن',
            careInstructions: 'Machine washable',
            careInstructionsAr: 'قابل للغسيل في الغسالة',
            featured: true,
            bestseller: true,
            newArrival: false,
            rating: 4.5,
            reviewCount: 120,
          },
          quantity: 1,
          size: 'Queen',
          color: { name: 'White', nameAr: 'أبيض', hex: '#FFFFFF', image: '' },
        },
      ],
      total: 1540,
      subtotal: 1500,
      tax: 40,
      shipping: 0,
      discount: 0,
      status: 'delivered',
      paymentMethod: 'Credit Card',
      shippingAddress: {
        id: '1',
        type: 'home',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        street: '123 Nile Street, Zamalek',
        city: 'Cairo',
        governorate: 'Cairo',
        postalCode: '11211',
        phone: '+20 100 123 4567',
        isDefault: true,
      },
      createdAt: new Date('2025-08-20'),
      updatedAt: new Date('2025-08-22'),
    },
  ];

  const orders = user?.orders.length ? user.orders : mockOrders;

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
              <h2 className="text-xl font-semibold text-[var(--text-color)]">{t('Your Orders')}</h2>
            </div>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ShoppingBagIcon className="w-5 h-5 text-[var(--text-color)]" />
                      <h3 className="font-semibold text-[var(--text-color)]">{t('Order')} #{order.id}</h3>
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                      order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
                      'bg-gray-100 dark:bg-gray-900/20 text-[var(--text-color)] dark:text-gray-300'
                    }`}>
                      {t(order.status)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--secondary-text-color)]">
                      {t('Placed on')} {order.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-[var(--secondary-text-color)]">
                      {t('Total')}: {order.total.toLocaleString()} {t('EGP')}
                    </p>
                    <div>
                      <p className="font-medium text-[var(--text-color)]">{t('Items')}</p>
                      {order.items.map((item) => (
                        <p key={item.id} className="text-sm text-[var(--secondary-text-color)]">
                          {item.quantity}x {t(item.product.name)} ({item.size}, {t(item.color.name)})
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-[var(--secondary-text-color)]">
                      {t('Shipped to')}: {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;