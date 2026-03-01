'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Ha ocurrido un error. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión con Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                    >
                        <div className="p-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </Button>

                            <div className="text-center mb-8 mt-2">
                                <img src="/images/logo2.png" alt="Pinky Flame" className="h-16 w-16 mx-auto mb-4 object-contain" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                                    {isLogin ? 'Bienvenido de nuevo a Pinky Flame' : 'Únete a la familia Pinky Flame'}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="tu@correo.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 bg-gradient-to-r from-pink-500 text-md font-semibold to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                                >
                                    {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
                                </Button>
                            </form>

                            <div className="mt-6 relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">O continúa con</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full py-6 flex items-center justify-center gap-3 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">Google</span>
                                </Button>
                            </div>

                            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                                {' '}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-pink-600 hover:text-pink-700 font-semibold underline-offset-4 hover:underline transition-all outline-none"
                                >
                                    {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
