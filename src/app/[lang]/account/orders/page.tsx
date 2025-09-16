'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import AccountSidebar from '../AccountSidebar';
import { Order } from '@/types';
import { toast } from 'react-hot-toast';

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error(t('failedToFetchOrders'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken, t]);


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
            {loading ? (
              <p>{t('loading')}</p>
            ) : orders.length === 0 ? (
              <p>{t('noOrders')}</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingBagIcon className="w-5 h-5 text-[var(--text-color)]" />
                        <h3 className="font-semibold text-[var(--text-color)]">{t('Order')} #{order.id}</h3>
                      </div>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                            : 'bg-gray-100 dark:bg-gray-900/20 text-[var(--text-color)] dark:text-gray-300'
                        }`}
                      >
                        {t(order.status)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[var(--secondary-text-color)]">
                        {t('Placed on')} {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-[var(--secondary-text-color)]">
                        {t('Total')}: {order.total_price.toLocaleString()} {t('EGP')}
                      </p>
                      <div>
                        <p className="font-medium text-[var(--text-color)]">{t('Items')}</p>
                        {order.orderItems.map((item) => (
                          <p key={item.id} className="text-sm text-[var(--secondary-text-color)]">
                            {item.quantity}x {t(item.product.name_en)}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm text-[var(--secondary-text-color)]">
                        {t('Shipped to')}: {order.shipping_info.firstName} {order.shipping_info.lastName}, {order.shipping_info.address}, {order.shipping_info.city}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;