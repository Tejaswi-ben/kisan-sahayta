import React from 'react';
import { languages } from '@/data/languages';
import { Language } from '@/types/farmer';
import { motion } from 'framer-motion';
import { Volume2, Info, Sprout, Bell, Mail, Clock } from 'lucide-react';
import farmHeroBg from '@/assets/farm-hero-bg.jpg';

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

  const speakNotification = (type: string) => {
    if ('speechSynthesis' in window) {
      const messages: Record<string, string> = {
        new: 'New notifications available',
        unread: 'You have unread notifications',
        previous: 'View previous notifications',
      };
      const utterance = new SpeechSynthesisUtterance(messages[type]);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Remove Marathi, only 5 languages as per reference
  const displayLanguages = languages.filter(l => l.code !== 'mr');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center px-4 py-12"
        style={{
          backgroundImage: `url(${farmHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        {/* About Us Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-white border border-white/20"
        >
          <Info className="w-5 h-5" />
          <span className="font-medium">About Us</span>
          <Volume2 className="w-4 h-4" />
        </motion.button>

        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sprout className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
              AGRON
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 font-medium">
            Government Schemes Made Easy for Farmers
          </p>
        </motion.div>

        {/* Select Language Title */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-xl text-white font-medium mb-8"
        >
          Select Your Language
        </motion.p>

        {/* Language Selection Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
        >
          {displayLanguages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => handleSelect(lang.code)}
              className="w-28 h-28 md:w-32 md:h-32 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 group"
            >
              <span className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                {lang.nativeName}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Bottom Notification Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-muted/80 backdrop-blur-sm border-t border-border py-4 px-6"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* New Notifications */}
          <button 
            onClick={() => speakNotification('new')}
            className="flex items-center gap-3 text-destructive hover:opacity-80 transition-opacity"
          >
            <Bell className="w-6 h-6" />
            <span className="font-medium">New Notifications</span>
            <Volume2 className="w-5 h-5 opacity-60" />
          </button>

          {/* Unread Notifications */}
          <button 
            onClick={() => speakNotification('unread')}
            className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity"
          >
            <Mail className="w-6 h-6" />
            <span className="font-medium">Unread Notifications</span>
            <Volume2 className="w-5 h-5 opacity-60" />
          </button>

          {/* Previous Notifications */}
          <button 
            onClick={() => speakNotification('previous')}
            className="flex items-center gap-3 text-foreground hover:opacity-80 transition-opacity"
          >
            <Clock className="w-6 h-6" />
            <span className="font-medium">Previous Notifications</span>
            <Volume2 className="w-5 h-5 opacity-60" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
