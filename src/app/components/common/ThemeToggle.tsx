'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 bg-sand-beige-100 text-deep-navy-900 rounded-full hover:bg-gold-accent-500 dark:bg-sand-beige-800 dark:text-cream-white-100 dark:hover:bg-gold-accent-700"
        aria-label="Switch to dark theme"
      >
        <MoonIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 bg-sand-beige-100 text-deep-navy-900 rounded-full hover:bg-gold-accent-500 dark:bg-sand-beige-800 dark:text-cream-white-100 dark:hover:bg-gold-accent-700"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}