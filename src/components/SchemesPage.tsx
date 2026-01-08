import React from 'react';
import { Scheme, Language } from '@/types/farmer';
import { uiText } from '@/data/languages';
import { schemes } from '@/data/schemes';
import { SchemeCard } from './SchemeCard';
import { ChatBot } from './ChatBot';
import { WeatherWidget } from './WeatherWidget';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Bell, Sprout, Shield, CheckCircle, BadgeCheck, Ban } from 'lucide-react';

interface SchemesPageProps {
  language: Language;
  onBack: () => void;
}

export function SchemesPage({ language, onBack }: SchemesPageProps) {
  const allSchemes = schemes;
  const newSchemesCount = allSchemes.filter((s) => s.isNew || s.isUrgent).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-primary-foreground p-4 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={uiText.back[language]}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6" />
            <h1 className="text-xl font-bold">AGRON</h1>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5" />
              {newSchemesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {newSchemesCount}
                </span>
              )}
            </button>
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label={uiText.home[language]}
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-4 pb-safe max-w-4xl mx-auto w-full">
        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <WeatherWidget language={language} />
        </motion.div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-foreground mb-4"
        >
          {uiText.yourSchemes[language]}
        </motion.h2>

        {/* Schemes List */}
        <div className="space-y-4 mb-6">
          {allSchemes.map((scheme, index) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              index={index}
            />
          ))}
        </div>

        {/* About Us - Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 mb-24 border border-border"
        >
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </span>
            {language === 'en' ? 'About AGRON' : 'AGRON के बारे में'}
          </h3>

          {/* Trust Elements */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                {language === 'en' 
                  ? 'Data sourced from official government portals' 
                  : 'सरकारी पोर्टल से प्राप्त डेटा'}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <BadgeCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                {language === 'en' 
                  ? 'Verified badge ✔️ on each scheme' 
                  : 'प्रत्येक योजना पर सत्यापित बैज ✔️'}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <Ban className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                {language === 'en' 
                  ? 'No private or paid schemes shown' 
                  : 'कोई निजी या भुगतान वाली योजनाएं नहीं'}
              </p>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {language === 'en' 
                ? 'AGRON is an informational platform supporting farmers. Final approval depends on government authorities.' 
                : 'AGRON किसानों का समर्थन करने वाला एक सूचना मंच है। अंतिम अनुमोदन सरकारी अधिकारियों पर निर्भर करता है।'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* AI ChatBot */}
      <ChatBot language={language} />
    </div>
  );
}
