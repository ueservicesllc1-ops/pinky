'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { LogOut, LogIn } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const { language, t } = useLanguage();
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const localePrefix = language === 'en' ? '/en' : '/es';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/admin') {
      e.preventDefault();
      setPinInput('');
      setPinError(false);
      setShowPinModal(true);
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1619') {
      setShowPinModal(false);
      router.push('/admin');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const navItems = [
    { href: localePrefix, label: t('header.home') },
    { href: `${localePrefix}/catalogo`, label: t('header.catalog') },
    { href: `${localePrefix}/personalizadas`, label: t('header.custom') },
    { href: `${localePrefix}/nosotros`, label: t('header.about') },
    { href: '/admin', label: t('header.admin') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 md:h-28 relative">
          {/* Logo */}
          <Link href={localePrefix} className="flex items-center">
            <img
              src="/images/logo2.png"
              alt="Pinky Flame Logo"
              className="w-32 h-32 md:w-40 md:h-40 object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 self-end pb-2 md:pb-3 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 self-end pb-1 md:pb-2">

            <LanguageSwitcher />

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="truncate max-w-[100px]">{user.displayName || user.email?.split('@')[0]}</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => signOut()} title="Cerrar Sesión">
                  <LogOut className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300" onClick={() => setShowAuthModal(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Ingresar</span>
              </Button>
            )}

            {/* Favorites */}
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative cursor-pointer" asChild>
              <Link href={`${localePrefix}/carrito`}>
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center p-0"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">

            {user ? (
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 text-gray-500" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setShowAuthModal(true)}>
                <User className="h-4 w-4" />
              </Button>
            )}

            <ThemeToggle />
            <LanguageSwitcher variant="mobile" />
            <Button variant="ghost" size="sm" className="relative cursor-pointer" asChild>
              <Link href={`${localePrefix}/carrito`}>
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center p-0">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-50 p-4 md:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <LanguageSwitcher variant="mobile" />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-medium text-lg"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Acceso Restringido</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowPinModal(false)} className="-mr-2">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm text-center">
                  Ingresa tu PIN de Seguridad (4 dígitos) para controlar la tienda.
                </p>

                <form onSubmit={handlePinSubmit}>
                  <div className="mb-6">
                    <input
                      type="password"
                      autoFocus
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError(false);
                      }}
                      className={`w-full text-center tracking-[0.5em] text-3xl font-mono px-4 py-3 rounded-lg border ${pinError ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 dark:bg-gray-900'
                        } text-gray-900 dark:text-white outline-none focus:ring-2 transition-all`}
                      placeholder="••••"
                    />
                    {pinError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-3 font-medium text-center">
                        PIN incorrecto. Intenta de nuevo.
                      </motion.p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPinModal(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-gray-900 hover:bg-black text-white dark:bg-pink-600 dark:hover:bg-pink-700 border-0">
                      Entrar
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.header>
  );
}