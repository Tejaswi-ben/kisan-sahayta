import React from 'react';
import { Scheme, Language, CropType, LandSize } from '@/types/farmer';
import { uiText } from '@/data/languages';
import { crops, landSizes } from '@/data/crops';
import { SchemeCard } from './SchemeCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Bell, RefreshCw } from 'lucide-react';

interface SchemesListProps {
  schemes: Scheme[];
  language: Language;
  crop: CropType;
  landSize: LandSize;
  onBack: () => void;
  onHome: () => void;
}

export function SchemesList({ schemes, language, crop, landSize, onBack, onHome }: SchemesListProps) {
  const selectedCrop = crops.find((c) => c.id === crop);
  const selectedLand = landSizes.find((l) => l.id === landSize);
  const newSchemesCount = schemes.filter((s) => s.isNew || s.isUrgent).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card shadow-lg p-4 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="icon-btn w-12 h-12"
            aria-label={uiText.back[language]}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-bold text-foreground">
            {uiText.yourSchemes[language]}
          </h1>

          <div className="flex gap-2">
            <button className="icon-btn w-12 h-12 relative">
              <Bell className="w-5 h-5" />
              {newSchemesCount > 0 && (
                <span className="notification-badge">{newSchemesCount}</span>
              )}
            </button>
            <button
              onClick={onHome}
              className="icon-btn w-12 h-12"
              aria-label={uiText.home[language]}
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User profile summary */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
          <span className="text-3xl">{selectedCrop?.icon}</span>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {selectedCrop?.labels[language]}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedLand?.labels[language]}
            </p>
          </div>
          <button
            onClick={onHome}
            className="p-2 rounded-xl bg-primary/10 text-primary"
            aria-label="Change selection"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Schemes list */}
      <div className="flex-1 p-4 pb-safe space-y-6">
        {schemes.length > 0 ? (
          schemes.map((scheme, index) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              index={index}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-muted-foreground">
              {uiText.noSchemesFound[language]}
            </p>
            <button onClick={onHome} className="action-btn mt-6">
              {language === 'en' ? 'Try Different Selection' : 'फिर से चुनें'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom notification bar */}
      {newSchemesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 p-4 bg-gradient-to-t from-notification/20 to-transparent"
        >
          <div className="bg-notification text-notification-foreground rounded-2xl p-4 flex items-center gap-3 shadow-xl">
            <Bell className="w-6 h-6 animate-bounce-gentle" />
            <span className="font-medium flex-1">
              {newSchemesCount} {uiText.notifications[language]}
            </span>
            <span className="text-2xl">👆</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
