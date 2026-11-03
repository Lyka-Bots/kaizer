if (!global.GoatBot.trollSessions) global.GoatBot.trollSessions = new Map();
const trollSessions = global.GoatBot.trollSessions;

const TROLL_LINES = [
  "okay, kaizer is trolling. Please allow me to start trolling you para manahimik ka na. Ayoko sa lahat ay bobo lalo kana.",
  "Labas Ka AsoKo Tawag Ka Ng Amo Mo😂😂🥊🥊",
  "Wag Kang Magwala Dyan Dog [name], Di Pa Nga Tapos Yung Usapan Nagta-Tantrums Ka Na 😭",
  "Tabah Wag Kang Magwala [name], Baka Mamaya Di Mo Na Makontrol Inis Mo 🥊",
  "Dog Wag Kang Magtantrums Dyan [name], Kala Ko Ba Makunat Ka Bakit Parang Pikon Na Pikon Ka Na 😭",
  "Wag Kang Magwala Tabah [name], Chat Lang Yan Ba't Parang Nawalan Ka Na Ng Pasensya 🥊",
  "Dog Breathe Ka Muna [name], Baka Sa Kakareply Mo Di Mo Na Namamalayang Ikaw Na Yung Nagwawala 😭",
  "Tabah Wag Kang Magtantrums Sa Lobby [name], Di Lahat Ng Banat Kailangan Mong Sagutin 🥊",
  "Wag Kang Magwala Dog [name], Panindigan Mo Yang Angas Mo Nang Di Ka Nagagalit Kada Reply 😭",
  "Tabah Kalma Ka Lang [name], Baka Mamaya Ikaw Na Yung Pinakamaingay Tapos Ikaw Pa Yung Pikon 🥊",
  "Dog Wag Kang Magtantrums [name], Di Mo Kailangan Magwala Para Lang Mapansin Ka 😭",
  "Wag Kang Magwala Tabah [name], Baka Mamaya Maubos Na Yung Angas Mo Kakapaliwanag 🥊",
  "Iyak Kana Naman [name] 😭",
  "Wag Kang Mawawala [name] 🥊",
  "Di Mo Ko Kaya [name] 😭",
  "Tabah Mode Kana Naman [name] 🥊",
  "Hala Umiyak [name] 😭",
  "Dog Mode Kana Ba [name] 🥊",
  "Wag Kang Iiyak [name] 😭",
  "Sunod Ka Nang Sunod [name] 🥊",
  "Iyak Sa Gilid [name] 😭",
  "Balik Ka Dito [name] 🥊",
  "Ang Hina Mo Naman [name] 😭",
  "Punching Bag Ng Tropa [name] 🥊",
  "Iyak Malala [name] 😭",
  "Wag Kang Tatakbo [name] 🥊",
  "Iyak Kana Naman [name] 😭",
  "Wag Kang Mawawala [name] 🥊",
  "Di Mo Ko Kaya [name] 😭",
  "Tabah Mode Kana Naman [name] 🥊",
  "Hala Umiyak [name] 😭",
  "Dog Mode Kana Ba [name] 🥊",
  "Wag Kang Iiyak [name] 😭",
  "Sunod Ka Nang Sunod [name] 🥊",
  "Iyak Sa Gilid [name] 😭",
  "Balik Ka Dito [name] 🥊",
  "Ang Hina Mo Naman [name] 😭",
  "Punching Bag Ng Tropa [name] 🥊",
  "Iyak Malala [name] 😭",
  "Wag Kang Tatakbo [name] 🥊",
  "Talo Na Naman [name] 😭",
  "Sige Pa Banat Ka [name] 🥊",
  "Iyak Ka Muna [name] 😭",
  "Wala Ka Nang Masabi [name] 🥊",
  "Tahimik Na Bigla [name] 😭",
  "Makunat Kaya To O Puro Yabang Lang Sa Umpisa [name], Baka Mamaya Isang Banat Ko Lang Biglang Manlambot Na 🥊",
  "Baka Manlambot To Sakin [name], Ang Lakas Ng Dating Sa Chat Pero Di Ko Pa Nakikitang Panindigan Lahat Ng Sinasabi 😭",
  "Guray Gurayin Mo Yang Angas Mo [name], Puro Ka Dada Kala Mo Naman Ikaw Na Pinakamalakas Sa Buong Lobby 🥊",
  "Makunat Ka Pala Ha [name], Sige Nga Tingnan Natin Kung Hanggang Saan Yang Tapang Mo Pag Binalikan Ka Na 😭",
  "Wag Kang Magmatigas Kung Di Mo Kayang Panindigan [name], Baka Sa Dulo Ikaw Pa Tong Unang Manahimik 🥊",
  "Guray Gurayin Mo Yang Banat Mo [name], Kasi Paulit Ulit Na Lang Wala Bang Bagong Script Dyan 😭",
  "Baka Manlambot To Sakin KakaYabang [name], Di Pa Nga Nagsisimula Ang Bardagulan Parang Gusto Nang Magpahinga 🥊",
  "Makunat Daw Pero Bakit Parang Bawat Reply May Kasamang Paliwanag At Depensa [name] 😭",
  "Wag Kang Puro Angas Sa Harap Ng Lahat [name], Kung Sa Simpleng Sagutan Pa Lang Parang Nauubusan Ka Na Ng Sasabihin 🥊",
  "Guray Gurayin Mo Yang Confidence Mo [name], Hindi Porket Maingay Ka Eh Ikaw Na Agad Ang Panalo 😭",
  "Makunat Kaya To O Makapal Lang Talaga Ang Mukha Sa Chat [name], Magkaiba Kasi Yung Dalawa 🥊",
  "Baka Manlambot Sakin To Kakasagot [name], Parang Mas Pagod Pa Ako Magbasa Kaysa Sayo Mag Isip Ng Banat 😭",
  "Talo Na Naman [name] 😭",
  "Sige Pa Banat Ka [name] 🥊",
  "Iyak Ka Muna [name] 😭",
  "Wala Ka Nang Masabi [name] 🥊",
  "Tahimik Na Bigla [name] 😭",
  "Makunat Kaya To O Puro Yabang Lang Sa Umpisa [name], Baka Mamaya Isang Banat Ko Lang Biglang Manlambot Na 🥊",
  "Baka Manlambot To Sakin [name], Ang Lakas Ng Dating Sa Chat Pero Di Ko Pa Nakikitang Panindigan Lahat Ng Sinasabi 😭",
  "Guray Gurayin Mo Yang Angas Mo [name], Puro Ka Dada Kala Mo Naman Ikaw Na Pinakamalakas Sa Buong Lobby 🥊",
  "Makunat Ka Pala Ha [name], Sige Nga Tingnan Natin Kung Hanggang Saan Yang Tapang Mo Pag Binalikan Ka Na 😭",
  "Wag Kang Magmatigas Kung Di Mo Kayang Panindigan [name], Baka Sa Dulo Ikaw Pa Tong Unang Manahimik 🥊",
  "Guray Gurayin Mo Yang Banat Mo [name], Kasi Paulit Ulit Na Lang Wala Bang Bagong Script Dyan 😭",
  "Baka Manlambot To Sakin KakaYabang [name], Di Pa Nga Nagsisimula Ang Bardagulan Parang Gusto Nang Magpahinga 🥊",
  "Makunat Daw Pero Bakit Parang Bawat Reply May Kasamang Paliwanag At Depensa [name] 😭",
  "Wag Kang Puro Angas Sa Harap Ng Lahat [name], Kung Sa Simpleng Sagutan Pa Lang Parang Nauubusan Ka Na Ng Sasabihin 🥊",
  "Guray Gurayin Mo Yang Confidence Mo [name], Hindi Porket Maingay Ka Eh Ikaw Na Agad Ang Panalo 😭",
  "Makunat Kaya To O Makapal Lang Talaga Ang Mukha Sa Chat [name], Magkaiba Kasi Yung Dalawa 🥊",
  "Baka Manlambot Sakin To Kakasagot [name], Parang Mas Pagod Pa Ako Magbasa Kaysa Sayo Mag Isip Ng Banat 😭",
  "tabah Wag Kang Magwala, Baka Mamaya Di Mo Na Makontrol  Inis Mo 🥊",
  "Ginalit Mo NaNaman Ako😂🥊😂🥊",
  "Lapag [name] Gagu😂😂🥊",
  "Takot Ka Ba? [name]😂😂🥊",
  "O Ayan Natahimik Ka Na😂😂🥊",
  "Keyboard Warrior AmpUta😂😂🥊",
  "Sa Bahay Puro Higa Ka😂✌🏿",
  "Baka Asar Ka Na Dyan Asoko😂😂🥊",
  "Wag Ka MagWala [name]🤣🤣🥊",
  "NagSisiMula Palang Tayo🤣🥊",
  "Kala Mo Nakakatakot Ka🥊🤣🥊",
  "Kahit Sino Matatawa Sayo TabaBoy🥊🤣🥊",
  "Sinubukan Mo Pa Talaga Ako [name] Taba🥊🤣",
  "Sana Natulog Ka Na Lang🥊🤣",
  "PukPukin Ko Ulo Mo E🥊🤣🥊",
  "Bobo Ka Ba Talaga [name] O Nagpapanggap Ka Lang🥊🤣🥊",
  "Kasi Patawa Ka🥊🤣🥊",
  "Kahit Mag aral Ka Pa Hindi Na Sapat🥊🤣🥊",
  "Baka Mag isip Ka Muna SaSusunod🥊🤣🥊",
  "Hoy ASokong Taba🤣🥊🤣",
  "Chupa Mo TiTiko🥊🤣🥊",
  "Hahaha Kawawa Ka Naman🤣🥊🤣",
  "Sarap Mong Pwetan🥊🤣🥊",
  "Kaso Wag🤣🥊🤣🥊",
  "Wag Kang Magwala Dyan Dog [name], Di Pa Nga Tapos Yung Usapan Parang Ubos Na Agad Pasensya Mo 😭",
  "Tabah Kalma Ka Lang Muna [name], Baka Sa Sobrang Dami Mong Gustong Sabihin Nakalimutan Mo Na Yung Punto Mo 😭",
  "Dog Mode Ka Na Naman Ba [name], Bawat Reply Mo May Kasamang Inis 😭",
  "Makunat Kaya To O Puro Lang Talaga Yabang Sa Umpisa [name] 🥊",
  "Guray Gurayin Mo Yang Script Mo [name], Parang Paulit Ulit Na Lang 😂",
  "Wag Kang Mawawala Bigla Tabah [name], Ang Dami Mong Sinabi Noong Simula 😭",
  "Baka Manlambot Ka Sa Kakareply Dog [name] 😂",
  "Tabah Wag Kang Mag Tantrums Sa Lobby [name] 🥊",
  "Angas Mo Sa Simula Dog [name], Pero Parang Iisa Na Lang Ang Sinasabi Mo 😭",
  "Makunat Ka Raw Tabah [name], Pero Parang Daming Paliwanag 😂",
  "Wag Kang Puro Dada Dog [name], Sabihin Mo Nang Diretso 😭",
  "Tabah Breathe Ka Muna [name] 😂",
  "Dog Wag Kang Magpanggap Na Walang Epekto Sayo [name] 😭",
  "Uy Tabah [name], Mag-isip Ka Naman Ng Bagong Banat 😂",
  "Dog Mode Activated Na Naman [name] 😭",
  "Tabah Huwag Mong Ubusin Ang Angas Mo Sa Chat [name] 🥊",
  "Makunat Daw Pero Puro Paliwanag [name] 😭",
  "Guray Gurayin Mo Yang Lumang Banat Mo [name] 😂",
  "Wag Kang Magwala Sa Reply Section Dog [name] 🥊",
  "Tabah Baka Kailangan Mo Lang Magpahinga Muna [name] 😭",
  "Dog Sige Pa Banat Ka [name] 😂",
  "Tabah Wag Kang Mawawala Sa Gitna Ng Usapan [name] 🥊",
  "Dog [name] Ang Haba Ng Reply Mo Pero Parang Bitin Sa Ideas 😭",
  "Tabah Kalma Lang Sa Lobby [name] 😂",
  "Makunat Kaya To [name], O Magaling Lang Sa Intro? 🥊",
  "Dog Wag Kang Puro Tantrums [name] 😂",
  "Tabah [name] Huwag Mong Gawing Competition Ang Bawat Chat 😭",
  "Dog [name] Parang Season Two Na Yung Script Mo 😂",
  "Tabah Wag Kang Magmadali Mag Reply [name] 🥊",
  "Kasi Baka Hindi Ka Naghuhugas Ng Pwet Mo Kapag Tumatae Ka🤣🥊",
  "Tissue Ata GinaGamit Mo E🤣🥊🤣",
  "Bagal Magreply🥊🤣🥊",
  "Wag Ka MagWala [name]🤣🥊",
  "Luh Asar Ata Sya🥊🤣🥊",
  "HAHAHAHHAHA",
  "Nakakahiya Ka Sa Sarili Mo🙂👌🏿",
  "Ewan Ko Ba Sayo Haha🙂👌🏿",
  "Huy [name]🙂👌🏿",
  "Bagal Mo Magreply Taba🙂👌🏿",
  "Halata Ka Nang Asar Kana Taba🙂👌🏿",
  "Di Mo Na Kaya Ano🙂👌🏿",
  "Sige Umalis Ka Na👌🏿🙂",
  "Babalik Ka Rin Dyan Haha🙂👌🏿",
  "Sa Chat Ka Lang Matapang AsuKo🙂👌🏿",
  "Wala Kang Laban Sa Gods Mo🙂👌🏿",
  "Panalo Ako Tapos Na🙂👌🏿",
  "BoBo🤡",
  "Alam Ko Na Yan🙂👌🏿",
  "Baka Umiyak Ka Na Dyan🙂👌🏿",
  "Copy Paste Nya Para Kunwari Mabilis Ang Galawan🤣🥊",
  "Sa ClipBoard Umaasa🤣🥊",
  "Wag Yabang Asuko Kong Keyboard Warrior Lang Ang Kaya Mo🤣🥊",
  "Wala Ka Bang Ibang MaPaPatunayan Sakin Na Talent Mo🤣🥊",
  "Tabaan Mopa [name]🤣🥊",
  "Kawawa Naman Buhay Mo🤣🤣🥊",
  "Takot Ka Na Noh?😀✌🏿",
  "Ayan Na Nga Eh😀✌🏿",
  "Talo Ka Na Taba Tanggapin Mo Na😀✌🏿",
  "Baka Nanginginig Ka Na Diyan😀✌🏿",
  "Halata Na TabaChoy😀✌🏿",
  "Hahaha Halata Talaga😀✌🏿",
  "Ano Nangyari Sa Tapang Mo😀✌🏿",
  "Nasan Na Yung Dating Kang Mayabang😀✌🏿",
  "Nawala Na Bigla Haha😀✌🏿",
  "Baka Kelangan Mo Na Ng Tubig😀✌🏿",
  "Para Makalma Ka Hahah😀✌🏿",
  "Hahaha Kawawa Ka Naman😀✌🏿",
  "Sige Huminga Ka Muna AsoKo😀✌🏿",
  "Bago Ka Sumagot Ulit Haha😀✌🏿",
  "Sige Subukan Mo Pa😀✌🏿",
  "HAHAHAHAH",
  "Pag Natalo Ka Ganyan Talaga😀✌🏿",
  "Hahaha Kawawa Ka Naman😀✌🏿",
  "Puro Nanga Higa Sa Bahay At Kain Pati Sa Chat Walang Effort😀✌🏿",
  "Talo Ka Na Tanggapin Mo Na😀✌🏿",
  "Haha Baka Asar Ka Dyan🤣🥊",
  "MagSabi Ka Lang🤣🥊🤣",
  "Wala Sa Keyboard Ang Tapang🤣🤣🥊",
  "Haha TangaKa🤣🥊",
  "NagSayang Pako Ng Oras Sayo🤣🥊🤣",
  "Di Ako Kayang Sabayan🤣🥊",
  "Pst [name]🥊🤣🥊",
  "Asar To Guys HAHAHAH",
  "NararamDaman Kona🤣🥊🤣",
  "Walang Iyakan Taba [name]🥊🤣🤣",
  "Di Monga Ako Kaya🥊🤣🤣",
  "Bakit Asar Kana HAHAHAHA",
  "Akala Ko Walang Maaasar Dito🤣🥊",
  "Panalo Nako DogsKo🥊🤣",
  "Kaizer Win😃💯"
];

  function buildMsg(raw, name, targetID) {
  const body = raw.replace(/\[name\]/g, name);

  if (!raw.includes("[name]")) {
    return { body };
  }

  const mentions = [];
  let idx = 0;

  while ((idx = body.indexOf(name, idx)) !== -1) {
    mentions.push({
      tag: name,
      id: targetID,
      fromIndex: idx
    });

    idx += name.length;
  }

  return { body, mentions };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  config: {
    name: "troll",
    version: "5.1",
    author: "Edward",
    countDown: 3,
    role: 2,
    description: {
      en: "Reply-based troll command with automatic stop phrase"
    },
    category: "fun",
    guide: {
      en: "{pn} - Reply to someone's message\nSay 'ok na' to stop."
    }
  },

  onStart: async function ({ api, event, usersData, message }) {
    const { threadID, messageReply } = event;

    if (trollSessions.has(threadID)) {
      return message.reply("nag troll pa ko kita mo ba? o duling lng?!");
    }

    if (!messageReply || !messageReply.senderID) {
      return message.reply(
        "di mo na need mag messenger alam ko naman na tamad ka tanginamo kang admin ka kaya gamitin mo nalanc yung /troll tapos ireply mo kung sino mo pag tripan, inaka kang hayop ka"
      );
    }

    const targetID = messageReply.senderID;

    if (String(targetID) === String(api.getCurrentUserID())) {
      return message.reply("Huwag mo akong idamay HAHAHAHA.");
    }

    if (String(targetID) === String(event.senderID)) {
      return message.reply("bawal mag troll sa sarili engot ka tlaga");
    }

    let name = "Kaibigan";

    try {
      name = await usersData.getName(targetID) || name;
    } catch (error) {
      console.error("[TROLL NAME ERROR]", error);
    }

    const session = {
      aborted: false,
      targetID
    };

    trollSessions.set(threadID, session);

    try {
      for (const line of TROLL_LINES) {
        if (session.aborted) break;

        const msg = buildMsg(line, name, targetID);

        await new Promise((resolve, reject) => {
          let finished = false;

          const done = (err) => {
            if (finished) return;
            finished = true;

            if (err) reject(err);
            else resolve();
          };

          try {
            api.sendMessage(msg, threadID, done);
          } catch (error) {
            done(error);
          }

          setTimeout(() => done(), 10000);
        });

        if (session.aborted) break;

        await sleep(2500);
      }
    } catch (error) {
      console.error("[TROLL ERROR]", error);
    } finally {
      if (trollSessions.get(threadID) === session) {
        trollSessions.delete(threadID);
      }
    }
  },

  onChat: async function ({ event }) {
    const { threadID, body } = event;

    if (!body) return;

    if (body.trim().toLowerCase() === "ok na") {
      const session = trollSessions.get(threadID);

      if (session) {
        session.aborted = true;
        trollSessions.delete(threadID);
      }
    }
  }
};
