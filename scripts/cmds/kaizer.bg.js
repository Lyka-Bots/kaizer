const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");
const checkCooldown = require("./utils/mediaCooldown");

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);
  return lines;
}

module.exports = {
  config: {
    name: "kaizer",
    version: "4.0.0",
    author: "Kaizer 🦄🦄",
    countDown: 10,
    role: 0,
    description: {
      en: "Create a Kaizer-style Facebook post"
    },
    category: "edit-img",
    guide: {
      en: "{pn} [text]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { senderID, threadID, messageID } = event;

    if (!await checkCooldown("siegfried", senderID, api, threadID))
      return;

    const bgPath = __dirname + "/cache/siegfried_bg.jpg";
    const pathImg = __dirname + "/cache/kaizer_post.png";
    const text = args.join(" ");

    if (!text)
      return api.sendMessage(
        "Put your post text!",
        threadID,
        messageID
      );

    try {
      const baseImage = await loadImage(bgPath);

      const canvas = createCanvas(
        baseImage.width,
        baseImage.height
      );

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        baseImage,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const W = canvas.width;
      const H = canvas.height;

      // HEADER
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(250, 0, 1750, 190);

      ctx.textAlign = "left";
      ctx.fillStyle = "#111111";
      ctx.font = "bold 110px Arial";
      ctx.fillText("Kaizer", 280, 105);

      ctx.fillStyle = "#65676b";
      ctx.font = "80px Arial";
      ctx.fillText("Just now", 280, 175);

      // POST TEXT
      ctx.textAlign = "center";
      ctx.fillStyle = "#111111";

      let fontSize = Math.floor(W * 0.035);
      if (fontSize > 115) fontSize = 115;

      ctx.font = `${fontSize}px Arial`;

      const maxWidth = W * 0.90;
      const lines = wrapText(ctx, text, maxWidth);

      while (
        lines.some(line =>
          ctx.measureText(line).width > maxWidth
        ) &&
        fontSize > 25
      ) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Arial`;
      }

      const lineHeight = fontSize * 1.35;
      const totalHeight = lines.length * lineHeight;

      let y = (H * 0.48) - (totalHeight / 2);

      for (const line of lines) {
        ctx.fillText(line, W / 2, y);
        y += lineHeight;
      }

      // REMOVE OLD REACTION SECTION
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, H - 210, W, 210);

      // REACTION ICONS
      const reactionY = H - 125;

      ctx.textAlign = "left";

      // Laugh reaction
      ctx.beginPath();
      ctx.arc(100, reactionY - 20, 48, 0, Math.PI * 2);
      ctx.fillStyle = "#f7b928";
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 55px Arial";
      ctx.textAlign = "center";
      ctx.fillText("😆", 100, reactionY);

      // Heart reaction
      ctx.beginPath();
      ctx.arc(215, reactionY - 20, 48, 0, Math.PI * 2);
      ctx.fillStyle = "#e4405f";
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 55px Arial";
      ctx.fillText("♥", 215, reactionY);

      // Reaction count
      ctx.textAlign = "left";
      ctx.fillStyle = "#65676b";
      ctx.font = "bold 75px Arial";
      ctx.fillText("1.2m", 290, reactionY + 5);

      // Shares count
      ctx.textAlign = "right";
      ctx.fillText("500k shares", W - 60, reactionY + 5);

      // SAVE IMAGE
      fs.writeFileSync(
        pathImg,
        canvas.toBuffer("image/png")
      );

      return api.sendMessage(
        {
          attachment: fs.createReadStream(pathImg)
        },
        threadID,
        () => {
          if (fs.existsSync(pathImg))
            fs.unlinkSync(pathImg);
        },
        messageID
      );

    } catch (error) {
      console.error(error);

      return api.sendMessage(
        "Something went wrong while creating the post.",
        threadID,
        messageID
      );
    }
  }
};
