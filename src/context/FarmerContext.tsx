import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FarmerProfile, Language, CropType, LandSize, Scheme } from '@/types/farmer';
import { schemes } from '@/data/schemes';

interface FarmerContextType {
  profile: FarmerProfile;
  setLanguage: (lang: Language) => void;
  setCrop: (crop: CropType) => void;
  setLandSize: (size: LandSize) => void;
  getMatchingSchemes: () => Scheme[];
  resetProfile: () => void;
}

const defaultProfile: FarmerProfile = {
  language: 'en',
};

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export function FarmerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(defaultProfile);

  const setLanguage = (lang: Language) => {
    setProfile((prev) => ({ ...prev, language: lang }));
  };

  const setCrop = (crop: CropType) => {
    setProfile((prev) => ({ ...prev, crop }));
  };

  const setLandSize = (size: LandSize) => {
    setProfile((prev) => ({ ...prev, landSize: size }));
  };

  const getMatchingSchemes = (): Scheme[] => {
    if (!profile.crop || !profile.landSize) return [];

    return schemes.filter(
      (scheme) =>
        scheme.eligibility.crops.includes(profile.crop!) &&
        scheme.eligibility.landSizes.includes(profile.landSize!)
    );
  };

  const resetProfile = () => {
    setProfile({ language: profile.language });
  };

  return (
    <FarmerContext.Provider
      value={{
        profile,
        setLanguage,
        setCrop,
        setLandSize,
        getMatchingSchemes,
        resetProfile,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const context = useContext(FarmerContext);
  if (context === undefined) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
}
