'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PencilIcon, StarIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';
import { User } from '@/types';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser, accessToken } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setFormData({
              name: userData.name,
              email: userData.email,
              phone: userData.phone || '',
            });
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      }
    };
    fetchUser();
  }, [accessToken, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && accessToken) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          toast.success(t('Profile updated successfully'));
          setIsEditing(false);
        } else {
          toast.error(t('Failed to update profile'));
        }
      } catch (error) {
        toast.error(t('Failed to update profile'));
      }
    }
  };

  const currentUser = user;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--card-bg-color)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-color)]">{t('My Account')}</h1>
        <p className="text-[var(--secondary-text-color)] mt-2">{t('Manage your account settings and orders')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
       
      <div className="lg:col-span-3">
        {currentUser ? (
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
                        {t('Full Name')}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                        {t('Email')}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 bg-[var(--card-bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
                      {t('Phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
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
                      <p className="font-medium text-[var(--text-color)]">{currentUser.name}</p>
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
            {/* Other sections like loyalty, etc. can be added here */}
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;