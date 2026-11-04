
const { createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "bratlyrics",
    version: "1.0.0",
    author: "kaizer",
    countDown: 5,
    role: 0,
    shortDescription: "Generate music BratLyrics",
    category: "fun"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "Usage: bratlyrics <song title>",
        event.threadID,
        event.messageID
      );
    }

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`
      );

      const data = await response.json();

      if (!data.results || !data.results.length) {
        return api.sendMessage(
          "Song not found. Try another title.",
          event.threadID,
          event.messageID
        );
      }

      const song = data.results[0];
      const canvas = createCanvas(1080, 1350);
      const ctx = canvas.getContext("2d");

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1080, 1350);

      // Black typography
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      // Song title
      ctx.font = "bold 75px Arial";
      const title = song.trackName;

      function wrapText(text, maxWidth, lineHeight, y) {
        const words = text.split(" ");
        let line = "";

        for (const word of words) {
          const test = line ? line + " " + word : word;

          if (ctx.measureText(test).width > maxWidth && line) {
            ctx.fillText(line, 540, y);
            line = word;
            y += lineHeight;
          } else {
            line = test;
          }
        }

        if (line) ctx.fillText(line, 540, y);
      }

      wrapText(title, 900, 100, 610);

      // Artist
      ctx.font = "32px Arial";
      ctx.fillText(song.artistName || "Unknown Artist", 540, 760);

      // Footer
      ctx.font = "bold 26px Arial";
      ctx.fillText("BRATLYRICS", 540, 1250);

      const image = canvas.toBuffer("image/png");

      return api.sendMessage(
        {
          body: `🎵 ${song.trackName}\n${song.artistName || ""}`,
          attachment: require("stream").Readable.from(image)
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error(error);

      return api.sendMessage(
        "Something went wrong while generating the image.",
        event.threadID,
        event.messageID
      );
    }
  }
};
        
