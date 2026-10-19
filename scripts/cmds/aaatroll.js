‎
‎if (!global.GoatBot.trollSessions) {
‎  global.GoatBot.trollSessions = new Map();
‎
‎ const TROLL_LINES = ]
‎"okay, Kaizer is Trolling.",
‎  "Labas Ka AsoKo Tawag Ka Ng Amo Mo????",
‎  "Ginalit Mo NaNaman Ako????",
‎  "Lapag [name] Gagu???",
‎  "Takot Ka Ba? [name]???",
‎  "O Ayan Natahimik Ka Na???",
‎  "Keyboard Warrior AmpUta???",
‎ 
‎function buildMsg(raw, name, targetID) {
‎  const body = raw.replace(/\[name\]/g, name);
‎  const mentions = [];
‎  let idx = 0;
‎
‎  while ((idx = body.indexOf(name, idx)) !== -1) {
‎    mentions.push({
‎      tag: name,
‎      id: targetID,
‎      fromIndex: idx
‎    });
‎    idx += name.length;
‎  }
‎
‎  return { body, mentions };
‎}
‎
‎module.exports = {
‎  config: {
‎    name: "troll",
‎    version: "4.0.0",
‎    author: "Kaizer",
‎    countDown: 10,
‎    role: 2,
‎    description: {
‎      en: "Playful message command"
‎    },
‎    category: "fun",
‎    guide: {
‎      en: "{pn} @mention"
‎    }
‎  },
‎
‎  onStart: async function ({
‎    api,
‎    event,
‎    usersData,
‎    message
‎  }) {
‎    const threadID = event.threadID;
‎    const threadKey = String(threadID);
‎    const mentions = event.mentions || {};
‎
‎    if (trollSessions.has(threadKey)) {
‎      return message.reply(
‎        'May active session pa. Type "okay na" para ihinto.'
‎      );
‎    }
‎
‎    const mentionIDs = Object.keys(mentions);
‎
‎    if (!mentionIDs.length) {
‎      return message.reply("sinong gusto mong pag tripan boss?");
‎    }
‎
‎    if (!Array.isArray(TROLL_LINES) || TROLL_LINES.length === 0) {
‎      return message.reply("Walang laman ang TROLL_LINES.");
‎    }
‎
‎    const targetID = String(mentionIDs[0]);
‎    const name = await usersData.getName(targetID);
‎
‎    const session = {
‎      aborted: false,
‎      targetID,
‎      targetName: name
‎    };
‎
‎    trollSessions.set(threadKey, session);
‎
‎    try {
‎      await new Promise(resolve => {
‎        api.sendMessage(
‎          "okay, kaizer is trolling",
‎          threadID,
‎          resolve
‎        );
‎        setTimeout(resolve, 5000);
‎      });
‎
‎      let i = 0;
‎
‎      while (
‎        !session.aborted &&
‎        trollSessions.get(threadKey) === session
‎      ) {
‎        const raw = TROLL_LINES[i % TROLL_LINES.length];
‎        const msg = buildMsg(raw, name, targetID);
‎
‎        await new Promise(resolve => {
‎          let finished = false;
‎
‎          const done = () => {
‎            if (finished) return;
‎            finished = true;
‎            resolve();
‎          };
‎
‎          try {
‎            api.sendMessage(msg, threadID, done);
‎          } catch (error) {
‎            done();
‎          }
‎
‎          setTimeout(done, 5000);
‎        });
‎
‎        i++;
‎
‎        if (!session.aborted) {
‎          await new Promise(resolve =>
‎            setTimeout(resolve, 1500)
‎          );
‎        }
‎      }
‎    } finally {
‎      if (trollSessions.get(threadKey) === session) {
‎        trollSessions.delete(threadKey);
‎      }
‎    }
‎  },
‎
