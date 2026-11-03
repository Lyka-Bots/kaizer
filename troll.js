if (!global.GoatBot.trollSessions) global.GoatBot.trollSessions = new Map();
const trollSessions = global.GoatBot.trollSessions;

const TROLL_LINES = [
  "Hoy [name] AsoKo😂😂🥊🥊",
  "Labas Ka AsoKo Tawag Ka Ng Amo Mo😂😂🥊🥊",
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
  "Kasi Baka Hindi Ka Naghuhugas Ng Pwet Mo Kapag Tumatae Ka🤣🥊",
  "Tissue Ata GinaGamit Mo E🤣🥊🤣",
  "NaliliNisan Pa Kaya Ata Pwet Mo Nyan🥊🤣",
  "Asar To Si Taba🤣🥊🥊",
  "Bagal Magreply🥊🤣🥊",
  "NagBinayot Naman To🤣🥊",
  "Wag Ka MagWala [name]🤣🥊",
  "Luh Asar Ata Sya🥊🤣🥊",
  "HAHAHAHHAHA",
  "LuWa Mo TiTiko [name]🙂👌🏿",
  "Mukhang Nasarapan Ka Ata Kaya Nag Stuck Sa BungaNga Mo🙂👌🏿",
  "Luwa Mo Nayan Huy🙂👌🏿",
  "Nasarapan Sa TiTi Kong Malaki👌🏿🙂",
  "Iluluwa Moyan O Hindi 👌🏿🙂",
  "[name] Taba👌🏿🙂",
  "TiTiko Stuck Sa BungaNga Mo👌🏿🙂",
  "BaYot🙂👌🏿",
  "Kain Pa More Ng TiTiko🙂👌🏿",
  "Nakakahiya Ka Sa Sarili Mo🙂👌🏿",
  "Ewan Ko Ba Sayo Haha🙂👌🏿",
  "Hey Bayot [name]🙂👌🏿",
  "Asar Ka Na Ata AsuKo🙂👌🏿",
  "Huy [name]🙂👌🏿",
  "Bagal Mo Magreply Taba🙂👌🏿",
  "Halata Ka Nang Asar Kana Taba🙂👌🏿",
  "Anyare Sa Kamay Mo Taba May Cancer Bayan🙂👌🏿",
  "Di Mo Na Kaya Ano🙂👌🏿",
  "Sige Umalis Ka Na👌🏿🙂",
  "Babalik Ka Rin Dyan Haha🙂👌🏿",
  "Kasi Wala Kang Magawa Sa Buhay Mo🙂👌🏿",
  "Sa Totoong Buhay Wala Kang Dating🙂👌🏿",
  "Sa Chat Ka Lang Matapang AsuKo🙂👌🏿",
  "AsoKong Mataba🙂👌🏿",
  "Sige Ka Tabaan Mopa🙂👌🏿",
  "Hindi Pa Kita MinuMura Umiiyak KaNa Sa Kahinaan Mo🙂👌🏿",
  "Di Moko Kaya🙂👌🏿",
  "Syempre AsuKita e🙂👌🏿",
  "Wala Kang Laban Sa Gods Mo🙂👌🏿",
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
  "BiBilangan Kita [name] Huy🙂👌🏿",
  "1",
  "2",
  "3",
  "4",
  "5",
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
  "Mysteriousq Win😃💯"
  ]:
setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "troll",
    version: "5.0",
    author: "Kaizer",
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

  // START TROLL
  onStart: async function ({ api, event, usersData, message }) {
    const { threadID, messageReply } = event;

    if (trollSessions.has(threadID)) {
      return message.reply("May active troll session pa!");
    }

    if (!messageReply || !messageReply.senderID) {
      return message.reply(
        "Mag-reply muna sa message ng target, saka gamitin ang /troll."
      );
    }

    const targetID = messageReply.senderID;

    if (targetID === api.getCurrentUserID()) {
      return message.reply("wag ako, tanginaneto.");
    }

    if (targetID === event.senderID) {
      return message.reply("ayoko, admin ka e, i shutdown mo pa ako.");
    }

    let name = "Friend";

    try {
      name = await usersData.getName(targetID) || name;
    } catch (e) {}

    const session = {
      aborted: false,
      targetID
    };

    trollSessions.set(threadID, session);

    try {
      for (const line of TROLL_LINES) {
        if (session.aborted) break;

        const body = line.replace(/\[name\]/g, name);

        await new Promise(resolve => {
          let finished = false;

          const done = () => {
            if (finished) return;
            finished = true;
            resolve();
          };

          api.sendMessage(body, threadID, done);
          setTimeout(done, 5000);
        });

        if (session.aborted) break;

        await sleep(2500);
      }
    } catch (err) {
      console.error("[TROLL ERROR]", err);
    } finally {
      if (trollSessions.get(threadID) === session) {
        trollSessions.delete(threadID);
      }
    }
  },

  // AUTOMATIC STOP PHRASE
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
