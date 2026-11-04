
module.exports = {
  config: {
    name: "bratlyrics",
    version: "1.0.0",
    author: "Edward",
    countDown: 5,
    role: 0,
    shortDescription: "BratLyrics Music Video Generator",
    longDescription: "Open the BratLyrics music video generator",
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    const website = "PASTE_YOUR_GITHUB_PAGES_LINK_HERE";

    return message.reply(
      "🎵 BRATLYRICS MUSIC VIDEO GENERATOR\n\n" +
      "Search songs, play audio, sync lyrics, and create your own BratLyrics video!\n\n" +
      "🌐 Open here:\n" + website
    );
  }
};
