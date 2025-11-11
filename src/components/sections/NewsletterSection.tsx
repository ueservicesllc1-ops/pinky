'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeToNewsletter } from '@/lib/newsletter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage(t('newsletter.errorRequired'));
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await subscribeToNewsletter(email, 'homepage');
      
      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
        setMessage(result.message);
        
        // Reset after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false);
          setMessage('');
        }, 5000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage(t('newsletter.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Decorative Elements */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-white/80" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Gift className="h-8 w-8 text-white/60" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('newsletter.headline')}
          </h2>
          
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {t('newsletter.descriptionExtended')}
          </p>

          {!isSubscribed ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                    placeholder={t('newsletter.emailPlaceholderDetailed')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="h-12 bg-white text-pink-600 hover:bg-white/90 font-semibold px-8 disabled:opacity-50"
                  >
                    {isLoading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                  </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center space-x-2 text-white">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">{t('newsletter.success')}</span>
              </div>
            </motion.div>
          )}

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                isSubscribed 
                  ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-200 border border-red-400/30'
              }`}>
                {message}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-sm text-white/70"
          >
            <p>
              {t('newsletter.policyNotice')}
              <br />
              {t('newsletter.policyDetail')}
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                {t('newsletter.benefit.exclusive.title')}
              </h3>
              <p className="text-white/80 text-sm">
                {t('newsletter.benefit.exclusive.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                {t('newsletter.benefit.products.title')}
              </h3>
              <p className="text-white/80 text-sm">
                {t('newsletter.benefit.products.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                {t('newsletter.benefit.tips.title')}
              </h3>
              <p className="text-white/80 text-sm">
                {t('newsletter.benefit.tips.description')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
