
const runningThreads = new Set();
const stopRequests = new Set();

const DELAY = 500;
const nickname = "Ako Ang Pinaka Malakas Dito👊😂🗑️";

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
    name: "pst",
    version: "1.3.0",
    author: "Kaizer",
    countDown: 5,
    role: 1,
    description: {
      en: "Set group nicknames and send random messages."
    },
    category: "box chat",
    guide: {
      en: "{pn} — Start\nType done in the group to stop."
    }
  },

  onChat: async function ({ event }) {
    const threadID = String(event.threadID || "");
    const body = String(event.body || "").trim().toLowerCase();

    if (!threadID || body !== "done") return;
    if (!runningThreads.has(threadID)) return;

    stopRequests.add(threadID);
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, senderID } = event;
    const key = String(threadID || "");

    if (!threadID || !senderID) return;

    if (event.isGroup === false) {
      return message.reply("Group chats only.");
    }

    if (runningThreads.has(key)) {
      return message.reply("May tumatakbo nang attack sa GC na ito.");
    }

    runningThreads.add(key);
    stopRequests.delete(key);

    try {
      let threadInfo;

      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (err) {
        console.error("[attack] Get thread info failed:", err);
        return message.reply("Hindi makuha ang group information. Check bot permissions.");
      }

      const participants = getParticipants(threadInfo);

      if (participants.length <= 2) {
        return message.reply("Kailangan ng group chat na may higit sa dalawang miyembro.");
      }

      // PHASE 1: Unahin ang pag-set ng nicknames.
      for (const userID of participants) {
        if (stopRequests.has(key)) break;

        try {
          await api.changeNickname(nickname, threadID, userID);
        } catch (err) {
          console.error(
            `[attack] Nickname failed for ${userID}:`,
            err?.message || err
          );
        }

        if (stopRequests.has(key)) break;
        await sleep(DELAY);
      }

      // PHASE 2: Troll messages pagkatapos ng nickname attempts.
      for (let i = 0; i < participants.length; i++) {
        if (stopRequests.has(key)) break;

        const randomLine =
          trollLines[Math.floor(Math.random() * trollLines.length)];

        try {
          await api.sendMessage(randomLine, threadID);
        } catch (err) {
          console.error("[attack] Send message failed:", err?.message || err);
        }

        if (stopRequests.has(key)) break;
        if (i < participants.length - 1) await sleep(DELAY);
      }

      // Walang completion message sa GC.
      return;
    } catch (err) {
      console.error("[attack] Unexpected error:", err?.stack || err);
      return message.reply("May error sa attack. Tingnan ang bot console.");
    } finally {
      runningThreads.delete(key);
      stopRequests.delete(key);
    }
  }
};
