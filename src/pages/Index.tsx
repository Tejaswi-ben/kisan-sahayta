import React, { useState } from 'react';
import { LanguageSelection } from '@/components/LanguageSelection';
import { SchemesPage } from '@/components/SchemesPage';
import { AlertsPage } from '@/components/AlertsPage';
import { FarmerProvider, useFarmer } from '@/context/FarmerContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Language } from '@/types/farmer';

type Step = 'language' | 'schemes' | 'alerts';

function FarmerApp() {
  const { profile, setLanguage, resetProfile } = useFarmer();
  const [step, setStep] = useState<Step>('language');

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStep('schemes');
  };

  const handleBack = () => {
    resetProfile();
    setStep('language');
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

        {step === 'schemes' && (
          <motion.div
            key="schemes"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SchemesPage
              language={profile.language}
              onBack={handleBack}
              onNavigateToAlerts={() => setStep('alerts')}
            />
          </motion.div>
        )}

        {step === 'alerts' && (
          <motion.div
            key="alerts"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AlertsPage
              language={profile.language}
              onBack={() => setStep('schemes')}
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
