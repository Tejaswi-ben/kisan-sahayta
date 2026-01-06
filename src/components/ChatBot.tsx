import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, Volume2, Loader2 } from 'lucide-react';
import { Language } from '@/types/farmer';
import { uiText } from '@/data/languages';
import { supabase } from '@/integrations/supabase/client';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  language: Language;
}

const placeholderText: Record<Language, string> = {
  te: 'మీ ప్రశ్న అడగండి...',
  hi: 'अपना सवाल पूछें...',
  ta: 'உங்கள் கேள்வியைக் கேளுங்கள்...',
  kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
  mr: 'तुमचा प्रश्न विचारा...',
  en: 'Ask your question...',
};

const welcomeText: Record<Language, string> = {
  te: 'నమస్కారం! నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. ప్రభుత్వ పథకాల గురించి ఏదైనా అడగండి.',
  hi: 'नमस्ते! मैं आपकी मदद के लिए यहाँ हूँ। सरकारी योजनाओं के बारे में कुछ भी पूछें।',
  ta: 'வணக்கம்! நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன். அரசு திட்டங்கள் பற்றி எதையும் கேளுங்கள்.',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ.',
  mr: 'नमस्कार! मी तुम्हाला मदत करण्यासाठी येथे आहे. सरकारी योजनांबद्दल काहीही विचारा.',
  en: 'Hello! I am here to help you. Ask anything about government schemes.',
};

export function ChatBot({ language }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking, isLoading: isTTSLoading } = useElevenLabsTTS();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeText[language]
      }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send full conversation history (excluding welcome message id)
      const conversationHistory = updatedMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('farmer-chat', {
        body: { messages: conversationHistory, language }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'en' 
          ? 'Sorry, something went wrong. Please try again.'
          : 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 150px)' }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {language === 'en' ? 'Kisan Helper' : 'किसान सहायक'}
                  </h3>
                  <p className="text-xs opacity-80">
                    {language === 'en' ? 'Ask about schemes' : 'योजनाओं के बारे में पूछें'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        disabled={isTTSLoading}
                        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {isTTSLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                        {isSpeaking ? 'Stop' : uiText.listen[language]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={placeholderText[language]}
                  className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
