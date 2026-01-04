import React, { useState } from 'react';
import { LanguageSelection } from '@/components/LanguageSelection';
import { CropSelection } from '@/components/CropSelection';
import { LandSelection } from '@/components/LandSelection';
import { SchemesList } from '@/components/SchemesList';
import { FarmerProvider, useFarmer } from '@/context/FarmerContext';
import { AnimatePresence, motion } from 'framer-motion';

type Step = 'language' | 'crop' | 'land' | 'schemes';

function FarmerApp() {
  const { profile, setLanguage, setCrop, setLandSize, getMatchingSchemes, resetProfile } = useFarmer();
  const [step, setStep] = useState<Step>('language');

  const handleLanguageSelect = (lang: typeof profile.language) => {
    setLanguage(lang);
    setStep('crop');
  };

  const handleCropSelect = (crop: NonNullable<typeof profile.crop>) => {
    setCrop(crop);
    setStep('land');
  };

  const handleLandSelect = (size: NonNullable<typeof profile.landSize>) => {
    setLandSize(size);
    setStep('schemes');
  };

  const handleBack = () => {
    if (step === 'crop') setStep('language');
    else if (step === 'land') setStep('crop');
    else if (step === 'schemes') setStep('land');
  };

  const handleHome = () => {
    resetProfile();
    setStep('crop');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {step === 'language' && (
          <motion.div
            key="language"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LanguageSelection onSelect={handleLanguageSelect} />
          </motion.div>
        )}

        {step === 'crop' && (
          <motion.div
            key="crop"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CropSelection
              language={profile.language}
              onSelect={handleCropSelect}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {step === 'land' && (
          <motion.div
            key="land"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LandSelection
              language={profile.language}
              onSelect={handleLandSelect}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {step === 'schemes' && profile.crop && profile.landSize && (
          <motion.div
            key="schemes"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SchemesList
              schemes={getMatchingSchemes()}
              language={profile.language}
              crop={profile.crop}
              landSize={profile.landSize}
              onBack={handleBack}
              onHome={handleHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Index = () => {
  return (
    <FarmerProvider>
      <FarmerApp />
    </FarmerProvider>
  );
};

export default Index;
