import React from 'react';
import { languages } from '@/data/languages';
import { Language } from '@/types/farmer';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface LanguageSelectionProps {
  onSelect: (language: Language) => void;
}

export function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  const playWelcome = (lang: Language) => {
    if ('speechSynthesis' in window) {
      const messages: Record<Language, string> = {
        te: 'తెలుగు ఎంచుకున్నారు',
        hi: 'हिंदी चुनी गई',
        ta: 'தமிழ் தேர்ந்தெடுக்கப்பட்டது',
        kn: 'ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ',
        mr: 'मराठी निवडली',
        en: 'English selected',
      };
      
      const utterance = new SpeechSynthesisUtterance(messages[lang]);
      utterance.lang = lang === 'en' ? 'en-IN' : `${lang}-IN`;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (lang: Language) => {
    playWelcome(lang);
    setTimeout(() => onSelect(lang), 500);
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      {/* Decorative header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4 animate-bounce-gentle">🌾</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          किसान सहायता
        </h1>
        <p className="text-muted-foreground">Farmer Help</p>
      </motion.div>

      {/* Voice icon indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 mb-8 text-secondary"
      >
        <Volume2 className="w-6 h-6" />
        <span className="text-sm font-medium">Voice enabled</span>
      </motion.div>

      {/* Language grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {languages.map((lang, index) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(lang.code)}
            className="selection-card group"
          >
            <span className="text-4xl mb-2">{lang.flag}</span>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {lang.nativeName}
            </span>
            <span className="text-sm text-muted-foreground">{lang.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Help text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-muted-foreground text-sm"
      >
        👆 Tap your language • अपनी भाषा चुनें
      </motion.p>
    </div>
  );
}
