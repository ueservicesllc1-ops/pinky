'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type LanguageOption = 'es' | 'en';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

const options: Array<{ code: LanguageOption; label: string }> = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher({ variant = 'desktop', className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const containerClasses = cn(
    'flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60',
    variant === 'mobile' && 'px-1',
    className,
  );

  return (
    <div className={containerClasses}>
      {options.map(({ code, label }) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            className={cn(
              'rounded-full px-2 py-1 text-xs font-semibold transition',
              isActive
                ? 'bg-pink-500 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
            )}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}


