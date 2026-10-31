const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

const pendingFights = new Map();
const W = 900;
const H = 500;

function roundedRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x, y + h, x, y + h, r);
  ctx.arcTo(x, y, x + w, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

async function getUserName(api, id) {
  try {
    const info = await api.getUserInfo(id);
    return info?.[id]?.name || `Player ${String(id).slice(-4)}`;
  } catch {
    return `Player ${String(id).slice(-4)}`;
  }
}

async function getAvatar(id) {
  try {
    const url =
      `https://graph.facebook.com/${encodeURIComponent(id)}/picture?type=large&width=256&height=256`;
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000
    });
    return await loadImage(Buffer.from(response.data));
  } catch {
    return null;
  }
}

function drawAvatar(ctx, img, x, y, color, name) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + 31, y + 31, 29, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = "#172033";
  ctx.fillRect(x, y, 62, 62);

  if (img) {
    ctx.drawImage(img, x + 2, y + 2, 58, 58);
  } else {
    ctx.fillStyle = color;
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name.charAt(0).toUpperCase(), x + 31, y + 41);
  }

  ctx.restore();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 31, y + 31, 30, 0, Math.PI * 2);
  ctx.stroke();
}

function drawSword(ctx, x1, y1, x2, y2, color, width = 5) {
  ctx.save();
  ctx.lineCap = "round";

  // Sword blade
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Sword guard
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(1, Math.hypot(dx, dy));
  const px = -dy / len;
  const py = dx / len;

  ctx.strokeStyle = "#ffd45c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x1 - px * 8, y1 - py * 8);
  ctx.lineTo(x1 + px * 8, y1 + py * 8);
  ctx.stroke();

  // Handle
  ctx.strokeStyle = "#a66b37";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - dx / len * 15, y1 - dy / len * 15);
  ctx.stroke();

  ctx.restore();
}

