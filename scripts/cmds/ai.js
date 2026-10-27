
const OpenAI = require("openai");

module.exports = {
  config: {
    name: "ai",
    version: "1.0.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    description: {
      en: "Chat with AI in Taglish"
    },
    category: "AI",
    guide: {
      en: "{pn} <message>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage(
        "Ano gusto mong itanong? 🤖\nExample: /ai ano ang meaning ng buhay?",
        threadID,
        messageID
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return api.sendMessage(
        "Wala pang naka-configure na OpenAI API key. ⚠️",
        threadID,
        messageID
      );
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        instructions:
          "You are a funny Filipino AI chatbot. Speak naturally in Taglish. " +
          "Be witty and playful, but avoid threats and serious harassment. " +
          "Keep replies conversational and concise.",
        input: prompt
      });

      const answer = response.output_text?.trim();

      return api.sendMessage(
        answer || "Walang naisagot ang AI. Subukan ulit. 🤖",
        threadID,
        messageID
      );
    } catch (error) {
      console.error("AI command error:", error);

      return api.sendMessage(
        "Nagka-error habang kumokonekta sa AI. Pakisubukan ulit mamaya. ⚠️",
        threadID,
        messageID
      );
    }
  }
};
