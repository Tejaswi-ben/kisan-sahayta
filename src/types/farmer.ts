export type Language = 'te' | 'hi' | 'ta' | 'kn' | 'mr' | 'en';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export type CropType = 'rice' | 'wheat' | 'cotton' | 'sugarcane' | 'vegetables' | 'fruits';

export interface CropOption {
  id: CropType;
  icon: string;
  labels: Record<Language, string>;
}

export type LandSize = 'small' | 'medium' | 'large';

export interface LandOption {
  id: LandSize;
  acres: string;
  icon: string;
  labels: Record<Language, string>;
}

export interface Scheme {
  id: string;
  title: Record<Language, string>;
  shortDescription: Record<Language, string>;
  benefit: string;
  eligibility: {
    crops: CropType[];
    landSizes: LandSize[];
  };
  videoUrl?: string;
  isNew?: boolean;
  isUrgent?: boolean;
}

export interface FarmerProfile {
  language: Language;
  crop?: CropType;
  landSize?: LandSize;
}
