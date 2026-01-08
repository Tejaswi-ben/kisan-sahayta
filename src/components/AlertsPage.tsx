import React, { useState } from 'react';
import { Language } from '@/types/farmer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Bell, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  Mic,
  AlertTriangle,
  Calendar,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface AlertsPageProps {
  language: Language;
  onBack: () => void;
}

type DeadlineStatus = 'open' | 'closing-soon' | 'urgent';

interface SchemeDeadline {
  id: string;
  name: { en: string; hi: string; te: string; ta: string; kn: string; mr: string };
  status: DeadlineStatus;
  daysLeft?: number;
}

const schemeDeadlines: SchemeDeadline[] = [
  {
    id: '1',
    name: {
      en: 'PM-KISAN Installment',
      hi: 'पीएम-किसान किस्त',
      te: 'పీఎం-కిసాన్ వాయిదా',
      ta: 'பிஎம்-கிசான் தவணை',
      kn: 'ಪಿಎಂ-ಕಿಸಾನ್ ಕಂತು',
      mr: 'पीएम-किसान हप्ता'
    },
    status: 'open',
    daysLeft: 45
  },
  {
    id: '2',
    name: {
      en: 'Crop Insurance Scheme',
      hi: 'फसल बीमा योजना',
      te: 'పంట బీమా పథకం',
      ta: 'பயிர் காப்பீட்டு திட்டம்',
      kn: 'ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ',
      mr: 'पीक विमा योजना'
    },
    status: 'closing-soon',
    daysLeft: 7
  },
  {
    id: '3',
    name: {
      en: 'Tractor Subsidy Application',
      hi: 'ट्रैक्टर सब्सिडी आवेदन',
      te: 'ట్రాక్టర్ సబ్సిడీ దరఖాస్తు',
      ta: 'டிராக்டர் மானியம் விண்ணப்பம்',
      kn: 'ಟ್ರ್ಯಾಕ್ಟರ್ ಸಬ್ಸಿಡಿ ಅರ್ಜಿ',
      mr: 'ट्रॅक्टर अनुदान अर्ज'
    },
    status: 'urgent',
    daysLeft: 2
  },
  {
    id: '4',
    name: {
      en: 'Soil Health Card',
      hi: 'मृदा स्वास्थ्य कार्ड',
      te: 'నేల ఆరోగ్య కార్డు',
      ta: 'மண் ஆரோக்கிய அட்டை',
      kn: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್',
      mr: 'माती आरोग्य कार्ड'
    },
    status: 'open',
    daysLeft: 60
  },
  {
    id: '5',
    name: {
      en: 'Drip Irrigation Subsidy',
      hi: 'ड्रिप सिंचाई सब्सिडी',
      te: 'బిందు సేద్యం సబ్సిడీ',
      ta: 'சொட்டு நீர்ப்பாசன மானியம்',
      kn: 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ',
      mr: 'ठिबक सिंचन अनुदान'
    },
    status: 'closing-soon',
    daysLeft: 5
  }
];

