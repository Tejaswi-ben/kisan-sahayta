import React from 'react';
import { landSizes } from '@/data/crops';
import { LandSize, Language } from '@/types/farmer';
import { uiText } from '@/data/languages';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface LandSelectionProps {
  language: Language;
  onSelect: (size: LandSize) => void;
  onBack: () => void;
}

export function LandSelection({ language, onSelect, onBack }: LandSelectionProps) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={onBack}
          className="icon-btn w-14 h-14"
          aria-label={uiText.back[language]}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {uiText.selectLand[language]}
          </h1>
          <p className="text-sm text-muted-foreground">
            👆 {language === 'en' ? 'Tap your land size' : 'अपनी जमीन चुनें'}
          </p>
        </div>
      </motion.div>

      {/* Land illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6"
      >
        <div className="text-7xl animate-float">🌍</div>
      </motion.div>

      {/* Land size options */}
      <div className="flex flex-col gap-4 flex-1">
        {landSizes.map((land, index) => (
          <motion.button
            key={land.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            onClick={() => onSelect(land.id)}
            className="selection-card flex-row justify-start gap-6 min-h-[100px]"
          >
            <span className="text-5xl">{land.icon}</span>
            <div className="text-left">
              <span className="text-lg font-semibold text-foreground block">
                {land.labels[language]}
              </span>
              <span className="text-3xl font-bold text-primary">
                {land.acres} 
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {language === 'en' ? 'acres' : 'एकड़'}
                </span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
