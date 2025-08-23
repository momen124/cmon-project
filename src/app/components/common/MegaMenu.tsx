'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Category } from '@/types';
import { useStore } from '@/store/useStore';

interface MegaMenuProps {
  category: Category;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ category }) => {
  const { t } = useTranslation(); // If needed for translations inside
  const { language } = useStore();
  const isRTL = language === 'ar';

  if (!category.children) return null;

  return (
    <div className="absolute top-full left-0 w-screen max-w-xs bg-[var(--card-bg-color)] shadow-lg border border-[var(--border-color)] rounded-lg mt-1 z-40">
      <div className="p-4">
        <h3 className="font-semibold text-[var(--primary-color)] mb-3">
          {isRTL ? category.nameAr : category.name}
        </h3>
        <div className="space-y-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/${language}/shop?category=${child.slug}`}
              className="block px-3 py-2 text-[var(--secondary-text-color)] hover:text-[var(--primary-color)] hover:bg-[var(--hover-bg-color)] rounded transition-colors"
            >
              {isRTL ? child.nameAr : child.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;