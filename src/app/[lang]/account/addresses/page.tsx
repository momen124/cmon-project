'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { Address } from '@/types';
import AccountSidebar from '../AccountSidebar';

const AddressesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, accessToken } = useStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: 'home',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    street: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: user?.phone || '',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    if (accessToken) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
        }
      } catch (error) {
        toast.error(t('Failed to fetch addresses'));
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken]);

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      street: '',
      city: '',
      governorate: '',
      postalCode: '',
      phone: user?.phone || '',
      isDefault: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/addresses`;
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(t(editingId ? 'Address updated successfully' : 'Address added successfully'));
        resetForm();
        fetchAddresses();
      } else {
        toast.error(t('Failed to save address'));
      }
    } catch (error) {
      toast.error(t('Failed to save address'));
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      governorate: address.governorate,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('Are you sure you want to delete this address?'))) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          toast.success(t('Address deleted successfully'));
          fetchAddresses();
        } else {
          toast.error(t('Failed to delete address'));
        }
      } catch (error) {
        toast.error(t('Failed to delete address'));
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/default`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        toast.success(t('Default address updated'));
        fetchAddresses();
      } else {
        toast.error(t('Failed to set default address'));
      }
    } catch (error) {
      toast.error(t('Failed to set default address'));
    }
  };

  const getTypeIcon = (type: string) => {
    return <MapPinIcon className="w-5 h-5 text-[var(--text-color)]" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'home':
        return 'text-[var(--primary-color)] bg-[var(--hover-bg-color)]';
      case 'work':
        return 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/20';
      case 'other':
        return 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-[var(--secondary-text-color)] bg-[var(--hover-bg-color)]';
    }
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
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--text-color)]">{t('Delivery Addresses')}</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[var(--primary-color)] text-[var(--cream-white-500)] px-4 py-2 rounded-lg hover:bg-[var(--primary-800)] transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>{t('Add New Address')}</span>
                </button>
              </div>
            </div>
            {showForm && (
              <div className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                  {editingId ? t('Edit Address') : t('Add New Address')}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-2">
                      {t('Address Type')}
                    </label>
                    <div className="flex space-x-4">
                      {['home', 'work', 'other'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={formData.type === type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'home' | 'work' | 'other' }))}
                            className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                          />
                          <span className="ml-2 capitalize text-[var(--text-color)]">{t(type)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('First Name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Last Name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                      {t('Street Address')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('City')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Governorate')} *
                      </label>
                      <select
                        required
                        value={formData.governorate}
                        onChange={(e) => setFormData(prev => ({ ...prev, governorate: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      >
                        <option value="">{t('Select Governorate')}</option>
                        <option value="cairo">{t('Cairo')}</option>
                        <option value="giza">{t('Giza')}</option>
                        <option value="alexandria">{t('Alexandria')}</option>
                        <option value="dakahlia">{t('Dakahlia')}</option>
                        <option value="red-sea">{t('Red Sea')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Postal Code')}
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                      {t('Phone Number')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      />
                      <span className="ml-2 text-sm text-[var(--text-color)]">{t('Set as default address')}</span>
                    </label>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[var(--primary-color)] text-[var(--cream-white-500)] px-6 py-2 rounded-lg hover:bg-[var(--primary-800)] transition-colors"
                    >
                      {editingId ? t('Update Address') : t('Add Address')}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="border border-[var(--border-color)] text-[var(--text-color)] px-6 py-2 rounded-lg hover:bg-[var(--hover-bg-color)] transition-colors"
                    >
                      {t('Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-[var(--card-bg-color)] rounded-lg shadow-sm border border-[var(--border-color)] p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(address.type)}`}>
                          {getTypeIcon(address.type)}
                          <span className="capitalize">{t(address.type)}</span>
                        </div>
                        {address.isDefault && (
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                            {t('Default')}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-[var(--text-color)]">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-[var(--secondary-text-color)]">{address.street}</p>
                        <p className="text-[var(--secondary-text-color)]">
                          {address.city}, {address.governorate} {address.postalCode}
                        </p>
                        <p className="text-[var(--secondary-text-color)]">{address.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-800)] transition-colors"
                        >
                          {t('Set Default')}
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-[var(--secondary-text-color)] hover:text-[var(--primary-color)] transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-[var(--secondary-text-color)] hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
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

export default AddressesPage;