const translations = {
  title: {
    en: 'Smart Alerts & Deadline Prediction',
    hi: 'स्मार्ट अलर्ट और समय सीमा पूर्वानुमान',
    te: 'స్మార్ట్ అలర్ట్‌లు & గడువు అంచనా',
    ta: 'ஸ்மார்ட் எச்சரிக்கைகள் & காலக்கெடு கணிப்பு',
    kn: 'ಸ್ಮಾರ್ಟ್ ಎಚ್ಚರಿಕೆಗಳು & ಗಡುವು ಮುನ್ಸೂಚನೆ',
    mr: 'स्मार्ट अलर्ट आणि मुदत अंदाज'
  },
  deadlineSection: {
    en: 'Scheme Deadline Prediction',
    hi: 'योजना समय सीमा पूर्वानुमान',
    te: 'పథకం గడువు అంచనా',
    ta: 'திட்ட காலக்கெடு கணிப்பு',
    kn: 'ಯೋಜನೆ ಗಡುವು ಮುನ್ಸೂಚನೆ',
    mr: 'योजना मुदत अंदाज'
  },
  open: {
    en: 'Open – Low Risk',
    hi: 'खुला – कम जोखिम',
    te: 'ఓపెన్ – తక్కువ రిస్క్',
    ta: 'திறந்தது – குறைந்த ஆபத்து',
    kn: 'ತೆರೆದಿದೆ – ಕಡಿಮೆ ಅಪಾಯ',
    mr: 'खुले – कमी धोका'
  },
  closingSoon: {
    en: 'Closing Soon',
    hi: 'जल्द बंद हो रहा है',
    te: 'త్వరలో మూసివేయబడుతుంది',
    ta: 'விரைவில் மூடப்படும்',
    kn: 'ಶೀಘ್ರದಲ್ಲಿ ಮುಚ್ಚುತ್ತಿದೆ',
    mr: 'लवकरच बंद होणार'
  },
  urgent: {
    en: 'Urgent – Apply Now',
    hi: 'अत्यावश्यक – अभी आवेदन करें',
    te: 'అత్యవసరం – ఇప్పుడే దరఖాస్తు చేయండి',
    ta: 'அவசரம் – இப்போது விண்ணப்பிக்கவும்',
    kn: 'ತುರ್ತು – ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    mr: 'तातडीचे – आताच अर्ज करा'
  },
  daysLeft: {
    en: 'days left',
    hi: 'दिन शेष',
    te: 'రోజులు మిగిలి ఉన్నాయి',
    ta: 'நாட்கள் மீதம்',
    kn: 'ದಿನಗಳು ಬಾಕಿ',
    mr: 'दिवस शिल्लक'
  },
  predictionNote: {
    en: 'Prediction based on recent government updates',
    hi: 'हालिया सरकारी अपडेट के आधार पर पूर्वानुमान',
    te: 'ఇటీవలి ప్రభుత్వ అప్‌డేట్‌ల ఆధారంగా అంచనా',
    ta: 'சமீபத்திய அரசாங்க புதுப்பிப்புகளின் அடிப்படையில் கணிப்பு',
    kn: 'ಇತ್ತೀಚಿನ ಸರ್ಕಾರಿ ನವೀಕರಣಗಳ ಆಧಾರದ ಮೇಲೆ ಮುನ್ಸೂಚನೆ',
    mr: 'अलीकडील सरकारी अपडेट्सवर आधारित अंदाज'
  },
  alertSection: {
    en: '🚨 AGRON Alerts & Reminders',
    hi: '🚨 AGRON अलर्ट और रिमाइंडर',
    te: '🚨 AGRON హెచ్చరికలు & రిమైండర్లు',
    ta: '🚨 AGRON எச்சரிக்கைகள் & நினைவூட்டல்கள்',
    kn: '🚨 AGRON ಎಚ್ಚರಿಕೆಗಳು & ನೆನಪೋಲೆಗಳು',
    mr: '🚨 AGRON अलर्ट आणि स्मरणपत्रे'
  },
  appealReminder: {
    en: 'Appeal deadline reminder',
    hi: 'अपील समय सीमा अनुस्मारक',
    te: 'అప్పీల్ గడువు రిమైండర్',
    ta: 'மேல்முறையீட்டு காலக்கெடு நினைவூட்டல்',
    kn: 'ಮೇಲ್ಮನವಿ ಗಡುವು ನೆನಪೋಲೆ',
    mr: 'अपील मुदत स्मरणपत्र'
  },
  missingDoc: {
    en: 'Missing document alert',
    hi: 'लापता दस्तावेज़ अलर्ट',
    te: 'తప్పిపోయిన పత్రం హెచ్చరిక',
    ta: 'காணாமல் போன ஆவண எச்சரிக்கை',
    kn: 'ಕಾಣೆಯಾದ ದಾಖಲೆ ಎಚ್ಚರಿಕೆ',
    mr: 'गहाळ दस्तऐवज अलर्ट'
  },
  approvalNotif: {
    en: 'Approval notification',
    hi: 'स्वीकृति अधिसूचना',
    te: 'ఆమోద నోటిఫికేషన్',
    ta: 'ஒப்புதல் அறிவிப்பு',
    kn: 'ಅನುಮೋದನೆ ಅಧಿಸೂಚನೆ',
    mr: 'मंजुरी सूचना'
  },
  enableSMS: {
    en: '📩 Enable SMS Alerts',
    hi: '📩 SMS अलर्ट सक्षम करें',
    te: '📩 SMS హెచ్చరికలను ప్రారంభించండి',
    ta: '📩 SMS எச்சரிக்கைகளை இயக்கு',
    kn: '📩 SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
    mr: '📩 SMS अलर्ट सक्षम करा'
  },
  hearAlerts: {
    en: '🎙️ Hear alerts in my language',
    hi: '🎙️ मेरी भाषा में अलर्ट सुनें',
    te: '🎙️ నా భాషలో హెచ్చరికలు వినండి',
    ta: '🎙️ என் மொழியில் எச்சரிக்கைகளைக் கேளுங்கள்',
    kn: '🎙️ ನನ್ನ ಭಾಷೆಯಲ್ಲಿ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಕೇಳಿ',
    mr: '🎙️ माझ्या भाषेत अलर्ट ऐका'
  },
  alertSuccess: {
    en: 'Alert sent successfully to your mobile 📲',
    hi: 'आपके मोबाइल पर अलर्ट सफलतापूर्वक भेजा गया 📲',
    te: 'మీ మొబైల్‌కి హెచ్చరిక విజయవంతంగా పంపబడింది 📲',
    ta: 'உங்கள் மொபைலுக்கு எச்சரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது 📲',
    kn: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಎಚ್ಚರಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ 📲',
    mr: 'तुमच्या मोबाईलवर अलर्ट यशस्वीरित्या पाठवला 📲'
  },
  demoNote: {
    en: 'This is a demo. In real use, alerts are sent via SMS / WhatsApp.',
    hi: 'यह एक डेमो है। वास्तविक उपयोग में, अलर्ट SMS / WhatsApp के माध्यम से भेजे जाते हैं।',
    te: 'ఇది డెమో. వాస్తవ వినియోగంలో, హెచ్చరికలు SMS / WhatsApp ద్వారా పంపబడతాయి.',
    ta: 'இது டெமோ. உண்மையான பயன்பாட்டில், எச்சரிக்கைகள் SMS / WhatsApp மூலம் அனுப்பப்படும்.',
    kn: 'ಇದು ಡೆಮೊ. ನಿಜವಾದ ಬಳಕೆಯಲ್ಲಿ, ಎಚ್ಚರಿಕೆಗಳನ್ನು SMS / WhatsApp ಮೂಲಕ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.',
    mr: 'हा डेमो आहे. वास्तविक वापरात, अलर्ट SMS / WhatsApp द्वारे पाठवले जातात.'
  },
  back: {
    en: 'Back',
    hi: 'वापस',
    te: 'వెనక్కి',
    ta: 'பின்செல்',
    kn: 'ಹಿಂದೆ',
    mr: 'मागे'
  }
};

