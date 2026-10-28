const runningThreads = new Set();

const nickname = "Ako Ang Pinaka Malakas Dito👊😂🗑️";
const COOLDOWN_MS = 5000;
await sleep(DELAY);

const trollLines = [
  "Hoy mga aso gising 😂👊 bakit tahimik ang GC akala mo may lamay dito HAHAHAHA 😂👌",
  "Mga ulol nasaan na kayo HAHAHAHA kanina ang iingay niyo tapos ngayon parang mga nawawalang sisiw 😂👊",
  "HOY MGA TAMBAY GUMALAW GALAW NAMAN KAYO 😂👊 online kayo lahat pero parang mga multo sa GC HAHAHAHA",
  "Gising mga idol HAHAHAHA anong oras na tulog pa rin mga utak niyo 😂👌👊",
  "Hoy mga tahimik diyan labas naman kayo sa lungga niyo HAHAHAHA hindi ako nangangagat, minsan lang mang-asar 😂👊",
  "ANO NA MGA BOSSING HAHAHAHA nag-chat lang ako biglang nagkanya-kanyang taguan na naman kayo 😂👌",
  "Mga idol buhay pa ba kayo o kailangan ko pang magpa-anunsyo sa buong barangay para magparamdam kayo 😂👊",
  "Hoy mga aso wag puro seen diyan HAHAHAHA kahit isang tahol naman para malaman naming buhay pa kayo 😂👌",
  "GISING MGA BOSS HAHAHAHA ang tahimik niyo naman, akala ko ba mga alamat kayo bakit parang mga extra lang sa sarili ninyong GC 😂👊",
  "Mga loko nasaan ang energy niyo HAHAHAHA kapag chismis ang usapan parang may turbo kayo, pero kapag ako na nag-chat biglang low battery 😂👌",
  "HOY GC CHECK HAHAHAHA sino rito ang tao at sino ang naka-display lang online buong araw 😂👊",
  "Mga aso nasaan ang mga tahol niyo HAHAHAHA kapag wala ako ang iingay niyo, kapag nandito ako parang naka-airplane mode lahat 😂👌",
  "ANO BA YAN MGA IDOL HAHAHAHA nagbukas lang ako ng GC parang pumasok ako sa library, nasaan ang mga maingay na nilalang dito 😂👊",
  "Hoy mga alamat magparamdam naman kayo HAHAHAHA puro kayo online status pero walang ambag sa ingay 😂👌",
  "MGA BOSSING GISING 😂👊 hindi pa tapos ang araw, bakit parang lahat kayo nag-resign sa pagiging maingay sa GC HAHAHAHA",
  "Hoy mga lods baka naman HAHAHAHA kahit emoji lang ihulog niyo rito para may ebidensiya akong hindi ako nakikipag-usap sa pader 😂👌",
  "Mga idol anong meron bakit tahimik HAHAHAHA may meeting ba ang mga multo o sabay-sabay lang kayong nag-AFK 😂👊",
  "HOY MGA ASO ATTENDANCE 😂👊 isang tahol para sa mga gising, dalawang tahol para sa mga gutom, at tatlong tahol para sa mga kunwari busy HAHAHAHA"
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getParticipants(threadInfo) {
  return [
    ...new Set(
      (threadInfo?.participantIDs || [])
        .map(id => id == null ? "" : String(id))
        .filter(Boolean)
    )
  ];
}

module.exports = {
  config: {
    name: "attack",
    version: "1.1.1",
    author: "Kaizer",
    countDown: 5,
    role: 1,
    description: {
      en: "Change group nicknames and send random troll messages."
    },
    category: "box chat",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, senderID } = event;
    const key = String(threadID || "");

    if (!threadID || !senderID) {
      return message.reply("❌ Invalid group or sender information.");
    }

    if (event.isGroup === false) {
      return message.reply("❌ Group chats only.");
    }

    if (runningThreads.has(key)) {
      return message.reply(
        "⏳ May tumatakbo nang proseso sa group na ito."
      );
    }

    runningThreads.add(key);

    try {
      let threadInfo;

      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (err) {
        console.error("[attack] Thread info error:", err?.message);
        return message.reply("❌ Hindi makuha ang group information.");
      }

      const participants = getParticipants(threadInfo);

      if (participants.length <= 2) {
        return message.reply("❌ Group chats only.");
      }

      let changed = 0;
      let failed = 0;

      for (const userID of participants) {
        try {
          await api.changeNickname(nickname, threadID, userID);
          changed++;

          const randomLine =
            trollLines[Math.floor(Math.random() * trollLines.length)];

          await sleep(DELAY);
          await api.sendMessage(randomLine, threadID);
        } catch (err) {
          failed++;

          console.error(
            `[attack] Failed for ${userID}:`,
            err?.message || "Unknown error"
          );
        }

        if (changed + failed < participants.length) {
          await sleep(DELAY);
        }
      }

      console.log(
        `[attack] Finished in thread ${threadID}. Changed: ${changed}, failed: ${failed}.`
      );
    } finally {
      runningThreads.delete(key);
    }
  }
};
