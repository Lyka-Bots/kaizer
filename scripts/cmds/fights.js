const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const pending = new Map();
const active = new Set();
const ACCEPT_WINDOW = 60_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTargetId(event) {
  const ids = Object.keys(event.mentions || {});

  if (event.messageReply?.senderID) {
    return String(event.messageReply.senderID);
  }

  return ids.length ? String(ids[0]) : null;
}

async function getName(api, id) {
  try {
    const info = await api.getUserInfo(id);
    return info?.[id]?.name || `Player ${id}`;
  } catch {
    return `Player ${id}`;
  }
}

async function getAvatar(id) {
  const url =
    `https://graph.facebook.com/${encodeURIComponent(id)}/picture?width=256&height=256`;

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 10000
  });

  return loadImage(Buffer.from(response.data));
}

function drawAvatar(ctx, img, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    x + size / 2,
    y + size / 2,
    size / 2,
    0,
    Math.PI * 2
  );
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(
    x + size / 2,
    y + size / 2,
    size / 2,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}

function drawStickman(ctx, x, y, flip, color, pose) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip ? -1 : 1, 1);

  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Head
  ctx.beginPath();
  ctx.arc(0, -95, 28, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(0, -65);
  ctx.lineTo(0, 10);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(0, -45);

  if (pose === 1) {
    ctx.lineTo(58, -35);
    ctx.lineTo(105, -65);
  } else if (pose === 2) {
    ctx.lineTo(55, -85);
    ctx.lineTo(80, -115);
  } else {
    ctx.lineTo(48, -10);
    ctx.lineTo(68, 10);
  }

  ctx.moveTo(0, -45);

  if (pose === 1) {
    ctx.lineTo(-38, -15);
    ctx.lineTo(-55, 15);
  } else if (pose === 2) {
    ctx.lineTo(-55, -85);
    ctx.lineTo(-80, -115);
  } else {
    ctx.lineTo(-48, -10);
    ctx.lineTo(-68, 10);
  }

  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(-35, 65);
  ctx.lineTo(-42, 100);

  ctx.moveTo(0, 10);
  ctx.lineTo(35, 65);
  ctx.lineTo(42, 100);
  ctx.stroke();

  ctx.restore();
}

function fitName(ctx, name, x, y, maxWidth) {
  let text = String(name || "Player");

  while (
    ctx.measureText(text).width > maxWidth &&
    text.length > 4
  ) {
    text = text.slice(0, -2) + "…";
  }

  ctx.fillText(text, x, y);
}

async function renderBattle(p1, p2, winnerId, threadID) {
  const cacheDir = path.join(__dirname, "cache");
  await fs.ensureDir(cacheDir);

  const out = path.join(
    cacheDir,
    `fight-${threadID}-${Date.now()}.png`
  );

  const canvas = createCanvas(1000, 650);
  const ctx = canvas.getContext("2d");

  // Arena background
  const bg = ctx.createLinearGradient(0, 0, 1000, 650);
  bg.addColorStop(0, "#10152e");
  bg.addColorStop(0.5, "#31134a");
  bg.addColorStop(1, "#111827");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1000, 650);

  // Arena lights
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = "rgba(255,255,255,0.045)";
    ctx.beginPath();
    ctx.arc(
      50 + i * 85,
      290 + (i % 2) * 22,
      36,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 44px Arial";
  ctx.fillText("STICKMAN DUEL", 500, 58);

  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "#ffcf5a";
  ctx.fillText("SCORE: 30% VS 30%", 500, 92);

  // Player profile pictures
  let a1;
  let a2;

  try {
    [a1, a2] = await Promise.all([
      getAvatar(p1.id),
      getAvatar(p2.id)
    ]);
  } catch (err) {
    console.error("[fight] Avatar error:", err.message);
  }

  if (a1) drawAvatar(ctx, a1, 175, 115, 105);
  if (a2) drawAvatar(ctx, a2, 720, 115, 105);

  // Player names
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Arial";

  fitName(ctx, p1.name, 227, 246, 250);
  fitName(ctx, p2.name, 772, 246, 250);

  // Health bars
  const hp1 = winnerId === p1.id ? 100 : 0;
  const hp2 = winnerId === p2.id ? 100 : 0;

  ctx.fillStyle = "#3b3b3b";
  ctx.fillRect(100, 270, 330, 24);
  ctx.fillRect(570, 270, 330, 24);

  ctx.fillStyle = "#35e07c";
  ctx.fillRect(100, 270, 330 * hp1 / 100, 24);
  ctx.fillRect(570, 270, 330 * hp2 / 100, 24);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 270, 330, 24);
  ctx.strokeRect(570, 270, 330, 24);

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText(`HP ${hp1}/100`, 265, 314);
  ctx.fillText(`HP ${hp2}/100`, 735, 314);

  // Stickman fighters
  drawStickman(
    ctx, 330, 440, false, "#ff5c75",
    winnerId === p1.id ? 2 : 1
  );

  drawStickman(
    ctx, 670, 440, true, "#5ec8ff",
    winnerId === p2.id ? 2 : 1
  );

  // Fatality finish
  ctx.textAlign = "center";
  ctx.font = "bold 52px Arial";
  ctx.fillStyle = "#ffcf5a";
  ctx.fillText("FATALITY!", 500, 390);

  ctx.font = "bold 30px Arial";
  ctx.fillStyle =
    winnerId === p1.id ? "#ff7a91" : "#70d7ff";

  const winnerName =
    winnerId === p1.id ? p1.name : p2.name;

  ctx.fillText(`WINNER: ${winnerName}`, 500, 590);

  ctx.font = "16px Arial";
  ctx.fillStyle = "#d1d5db";
  ctx.fillText(
    "Fantasy stickman battle",
    500,
    625
  );

  await fs.writeFile(out, canvas.toBuffer("image/png"));

  return out;
}

