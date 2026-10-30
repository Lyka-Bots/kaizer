
const axios = require("axios");

function normalizeTitle(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  config: {
    name: "lyrics",
    version: "2.0.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    category: "music",
    description: {
      en: "Search for an exact song match."
    },
    guide: {
      en: "{pn} <song title>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "🎵 Please enter a song title.\nExample: /lyrics Hangin",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const res = await axios.get(
        "https://www.smfahim.xyz/ai/lyrics/v1",
        {
          params: { prompt: query },
          timeout: 15000
        }
      );

      const data = res.data;

      if (!data?.success || !data?.lyrics?.title) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(
          "❌ Song not found. Try adding the artist name.",
          threadID,
          messageID
        );
      }

      const title = data.lyrics.title;
      const requestedTitle = normalizeTitle(query);
      const returnedTitle = normalizeTitle(title);

      // Reject results that do not exactly match the requested title.
      if (requestedTitle !== returnedTitle) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(
          `❌ Wrong song result!\n\n` +
          `🔎 Search: ${query}\n` +
          `🎵 Result: ${title}\n\n` +
          `Please include the artist name for a more accurate search.`,
          threadID,
          messageID
        );
      }

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(
        `🎵 Exact song match found!\n\n` +
        `Title: ${title}\n\n` +
        `Song lyrics are not displayed in full here.`,
        threadID,
        messageID
      );

    } catch (err) {
      console.error("[LYRICS ERROR]", err);

      api.setMessageReaction("❌", messageID, () => {}, true);

      return api.sendMessage(
        "❌ Lyrics search failed. Please try again later.",
        threadID,
        messageID
      );
    }
  }
};
