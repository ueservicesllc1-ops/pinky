'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale
    router.push(`/${langCode}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className="text-sm">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                language.code === locale ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </div>
              {language.code === locale && (
                <Check className="h-4 w-4 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