function drawStickman(ctx, x, y, color, pose, flip = 1, fallen = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (fallen) {
    ctx.rotate(-0.85);
    ctx.beginPath();
    ctx.arc(0, -15, 15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 42);
    ctx.lineTo(-30, 60);
    ctx.moveTo(0, 42);
    ctx.lineTo(28, 60);
    ctx.moveTo(0, 15);
    ctx.lineTo(-24, 30);
    ctx.moveTo(0, 15);
    ctx.lineTo(23, 27);
    ctx.stroke();

    ctx.restore();
    return;
  }

  const lean = pose === "attack" ? -12 : pose === "throw" ? 12 : 0;

  ctx.beginPath();
  ctx.arc(lean, -72, 16, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(lean, -55);
  ctx.lineTo(lean, -5);

  if (pose === "attack") {
    ctx.moveTo(lean, -42);
    ctx.lineTo(lean + 28, -58);
    ctx.moveTo(lean, -42);
    ctx.lineTo(lean - 22, -20);
    ctx.moveTo(lean, -5);
    ctx.lineTo(lean + 24, 30);
    ctx.moveTo(lean, -5);
    ctx.lineTo(lean - 24, 30);
  } else if (pose === "throw") {
    ctx.moveTo(lean, -42);
    ctx.lineTo(lean + 28, -20);
    ctx.moveTo(lean, -42);
    ctx.lineTo(lean - 25, -25);
    ctx.moveTo(lean, -5);
    ctx.lineTo(lean + 28, 28);
    ctx.moveTo(lean, -5);
    ctx.lineTo(lean - 22, 30);
  } else {
    ctx.moveTo(lean, -42);
    ctx.lineTo(lean + 24, -28);
    ctx.moveTo(lean, -42);
    ctx.lineTo(lean - 23, -24);
    ctx.moveTo(lean, -5);
    ctx.lineTo(lean + 20, 30);
    ctx.moveTo(lean, -5);
    ctx.lineTo(lean - 20, 30);
  }

  ctx.stroke();
  ctx.restore();
}

function drawFrame(ctx, frame, fight, avatars, winner) {
  const { name1, name2 } = fight;
  const [avatar1, avatar2] = avatars;
  const t = frame / 35;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#10152e");
  bg.addColorStop(0.5, "#20204b");
  bg.addColorStop(1, "#091a2e");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Moonlit arena
  ctx.fillStyle = "rgba(180,205,255,.14)";
  ctx.beginPath();
  ctx.arc(450, 180, 115, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#090d1c";
  ctx.fillRect(0, 355, W, 145);

  ctx.strokeStyle = "#59658e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 355);
  ctx.lineTo(W, 355);
  ctx.stroke();

  // HP bars
  roundedRect(ctx, 18, 16, 390, 18, 8, "#262b45");
  roundedRect(ctx, 492, 16, 390, 18, 8, "#262b45");

  const hp1 = Math.max(0, 1 - t * 1.08);
  const hp2 = Math.max(0, 1 - Math.max(0, t - 0.1) * 1.2);

  roundedRect(ctx, 20, 18, 386 * hp1, 14, 6, "#ff3158");
  roundedRect(
    ctx,
    494 + 386 * (1 - hp2),
    18,
    386 * hp2,
    14,
    6,
    "#20caff"
  );

  drawAvatar(ctx, avatar1, 20, 42, "#ff3158", name1);
  drawAvatar(ctx, avatar2, 818, 42, "#20caff", name2);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(name1.slice(0, 22), 92, 77);

  ctx.textAlign = "right";
  ctx.fillText(name2.slice(0, 22), 808, 77);

  ctx.textAlign = "center";
  ctx.font = "bold 25px Arial";
  ctx.fillStyle = "#ffd34d";
  ctx.fillText("VS", 450, 65);

  let x1 = 260;
  let x2 = 640;
  let pose1 = "idle";
  let pose2 = "idle";
  let fallen2 = false;

  // Approach and sword fight
  if (frame < 8) {
    x1 += frame * 7;
    x2 -= frame * 7;
    pose1 = frame % 3 === 0 ? "attack" : "idle";
    pose2 = frame % 3 === 1 ? "attack" : "idle";
  } else if (frame < 19) {
    x1 = 330 + (frame % 2) * 10;
    x2 = 570 - (frame % 2) * 10;
    pose1 = "attack";
    pose2 = "attack";
  } else if (frame < 23) {
    x1 = 360;
    x2 = 535;
    pose1 = "attack";
  } else if (frame < 28) {
    x1 = 365;
    x2 = 520 + (frame - 23) * 12;
    pose1 = "throw";
  } else {
    x1 = 365;
    x2 = 635;
    fallen2 = true;
  }

  // Sword swings
  if (frame < 23) {
    const swing = frame < 8 ? frame : frame < 19 ? frame % 5 : frame - 19;

    drawSword(
      ctx,
      x1 + 15,
      300,
      x1 + 75 + swing * 2,
      250 - swing * 3,
      "#fff4c7"
    );

    if (frame < 19) {
      drawSword(
        ctx,
        x2 - 15,
        300,
        x2 - 75 - swing * 2,
        250 + swing * 2,
        "#9eeaff"
      );
    }
  } else if (frame < 28) {
    drawSword(ctx, x1 + 12, 300, x1 + 72, 275, "#fff4c7");
  }

  drawStickman(ctx, x1, 345, "#ff4266", pose1, 1);
  drawStickman(ctx, x2, 345, "#32d5ff", pose2, -1, fallen2);

  // Sword clash sparks
  if (frame >= 6 && frame <= 19) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(450 + Math.sin(frame * 2) * 9, 275, 10 + (frame % 3) * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffd65c";
    ctx.lineWidth = 4;

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + frame;
      ctx.beginPath();
      ctx.moveTo(450 + Math.cos(a) * 8, 275 + Math.sin(a) * 8);
      ctx.lineTo(450 + Math.cos(a) * 30, 275 + Math.sin(a) * 30);
      ctx.stroke();
    }
  }

  // KO moment
  if (frame >= 20 && frame <= 22) {
    ctx.fillStyle = "#ff304d";
    ctx.font = "bold italic 64px Arial";
    ctx.textAlign = "center";
    ctx.fillText("K.O.!", 450, 205);
  }

  // Finishing throw after KO
  if (frame >= 23 && frame <= 27) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FINISHING THROW!", 450, 145);

    ctx.strokeStyle = "rgba(100,210,255,.8)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(545, 290, 75 + frame * 2, Math.PI * 1.1, Math.PI * 1.8);
    ctx.stroke();
  }

  // Final screen
  if (frame >= 28) {
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.font = "italic bold 70px Arial";
    ctx.fillStyle = "#ff183d";
    ctx.fillText("FATALITY!", 450, 220);

    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`WINNER: ${winner}`, 450, 270);

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#ffd34d";
    ctx.fillText("SWORD DUEL", 450, 310);
  }
}

