const { getStreamFromURL } = global.utils;

const GROUP_NAME = "Kaizer Owns You 😂👊😈";
const MEMBER_NICKNAME = "LuLuHod Kapag Nakita Ako😂👊";
const PINTEREST_URL = "https://pin.it/1hRj5otW3";

const DELAY_MS = 1200;
const runningThreads = new Set();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isBotAdmin(userID) {
  const configured =
    global.GoatBot?.config?.adminBot ??
    global.config?.adminBot ??
    [];

  const admins = Array.isArray(configured)
    ? configured
    : [configured];

  return admins.some(admin => {
    const id =
      admin && typeof admin === "object"
        ? admin.id ?? admin.uid ?? admin.userID
        : admin;

    return id != null && String(id) === String(userID);
  });
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

async function getPinterestImageUrl(pinUrl) {
  const response = await fetch(pinUrl, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Pinterest HTTP ${response.status}`);
  }

  const html = await response.text();

  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  throw new Error("Hindi makita ang direct Pinterest image URL.");
}

module.exports = {
  config: {
    name: "sige",
    aliases: ["allset"],
    version: "1.0.0",
    author: "Kaizer",
    countDown: 60,
    role: 0,
    description: {
      en: "Set all member nicknames, group profile, and group name."
    },
    category: "box chat",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, senderID } = event;

    if (!threadID || !senderID) return;

    if (event.isGroup === false) {
      return message.reply("Group chats only.");
    }

    if (!isBotAdmin(senderID)) {
      return message.reply(
        "Bot owner/admin lang ang puwedeng gumamit nito."
      );
    }

    const key = String(threadID);

    if (runningThreads.has(key)) {
      return message.reply(
        "May tumatakbo nang setall sa group na ito."
      );
    }

    runningThreads.add(key);

    let changed = 0;
    let failed = 0;
    let photoStatus = "FAILED";
    let titleStatus = "FAILED";

    try {
      const info = await api.getThreadInfo(threadID);

      const members = [
        ...new Set(
          (info?.participantIDs || [])
            .map(String)
            .filter(Boolean)
        )
      ];

      if (!members.length) {
        return message.reply("Walang nakuhang group members.");
      }

      // Palitan ang group name.
      const titlePromise = (async () => {
        try {
          await api.setTitle(GROUP_NAME, threadID);
          titleStatus = "SUCCESS";
        } catch (error) {
          console.error("[setall] Group name error:", error);
        }
      })();

      // Palitan ang group profile picture.
      const photoPromise = (async () => {
        try {
          const imageUrl =
            await getPinterestImageUrl(PINTEREST_URL);

          const imageStream =
            await getStreamFromURL(imageUrl);

          await api.changeGroupImage(imageStream, threadID);

          photoStatus = "SUCCESS";
        } catch (error) {
          console.error("[setall] Group profile error:", error);
        }
      })();

      // Palitan ang nickname ng lahat ng members.
      for (let i = 0; i < members.length; i++) {
        try {
          await api.changeNickname(
            MEMBER_NICKNAME,
            threadID,
            members[i]
          );

          changed++;
        } catch (error) {
          failed++;

          console.error(
            `[setall] Nickname error for ${members[i]}:`,
            error
          );
        }

        if (i < members.length - 1) {
          await sleep(DELAY_MS);
        }
      }

      await Promise.allSettled([
        titlePromise,
        photoPromise
      ]);

      return;
         );

    } catch (error) {
      console.error("[setall] Error:", error);

      return message.reply(
        "Nagkaroon ng error. Tingnan ang Railway logs."
      );

    } finally {
      runningThreads.delete(key);
    }
  }
};
