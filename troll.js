if (!global.GoatBot.trollSessions) global.GoatBot.trollSessions = new Map();
const trollSessions = global.GoatBot.trollSessions;

const TROLL_LINES = [
  "Okay, Kaizer is Trolling. Mag handa ka baka umiyak ka",
  "Labas Ka AsoKo Tawag Ka Ng Amo Mo😂😂🥊🥊",
  "Pinapatawa mo kong wanna be dog ka ah😂🥊😂🥊",
  "Lapag [name] Gagu😂😂🥊",
  "Takot Ka Ba? [name]😂😂🥊",
  "O Ayan Natahimik Ka Na😂😂🥊",
  "Keyboard Warrior AmpUta😂😂🥊",
  "Sa Bahay Puro Higa Ka😂✌🏿",
  "Baka Asar Ka Na Dyan Asoko😂😂🥊",
   "Hindi Ka Worth It I Troll Asuko🙂👌🏿",
  "Panalo Ako Tapos Na🙂👌🏿",
  "Randam Na Randam Kong Trible B Ka [name]🤣🥊",
  "Alam Moyung Triple B😀⁉️",
  "Malamang Di Mo Alam Kasi BoBo Ka🤷🏿‍♂️",
  "Ito Meaning Ng Triple B [name]TabaBoi🤣🤣🥊",
  "BoBo🤡",
  "Bayot🤷🏿‍♂️",
  "Bading🤢",
  "Ikaw Pa Mag admit Nyan MatabaKong Aso🙂👌🏿",
  "Nahihiya Ka Na Ata E🙂👌🏿",
  "[name] Asuko🙂👌🏿",
  "Aminin Mo Na🙂👌🏿",
  "Alam Ko Na Yan🙂👌🏿",
  "Baka Umiyak Ka Na Dyan🙂👌🏿",
‎"[name] Wag Kang Magwala Dyan Dog, Di Pa Nga Tapos Yung Usapan Nagta-Tantrums Ka Na 😭",
‎"[name] Tabah Wag Kang Magwala, Baka Mamaya Di Mo Na Makontrol Yang Inis Mo 🥊",
‎"[name] Dog Wag Kang Magtantrums Dyan, Kala Ko Ba Makunat Ka Bakit Parang Pikon Na Pikon Ka Na 😭",
‎"[name] Wag Kang Magwala Tabah, Chat Lang Yan Ba't Parang Nawalan Ka Na Ng Pasensya 🥊",
‎"[name] Dog Breathe Ka Muna, Baka Sa Kakareply Mo Di Mo Na Namamalayang Ikaw Na Yung Nagwawala 😭",
‎"[name] Tabah Wag Kang Magtantrums Sa Lobby, Di Lahat Ng Banat Kailangan Mong Sagutin 🥊",
‎"[name] Wag Kang Magwala Dog, Panindigan Mo Yang Angas Mo Nang Di Ka Nagagalit Kada Reply 😭",
‎"[name] Tabah Kalma Ka Lang, Baka Mamaya Ikaw Na Yung Pinakamaingay Tapos Ikaw Pa Yung Pikon 🥊",
‎"[name] Dog Wag Kang Magtantrums, Di Mo Kailangan Magwala Para Lang Mapansin Ka 😭",
‎"[name] Wag Kang Magwala Tabah, Baka Mamaya Maubos Na Yung Angas Mo Kakapaliwanag 🥊",
‎"[name] iyak kana naman 😭",
‎"[name] wag kang mawawala 🥊",
‎"[name] di mo ko kaya 😭",
‎"[name] tabah mode kana naman 🥊",
‎"[name] hala umiyak 😭",
‎"[name] dog mode kana ba 🥊",
‎"[name] wag kang iiyak 😭",
‎"[name] sunod ka nang sunod 🥊",
‎"[name] iyak sa gilid 😭",
‎"[name] balik ka dito 🥊",
‎"[name] ang hina mo naman 😭",
‎"[name] punching bag ng tropa 🥊",
‎"[name] iyak malala 😭",
‎"[name] wag kang tatakbo 🥊",
‎"[name] talo na naman 😭",
‎"[name] sige pa banat ka 🥊",
‎"[name] iyak ka muna 😭",
‎"[name] wala ka nang masabi 🥊",
‎"[name] tahimik na bigla 😭"
‎"[name] Makunat Kaya To O Puro Yabang Lang Sa Umpisa, Baka Mamaya Isang Banat Ko Lang Biglang Manlambot Na 🥊",
‎"[name] Baka Manlambot To Sakin, Ang Lakas Ng Dating Sa Chat Pero Di Ko Pa Nakikitang Panindigan Lahat Ng Sinasabi 😭",
‎"[name] Guray Gurayin Mo Yang Angas Mo, Puro Ka Dada Kala Mo Naman Ikaw Na Pinakamalakas Sa Buong Lobby 🥊",
‎"[name]Makunat Ka Pala Ha, Sige Nga Tingnan Natin Kung Hanggang Saan Yang Tapang Mo Pag Binalikan Ka Na 😭",
‎"[name] Wag Kang Magmatigas Kung Di Mo Kayang Panindigan, Baka Sa Dulo Ikaw Pa Tong Unang Manahimik 🥊",
‎"[name] Guray Gurayin Mo Yang Banat Mo Kasi Paulit Ulit Na Lang, Wala Bang Bagong Script Dyan 😭",
‎"[name] Baka Manlambot To Sakin KakaYabang, Di Pa Nga Nagsisimula Ang Bardagulan Parang Gusto Nang Magpahinga 🥊",
‎"[name] Makunat Daw Pero Bakit Parang Bawat Reply May Kasamang Paliwanag At Depensa 😭",
‎"[name] Wag Kang Puro Angas Sa Harap Ng Lahat Kung Sa Simpleng Sagutan Pa Lang Parang Nauubusan Ka Na Ng Sasabihin 🥊",
‎"[name] Guray Gurayin Mo Yang Confidence Mo, Hindi Porket Maingay Ka Eh Ikaw Na Agad Ang Panalo 😭",
‎"[name] Makunat Kaya To O Makapal Lang Talaga Ang Mukha Sa Chat, Magkaiba Kasi Yung Dalawa 🥊",
‎"[name] Baka Manlambot Sakin To Kakasagot, Parang Mas Pagod Pa Ako Magbasa Kaysa Sayo Mag Isip Ng Banat 😭"
  "Puta Bagal Ng Taba Nato🤣🥊🤣",
  "Siguro Gumagawa Naman Ito Sa Notes Ng Sasabihin Sakin🤣🥊🤣",
  "Copy Paste Nya Para Kunwari Mabilis Ang Galawan🤣🥊",
  "Halata Na Talaga Kayong Mga BoBong Troller E🤣🥊",
  "Sa ClipBoard Umaasa🤣🥊",
  "Kahit ClipBoard Payan Di Ka TaTagos Sakin AsoKo🤣🥊",
  "Yang Idea Mo Nakaw MoLang Yan Sa Iba Tas Uulitin Mo Sakin🤣🥊",
  "Wag Yabang Asuko Kong KeyBoard Warrior Lang Ang Kaya Mo🤣🥊",
  "Wala Kabang Ibang MaPaPatunayan Sakin Na Talent Mo🤣🥊",
  "Kundi Kabobohan Mo Lang PinaPairal Mo Deto🤣🥊",
  "Tabaan Mopa [name]🤣🥊",
  "Walis KanaNga Sa Bahay Nyo Eh🤣🥊",
  "Kawawa Naman Buhay Mo🤣🤣🥊",
  "Wag Ka Na Sumagot Baka Mas Mahiya Ka Pa🤣🥊",
  "Takot Ka Na Noh?😀✌🏿",
  "Ayan Na Nga Eh😀✌🏿",
  "Talo Ka Na Taba Tanggapin Mo Na😀✌🏿",
  "Baka Nanginginig Ka Na Diyan😀✌🏿",
  "Halata Na TabaChoy😀✌🏿",
  "Kamay Mo Nanlalamig Na Ata😀✌🏿",
  "Baka Hindi Ka Na Makabasa Nito Nang Maayos😀✌🏿",
  "Kasi Nanginginig Ka Na😀✌🏿",
  "AkoPa Sinubukan Mo [name]😀✌🏿",
  "Di Ka Uubra Sakin Boi😀✌🏿",
  "Batukan Kita E😀✌🏿",
  "Pwede Naba Kitang Birahin😀✌🏿",
  "Tangina Bagal Magreply😀✌🏿",
  "Hey [name]😀✌🏿",
  "NakakaWalang Gana I Troll😀✌🏿",
  "Chupa Mu na Lang TiTiKo Para Naman May Pakinabang Ka😀✌🏿",
  "Kasi Wla Eh Buti Pa Yung Hayup Merong Pakinabang Kesa Sayo😀✌🏿",
  "Diba [name] Alam Moyan😀✌🏿",
  "Alam Mong Mas Mahalaga Pa Hayup Kesa Sayo😀✌🏿",
  "Kesa Ikaw Puro Cellphone At Kain Tolog Lng😀✌🏿",
  "Tangina Tambay Yarn😀✌🏿",
  "Sa Mga Magulang Lang Umaasa Yung AsuKo😀✌🏿",
  "Lapag [name]😀✌🏿",
  "O Ayan Tahimik Ka Na Bigla😀✌🏿",
  "Takot Ka Na Ba Taba😀✌🏿",
  "Sige Aminin Mo Na Nanginginig Ka😀✌🏿",
  "Hahaha Halata Talaga😀✌🏿",
  "Baka Luha Na Yan Hindi Pawis😀✌🏿",
  "Tuminog Ka Pa Sakin Haha😀✌🏿",
  "Ano Nangyari Sa Tapang Mo😀✌🏿",
  "Nasan Na Yung Dating Kang Mayabang😀✌🏿",
  "Huy [name] Achuko😀✌🏿",
  "Nawala Na Bigla Haha😀✌🏿",
  "Baka Kelangan Mo Na Ng Tubig😀✌🏿",
  "Para Makalma Ka Hahah😀✌🏿",
  "Wala Na Sukat Sakin Pre😹🥊",
  "Kasi Alam Mo Na Talo Ka😹🥊",
  "Haha Wag Ka Mag Alala Asuko🙂👌🏿",
  "Nandito Pa Rin Ako Kapag Bumalik Ka😀✌🏿",
  "Baka Kinakabahan Ka Na Sumagot😀✌🏿",
  "Kasi Baka Mas Malala Pa Ang Susunod✌🏿😀",
  "Tama Ka Dun Taba Mag ingat Ka😀✌🏿",
  "Mas Masarap Pa To Kapag Sumagot Ka Pa😀✌🏿",
  "Sige Subukan Mo Pa😀✌🏿",
  "Pero Alam Ko Ayaw Mo Na Haha😀✌🏿",
  "Diba [name]😀✌🏿",
  "Nanginginig Ka Na Kaya😀✌🏿",
  "HAHAHAHAH",
  "RamDam Na RanDam Ko👌🏿🙂",
  "Pag Natalo Ka Ganyan Talaga😀✌🏿",
  "Nanginginig Tatalon Tatalon😀✌🏿",
  "Hahaha Kawawa Ka Naman😀✌🏿",
  "Dikapa SumaSagot Nararamdam Kona Na NangingiNig Ka Dyan😀✌🏿",
  "Sige Huminga Ka Muna AsoKo😀✌🏿",
  "Bago Ka Sumagot Ulit Haha😀✌🏿",
  "Kasi Baka Hindi Mo Na Maisip Ng Maayos😀✌🏿",
  "Dahil Nanginginig Ka Pa Rin😀✌🏿",
  "Sabayan Moko [name]😀✌🏿",
  "Oh Ano Akolang Nag Eefort Dito😀✌🏿",
  "Tanginang Mataba Nato😀✌🏿",
  "Puro Nanga Higa Sa Bahay At Kain Pati Sa Chat Wlang Effort😀✌🏿",
  "Bubo Ka Pala [name]😀✌🏿",
  "D Mo Kaya Makipag Sabayan Sakin Noh?😀✌🏿",
  "Talo Ka Na Tanggapin Mo Na😀✌🏿",
  "NagSayang Pako Ng Oras Sayo🤣🥊",
  "BoBo Ka Pala I Troll🤣🥊",
  "Haha Baka Asar Ka Dyan🤣🥊",
  "MagSabi Ka Lang🤣🥊🤣",
  "Video Call Nga Tayo Baka Umiiyak Kana🤣🥊🤣",
  "Iyakin Kapa Naman Eh😂🥊🤣",
  "Oh Ano [name] Video Call Tayu🥊🤣",
  "Dun Ko Titignan Tapang Mo🤣🥊",
  "Wala Sa Keyboard Ang Tapang🤣🤣🥊",
  "Kasi Kamay MoLang Ginagalaw Mo🤣🥊",
  "SuBukan Natin Sa RealLife BagaGin Ko Mukha Mo🤣🥊",
  "Dun Mo Ilabas Pagiging Tanga Mo [name]",
  "Pero Wag Nalang🤣🥊",
  "Baka Bayot K🤣🥊",
  "Baka Chupa Mopa TiTiKo Tas Bigla Kitang Napatay🤣🥊",
  "Haha TangaKa🤣🥊",
  "Kilalanin Mo Binabangga Mo Taba🤣🥊",
  "NagSayang Pako Ng Oras Sayo🤣🥊🤣",
  "Bobo Ka Palang Bobita Ka🤣🥊🤣",
  "Ugaling Pantanga🤣🥊",
  "Di Ako Kayang Sabayan🤣🥊",
  "Kasi ClipBoard Boi Kalang🤣🥊🥊",
  "Jan Kalang Umaasa Eh🤣🥊🥊",
  "Hindi Mo GinaGamit Utak Mo🤣🥊",
  "Mas PinaPairal Mopa KabubuHan Mo🤣🥊",
  "Pst [name]🥊🤣🥊",
  "Asar To Guys HAHAHAH",
  "NararamDaman Kona🤣🥊🤣",
  "UmiiYak Na Ata To Habang Nag iisip Ng Ibabato Sakin🤣🥊🤣",
  "Walang Iyakan Taba [name]🥊🤣🤣",
  "PatuNayan Mo Na Kaya Moko Talunin🤣🥊🤣",
  "Di Monga Ako Kaya🥊🤣🤣",
  "Tas Tatalunin MoPa Yung Gods Mo🥊🤣",
  "Pst Bayot [name]🤣🥊",
  "Bakit Asar Kana HAHAHAHA",
  "Akala Ko Walang Maaasar Dito🤣🥊",
  "Ganyan Talaga Taba [name] Kapag Naasar NangiNginig Kamay Tas Pawis🤣🥊",
  "Ibig Sabihin Talo Ka🤣🥊🤣",
  "Panalo Nako DogsKo🤣🥊🤣",
  "di mo'ko kayang sabayan tas asar kapa HAHAHHAHA",
  "Naaawa Nako Sayo Bagal Mo Magreply Taba🥊🤣",
  "Kaizer Win😃💯"
];

