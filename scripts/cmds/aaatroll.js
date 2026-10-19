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
  "tabah Wag Kang Magwala, Baka Mamaya Di Mo Na Makontrol  Inis Mo 🥊",
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
  "Wag Kang Magwala Dyan Dog [name], Di Pa Nga Tapos Yung Usapan Parang Ubos Na Agad Pasensya Mo 😭 Akala Ko Ba Makunat Ka Bakit Isang Sagutan Pa Lang Parang Gusto Mo Nang Mag Logout 🥊",
"Tabah Kalma Ka Lang Muna [name], Baka Sa Sobrang Dami Mong Gustong Sabihin Nakalimutan Mo Na Kung Ano Talaga Yung Pinaglalaban Mo 😭 Ang Daming Angas Sa Simula Pero Pag Humaba Na Ang Usapan Paulit Ulit Na Lang Yung Banat 🥊",
"Dog Mode Ka Na Naman Ba [name], Bawat Reply Mo May Kasamang Inis Tapos Sasabihin Mo Hindi Ka Pikon 😭 Kung Talagang Chill Ka Lang Bakit Parang Bawat Salita Kailangan Mong Sagutin At Bawat Banat Kailangan Mong Patulan 🥊",
"Makunat Kaya To O Puro Lang Talaga Yabang Sa Umpisa [name], Kasi Ang Lakas Mong Magpakilala Na Hindi Ka Basta Basta Pero Parang Ang Dami Mong Paliwanag Sa Bawat Simpleng Sagutan 😭 Panindigan Mo Muna Yung Sinimulan Mong Angas 🥊",
"Guray Gurayin Mo Yang Script Mo [name], Kasi Parang Paulit Ulit Na Lang Yung Linya Mong Ginagamit Sa Bawat Tao 😭 Magdagdag Ka Naman Ng Bagong Banat Para Hindi Naman Parang Lumang Episode Yung Binabasa Namin Sa Lobby 🥊",
"Wag Kang Mawawala Bigla Tabah [name], Ang Dami Mong Sinabi Noong Simula Tapos Ngayong May Sumagot Sayo Parang Nag Iisip Ka Na Kung Paano Tatapusin Yung Usapan 😭 Akala Ko Ba Kayang Kaya Mo Lahat Ng Banat Dito 🥊",
"Baka Manlambot Ka Sa Kakareply Dog [name], Kasi Parang Mas Marami Ka Pang Energy Sa Pagpapaliwanag Kaysa Sa Pagbuo Ng Bagong Banat 😭 Hindi Kailangan Mahaba Ang Reply Kung Wala Namang Bagong Punto Na Dinadagdag Sa Usapan 🥊",
"Tabah Wag Kang Mag Tantrums Sa Lobby [name], Hindi Lahat Ng Tao Kailangan Sumang Ayon Sa Sinasabi Mo At Hindi Lahat Ng Sagot Ay Dahilan Para Magalit Ka 😭 Kung Bardagulan Ang Gusto Mo Matuto Ka Rin Tumanggap Ng Sagot 🥊",
"Angas Mo Sa Simula Dog [name], Parang Ikaw Na Ang May Ari Ng Buong Lobby Pero Habang Tumatagal Parang Iisa Na Lang Ang Paulit Ulit Mong Sinasabi 😭 Baka Kailangan Mo Nang Mag Update Ng Script Para May Bago Naman Kaming Mababasa 🥊",
"Makunat Ka Raw Tabah [name], Pero Bakit Parang Bawat Reply Mo Kailangan May Kasamang Sampung Paliwanag At Tatlong Depensa 😭 Hindi Naman Kailangan Patunayan Sa Lahat Na Ikaw Ang Tama Sa Bawat Usapan 🥊",
"Wag Kang Puro Dada Dog [name], Kung May Sasabihin Ka Sabihin Mo Nang Diretso Imbes Na Paulit Ulit Mong Iikot Yung Parehong Punto 😭 Ang Haba Na Ng Usapan Pero Parang Wala Pa Rin Tayong Naririnig Na Bago 🥊",
"Tabah Breathe Ka Muna [name], Baka Sa Kakaisip Mo Ng Isasagot Hindi Mo Na Napapansin Na Nauulit Mo Na Lang Yung Mga Nauna Mong Sinabi 😭 Chill Lang Dito Walang Premyo Sa Pinakamaraming Reply Sa Isang Gabi 🥊",
"Dog Wag Kang Magpanggap Na Walang Epekto Sayo [name], Kung Ayaw Mong Patulan Ang Banat Puwede Ka Namang Tumawa At Magpatuloy Sa Usapan 😭 Hindi Naman Kailangan Gawing Malaking Issue Ang Bawat Asaran Sa Lobby 🥊",
"Uy Tabah [name], Ang Dami Mong Baon Na Banat Pero Parang Iisa Lang Ang Paulit Ulit Na Lumalabas 😭 Mag Imbento Ka Naman Ng Bagong Linya Para Hindi Naman Kabisado Na Namin Ang Susunod Mong Sasabihin Bago Mo Pa Itype 🥊",
"Dog Mode Activated Na Naman [name] 😭 Isang Mensahe Lang Ang Binasa Mo Pero Parang Gumawa Ka Na Ng Buong Thesis Sa Pagsagot Dito 🥊 Relax Lang At Ayusin Mo Muna Yung Punto Mo Bago Ka Maglabas Ng Panibagong Paragraph", 
"Tabah Huwag Mong Ubusin Ang Angas Mo Sa Chat [name], Baka Sa Dami Ng Pangako Mong Banat Wala Ka Nang Maiwan Para Sa Susunod Na Round 😭 Mas Maganda Yung May Sense Ang Sinasabi Kaysa Mahaba Nga Pero Paulit Ulit Naman 🥊",
"Makunat Daw Pero Puro Paliwanag [name] 😭 Akala Ko Ba Diretso Ka Magsalita Bakit Parang Kailangan Pa Nating Balikan Ang Buong Conversation Para Lang Maintindihan Kung Ano Talaga Yung Gusto Mong Sabihin 🥊",
"Guray Gurayin Mo Yang Lumang Banat Mo [name], Kasi Parang Kahapon Pa Namin Naririnig Yung Parehong Linya Mo 😭 Kung Gusto Mong Sumabay Sa Bardagulan Dagdagan Mo Naman Ng Creativity At Bawasan Yung Paulit Ulit Na Script 🥊",
"Wag Kang Magwala Sa Reply Section Dog [name], Hindi Ito Paligsahan Kung Sino Ang Pinakamahabang Magtype 😭 Mas Nakakatawa Yung Marunong Makipagbiruan Nang Hindi Ginagawang Away Ang Bawat Salita 🥊",
"Tabah Baka Kailangan Mo Lang Magpahinga Muna [name], Kasi Parang Ubos Na Ang Ideas Mo At Pareho Na Lang Ang Lumalabas Sa Bawat Reply 😭 Balik Ka Kapag May Bago Ka Nang Banat Para Hindi Naman Pareho Ang Binabasa Natin 🥊",
"Dog Sige Pa Banat Ka [name], Basta Siguraduhin Mong May Bago Kang Sasabihin Dahil Hindi Naman Puwedeng Iisang Linya Ang Ipapalit Mo Lang Ang Puwesto Tapos Tatawagin Mong New Script 😭 Creativity Muna Bago Ang Angas 🥊",
"Tabah Wag Kang Mawawala Sa Gitna Ng Usapan [name], Ikaw Ang Naunang Maingay Kaya Nakakatuwang Makita Kung Paano Mo Itutuloy Yung Mga Sinimulan Mong Linya 😭 Basta Tandaan Mo Na Asaran Lang Ito At Hindi Kailangang Gawing Personal 🥊",
"Dog [name] Ang Haba Ng Reply Mo Pero Parang Bitin Sa Bagong Ideas 😭 Puro Recycle Ng Dating Banat Tapos Lalagyan Lang Ng Ibang Emoji Para Magmukhang Fresh 🥊 Sige Nga Maglabas Ka Naman Ng Original Na Linya",
"Tabah Kalma Lang Sa Lobby [name], Hindi Naman Kailangang Sagutin Ang Lahat Ng Mensahe Na Para Bang May Deadline Bawat Reply 😭 Puwede Kang Magpatawa Puwede Kang Bumawi Pero Huwag Mong Kalimutang Enjoyin Lang Ang Bardagulan 🥊",
"Makunat Kaya To [name], O Magaling Lang Talaga Sa Intro Tapos Nawawalan Ng Bagong Sasabihin Kapag Humahaba Na Ang Conversation 😭 Sige Lang Mag Isip Ka Muna Ng Mas Creative Na Banat Bago Ka Bumalik Sa Round 🥊",
"Dog Wag Kang Puro Tantrums [name], Mas Maganda Kung May Sense Of Humor Ka Rin Kapag Ikaw Na Ang Pinagbibiro 😭 Hindi Puwedeng Ikaw Lang Ang May Karapatang Mang Asar Tapos Kapag Binalikan Ka Biglang Serious Mode Na 🥊",
"Tabah [name] Huwag Mong Gawing Competition Ang Bawat Chat, Hindi Naman Paramihan Ng Message Ang Basehan Ng Pinakamagandang Banat 😭 Minsan Isang Maayos Na Linya Lang Mas Nakakatawa Kaysa Sampung Paragraph Na Pareho Lang Ang Sinasabi 🥊",
"Dog [name] Parang May Season Two Na Yung Script Mo Pero Wala Pa Ring Bagong Plot 😭 Puro Same Lines Same Energy Same Ending 🥊 Bigyan Mo Naman Kami Ng Plot Twist Na Hindi Galing Sa Lumang Conversation Mo",
"Tabah Wag Kang Magmadali Mag Reply [name], Mag Isip Ka Muna Ng Bagong Banat Para Hindi Naman Parang Copy Paste Ang Bawat Sagot Mo 😭 Mas Masaya Ang Lobby Kapag Parehong May Creativity At Marunong Tumawa Sa Sariling Pagkakamali 🥊",
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
    author: "Kaizer",
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
      return message.reply("sige, boss kaizer");
    }

    if (trollSessions.has(threadID)) {
      return message.reply("⚠️ May umaandar pang troll session dito. Gamitin: " + prefix + "troll tigil");
    }

    const mentionIDs = Object.keys(mentions || {});
    if (!mentionIDs.length) {
      return message.reply("tag mo yung i t-troll boss Kaizer");
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

      const finalBody = `MYSTERIOUSq ON TOP 🔝\n\n${name} ON TRASH🚮🚮🚮\n\n\nREASON BAKIT NATALO:\n\n- MAHINA\n- NAASAR SA SIMPLING TROLL\n- DI AKO KAYANG SABAYAN\n- MATABA ANG MGA KAMAY\n- SA CLIPBOARD LANG UMAASA SI TABA\n- ASUKO SI TABA\n\nDuration:\n${timeStr}`;

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
