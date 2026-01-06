import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId, language } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Map language codes to appropriate voice IDs
    // Using voices that work well for Indian languages
    const languageVoiceMap: Record<string, string> = {
      te: 'pFZP5JQG7iQjIQuC4Bku', // Lily - works well for Telugu
      hi: 'onwK4e9ZLuTAKqWW03F9', // Daniel - works well for Hindi
      ta: 'XrExE9yKIg1WjnnlVkGX', // Matilda - works well for Tamil
      kn: 'cgSgspJ2msm6clMCkdW9', // Jessica - works well for Kannada
      mr: 'EXAVITQu4vr4xnSDxMaL', // Sarah - works well for Marathi
      en: 'JBFqnCBsd6RMkjVDRZzb', // George - clear English voice
    };

    const selectedVoiceId = voiceId || languageVoiceMap[language] || 'JBFqnCBsd6RMkjVDRZzb';

    console.log(`Generating speech for language: ${language}, voice: ${selectedVoiceId}`);
    console.log(`Text length: ${text.length} characters`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.85, // Slightly slower for clarity
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`Audio generated successfully, size: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('TTS Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
