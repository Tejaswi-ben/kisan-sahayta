import React from 'react';
import { crops } from '@/data/crops';
import { CropType, Language } from '@/types/farmer';
import { uiText } from '@/data/languages';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface CropSelectionProps {
  language: Language;
  onSelect: (crop: CropType) => void;
  onBack: () => void;
}

export function CropSelection({ language, onSelect, onBack }: CropSelectionProps) {
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
            {uiText.selectCrop[language]}
          </h1>
          <p className="text-sm text-muted-foreground">
            👆 {language === 'en' ? 'Tap your crop' : 'अपनी फसल चुनें'}
          </p>
        </div>
      </motion.div>

      {/* Crop illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6"
      >
        <div className="text-7xl animate-float">🌱</div>
      </motion.div>

      {/* Crop grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {crops.map((crop, index) => (
          <motion.button
            key={crop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(crop.id)}
            className="selection-card"
          >
            <span className="text-5xl mb-3">{crop.icon}</span>
            <span className="text-lg font-semibold text-foreground">
              {crop.labels[language]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
