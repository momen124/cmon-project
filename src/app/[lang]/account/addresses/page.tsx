'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { Address } from '@/types';
import AccountSidebar from '../AccountSidebar';

const AddressesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Address>({
    id: '',
    type: 'home',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: user?.phone || '',
    isDefault: false,
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
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
    {
      id: '2',
      type: 'work',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      street: '456 Tahrir Square',
      city: 'Cairo',
      governorate: 'Cairo',
      postalCode: '11511',
      phone: '+20 100 123 4567',
      isDefault: false,
    },
  ]);

  const resetForm = () => {
    setFormData({
      id: '',
      type: 'home',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      ...formData,
      id: editingId || Date.now().toString(),
    };
    if (editingId) {
      setAddresses(prev => prev.map(addr =>
        addr.id === editingId
          ? newAddress
          : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
      ));
      toast.success(t('Address updated successfully'));
    } else {
      setAddresses(prev =>
        formData.isDefault
          ? [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress]
          : [...prev, newAddress]
      );
      toast.success(t('Address added successfully'));
    }
    resetForm();
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('Are you sure you want to delete this address?'))) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast.success(t('Address deleted successfully'));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast.success(t('Default address updated'));
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
                        className="p-2 text-[var(--secondary-text-color)] hover:text-red-600 dark:hover:text-red-300 transition-colors"
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