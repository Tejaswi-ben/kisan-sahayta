import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is required");
    }

    const languageNames: Record<string, string> = {
      te: "Telugu",
      hi: "Hindi", 
      ta: "Tamil",
      kn: "Kannada",
      mr: "Marathi",
      en: "English"
    };

    const systemPrompt = `You are a friendly and helpful assistant for Indian farmers. Your role is to explain government schemes and subsidies in simple, easy-to-understand language.

IMPORTANT GUIDELINES:
- Always respond in ${languageNames[language] || "Hindi"}
- Use very simple words that an illiterate or semi-literate farmer can understand
- Avoid technical terms, government jargon, or complex sentences
- Be warm, supportive, and encouraging
- Keep responses short (2-3 sentences max)
- If asked about specific schemes, explain benefits, eligibility, and how to apply in simple terms
- Focus on practical information: how much money, who can get it, what documents needed

Example topics you can help with:
- PM-KISAN (₹6,000/year for small farmers)
- Crop insurance schemes
- Subsidies for seeds, fertilizers, equipment
- Loan waivers and interest subsidies
- Irrigation and water schemes

Remember: The farmer may not be able to read, so your response will be read aloud to them. Keep it conversational and friendly.`;

    // Build conversation with system prompt and user messages
    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log("Sending messages to AI:", JSON.stringify(conversationMessages.slice(0, 2)));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: conversationMessages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand. Please try again.";

    console.log("AI reply:", reply.substring(0, 100));

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
