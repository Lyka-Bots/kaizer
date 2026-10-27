const OpenAI = require("openai");

module.exports = {
  config: {
    name: "ai",
    aliases: ["chatgpt"],
    version: "1.0.0",
    author: "Kaizer",
    role: 0,
    category: "AI",
    shortDescription: "Chat with AI",
    longDescription: "Chat with an AI that understands Taglish.",
    guide: "{pn}ai <message>"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply(
        "Ano gusto mong itanong? 🤖\nExample: /ai ano ang meaning ng buhay?"
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return message.reply(
        "Hindi pa naka-configure ang OpenAI API key. ⚠️"
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
          "You can joke and tease playfully, but avoid threats and serious harassment. " +
          "Keep replies conversational and not unnecessarily long.",
        input: prompt
      });

      const answer = response.output_text?.trim();

      return message.reply(
        answer || "Walang naisagot ang AI. Subukan mo ulit. 🤖"
      );
    } catch (error) {
      console.error("AI command error:", error.message);

      return message.reply(
        "Nagka-error habang kumokonekta sa AI. Pakisubukan ulit mamaya. ⚠️"
      );
    }
  }
};
