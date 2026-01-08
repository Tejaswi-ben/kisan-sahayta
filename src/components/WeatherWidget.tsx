import React, { useState, useEffect } from 'react';
import { Language } from '@/types/farmer';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react';

interface WeatherWidgetProps {
  language: Language;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  humidity: number;
  windSpeed: number;
  forecast: { day: string; temp: number; condition: string }[];
}

const weatherLabels: Record<string, Record<Language, string>> = {
  weather: {
    te: 'వాతావరణం',
    hi: 'मौसम',
    ta: 'வானிலை',
    kn: 'ಹವಾಮಾನ',
    mr: 'हवामान',
    en: 'Weather',
  },
  today: {
    te: 'ఈ రోజు',
    hi: 'आज',
    ta: 'இன்று',
    kn: 'ಇಂದು',
    mr: 'आज',
    en: 'Today',
  },
  humidity: {
    te: 'తేమ',
    hi: 'नमी',
    ta: 'ஈரப்பதம்',
    kn: 'ತೇವಾಂಶ',
    mr: 'आर्द्रता',
    en: 'Humidity',
  },
  wind: {
    te: 'గాలి',
    hi: 'हवा',
    ta: 'காற்று',
    kn: 'ಗಾಳಿ',
    mr: 'वारा',
    en: 'Wind',
  },
};

const dayNames: Record<Language, string[]> = {
  te: ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु'],
  ta: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்'],
  kn: ['ಭಾನು', 'ಸೋಮ', 'ಮಂಗಳ', 'ಬುಧ', 'ಗುರು'],
  mr: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
};

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case 'rainy':
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    case 'cloudy':
      return <Cloud className="w-8 h-8 text-gray-500" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-400" />;
  }
};

export function WeatherWidget({ language }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated weather data - in production, fetch from actual API
    const simulatedWeather: WeatherData = {
      location: language === 'en' ? 'Hyderabad' : 'హైదరాబాద్',
      temperature: 32,
      condition: 'partly-cloudy',
      humidity: 65,
      windSpeed: 12,
      forecast: [
        { day: dayNames[language][0], temp: 32, condition: 'sunny' },
        { day: dayNames[language][1], temp: 30, condition: 'cloudy' },
        { day: dayNames[language][2], temp: 28, condition: 'rainy' },
        { day: dayNames[language][3], temp: 31, condition: 'sunny' },
        { day: dayNames[language][4], temp: 33, condition: 'sunny' },
      ],
    };

    setTimeout(() => {
      setWeather(simulatedWeather);
      setLoading(false);
    }, 500);
  }, [language]);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-lg border border-border animate-pulse">
        <div className="h-20 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-cyan-500/10 rounded-2xl p-4 shadow-lg border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">{weather.location}</span>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Current Weather */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl font-bold text-foreground">
          {weather.temperature}°
        </div>
        {getWeatherIcon(weather.condition)}
        <div className="flex-1 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplets className="w-4 h-4" />
            <span>{weatherLabels.humidity[language]}: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wind className="w-4 h-4" />
            <span>{weatherLabels.wind[language]}: {weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-5 gap-2 pt-3 border-t border-border">
        {weather.forecast.map((day, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
            <div className="flex justify-center mb-1">
              {getWeatherIcon(day.condition)}
            </div>
            <p className="text-sm font-medium text-foreground">{day.temp}°</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