const getStatusConfig = (status: DeadlineStatus) => {
  switch (status) {
    case 'open':
      return {
        color: 'bg-green-500',
        bgLight: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        icon: '🟢'
      };
    case 'closing-soon':
      return {
        color: 'bg-yellow-500',
        bgLight: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        icon: '🟡'
      };
    case 'urgent':
      return {
        color: 'bg-red-500',
        bgLight: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-300',
        icon: '🔴'
      };
  }
};

export const AlertsPage: React.FC<AlertsPageProps> = ({ language, onBack }) => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const lang = language || 'en';

  const handleAlertAction = () => {
    setShowSuccessDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-lg font-bold">{translations.title[lang]}</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Section 1: Deadline Prediction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {translations.deadlineSection[lang]}
          </h2>

          <div className="space-y-3">
            {schemeDeadlines.map((scheme, index) => {
              const config = getStatusConfig(scheme.status);
              const statusText = scheme.status === 'open' 
                ? translations.open[lang]
                : scheme.status === 'closing-soon'
                ? translations.closingSoon[lang]
                : translations.urgent[lang];

              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${config.border} ${config.bgLight}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {scheme.name[lang]}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className={`text-sm font-medium ${config.textColor}`}>
                          {statusText}
                        </span>
                      </div>
                      {scheme.daysLeft && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{scheme.daysLeft} {translations.daysLeft[lang]}</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center italic">
            {translations.predictionNote[lang]}
          </p>
        </motion.section>

        {/* Section 2: AGRON Alert System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">
            {translations.alertSection[lang]}
          </h2>

          {/* Alert Types */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {translations.appealReminder[lang]}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {translations.missingDoc[lang]}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {translations.approvalNotif[lang]}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleAlertAction}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {translations.enableSMS[lang]}
            </Button>

            <Button 
              onClick={handleAlertAction}
              variant="outline"
              className="w-full"
            >
              <Mic className="w-4 h-4 mr-2" />
              {translations.hearAlerts[lang]}
            </Button>
          </div>

          {/* Demo Note */}
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {translations.demoNote[lang]}
          </p>
        </motion.section>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              {lang === 'en' ? 'Success!' : 'सफलता!'}
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {translations.alertSuccess[lang]}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-lg mt-2">
            <p className="text-xs text-muted-foreground text-center">
              {translations.demoNote[lang]}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
