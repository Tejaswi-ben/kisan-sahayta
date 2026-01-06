import React, { useState, useRef } from 'react';
import { Scheme, Language } from '@/types/farmer';
import { uiText } from '@/data/languages';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, RotateCcw, IndianRupee, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import farmerVideo from '@/assets/farmer-scheme-video.mp4';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  index: number;
}

export function SchemeCard({ scheme, language, index }: SchemeCardProps) {
  const { speak, stop, isSpeaking, isLoading } = useElevenLabsTTS();
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else {
      const text = `${scheme.title[language]}. ${scheme.shortDescription[language]}`;
      speak(text, language);
    }
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
    if (!showVideo && videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
        setIsPlaying(true);
      }, 100);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="scheme-card relative"
    >
      {/* Badges */}
      <div className="absolute -top-3 right-4 flex gap-2">
        {scheme.isNew && (
          <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {uiText.newScheme[language]}
          </span>
        )}
        {scheme.isUrgent && (
          <span className="px-3 py-1 rounded-full bg-notification text-notification-foreground text-xs font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {uiText.urgent[language]}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-3 pr-16">
        {scheme.title[language]}
      </h3>

      {/* Benefit badge */}
      <div className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold mb-4">
        <IndianRupee className="w-4 h-4" />
        {scheme.benefit}
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {scheme.shortDescription[language]}
      </p>

      {/* Video section */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <div className="video-container relative overflow-hidden rounded-2xl">
            <video
              ref={videoRef}
              src={farmerVideo}
              className="w-full aspect-video object-cover"
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
            />
            
            {/* Video controls overlay */}
            <div className="video-controls flex justify-center gap-4">
              <button
                onClick={handlePlayPause}
                className="icon-btn w-14 h-14 bg-card/90"
                aria-label={isPlaying ? uiText.pause[language] : uiText.play[language]}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleReplay}
                className="icon-btn w-14 h-14 bg-card/90"
                aria-label={uiText.replay[language]}
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleListen}
          disabled={isLoading}
          className={`flex-1 touch-target rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isSpeaking 
              ? 'bg-destructive text-destructive-foreground' 
              : 'bg-secondary text-secondary-foreground hover:shadow-lg'
          } ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{language === 'en' ? 'Loading...' : 'लोड हो रहा...'}</span>
            </>
          ) : isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>{language === 'en' ? 'Stop' : 'रुकें'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>{uiText.listen[language]}</span>
            </>
          )}
        </button>

        <button
          onClick={toggleVideo}
          className="flex-1 action-btn flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          <span>{uiText.watchVideo[language]}</span>
        </button>
      </div>
    </motion.div>
  );
}