module.exports = {
  config: {
    name: "fight",
    version: "1.0.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    description: {
      en: "Challenge a group member to a stickman duel."
    },
    category: "games",
    guide: {
      en:
        "{pn} @mention — challenge a player | " +
        "{pn} accept — accept a challenge | " +
        "{pn} decline — decline a challenge"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = String(event.threadID || "");
    const senderID = String(event.senderID || "");
    const sub = String(args[0] || "").toLowerCase();

    if (!threadID || !senderID) return;

    // ACCEPT CHALLENGE
    if (sub === "accept" || sub === "a") {
      const challenge = pending.get(threadID);

      if (!challenge) {
        return message.reply(
          "Walang pending na fight challenge sa GC na ito."
        );
      }

      if (Date.now() > challenge.expiresAt) {
        pending.delete(threadID);

        return message.reply(
          "⌛ Expired na ang challenge. Gumawa ulit ng /fight @mention."
        );
      }

      if (senderID !== challenge.targetId) {
        return message.reply(
          "❌ Ang mismong hinamon lang ang puwedeng tumanggap nito."
        );
      }

      pending.delete(threadID);

      if (active.has(threadID)) {
        return message.reply(
          "May duel nang kasalukuyang nagaganap sa GC na ito."
        );
      }

      active.add(threadID);

      try {
        await message.reply(
          `⚔️ STICKMAN DUEL ACCEPTED!\n\n` +
          `🔴 ${challenge.challengerName} — SCORE: 30%\n` +
          `🔵 ${challenge.targetName} — SCORE: 30%\n\n` +
          `🥊 Simula na ang laban...`
        );

        // Random winner
        const winner =
          Math.random() < 0.5
            ? challenge.challengerId
            : challenge.targetId;

        await sleep(1200);

        const out = await renderBattle(
          {
            id: challenge.challengerId,
            name: challenge.challengerName
          },
          {
            id: challenge.targetId,
            name: challenge.targetName
          },
          winner,
          threadID
        );

        const winnerName =
          winner === challenge.challengerId
            ? challenge.challengerName
            : challenge.targetName;

        await api.sendMessage(
          {
            body:
              `💥 FATALITY!\n` +
              `🏆 WINNER: ${winnerName}\n\n` +
              `🔴 ${challenge.challengerName}: ` +
              `${winner === challenge.challengerId ? "WIN" : "LOSE"}\n` +
              `🔵 ${challenge.targetName}: ` +
              `${winner === challenge.targetId ? "WIN" : "LOSE"}`,
            attachment: fs.createReadStream(out)
          },
          threadID,
          () => fs.remove(out),
          event.messageID
        );
      } catch (err) {
        console.error(
          "[fight] Duel error:",
          err?.stack || err
        );

        return message.reply(
          "❌ Hindi natuloy ang duel. Check kung installed ang canvas at axios."
        );
      } finally {
        active.delete(threadID);
      }

      return;
    }

    // DECLINE CHALLENGE
    if (sub === "decline" || sub === "d") {
      const challenge = pending.get(threadID);

      if (!challenge) {
        return message.reply("Walang pending na challenge.");
      }

      if (senderID !== challenge.targetId) {
        return message.reply(
          "Ang hinamon lang ang puwedeng tumanggi."
        );
      }

      pending.delete(threadID);

      return message.reply(
        `🚫 Tinanggihan ni ${challenge.targetName} ` +
        `ang hamon ni ${challenge.challengerName}.`
      );
    }

    // CREATE CHALLENGE
    const targetId = getTargetId(event);

    if (!targetId) {
      return message.reply("Gamitin: /fight @mention");
    }

    if (targetId === senderID) {
      return message.reply(
        "Hindi mo puwedeng hamunin ang sarili mo."
      );
    }

    if (active.has(threadID)) {
      return message.reply(
        "May duel nang kasalukuyang nagaganap sa GC na ito."
      );
    }

    if (pending.has(threadID)) {
      return message.reply(
        "May pending challenge na sa GC. I-accept o i-decline muna."
      );
    }

    const [challengerName, targetName] = await Promise.all([
      getName(api, senderID),
      getName(api, targetId)
    ]);

    pending.set(threadID, {
      challengerId: senderID,
      targetId,
      challengerName,
      targetName,
      expiresAt: Date.now() + ACCEPT_WINDOW
    });

    setTimeout(() => {
      const current = pending.get(threadID);

      if (
        current &&
        current.challengerId === senderID &&
        current.targetId === targetId
      ) {
        pending.delete(threadID);
      }
    }, ACCEPT_WINDOW).unref?.();

    return message.reply(
      `⚔️ STICKMAN DUEL CHALLENGE!\n\n` +
      `🔴 Challenger: ${challengerName} — SCORE: 30%\n` +
      `🔵 Opponent: ${targetName} — SCORE: 30%\n\n` +
      `${targetName}, tatanggapin mo ba ang hamon?\n\n` +
      `✅ Accept: /fight accept\n` +
      `🚫 Decline: /fight decline\n\n` +
      `⏳ May 60 seconds para sumagot!`
    );
  }
};
