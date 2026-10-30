const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    version: "2.0.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    category: "music",
    description: { en: "Search song information by title and artist." },
    guide: { en: "{pn} <song title> [by artist]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "🎵 SONG SEARCH\n\nUsage: /lyrics <song title> [by artist]\nExample: /lyrics Kung Wala Ka by Hale\nExample: /lyrics Perfect by Ed Sheeran",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const response = await axios.get(
        "https://www.smfahim.xyz/ai/lyrics/v1",
        {
          params: { prompt: query },
          timeout: 20000,
          headers: { Accept: "application/json" }
        }
      );

      const data = response.data;
      const song = data && data.lyrics;

      if (!data || data.success !== true || !song || typeof song !== "object") {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(
          `❌ Walang mahanap na result para sa: ${query}\n\nSubukan ang mas kumpletong title o idagdag ang artist name.`,
          threadID,
          messageID
        );
      }

      const title = song.title || song.name || "Unknown title";
      const artist = song.artist || song.artists || song.artist_name || song.singer || "Not provided by search API";
      const album = song.album || song.album_name;
      const link = song.url || song.link || song.source;

      // Do not print the API's full lyric text. Show song metadata only.
      let message = `🎵 SONG RESULT\n\nTitle: ${title}\nArtist: ${Array.isArray(artist) ? artist.join(", ") : artist}`;
      if (album) message += `\nAlbum: ${album}`;
      if (link && typeof link === "string" && /^https?:\/\//i.test(link)) {
        message += `\n\nListen / view: ${link}`;
      }
      message += "\n\nIf the result is not the song you meant, try adding the artist name to your search.";

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(message, threadID, messageID);
    } catch (error) {
      console.error("[LYRICS COMMAND ERROR]", error.response?.data || error.message || error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ Hindi ma-access ang song search ngayon. Pakisubukan ulit mamaya.",
        threadID,
        messageID
      );
    }
  }
};
            