function buildMsg(raw, name, targetID) {
  if (!raw.includes("[name]")) return { body: raw };
  const body = raw.replace(/\[name\]/g, name);
  const mentions = [];
  let idx = 0;
  while ((idx = body.indexOf(name, idx)) !== -1) {
    mentions.push({ tag: name, id: targetID, fromIndex: idx });
    idx += name.length;
  }
  return { body, mentions };
}

module.exports = {
  config: {
    name: "troll",
    version: "3.0.0",
    author: "Siegfried Samá",
    countDown: 10,
    role: 2,
    description: { en: "ginagamit sa mga tangang troller" },
    category: "fun",
    guide: { en: "{pn} @mention | {pn} tigil" }
  },

  onStart: async function ({ api, event, usersData, message, args }) {
    const { threadID, mentions } = event;
    const prefix = global.GoatBot.config.prefix;

    if (args[0] && args[0].toLowerCase() === "tigil") {
      if (!trollSessions.has(threadID)) {
        return message.reply("Walang aktibong troll session sa thread na ito.");
      }
      const session = trollSessions.get(threadID);
      session.aborted = true;
      trollSessions.delete(threadID);
      return message.reply("✅ Troll session naitigil na.");
    }

    if (trollSessions.has(threadID)) {
      return message.reply("⚠️ May umaandar pang troll session dito. Gamitin: " + prefix + "troll tigil");
    }

    const mentionIDs = Object.keys(mentions || {});
    if (!mentionIDs.length) {
      return message.reply("tag mo yung i t-troll");
    }

    const targetID = mentionIDs[0];
    const name = await usersData.getName(targetID);

    const session = {
      aborted: false,
      targetID,
      targetName: name,
      replyIndex: 0,
      startTime: Date.now()
    };
    trollSessions.set(threadID, session);

    for (let i = 0; i < TROLL_LINES.length; i++) {
      if (session.aborted) break;
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (session.aborted) break;
      const msg = buildMsg(TROLL_LINES[i], name, targetID);
      await new Promise(resolve => {
        try {
          api.sendMessage(msg, threadID, () => resolve());
        } catch (e) {
          resolve();
        }
        setTimeout(resolve, 5000);
      });
    }

    if (!session.aborted) {
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      const timeStr = mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;

      const finalBody = `Kaizer ON TOP 🔝\n\n${name} ON TRASH🚮🚮🚮\n\n\nREASON BAKIT NATALO:\n\n- MAHINA\n- NAASAR SA SIMPLING TROLL\n- DI AKO KAYANG SABAYAN\n- MATABA ANG MGA KAMAY\n- SA CLIPBOARD LANG UMAASA SI TABA\n- ASUKO SI TABA\n\nDuration:\n${timeStr}`;

      const finalMentions = [];
      let idx = 0;
      while ((idx = finalBody.indexOf(name, idx)) !== -1) {
        finalMentions.push({ tag: name, id: targetID, fromIndex: idx });
        idx += name.length;
      }

      await new Promise(resolve => api.sendMessage(
        { body: finalBody, mentions: finalMentions },
        threadID,
        resolve
      ));
    }

    if (trollSessions.get(threadID) === session) {
      trollSessions.delete(threadID);
    }
  }
};