async function makeFightGif(fight, outPath) {
  const avatars = await Promise.all([
    getAvatar(fight.p1),
    getAvatar(fight.p2)
  ]);

  const encoder = new GIFEncoder(W, H);
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const stream = encoder.createReadStream();
  const fileStream = fs.createWriteStream(outPath);

  const done = new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
    stream.on("error", reject);
  });

  stream.pipe(fileStream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(110);
  encoder.setQuality(10);

  for (let i = 0; i < 36; i++) {
    drawFrame(ctx, i, fight, avatars, fight.name1);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  await done;
}

module.exports = {
  config: {
    name: "fight",
    aliases: ["duel", "swordfight"],
    version: "2.0.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    shortDescription: "Challenge someone to an animated sword duel",
    longDescription: "Challenge a member, accept the duel, and generate a sword-fight GIF with names and profile pictures.",
    category: "games",
    guide: {
      en: "{pn} @mention — challenge a player\n{pn} accept — accept the challenge\n{pn} decline — decline the challenge"
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const action = (args[0] || "").toLowerCase();
    const key = String(threadID);
    const current = pendingFights.get(key);

    if (["accept", "a"].includes(action)) {
      if (!current) {
        return api.sendMessage(
          "Walang pending sword fight sa chat na ito. Gamitin: /fight @mention",
          threadID,
          event.messageID
        );
      }

      if (senderID !== current.p2) {
        return api.sendMessage(
          "Ang hinamon lang ang puwedeng mag-accept ng fight na ito.",
          threadID,
          event.messageID
        );
      }

      pendingFights.delete(key);

      if (Math.random() < 0.5) {
        [current.p1, current.p2] = [current.p2, current.p1];
        [current.name1, current.name2] = [current.name2, current.name1];
      }

      api.sendMessage(
        "⚔️ Accepted! Kinukuha ang profile pictures at names, then generating sword-fight GIF...",
        threadID,
        event.messageID
      );

      const outPath = path.join(
        __dirname,
        `fight-${threadID}-${Date.now()}.gif`
      );

      try {
        await makeFightGif(current, outPath);

        await new Promise((resolve, reject) => {
          api.sendMessage(
            {
              body:
                `⚔️ SWORD DUEL\n${current.name1} VS ${current.name2}\n\n` +
                "K.O. → FINISHING THROW → FATALITY!",
              attachment: fs.createReadStream(outPath)
            },
            threadID,
            err => (err ? reject(err) : resolve()),
            event.messageID
          );
        });
      } catch (err) {
        console.error("[fight] GIF generation failed:", err);
        api.sendMessage(
          "Hindi nagawa ang GIF. Check kung installed ang canvas, gifencoder, axios, at fs-extra.",
          threadID,
          event.messageID
        );
      } finally {
        fs.remove(outPath).catch(() => {});
      }

      return;
    }

    if (["decline", "d"].includes(action)) {
      if (!current) {
        return api.sendMessage("Walang pending challenge.", threadID, event.messageID);
      }

      if (senderID !== current.p2) {
        return api.sendMessage(
          "Ang hinamon lang ang puwedeng mag-decline.",
          threadID,
          event.messageID
        );
      }

      pendingFights.delete(key);
      return api.sendMessage("Challenge declined. ⚔️", threadID, event.messageID);
    }

    const mentioned = Object.keys(event.mentions || {});
    const targetID = mentioned.find(id => id !== senderID);

    if (!targetID) {
      return api.sendMessage(
        "Gamitin: /fight @mention\nPag may challenge na, ang hinamon ay mag-type ng /fight accept.",
        threadID,
        event.messageID
      );
    }

    if (pendingFights.has(key)) {
      return api.sendMessage(
        "May pending fight na sa chat na ito. I-accept o i-decline muna.",
        threadID,
        event.messageID
      );
    }

    if (targetID === senderID) {
      return api.sendMessage("Hindi puwedeng hamunin ang sarili mo. 😅", threadID, event.messageID);
    }

    const [name1, name2] = await Promise.all([
      getUserName(api, senderID),
      getUserName(api, targetID)
    ]);

    pendingFights.set(key, {
      p1: senderID,
      p2: targetID,
      name1,
      name2,
      createdAt: Date.now()
    });

    return api.sendMessage(
      `⚔️ SWORD FIGHT CHALLENGE!\n\n${name1} challenges ${name2}!\n\n` +
      `${name2}, type /fight accept to start or /fight decline to refuse.\n\n` +
      "Both profile pictures and names will appear in the fight GIF.",
      threadID,
      event.messageID
    );
  }
};
