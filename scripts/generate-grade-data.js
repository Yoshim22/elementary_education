const fs = require("fs");
const path = require("path");
const kanji = require("kanji");
const kanjiData = require("kanji-data");
const vm = require("vm");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8"), sandbox);
const grade4Source = sandbox.window.GRADE4_KANJI || [];
const japaneseMeanings = sandbox.window.WORD_MEANINGS || {};
const wordExamples = sandbox.window.WORD_EXAMPLES || {};

const OFFICIAL_GRADE_STRINGS = {
  1: "一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六",
  2: "引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時室社弱首秋週春書少場色色食心新親図数西声音晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬売買麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話",
  3: "悪安暗医委意育員院飲運泳駅央横屋温化荷界開階寒感漢館岸起期客究急級宮球去橋業曲局銀区苦具君係軽血決研県庫湖向幸港号根祭皿仕死使始指歯詩次事持式実写者主守取酒受州拾終習集住重宿所暑助昭消商章勝乗植申身神真深進世整昔全相送想息速族他打対待代第題炭短談着注柱丁帳調追定庭笛鉄転都度投豆島湯登等動童農波配倍箱畑発反坂板皮悲美鼻筆氷表秒病品負部服福物平返勉放味命面問役薬由油有遊予羊洋葉陽様落流旅両緑礼列練路和",
  4: "愛案以衣位囲胃印英栄塩億加果貨課芽改械害街各覚完官管関観願希季紀喜旗器機議求泣救給挙漁共協鏡競極訓軍郡径型景芸欠結建健験固功好候航康告差菜最材昨札刷殺察参産散残士氏史司試児治辞失借種周祝順初松笑唱焼象照賞臣信成省清静席積折節説浅戦選然争倉巣束側続卒孫帯隊達単置仲貯兆腸低底停的典伝徒努灯堂働特得毒熱念敗梅博飯飛費必票標不夫付府副粉兵別辺変便包法望牧末満未脈民無約勇要養浴利陸良料量輪類令冷例歴連老労録",
  5: "圧移因永営衛易益液演応往桜恩可仮価河過賀快解格確額刊幹慣眼基寄規技義逆久旧居許境均禁句群経潔件券険検限現減故個護効厚耕鉱構興講混査再災妻採際在財罪雑酸賛支志枝師資飼示似識質舎謝授修述術準序招承証条状常情織職制性政勢精製税責績接設舌絶銭祖素総造像増則測属率損退貸態団断築張提程適敵統銅導徳独任燃能破犯判版比肥非備俵評貧布婦富武復複仏編弁保墓報豊防貿暴務夢迷綿輸余預容略留領",
  6: "異遺域宇映延沿我灰拡革閣割株干巻看簡危机揮貴疑吸供胸郷勤筋系敬警劇激穴絹権憲源厳己呼誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処署諸除将傷障城蒸針仁垂推寸盛聖誠宣専泉洗染善奏窓創装層操蔵臓存尊宅担探誕段暖値宙忠著庁頂潮賃痛展討党糖届難乳認納脳派拝背肺俳班晩否批秘腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟模訳郵優幼欲翌乱卵覧裏律臨朗論",
};

const CUSTOM_WORDS = {
  一: { write: ["一つ", "ひとつ", "thing"], read: ["一つ", "ひとつ", "thing"] },
  二: { write: ["二つ", "ふたつ", "thing"], read: ["二つ", "ふたつ", "thing"] },
  三: { write: ["三つ", "みっつ", "thing"], read: ["三つ", "みっつ", "thing"] },
  四: { write: ["四つ", "よっつ", "thing"], read: ["四つ", "よっつ", "thing"] },
  五: { write: ["五つ", "いつつ", "thing"], read: ["五つ", "いつつ", "thing"] },
  六: { write: ["六つ", "むっつ", "thing"], read: ["六つ", "むっつ", "thing"] },
  七: { write: ["七つ", "ななつ", "thing"], read: ["七つ", "ななつ", "thing"] },
  八: { write: ["八つ", "やっつ", "thing"], read: ["八つ", "やっつ", "thing"] },
  九: { write: ["九つ", "ここのつ", "thing"], read: ["九つ", "ここのつ", "thing"] },
  十: { write: ["十こ", "じゅっこ", "thing"], read: ["十こ", "じゅっこ", "thing"] },
  日: { write: ["日本", "にほん", "place"], read: ["日本", "にほん", "place"] },
  月: { write: ["月よう日", "げつようび", "time"], read: ["月", "つき", "nature"] },
  火: { write: ["花火", "はなび", "nature"], read: ["火", "ひ", "nature"] },
  水: { write: ["水たまり", "みずたまり", "nature"], read: ["水", "みず", "nature"] },
  木: { write: ["木かげ", "こかげ", "nature"], read: ["木", "き", "nature"] },
  金: { write: ["金いろ", "きんいろ", "thing"], read: ["金", "きん", "thing"] },
  土: { write: ["土山", "つちやま", "nature"], read: ["土", "つち", "nature"] },
  学: { write: ["学校", "がっこう", "place"], read: ["学校", "がっこう", "place"], okuri: ["学ぶ", "まなぶ", "verb"] },
  校: { write: ["学校", "がっこう", "place"], read: ["学校", "がっこう", "place"] },
  休: { write: ["休み", "やすみ", "time"], read: ["休日", "きゅうじつ", "time"], okuri: ["休む", "やすむ", "verb"] },
  本: { write: ["本だな", "ほんだな", "book"], read: ["本", "ほん", "book"] },
  見: { write: ["花見", "はなみ", "action"], read: ["見る", "みる", "verb"], okuri: ["見る", "みる", "verb"] },
  食: { write: ["食事", "しょくじ", "food"], read: ["食事", "しょくじ", "food"], okuri: ["食べる", "たべる", "verb"] },
  読: { write: ["読書", "どくしょ", "book"], read: ["読む", "よむ", "verb"], okuri: ["読む", "よむ", "verb"] },
  書: { write: ["図書", "としょ", "book"], read: ["書く", "かく", "verb"], okuri: ["書く", "かく", "verb"] },
  海: { write: ["海べ", "うみべ", "place"], read: ["海", "うみ", "nature"] },
  右: { write: ["右", "みぎ", "thing"], read: ["右", "みぎ", "thing"] },
  左: { write: ["左", "ひだり", "thing"], read: ["左", "ひだり", "thing"] },
  上: { write: ["上", "うえ", "thing"], read: ["上", "うえ", "thing"] },
  下: { write: ["下", "した", "thing"], read: ["下", "した", "thing"] },
  気: { write: ["元気", "げんき", "abstract"], read: ["元気", "げんき", "abstract"] },
  玉: { write: ["玉", "たま", "thing"], read: ["玉", "たま", "thing"] },
  子: { write: ["子ども", "こども", "person"], read: ["子ども", "こども", "person"] },
  糸: { write: ["糸", "いと", "thing"], read: ["糸", "いと", "thing"] },
  夕: { write: ["夕がた", "ゆうがた", "time"], read: ["夕がた", "ゆうがた", "time"] },
  千: { write: ["千", "せん", "thing"], read: ["千", "せん", "thing"] },
  音: { write: ["音", "おと", "thing"], read: ["音", "おと", "thing"] },
  空: { write: ["空", "そら", "nature"], read: ["空", "そら", "nature"] },
  犬: { write: ["犬", "いぬ", "nature"], read: ["犬", "いぬ", "nature"] },
  口: { write: ["口", "くち", "thing"], read: ["口", "くち", "thing"] },
  耳: { write: ["耳", "みみ", "thing"], read: ["耳", "みみ", "thing"] },
  手: { write: ["手", "て", "thing"], read: ["手", "て", "thing"] },
  車: { write: ["車", "くるま", "thing"], read: ["車", "くるま", "thing"] },
  女: { write: ["女", "おんな", "person"], read: ["女", "おんな", "person"] },
  出: { write: ["出る", "でる", "verb"], read: ["出る", "でる", "verb"], okuri: ["出る", "でる", "verb"] },
  小: { write: ["小さい", "ちいさい", "adjective"], read: ["小さい", "ちいさい", "adjective"] },
  正: { write: ["正しい", "ただしい", "adjective"], read: ["正しい", "ただしい", "adjective"] },
  青: { write: ["青い", "あおい", "adjective"], read: ["青い", "あおい", "adjective"] },
  赤: { write: ["赤い", "あかい", "adjective"], read: ["赤い", "あかい", "adjective"] },
  早: { write: ["早い", "はやい", "adjective"], read: ["早い", "はやい", "adjective"] },
  大: { write: ["大きい", "おおきい", "adjective"], read: ["大きい", "おおきい", "adjective"] },
  入: { write: ["入る", "はいる", "verb"], read: ["入る", "はいる", "verb"], okuri: ["入る", "はいる", "verb"] },
  白: { write: ["白い", "しろい", "adjective"], read: ["白い", "しろい", "adjective"] },
  百: { write: ["百", "ひゃく", "thing"], read: ["百", "ひゃく", "thing"] },
  名: { write: ["名前", "なまえ", "thing"], read: ["名前", "なまえ", "thing"] },
  立: { write: ["立つ", "たつ", "verb"], read: ["立つ", "たつ", "verb"], okuri: ["立つ", "たつ", "verb"] },
  絵: { write: ["絵本", "えほん", "book"], read: ["絵本", "えほん", "book"] },
  羽: { write: ["羽", "はね", "nature"], read: ["羽", "はね", "nature"] },
  家: { write: ["家", "いえ", "place"], read: ["家", "いえ", "place"] },
  園: { write: ["公園", "こうえん", "place"], read: ["公園", "こうえん", "place"] },
  遠: { write: ["遠い", "とおい", "adjective"], read: ["遠い", "とおい", "adjective"] },
  夏: { write: ["夏休み", "なつやすみ", "time"], read: ["夏", "なつ", "time"] },
  科: { write: ["理科", "りか", "thing"], read: ["理科", "りか", "thing"] },
  角: { write: ["角", "かど", "thing"], read: ["角", "かど", "thing"] },
  市: { write: ["市内", "しない", "place"], read: ["市内", "しない", "place"] },
  太: { write: ["太い", "ふとい", "adjective"], read: ["太い", "ふとい", "adjective"] },
  頭: { write: ["頭", "あたま", "thing"], read: ["頭", "あたま", "thing"] },
  春: { write: ["春", "はる", "time"], read: ["春", "はる", "time"] },
  虫: { write: ["虫", "むし", "nature"], read: ["虫", "むし", "nature"] },
  友: { write: ["友だち", "ともだち", "person"], read: ["友だち", "ともだち", "person"] },
  汽: { write: ["汽車", "きしゃ", "thing"], read: ["汽車", "きしゃ", "thing"] },
  顔: { write: ["顔", "かお", "thing"], read: ["顔", "かお", "thing"] },
  引: { write: ["引く", "ひく", "verb"], read: ["引く", "ひく", "verb"], okuri: ["引く", "ひく", "verb"] },
  会: { write: ["会う", "あう", "verb"], read: ["会う", "あう", "verb"], okuri: ["会う", "あう", "verb"] },
  委: { write: ["委員", "いいん", "person"], read: ["委員", "いいん", "person"] },
  院: { write: ["病院", "びょういん", "place"], read: ["病院", "びょういん", "place"] },
  飲: { write: ["飲み物", "のみもの", "food"], read: ["飲み物", "のみもの", "food"] },
  運: { write: ["運動", "うんどう", "action"], read: ["運動", "うんどう", "action"] },
  央: { write: ["中央", "ちゅうおう", "place"], read: ["中央", "ちゅうおう", "place"] },
  化: { write: ["変化", "へんか", "abstract"], read: ["変化", "へんか", "abstract"] },
  荷: { write: ["荷物", "にもつ", "thing"], read: ["荷物", "にもつ", "thing"] },
  界: { write: ["世界", "せかい", "place"], read: ["世界", "せかい", "place"] },
  漢: { write: ["漢字", "かんじ", "thing"], read: ["漢字", "かんじ", "thing"] },
  館: { write: ["図書館", "としょかん", "place"], read: ["図書館", "としょかん", "place"] },
  究: { write: ["研究", "けんきゅう", "action"], read: ["研究", "けんきゅう", "action"] },
  悪: { write: ["悪路", "あくろ", "thing"], read: ["悪路", "あくろ", "thing"] },
  暗: { write: ["暗夜", "あんや", "time"], read: ["暗夜", "あんや", "time"] },
  育: { write: ["発育", "はついく", "abstract"], read: ["発育", "はついく", "abstract"] },
  泳: { write: ["水泳", "すいえい", "action"], read: ["水泳", "すいえい", "action"] },
  駅: { write: ["駅前", "えきまえ", "place"], read: ["駅前", "えきまえ", "place"] },
  横: { write: ["横断歩道", "おうだんほどう", "place"], read: ["横断歩道", "おうだんほどう", "place"] },
  客: { write: ["乗客", "じょうきゃく", "person"], read: ["乗客", "じょうきゃく", "person"] },
  業: { write: ["授業", "じゅぎょう", "action"], read: ["授業", "じゅぎょう", "action"] },
  局: { write: ["郵便局", "ゆうびんきょく", "place"], read: ["郵便局", "ゆうびんきょく", "place"] },
  係: { write: ["係員", "かかりいん", "person"], read: ["係員", "かかりいん", "person"] },
  血: { write: ["血液", "けつえき", "thing"], read: ["血液", "けつえき", "thing"] },
  決: { write: ["決定", "けってい", "action"], read: ["決定", "けってい", "action"] },
  意: { write: ["意見", "いけん", "abstract"], read: ["意見", "いけん", "abstract"] },
  易: { write: ["易しい", "やさしい", "adjective"], read: ["易しい", "やさしい", "adjective"] },
  益: { write: ["有益", "ゆうえき", "abstract"], read: ["有益", "ゆうえき", "abstract"] },
  応: { write: ["応援", "おうえん", "action"], read: ["応援", "おうえん", "action"] },
  往: { write: ["往復", "おうふく", "action"], read: ["往復", "おうふく", "action"] },
  桜: { write: ["桜", "さくら", "nature"], read: ["桜", "さくら", "nature"] },
  営: { write: ["営業", "えいぎょう", "action"], read: ["営業", "えいぎょう", "action"] },
  衛: { write: ["衛生", "えいせい", "abstract"], read: ["衛生", "えいせい", "abstract"] },
  可: { write: ["可能", "かのう", "abstract"], read: ["可能", "かのう", "abstract"] },
  仮: { write: ["仮名", "かな", "thing"], read: ["仮名", "かな", "thing"] },
  価: { write: ["価格", "かかく", "thing"], read: ["価格", "かかく", "thing"] },
  河: { write: ["河川", "かせん", "place"], read: ["河川", "かせん", "place"] },
  過: { write: ["過去", "かこ", "time"], read: ["過去", "かこ", "time"] },
  賀: { write: ["年賀状", "ねんがじょう", "thing"], read: ["年賀状", "ねんがじょう", "thing"] },
  格: { write: ["格好", "かっこう", "thing"], read: ["格好", "かっこう", "thing"] },
  快: { write: ["快晴", "かいせい", "time"], read: ["快晴", "かいせい", "time"] },
  確: { write: ["確認", "かくにん", "action"], read: ["確認", "かくにん", "action"] },
  刊: { write: ["刊行", "かんこう", "action"], read: ["刊行", "かんこう", "action"] },
  幹: { write: ["幹線道路", "かんせんどうろ", "place"], read: ["幹線道路", "かんせんどうろ", "place"] },
  異: { write: ["異なる", "ことなる", "verb"], read: ["異なる", "ことなる", "verb"] },
  映: { write: ["映画", "えいが", "book"], read: ["映画", "えいが", "book"] },
  演: { write: ["演技", "えんぎ", "action"], read: ["演技", "えんぎ", "action"] },
  我: { write: ["我慢", "がまん", "abstract"], read: ["我慢", "がまん", "abstract"] },
  灰: { write: ["灰色", "はいいろ", "thing"], read: ["灰色", "はいいろ", "thing"] },
  拡: { write: ["拡大", "かくだい", "action"], read: ["拡大", "かくだい", "action"] },
  革: { write: ["革", "かわ", "thing"], read: ["革", "かわ", "thing"] },
  閣: { write: ["内閣", "ないかく", "thing"], read: ["内閣", "ないかく", "thing"] },
  割: { write: ["割合", "わりあい", "thing"], read: ["割合", "わりあい", "thing"] },
  株: { write: ["切り株", "きりかぶ", "thing"], read: ["切り株", "きりかぶ", "thing"] },
  干: { write: ["干す", "ほす", "verb"], read: ["干す", "ほす", "verb"], okuri: ["干す", "ほす", "verb"] },
  巻: { write: ["巻く", "まく", "verb"], read: ["巻く", "まく", "verb"], okuri: ["巻く", "まく", "verb"] },
  看: { write: ["看板", "かんばん", "thing"], read: ["看板", "かんばん", "thing"] },
  簡: { write: ["簡単", "かんたん", "adjective"], read: ["簡単", "かんたん", "adjective"] },
  危: { write: ["危険", "きけん", "abstract"], read: ["危険", "きけん", "abstract"] },
  机: { write: ["机", "つくえ", "thing"], read: ["机", "つくえ", "thing"] },
  揮: { write: ["発揮", "はっき", "action"], read: ["発揮", "はっき", "action"] },
  貴: { write: ["貴重", "きちょう", "adjective"], read: ["貴重", "きちょう", "adjective"] },
  疑: { write: ["疑問", "ぎもん", "abstract"], read: ["疑問", "ぎもん", "abstract"] },
  供: { write: ["供給", "きょうきゅう", "action"], read: ["供給", "きょうきゅう", "action"] },
  胸: { write: ["胸", "むね", "thing"], read: ["胸", "むね", "thing"] },
  権: { write: ["権利", "けんり", "abstract"], read: ["権利", "けんり", "abstract"] },
  源: { write: ["資源", "しげん", "thing"], read: ["資源", "しげん", "thing"] },
  呼: { write: ["呼吸", "こきゅう", "action"], read: ["呼吸", "こきゅう", "action"] },
  紅: { write: ["紅茶", "こうちゃ", "food"], read: ["紅茶", "こうちゃ", "food"] },
  詩: { write: ["詩集", "ししゅう", "book"], read: ["詩人", "しじん", "person"] },
  議: { write: ["会議", "かいぎ", "action"], read: ["会議", "かいぎ", "action"] },
  愛: { write: ["愛じょう", "あいじょう", "abstract"], read: ["愛読", "あいどく", "book"] },
};

const READING_OVERRIDES = {
  右: "みぎ",
  左: "ひだり",
  雨: "あめ",
  音: "おと",
  空: "そら",
  月: "つき",
  子: "こ",
  女: "おんな",
  上: "うえ",
  下: "した",
  見: "みる",
  引: "ひく",
  羽: "はね",
  園: "その",
  遠: "とおい",
  家: "いえ",
  夏: "なつ",
  科: "か",
  貝: "かい",
  玉: "たま",
  女: "おんな",
  上: "うえ",
  小: "ちいさい",
  青: "あおい",
  赤: "あかい",
  白: "しろい",
  草: "くさ",
  足: "あし",
  男: "おとこ",
  竹: "たけ",
  中: "なか",
  町: "まち",
  天: "てん",
  田: "た",
  日: "ひ",
  入: "はいる",
  年: "とし",
  文: "ぶん",
  名: "なまえ",
  目: "め",
  立: "たつ",
  力: "ちから",
  林: "はやし",
  歌: "うた",
  画: "えがく",
  会: "あう",
  外: "そと",
  角: "かど",
  丸: "まる",
  楽: "たのしい",
  活: "せいかつ",
  間: "あいだ",
  岩: "いわ",
  牛: "うし",
  記: "き",
  帰: "かえる",
  教: "おしえる",
  近: "ちかい",
  計: "はかる",
  言: "いう",
  原: "はら",
  後: "あと",
  工: "こうさく",
  光: "ひかり",
  行: "いく",
  高: "たかい",
  黄: "きいろ",
  黒: "くろい",
  作: "つくる",
  紙: "かみ",
  自: "じぶん",
  時: "じかん",
  室: "きょうしつ",
  社: "じんじゃ",
  弱: "よわい",
  秋: "あき",
  大: "おおきい",
  正: "ただしい",
  早: "はやい",
  百: "ひゃく",
  形: "かたち",
  語: "ことば",
  知: "しる",
  昼: "ひる",
  長: "ながい",
  朝: "あさ",
  通: "とおる",
  冬: "ふゆ",
  東: "ひがし",
  答: "こたえ",
  同: "おなじ",
  道: "みち",
  内: "うち",
  南: "みなみ",
  馬: "うま",
  売: "うる",
  買: "かう",
  麦: "むぎ",
  聞: "きく",
  米: "こめ",
  歩: "あるく",
  北: "きた",
  鳴: "なる",
  毛: "け",
  夜: "よる",
  野: "の",
  来: "くる",
  話: "はなす",
  区: "く",
  苦: "くるしい",
  具: "どうぐ",
  君: "きみ",
  軽: "かるい",
  湖: "みずうみ",
  港: "みなと",
  根: "ね",
  祭: "まつり",
  皿: "さら",
  使: "つかう",
  始: "はじめる",
  指: "ゆび",
  歯: "は",
  次: "つぎ",
  持: "もつ",
  写: "うつす",
  主: "ぬし",
  守: "まもる",
  取: "とる",
  酒: "さけ",
  受: "うける",
  所: "ところ",
  暑: "あつい",
  助: "たすける",
  申: "もうす",
  真: "ま",
  深: "ふかい",
  進: "すすむ",
  整: "ととのえる",
  送: "おくる",
  想: "おもう",
  息: "いき",
  速: "はやい",
  他: "ほか",
  打: "うつ",
  待: "まつ",
  炭: "すみ",
  短: "みじかい",
  談: "はなす",
};

const HINT_RULES = [
  [/right/i, "みぎがわ"],
  [/left/i, "ひだりがわ"],
  [/rain/i, "そらから ふる みず"],
  [/snow/i, "そらから ふる しろい もの"],
  [/cloud/i, "そらに うかぶ もの"],
  [/sun|day/i, "ひるの ひかり"],
  [/moon/i, "よるの そらに みえる もの"],
  [/fire/i, "もえる ひ"],
  [/water/i, "のみものにも なる みず"],
  [/tree|wood/i, "みきや えだの ある もの"],
  [/flower/i, "さく はな"],
  [/grass/i, "じめんに はえる くさ"],
  [/mountain/i, "たかい やま"],
  [/river/i, "ながれる かわ"],
  [/sea|ocean/i, "ひろい うみ"],
  [/sky/i, "あたまの うえの そら"],
  [/wind/i, "ふいて くる かぜ"],
  [/sound/i, "みみで きく おと"],
  [/ear/i, "おとを きく みみ"],
  [/eye/i, "ものを みる め"],
  [/mouth/i, "たべたり はなしたり する くち"],
  [/hand/i, "ものを もつ て"],
  [/foot|leg/i, "あるく あし"],
  [/dog/i, "わんわん なく どうぶつ"],
  [/bird/i, "そらを とぶ とり"],
  [/fish/i, "みずの なかを およぐ さかな"],
  [/insect|bug/i, "ちいさな むし"],
  [/school/i, "べんきょうする ところ"],
  [/book/i, "よむ ほん"],
  [/picture|drawing/i, "えや ず"],
  [/song|music/i, "うたや おと"],
  [/king/i, "くにの いちばん えらい ひと"],
  [/man|person/i, "ひと"],
  [/woman/i, "おんなの ひと"],
  [/child/i, "こども"],
  [/mother/i, "おかあさん"],
  [/father/i, "おとうさん"],
  [/brother/i, "きょうだい"],
  [/sister/i, "きょうだい"],
  [/friend/i, "ともだち"],
  [/country/i, "くに"],
  [/town|village|city/i, "まち"],
  [/park/i, "あそぶ ところ"],
  [/room|house/i, "へやや いえ"],
  [/car|vehicle/i, "のりもの"],
  [/money|gold/i, "おかね"],
  [/circle|round/i, "まるい かたち"],
  [/big|large/i, "おおきい こと"],
  [/small/i, "ちいさい こと"],
  [/long/i, "ながい こと"],
  [/short/i, "みじかい こと"],
  [/high|tall/i, "たかい こと"],
  [/low/i, "ひくい こと"],
  [/far|distant/i, "はなれて いる こと"],
  [/near|close/i, "ちかい こと"],
  [/strong/i, "つよい こと"],
  [/weak/i, "よわい こと"],
  [/read/i, "よむ こと"],
  [/write/i, "かく こと"],
  [/eat/i, "たべる こと"],
  [/drink/i, "のむ こと"],
  [/rest/i, "やすむ こと"],
  [/learn|study/i, "まなぶ こと"],
  [/go|come/i, "いどうする こと"],
  [/see|look/i, "みる こと"],
  [/think/i, "かんがえる こと"],
  [/love/i, "たいせつに 思う きもち"],
  [/hope/i, "のぞみ"],
  [/law/i, "きまり"],
  [/history/i, "むかしからの できごと"],
];

const SINGLE_CHAR_SENTENCE_RULES = [
  [/\bright\b/i, "{display}の てを あげる。"],
  [/\bleft\b/i, "{display}に まがる。"],
  [/\brain\b/i, "そらから {display}が ふる。"],
  [/\bsnow\b/i, "ふゆの あさに {display}が つもる。"],
  [/\bcloud\b/i, "そらに {display}が うかぶ。"],
  [/\bsun\b|\bday\b/i, "きょうは よい {display}だ。"],
  [/\bmoon\b/i, "よるの そらに {display}が みえる。"],
  [/\bfire\b/i, "{display}に きを つける。"],
  [/\bwater\b/i, "{display}を のむ。"],
  [/\btree\b|\bwood\b/i, "{display}の したで やすむ。"],
  [/\bflower\b/i, "{display}が さく。"],
  [/\bgrass\b/i, "{display}が のびる。"],
  [/\bmountain\b/i, "{display}に のぼる。"],
  [/\briver\b/i, "{display}で あそぶ。"],
  [/\bsea\b|\bocean\b/i, "{display}を 見に 行く。"],
  [/\bsky\b/i, "{display}を 見上げる。"],
  [/\bwind\b/i, "{display}が つよい。"],
  [/\bnoise\b|\bsound\b/i, "{display}が きこえる。"],
  [/\bear\b/i, "{display}で きく。"],
  [/\beye\b/i, "{display}で 見る。"],
  [/\bmouth\b/i, "{display}を あける。"],
  [/\bhand\b/i, "{display}を あらう。"],
  [/\bfoot\b|\bleg\b/i, "{display}で あるく。"],
  [/\bdog\b/i, "{display}が なく。"],
  [/\bbird\b/i, "{display}が とぶ。"],
  [/\bfish\b/i, "{display}が およぐ。"],
  [/\binsect\b|\bbug\b/i, "{display}を 見つける。"],
  [/\bschool\b/i, "{display}へ 行く。"],
  [/\bbook\b/i, "{display}を 読む。"],
  [/\bpicture\b|\bdrawing\b/i, "{display}を かく。"],
  [/\bsong\b|\bmusic\b/i, "{display}を うたう。"],
  [/\bking\b/i, "{display}の はなしを 読む。"],
  [/\bman\b|\bperson\b/i, "{display}が あるく。"],
  [/\bwoman\b/i, "{display}が はなす。"],
  [/\bchild\b/i, "{display}が わらう。"],
  [/\bmother\b|\bfather\b/i, "{display}と でかける。"],
  [/\bbrother\b|\bsister\b|\bfriend\b/i, "{display}と あそぶ。"],
  [/\bcountry\b/i, "{display}の ちずを 見る。"],
  [/\btown\b|\bvillage\b|\bcity\b/i, "{display}に すむ。"],
  [/\bpark\b|\bgarden\b|\byard\b|\bfarm\b/i, "{display}で あそぶ。"],
  [/\broom\b|\bhouse\b/i, "{display}に 入る。"],
  [/\bcar\b|\bvehicle\b/i, "{display}に のる。"],
  [/\bmoney\b|\bgold\b|\byen\b/i, "{display}を はらう。"],
  [/\bcircle\b|\bround\b/i, "{display}を かく。"],
  [/\bbig\b|\blarge\b/i, "{display}こえで よむ。"],
  [/\bsmall\b/i, "{display}こえで はなす。"],
  [/\blong\b/i, "{display}ひもを もつ。"],
  [/\bshort\b/i, "{display}えんぴつを つかう。"],
  [/\bhigh\b|\btall\b/i, "{display}木を 見上げる。"],
  [/\blow\b/i, "{display}ところを くぐる。"],
  [/\bfar\b|\bdistant\b/i, "学校は えきから {display}。"],
  [/\bnear\b|\bclose\b/i, "学校は いえから {display}。"],
  [/\bstrong\b/i, "{display}力で おす。"],
  [/\bweak\b/i, "{display}風で ゆれる。"],
  [/\bread\b/i, "{display}本が すきだ。"],
  [/\bwrite\b/i, "{display}字で 名前を 書く。"],
  [/\beat\b/i, "{display}のが はやい。"],
  [/\bdrink\b/i, "{display}水を のむ。"],
  [/\brest\b/i, "きょうは {display}。"],
  [/\blearn\b|\bstudy\b/i, "学校で {display}。"],
  [/\bgo\b|\bcome\b/i, "はやく {display}。"],
  [/\bsee\b|\blook\b/i, "よく {display}。"],
  [/\bthink\b/i, "しずかに {display}。"],
  [/\blove\b/i, "{display}を 大切に する。"],
  [/\bwhat\b/i, "{display}が ほしいですか。"],
  [/\bair\b|\bspirit\b|\bfeeling\b|\bmind\b/i, "{display}もちで あいさつする。"],
];

const KANJI_SENTENCE_OVERRIDES = {
  丸: "{display} ボールが ころがる。",
  弓: "{display} を ひく れんしゅうを する。",
  牛: "{display} が くさを 食べる。",
  京: "しゅう学りょこうで {display} 都へ 行く。",
  元: "{display} 気に あいさつする。",
  古: "{display} い どうぐを 大切に のこす。",
  午: "{display} ごはんを 食べる。",
  公: "{display} 園で あそぶ。",
  広: "{display} い へやで あそぶ。",
  交: "友だちと {display} りゅうする。",
  考: "よく {display} えて こたえる。",
  合: "みんなの 力を {display} わせる。",
  谷: "山の あいだに {display} が ある。",
  今: "{display} 日の よていを たしかめる。",
  才: "歌の {display} 能を のばす。",
  細: "{display} い せんを かく。",
  算: "{display} 数の もんだいを とく。",
  止: "あぶないので {display} まる。",
  矢: "{display} が とぶ ようすを えがく。",
  寺: "{display} に おまいりする。",
  少: "{display} し ずつ 食べる。",
  色: "花の {display} を くらべる。",
  心: "{display} を こめて あいさつする。",
  新: "{display} しい ノートを つかう。",
  親: "{display} 子で 手を つなぐ。",
  数: "星の {display} を かぞえる。",
  西: "{display} の 空が 赤く なる。",
  声: "大きな {display} で よむ。",
  晴: "明日は {display} れる かな。",
  切: "はさみで 紙を {display} る。",
  船: "{display} に のる。",
  線: "まっすぐな {display} を ひく。",
  前: "みんなの {display} に 立つ。",
  組: "三人 {display} を つくる。",
  走: "うんどう場を {display} る。",
  多: "{display} くの 人が あつまる。",
  体: "{display} を うごかす。",
  台: "にもつを {display} 車に のせる。",
  地: "{display} 図を 見て 場所を たしかめる。",
  池: "{display} に こいが およぐ。",
  屋: "本{display} で 本を さがす。",
  温: "手で 水の {display} 度を たしかめる。",
  開: "まどを {display}。",
  階: "二{display} へ 上がる。",
  寒: "{display} 日は コートを 着る。",
  岸: "川の {display} を あるく。",
  起: "朝 早く {display}。",
  期: "二学{display} が はじまる。",
  急: "{display} で 走らない。",
  級: "上の {display} に すすむ。",
  宮: "{display} 島へ 行って 学ぶ。",
  球: "白い {display} を 投げる。",
  去: "{display} 年の 思い出を 話す。",
  橋: "大きな {display} を わたる。",
  曲: "音楽の {display} を 聞く。",
  銀: "{display} 色の かみを おる。",
  語: "あたらしい {display} を おぼえる。",
  週: "らい{display} に えんそくが ある。",
  場: "うんどう{display} で はしる。",
  知: "しらない ことを {display}。",
  昼: "{display} ごはんを 食べる。",
  長: "{display} い えんぴつを つかう。",
  朝: "{display} ごはんを 食べる。",
  通: "この みちを {display}。",
  冬: "{display} に ゆきが ふる。",
  東: "{display} の 空が 明るく なる。",
  答: "先生の しつもんに {display}。",
  同: "{display} じ いろを えらぶ。",
  道: "{display} を まっすぐ あるく。",
  内: "はこの {display} を 見る。",
  南: "{display} の まどを あける。",
  馬: "{display} が はしる。",
  売: "店で パンを {display}。",
  買: "おかしを {display}。",
  麦: "{display} 茶を のむ。",
  聞: "先生の 話を {display}。",
  米: "{display} を あらう。",
  歩: "こうえんを {display}。",
  北: "{display} の 空を 見る。",
  鳴: "かねが {display}。",
  毛: "ねこの {display} が やわらかい。",
  夜: "{display} に 星を 見る。",
  野: "{display} 原を 走る。",
  来: "友だちが あそびに {display}。",
  話: "友だちと {display} す。",
  区: "この 地図は 二つの {display} に 分かれる。",
  苦: "{display} い くすりを のむ。",
  具: "べんりな {display} を つかう。",
  君: "{display} と いっしょに かえる。",
  軽: "{display} い かばんを もつ。",
  湖: "{display} に 鳥が うかぶ。",
  港: "{display} に 船が とまる。",
  根: "木の {display} が はる。",
  祭: "まちの {display} に さんかする。",
  皿: "白い {display} に りんごを のせる。",
  使: "大切に えんぴつを {display}。",
  始: "しゅくだいを {display}。",
  指: "{display} で さす。",
  歯: "{display} を みがく。",
  次: "{display} の 人が 入る。",
  持: "かばんを {display} つ。",
  写: "しゃしんを {display} す。",
  主: "クラスの {display} な いけんを まとめる。",
  守: "きまりを {display}。",
  取: "ボールを {display}。",
  酒: "大人が {display} を のむ。",
  受: "テストを {display}。",
  所: "すきな {display} を えらぶ。",
  暑: "{display} 日が つづく。",
  助: "こまって いる 友だちを {display}。",
  申: "はっきりと {display} す。",
  真: "{display} ん中に 立つ。",
  深: "{display} い 海を 見る。",
  進: "前へ {display} む。",
  整: "えんぴつを きれいに {display}。",
  送: "友だちを えきまで {display}。",
  想: "家ぞくを {display}。",
  息: "大きく {display} を すう。",
  速: "{display} い くるまが 走る。",
  他: "{display} の 人にも 聞いてみる。",
  打: "ボールを {display} つ。",
  待: "友だちを {display} つ。",
  炭: "{display} で 火を おこす。",
  短: "{display} い えんぴつを つかう。",
  談: "友だちと いろいろ {display} す。",
  常: "{display} に 早ね早おきを 心がける。",
  警: "{display} さつに みまもられる。",
  骨: "魚の {display} に 気をつける。",
  署: "けいさつ{display} へ とどける。",
  庁: "市役所の 本{display} へ 行く。",
  律: "ほう{display} を 守る。",
};

const WORD_PATTERN_EXAMPLES = [
  [/pressure/i, "天気よほうで {} を 調べる。"],
  [/doctor|medical care|medical science/i, "びょういんで {} の 話を 聞く。"],
  [/cause|factor/i, "できごとの {} を 考える。"],
  [/change|moving|mobile|transfer/i, "きせつの {} を かんじる。"],
  [/area|region|community/i, "この {} の ちずを 見る。"],
  [/heritage|ruins|remains|relic/i, "{} を 見学する。"],
  [/benefit|profit/i, "{} が ある ほうほうを えらぶ。"],
  [/liquid/i, "{} の はたらきを 調べる。"],
  [/defense|protect|guard/i, "{} の ほうほうを 学ぶ。"],
  [/perform|show|play/i, "{} を 見に 行く。"],
  [/response|reply|answer/i, "{} を かんがえて こたえる。"],
  [/easy|simple/i, "{} な やりかたを えらぶ。"],
  [/different|strange|unusual/i, "{} に 気づく。"],
  [/expand|wide/i, "{} を 広げる。"],
  [/safety/i, "{} を たしかめて 行動する。"],
  [/meeting|conference/i, "クラスで {} を ひらく。"],
  [/vote|election/i, "{} で だいひょうを 決める。"],
  [/language/i, "{} で あいさつする。"],
  [/climate|weather/i, "{} の ちがいを 調べる。"],
  [/season/i, "{} の うつりかわりを たのしむ。"],
  [/health/i, "{} に 気を つける。"],
  [/victory|defeat/i, "しあいの {} を ふり返る。"],
  [/history/i, "{} を 学ぶ。"],
  [/law/i, "{} を 守る。"],
  [/difference|different|abnormal|strange/i, "ふだんと ちがう {} に 気づく。"],
  [/eternity|permanent|forever/i, "{} の ねがいを こめる。"],
];

const EXACT_WORD_EXAMPLES = {
  一つ: "りんごが {} ある。",
  二つ: "あめを {} もらう。",
  三つ: "みかんが {} ならぶ。",
  四つ: "はこが {} ある。",
  五つ: "ほしを {} かぞえる。",
  六つ: "えんぴつが {} ある。",
  七つ: "ボールを {} あつめる。",
  八つ: "おさらが {} ならぶ。",
  九つ: "花を {} かざる。",
  十こ: "どんぐりを {} ひろう。",
  学校: "{} へ 行く。",
  学ぶ: "学校で {}。",
  休み: "きょうは {} だ。",
  休む: "つかれたので {}。",
  本: "{} を 読む。",
  下: "つくえの {} を みる。",
  貝: "{} を ひろう。",
  花見: "春に {} を たのしむ。",
  食事: "家ぞくで {} を する。",
  読書: "しずかな へやで {} を する。",
  図書: "としょしつで {} を さがす。",
  絵本: "{} を 読む。",
  音: "{} が きこえる。",
  空: "{} を 見上げる。",
  月: "よるの {} を 見る。",
  字: "{} を ていねいに 書く。",
  右: "みぎの {} を みる。",
  左: "ひだりの {} を みる。",
  金いろ: "きれいな {} の かみを おる。",
  口: "{} を あける。",
  女: "{} の こが わらう。",
  大きい: "{} 木の 下で あそぶ。",
  小さい: "{} こえで はなす。",
  上: "つくえの {} に 本を おく。",
  森: "{} を あるく。",
  正しい: "{} こたえを えらぶ。",
  生きる: "いきものが {}。",
  青い: "{} 空を 見上げる。",
  石: "{} を ひろう。",
  赤い: "{} 花が さく。",
  先: "{} に あいさつを する。",
  早い: "{} じかんに 学校へ 行く。",
  春: "{} に さくらが さく。",
  草: "{} を つむ。",
  足: "{} が はやい。",
  男: "{} の こが はしる。",
  耳: "{} で きく。",
  竹: "{} で できた かごを 見る。",
  中: "はこの {} を 見る。",
  町: "{} を あるく。",
  天: "{} 気の よい 日だ。",
  田: "{} んぼに 水が はいる。",
  土: "{} を さわる。",
  日: "{} が のぼる。",
  出る: "へやから {}。",
  入る: "へやに {}。",
  年: "ことしは 二〇二六{} だ。",
  白い: "{} くもが うかぶ。",
  百: "{} まで かぞえる。",
  文: "{} を 読む。",
  名前: "{} を 書く。",
  目: "{} で よく 見る。",
  見る: "空を {}。",
  立つ: "まっすぐ {}。",
  力: "{} を あわせる。",
  林: "{} の 中を あるく。",
  手: "{} を あらう。",
  車: "{} に のる。",
  犬: "{} が なく。",
  海べ: "{} を あるく。",
  元気: "きょうも {} に あそぶ。",
  玉: "{} を ころがす。",
  子ども: "{} が ならぶ。",
  友だち: "{} と あそぶ。",
  糸: "{} を つなげる。",
  夕がた: "{} に かえる。",
  千: "{} まで かぞえる。",
  公園: "{} で あそぶ。",
  遠い: "学校は えきから {}。",
  家: "{} に かえる。",
  夏: "{} が 来る。",
  夏休み: "{} を たのしみに する。",
  理科: "{} の じっけんを する。",
  歌: "{} を うたう。",
  画: "えを {}。",
  回: "うんどうじょうを 一{} はしる。",
  会う: "友だちに {}。",
  引く: "ドアを {}。",
  外: "{} で あそぶ。",
  角: "みちの {} を まがる。",
  楽しい: "{} じゅぎょうだった。",
  生活: "早ね早おきの {} を つづける。",
  間: "友だちとの {} を あける。",
  岩: "{} の 近くで 水が ながれる。",
  羽: "とりの {} が まう。",
  汽車: "{} の えを みる。",
  顔: "{} を あらう。",
  記: "大事な ことを {} に のこす。",
  帰る: "学校から まっすぐ {}。",
  教える: "ともだちに やり方を {}。",
  近い: "学校が 家から {}。",
  計る: "長さを {}。",
  言う: "はっきり {}。",
  原: "草{} を 走る。",
  後: "{} で ならぶ。",
  工作: "{} で はこを 作る。",
  光: "まどから {} が さす。",
  行く: "学校へ {}。",
  高い: "{} 山が 見える。",
  黄色: "{} 花が さく。",
  黒い: "{} ねこが いる。",
  作る: "こうさくを {}。",
  紙: "{} を おる。",
  自分: "{} の ことは 自分で する。",
  時間: "{} を まもる。",
  教室: "{} に 入る。",
  神社: "{} に おまいりする。",
  弱い: "つよい 風に {}。",
  秋: "{} の くだものを 食べる。",
  委員: "学級{} を みんなで 決める。",
  病院: "けがをしたので {} へ 行く。",
  飲み物: "うんどうの あとで {} を のむ。",
  運動: "休み時間に 校庭で {} する。",
  中央: "ちずの {} に しるしを つける。",
  変化: "しょくぶつの {} を 観察する。",
  荷物: "わすれものの {} を とどける。",
  世界: "{} の 国々を しゃかいで 学ぶ。",
  漢字: "新しい {} の れんしゅうを する。",
  図書館: "ほうかごに {} で 本を かりる。",
  研究: "理科で 育て方を {} する。",
  乗客: "駅で {} が 電車を 待つ。",
  授業: "算数の {} で 面積を 学ぶ。",
  郵便局: "{} で はがきを 出す。",
  係員: "{} が みんなに 合図する。",
  血液: "{} の はたらきを 理科で 学ぶ。",
  決定: "クラスの もくひょうを {} する。",
  意見: "グループで {} を 出し合う。",
  易しい: "この もんだいは {}。",
  有益: "くらしに {} な 本を 読む。",
  応援: "みんなで {} する。",
  往復: "学校を {} する。",
  桜: "春に {} が さく。",
  可能: "じっけんが {} か たしかめる。",
  仮名: "国語で {} を 学ぶ。",
  過去: "{} の 出来事を 学ぶ。",
  年賀状: "お正月に {} を 出す。",
  格好: "運動しやすい {} で 集まる。",
  異なる: "二つの いけんが {}。",
  映画: "休日に {} を 見る。",
  営業: "店の {} 時間を たしかめる。",
  衛生: "手洗いで {} に 気をつける。",
  価格: "品物の {} を くらべる。",
  河川: "{} の 水の ながれを 調べる。",
  快晴: "今日は {} で 気もちが よい。",
  確認: "持ち物を {} する。",
  刊行: "新しい 本が {} される。",
  幹線道路: "{} の 位置を 地図で たしかめる。",
  灰色: "くもった 空が {} に 見える。",
  演技: "学芸会で {} する。",
  拡大: "しゃしんを {} して 見る。",
  革: "{} の かばんを つかう。",
  内閣: "社会で {} の しごとを 学ぶ。",
  割合: "全体の {} を 計算する。",
  切り株: "森で {} を 見つける。",
  干す: "せんたくものを {}。",
  巻く: "マフラーを {}。",
  看板: "店の {} を 見る。",
  簡単: "{} な もんだいから とく。",
  危険: "{} な 場所に 近づかない。",
  机: "{} を ふく。",
  発揮: "練習の 成果を {} する。",
  貴重: "{} な 水を 大切に 使う。",
  疑問: "学習して {} を ノートに 書く。",
  供給: "電気の {} を 支える しくみを 学ぶ。",
  胸: "{} を はって 発表する。",
  権利: "子どもの {} について 考える。",
  資源: "地球の {} を 大切に する。",
  呼吸: "深く {} する。",
  紅茶: "あたたかい {} を のむ。",
  安全: "あんぜんな くらしの ために {} を まもる。",
  安心: "{} して ねむる。",
  安心感: "{} を もって はっぴょうする。",
  医師: "{} に みてもらう。",
  医者: "{} に みてもらう。",
  医学: "{} を 学ぶ 人の 話を 聞く。",
  医療: "ちいきの {} を 支える 人が いる。",
  悪路: "雨の あとの {} に 気をつける。",
  暗夜: "{} に 月が ひかる。",
  発育: "子どもの {} を 見まもる。",
  水泳: "夏の 体育で {} を する。",
  駅前: "{} で 友だちと 待ち合わせる。",
  横断歩道: "{} を わたる ときは 右左を 見る。",
  女医: "{} に けんこうの そうだんを する。",
  移動: "バスで {} する。",
  移り変わり: "きせつの {} を かんじる。",
  原因: "じこの {} を 考える。",
  要因: "へんかの {} を 調べる。",
  永遠: "{} の へいわを ねがう。",
  異常: "きかいの {} に 気づく。",
  相違: "二つの いけんの {} を くらべる。",
  世界遺産: "{} を 見学する。",
  文化遺産: "{} を 守る。",
  遺跡: "{} から むかしの くらしを 学ぶ。",
  遺産: "せかいの {} を 調べる。",
  地域: "{} の 行事に さんかする。",
  領域: "{} を 広げる れんしゅうを する。",
  宇宙: "{} の ひみつを 調べる。",
  気圧: "{} の へんかで 天気を 予想する。",
  電圧: "かいろの {} を はかる。",
  高気圧: "{} が 近づくと よく 晴れる。",
  延長: "しあいが {} に 入る。",
  沿道: "{} に ひとが ならぶ。",
  我慢: "すこし {} して がんばる。",
  灰色: "くもった 空が {} に 見える。",
};

const BAD_WRITTEN_PATTERNS = /(?:大学|学会|協会|会社|公団|条約|議会|委員会|省|庁|県|府|都|藩|軍|帝|王立|大学校|財団|病|症|死|遺体|遺骨|遺影|遺族|遺書|遺児|圧死|弾圧|公安|保障|条約|議定|政権)/;
const BAD_GLOSS = /(?:former province|era|prefecture|corporation|association|council|committee|treaty|government|ministry|police|bank|company|university|college|school of medicine|disease|pregnancy|delivery|corpse|deceased|bereaved|gene|genetic|organ|military|war|crime|psychology|surgery|euthanasia|morgue|abandonment|dead body|blood coagulation|act|therapy|law|province|imperial|foundation|cerebral|physics|chemistry|biology|buddhist|myth|medicine based|diagnosis|posthumous|archaeological|inheritance|estate)/i;
const HARD_READING_WORDS = new Set([
  ...grade4Source.map((item) => item.readWord).filter(Boolean),
  "梅雨",
  "吹雪",
  "足袋",
  "木綿",
  "田舎",
  "大人",
  "相手",
  "土産",
  "仲人",
  "一昨日",
  "昨日",
  "明日",
  "五月雨",
  "川原",
  "日和",
  "真夜中",
  "出来事",
  "人気",
  "上手",
  "下手",
]);

const TEMPLATE_LIBRARY = {
  1: {
    place: ["{} へ いく。", "{} で あそぶ。"],
    person: ["{} に あう。", "{} が くる。"],
    book: ["{} を よむ。", "{} を ひらく。"],
    nature: ["{} が ある。", "{} が みえる。"],
    food: ["{} を たべる。", "{} を のむ。"],
    time: ["きょうは {} だ。", "{} に かえる。"],
    action: ["みんなで {} を する。", "{} を はじめる。"],
    abstract: ["{} を たいせつに する。", "{} を かんじる。"],
    thing: ["{} を つかう。", "{} を もつ。"],
    verb: ["みんなで {}。", "きょうは {}。"],
    adjective: ["それは {}。", "{} ようすだ。"],
  },
  2: {
    place: ["学校の あとで {} へ いく。", "{} で あそぶ。"],
    person: ["学校で {} に あう。", "{} と はなす。"],
    book: ["学校で {} を よむ。", "{} を ひらく。"],
    nature: ["外で {} を みつける。", "{} を よく みる。"],
    food: ["家で {} を たべる。", "{} を のむ。"],
    time: ["あしたは {} だ。", "きょうは {} だ。"],
    action: ["みんなで {} を する。", "{} を れんしゅうする。"],
    abstract: ["{} を 大切に する。", "{} について 考える。"],
    thing: ["{} を つかう。", "{} を 見つける。"],
    verb: ["みんなで {}。", "家で {}。"],
    adjective: ["空が {}。", "みちが {}。"],
  },
  3: {
    place: ["{} へ 行く。", "{} で 学ぶ。"],
    person: ["{} に そうだんする。", "{} と いっしょに 学ぶ。"],
    book: ["教室で {} を 読む。", "{} を ひらく。"],
    nature: ["{} の ようすを 観察する。", "{} を 見つける。"],
    food: ["{} を 用意する。", "{} を 飲む。"],
    time: ["{} まで 待つ。", "{} に 集まる。"],
    action: ["みんなで {} を 行う。", "{} を れんしゅうする。"],
    abstract: ["{} について 考える。", "{} を 大切に する。"],
    thing: ["{} を つかう。", "{} を たしかめる。"],
    verb: ["先生の 話を 聞いて {}。", "みんなで {}。"],
    adjective: ["その 川は {}。", "空気が {}。"],
  },
  4: {
    place: ["{} へ 行って 学ぶ。", "{} で 話し合う。"],
    person: ["{} に 質問する。", "{} が みんなを まとめる。"],
    book: ["{} を 読んで 考える。", "資料で {} を 調べる。"],
    nature: ["{} の 変化を 観察する。", "{} を 見る。"],
    food: ["{} を 用意する。", "{} の ようすを 調べる。"],
    time: ["{} までに じゅんびを 終える。", "{} に 集まる。"],
    action: ["{} を して 力を 合わせる。", "{} を 行う。"],
    abstract: ["{} について 考える。", "{} を 大切に する。"],
    thing: ["{} を えらぶ。", "{} を たしかめる。"],
    verb: ["友だちと 相談して {}。", "目的を 決めて {}。"],
    adjective: ["その ちがいは {}。", "ようすが {}。"],
  },
  5: {
    place: ["見学で {} を おとずれる。", "{} を 調べる。"],
    person: ["{} の 話を 聞く。", "{} に 相談する。"],
    book: ["資料集で {} を 読み取る。", "{} を 読んで 考える。"],
    nature: ["{} の 仕組みを 調べる。", "{} の 変化を 比べる。"],
    food: ["{} の 特ちょうを 調べる。", "{} を 用意する。"],
    time: ["{} までの 予定を 立てる。", "{} に そなえる。"],
    action: ["{} を 計画して 実行する。", "{} を 通して 学ぶ。"],
    abstract: ["{} について 自分の 考えを まとめる。", "{} を 大切に して 行動する。"],
    thing: ["{} を たしかめる。", "{} を 生活に 生かす。"],
    verb: ["目的を 考えて {}。", "手順を 決めて {}。"],
    adjective: ["その 状態は {}。", "結果が {}。"],
  },
  6: {
    place: ["資料を 集めて {} を 調べる。", "見学した {} を まとめる。"],
    person: ["{} の 立場を 考える。", "{} に 話を 聞く。"],
    book: ["資料から {} を 読み取る。", "{} を 比べて 考える。"],
    nature: ["{} の しくみを 資料で 調べる。", "{} の 変化を 分析する。"],
    food: ["{} の 特ちょうを 比べる。", "{} について 調べる。"],
    time: ["{} までの 予定を 整える。", "{} に 向けて じゅんびする。"],
    action: ["{} を 計画して 実行する。", "{} を 通して 課題を 見つける。"],
    abstract: ["{} について 自分の 意見を まとめる。", "{} を 大切に して 判断する。"],
    thing: ["{} を たしかめる。", "{} を 比べて 考える。"],
    verb: ["理由を 考えながら {}。", "手順を 確かめて {}。"],
    adjective: ["その 状況は {}。", "結果として {}。"],
  },
};

const META_BAD_GLOSS = /(abbr|prefecture|corporation|academy|act on|battle|species|former|university|college|bank|police|ministry|government|company|association|conference|council|committee|treaty|province|imperial|russian|american|aichi|japanese navy|sexual)/i;

const STUDY_KANJI = {};
const CUMULATIVE_KANJI = {};

for (let grade = 1; grade <= 6; grade += 1) {
  STUDY_KANJI[grade] = [...OFFICIAL_GRADE_STRINGS[grade]];
  CUMULATIVE_KANJI[grade] = new Set(
    Array.from({ length: grade }, (_, index) => STUDY_KANJI[index + 1]).flat(),
  );
}

function termFor(index, total) {
  const boundary1 = Math.ceil(total / 3);
  const boundary2 = Math.ceil((total * 2) / 3);
  if (index + 1 <= boundary1) return 1;
  if (index + 1 <= boundary2) return 2;
  return 3;
}

function toHiragana(text) {
  return (text || "")
    .replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/\./g, "")
    .replace(/-/g, "");
}

function isKana(char) {
  return /[ぁ-ゖァ-ヶー]/u.test(char);
}

function isSimpleJapanese(text) {
  return /^[ぁ-ゖァ-ヶー一-龯々]+$/u.test(text);
}

function allAnswerCharsAllowed(word, grade, target) {
  const allowed = CUMULATIVE_KANJI[grade];
  return [...word].every((char) => isKana(char) || char === target || allowed.has(char));
}

function classifyFromText(text) {
  if (/(学校|校|教室|公園|駅|町|村|市|県|国|海べ|海|山|川|店|館|場|室|園)/.test(text)) return "place";
  if (/(本|書|図|絵|詩|歌|読書|図書|絵本|詩集)/.test(text)) return "book";
  if (/(人|者|士|員|長|生|友|母|父|兄|弟|姉|妹|王|氏|民)/.test(text)) return "person";
  if (/(雨|雪|風|空|月|日|花|草|木|森|林|山|川|海|雲|星|鳥|犬|魚|虫)/.test(text)) return "nature";
  if (/(食|飯|茶|麦|肉|野菜|果)/.test(text)) return "food";
  return null;
}

function classifyByGloss(gloss, written) {
  const base = `${gloss || ""} ${written}`;
  if (/(place|school|park|station|sea|river|mountain|house|room|shop|hall|library|city|village|country)/i.test(base)) return "place";
  if (/(book|picture|poem|map|story|letter|text|music|song)/i.test(base)) return "book";
  if (/(person|man|woman|child|student|teacher|poet|leader|member|friend|father|mother|brother|sister)/i.test(base)) return "person";
  if (/(sea|river|mountain|flower|tree|grass|dog|bird|fish|insect|wind|rain|snow|sky|sun|moon|nature)/i.test(base)) return "nature";
  if (/(food|rice|tea|bread|fruit|vegetable|meal|drink)/i.test(base)) return "food";
  if (/(day|holiday|morning|night|week|month|year|time)/i.test(base)) return "time";
  if (/(study|meeting|work|game|exercise|travel|practice|action|plan|event|contest)/i.test(base)) return "action";
  if (/(hope|love|mind|idea|law|promise|health|history|reason|meaning|result|care|feeling)/i.test(base)) return "abstract";
  return classifyFromText(written) || "thing";
}

function hash(text) {
  let value = 0;
  for (const char of text) value = (value * 33 + char.charCodeAt(0)) >>> 0;
  return value;
}

function priorityRank(priorities = []) {
  if (priorities.some((value) => /^ichi1$/.test(value))) return 100;
  if (priorities.some((value) => /^spec1$/.test(value))) return 95;
  if (priorities.some((value) => /^news1$/.test(value))) return 90;
  const nf = priorities
    .filter((value) => /^nf\d+$/.test(value))
    .map((value) => Number(value.slice(2)))
    .sort((a, b) => a - b)[0];
  if (Number.isFinite(nf)) return Math.max(0, 80 - nf);
  if (priorities.length) return 40;
  return 0;
}

function selectTemplate(grade, category) {
  const list = TEMPLATE_LIBRARY[grade][category] || TEMPLATE_LIBRARY[grade].thing;
  return list[Math.abs(hash(`${grade}-${category}`)) % list.length];
}

function variantScore(variant, target, grade) {
  const priorities = variant.priorities || [];
  let score = priorityRank(priorities);
  score -= Math.max(0, [...variant.written].length - 2) * 8;
  score -= Math.max(0, variant.pronounced.length - 6);
  if ([...variant.written].length === 2) score += 12;
  if ([...variant.written].length === 3) score += 6;
  if ([...variant.written].length === 1) score -= 6;
  if (META_BAD_GLOSS.test(variant.gloss || "")) score -= 120;
  if (BAD_GLOSS.test(variant.gloss || "")) score -= 140;
  if (BAD_WRITTEN_PATTERNS.test(variant.written || "")) score -= 120;
  if (/[A-Za-zＡ-Ｚａ-ｚ0-9０-９]/u.test(variant.written)) score -= 120;
  if (/[ァ-ヶ]/u.test(variant.written)) score -= 40;
  if (grade <= 3 && !allAnswerCharsAllowed(variant.written, grade, target)) score -= 120;
  if (!isSimpleJapanese(variant.written)) score -= 120;
  if (variant.written.includes(target) && [...variant.written].length > 1) score += 8;
  if (variant.pronounced.includes("・")) score -= 40;
  if (wordExamples[variant.written] || EXACT_WORD_EXAMPLES[variant.written]) score += 40;
  return score;
}

function getVariantsForKanji(target, grade, mode) {
  return kanjiData.getWords(target)
    .flatMap((entry) => {
      const gloss = (entry.meanings || []).flatMap((meaning) => meaning.glosses || [])[0] || "";
      return (entry.variants || []).map((variant) => ({ ...variant, gloss }));
    })
    .filter((variant) => variant.written && variant.pronounced)
    .filter((variant) => variant.written.includes(target))
    .filter((variant) => mode === "okuri" ? /[ぁ-ゖ]/u.test(variant.written) : true)
    .filter((variant) => grade >= 4 || allAnswerCharsAllowed(variant.written, grade, target))
    .filter((variant) => isSimpleJapanese(variant.written))
    .map((variant) => ({
      written: variant.written,
      pronounced: variant.pronounced,
      gloss: variant.gloss,
      category: classifyByGloss(variant.gloss, variant.written),
      score: variantScore(variant, target, grade),
    }))
    .sort((a, b) => b.score - a.score);
}

function makeCustomEntry(target, mode) {
  const custom = CUSTOM_WORDS[target]?.[mode];
  if (!custom) return null;
  return {
    written: custom[0],
    pronounced: custom[1],
    category: custom[2],
    gloss: "",
  };
}

function getPrimaryEnglishMeaning(target) {
  return (kanjiData.get(target)?.meanings || [])[0] || "";
}

function preferredReading(target) {
  if (READING_OVERRIDES[target]) return READING_OVERRIDES[target];
  const meta = kanji.readings(target) || { kun: [], on: [] };
  const meaning = getPrimaryEnglishMeaning(target);
  const preferKun = /\brain\b|\bsnow\b|\bcloud\b|\bsun\b|\bmoon\b|\bfire\b|\bwater\b|\btree\b|\bflower\b|\bgrass\b|\bmountain\b|\briver\b|\bsea\b|\bsky\b|\bwind\b|\bnoise\b|\bsound\b|\bear\b|\beye\b|\bmouth\b|\bhand\b|\bfoot\b|\bleg\b|\bdog\b|\bbird\b|\bfish\b|\binsect\b|\bbook\b|\bpicture\b|\bsong\b|\bman\b|\bwoman\b|\bchild\b|\bmother\b|\bfather\b|\bbrother\b|\bsister\b|\bfriend\b|\bcountry\b|\btown\b|\bvillage\b|\bcity\b|\bpark\b|\bgarden\b|\byard\b|\bfarm\b|\broom\b|\bhouse\b|\bcar\b|\bvehicle\b|\bmoney\b|\bgold\b|\byen\b|\bcircle\b|\bround\b|\bwhat\b/i.test(meaning);
  const source = preferKun ? [...(meta.kun || []), ...(meta.on || [])] : [...(meta.on || []), ...(meta.kun || [])];
  const readings = source
    .map((value) => toHiragana(value))
    .filter(Boolean)
    .map((value) => value.replace(/\./g, ""))
    .filter((value, index, array) => array.indexOf(value) === index);
  return readings[0] || target;
}

function adjectiveLikeMeaning(meaning) {
  return /\bbig\b|\blarge\b|\bsmall\b|\blong\b|\bshort\b|\bhigh\b|\btall\b|\blow\b|\bfar\b|\bdistant\b|\bnear\b|\bclose\b|\bstrong\b|\bweak\b|\bdark\b|\bbright\b|\beasy\b/i.test(meaning);
}

function buildJapaneseHint(target, reading) {
  const meaning = getPrimaryEnglishMeaning(target);
  for (const [pattern, hint] of HINT_RULES) {
    if (pattern.test(meaning)) return hint;
  }
  if (/bad|evil/i.test(meaning)) return "よくない こと";
  if (/dark/i.test(meaning)) return "くらい ようす";
  if (/member|staff/i.test(meaning)) return "なかまの ひと";
  if (/carry|transport/i.test(meaning)) return "はこぶ こと";
  if (/swim/i.test(meaning)) return "およぐ こと";
  if (/center|middle/i.test(meaning)) return "まんなか";
  if (/luck|fortune/i.test(meaning)) return "さいわいな こと";
  if (/easy|simple/i.test(meaning)) return "たやすい こと";
  if (/benefit|profit/i.test(meaning)) return "ために なる こと";
  if (/liquid/i.test(meaning)) return "ながれる えきたい";
  if (/perform|show|play/i.test(meaning)) return "えんじる こと";
  if (/response|reply|answer/i.test(meaning)) return "こたえる こと";
  if (/defend|protect|guard/i.test(meaning)) return "まもる こと";
  if (/expand|wide/i.test(meaning)) return "ひろげる こと";
  if (/cabinet|building/i.test(meaning)) return "たてもの";
  if (/divide|ratio/i.test(meaning)) return "わける こと";
  if (/dry/i.test(meaning)) return "かわかす こと";
  if (/simple|brief/i.test(meaning)) return "かんたんな こと";
  if (/different|strange|unusual/i.test(meaning)) return "ほかと ちがう こと";
  if (/reflect|project/i.test(meaning)) return "うつす こと";
  if (/extend|stretch/i.test(meaning)) return "のばす こと";
  if (/along/i.test(meaning)) return "そって すすむ こと";
  if (/space|universe/i.test(meaning)) return "そらの むこう";
  if (reading.endsWith("い")) return `${reading} ようす`;
  if (/[うくぐすつぬぶむる]$/.test(reading)) return `${reading} こと`;
  return `${reading} ことば`;
}

function buildDefinitionPrompt(target, reading, mode) {
  const meaning = getPrimaryEnglishMeaning(target);
  const display = mode === "read" ? target : `（${reading}）`;
  const category = classifyByGloss(meaning, target);

  if (KANJI_SENTENCE_OVERRIDES[target]) {
    return KANJI_SENTENCE_OVERRIDES[target].replace("{display}", display);
  }

  for (const [pattern, template] of SINGLE_CHAR_SENTENCE_RULES) {
    if (pattern.test(meaning)) {
      return template.replace("{display}", display);
    }
  }

  if (reading.endsWith("い") && adjectiveLikeMeaning(meaning)) {
    return `${display} みちを あるく。`;
  }

  if (/[うくぐすつぬぶむる]$/.test(reading)) {
    return `まいにち ${display}。`;
  }

  if (category === "place") return `${display} へ 行く。`;
  if (category === "person") return `${display} に 会う。`;
  if (category === "book") return `${display} を 読む。`;
  if (category === "nature") return `${display} を 見る。`;
  if (category === "food") return `${display} を 食べる。`;
  if (category === "time") return `きょうは ${display} だ。`;
  if (category === "action") return `みんなで ${display} を する。`;
  if (category === "abstract") return `${display} を 大切に する。`;
  return `${display} を よく 見る。`;
}

function chooseWord(target, grade, mode) {
  const custom = makeCustomEntry(target, mode);
  if (custom) return custom;

  const candidates = getVariantsForKanji(target, grade, mode);
  const preferred = candidates.find((candidate) => (
    EXACT_WORD_EXAMPLES[candidate.written]
    || wordExamples[candidate.written]
  ));
  if (grade <= 3) {
    return preferred || null;
  }

  const backup = candidates.find((candidate) => (
    [...candidate.written].length <= 4
    && candidate.pronounced.length <= 8
    && candidate.score >= 44
  ));
  const selected = preferred || backup || null;
  const threshold = grade >= 5 ? 44 : 52;
  if (!selected || selected.score < threshold) {
    return null;
  }

  return selected;
}

function fallbackWriteWord(target) {
  const reading = preferredReading(target);
  return {
    written: target,
    pronounced: reading,
    category: classifyByGloss((kanjiData.get(target)?.meanings || [])[0] || "", target),
    gloss: "",
    fallback: true,
  };
}

function fallbackReadWord(target) {
  const answer = preferredReading(target);
  return {
    written: target,
    pronounced: answer,
    category: classifyByGloss((kanjiData.get(target)?.meanings || [])[0] || "", target),
    gloss: "",
    fallback: true,
  };
}

function chooseOkuriWord(target) {
  const custom = makeCustomEntry(target, "okuri");
  if (custom) return custom;
  return null;
}

function renderPrompt(grade, word, mode) {
  if (word.fallback) return null;

  const preferred = EXACT_WORD_EXAMPLES[word.written] || wordExamples[word.written];
  if (preferred) {
    const display = mode === "read" ? `「${word.written}」` : `（${word.pronounced}）`;
    return preferred.replace("{}", display);
  }

  for (const [pattern, template] of WORD_PATTERN_EXAMPLES) {
    if (pattern.test(word.gloss || "")) {
      const display = mode === "read" ? `「${word.written}」` : `（${word.pronounced}）`;
      return template.replace("{}", display);
    }
  }

  const category =
    mode === "okuri"
      ? word.category === "adjective" ? "adjective" : "verb"
      : word.category || "thing";

  const template = selectTemplate(grade, category);
  const display = mode === "read" ? word.written : `（${word.pronounced}）`;
  return template.replace("{}", display);
}

function meaningFor(target, word) {
  const meaning = japaneseMeanings[word?.written] || japaneseMeanings[target] || "";
  return /[A-Za-z]/.test(meaning) ? "" : meaning;
}

function shouldIncludeReadQuestion(grade, readWord) {
  if (!readWord) return false;
  if (grade === 4) return true;
  return HARD_READING_WORDS.has(readWord.written);
}

function buildGrade4Prompt(word, mode) {
  const template = wordExamples[word.written];
  if (!template) return mode === "read" ? `「${word.written}」を つかう。` : `（${word.pronounced}）を つかう。`;
  return template.replace("{}", mode === "read" ? `「${word.written}」` : `（${word.pronounced}）`);
}

function buildGrade4Questions() {
  const questions = [];

  grade4Source.forEach((item, index) => {
    const term = termFor(index, grade4Source.length);
    const baseOrder = (index + 1) * 10;

    questions.push({
      id: `g4-${item.kanji}-${index + 1}-write`,
      grade: 4,
      term,
      order: baseOrder + 1,
      text: buildGrade4Prompt({ written: item.writeAnswer, pronounced: item.writeKana }, "write"),
      answer: item.writeAnswer,
      meaning: japaneseMeanings[item.writeAnswer] || "",
    });

    questions.push({
      id: `g4-${item.kanji}-${index + 1}-read`,
      grade: 4,
      term,
      order: baseOrder + 2,
      text: buildGrade4Prompt({ written: item.readWord, pronounced: item.readAnswer }, "read"),
      answer: item.readAnswer,
      meaning: japaneseMeanings[item.readWord] || "",
    });

    if (item.okuriAnswer) {
      questions.push({
        id: `g4-${item.kanji}-${index + 1}-okuri`,
        grade: 4,
        term,
        order: baseOrder + 3,
        text: `${item.okuriPrompt} ように かく。`,
        answer: item.okuriAnswer,
        meaning: "",
      });
    }
  });

  return questions;
}

function buildQuestionsForGrade(grade) {
  const chars = STUDY_KANJI[grade];
  const questions = [];

  chars.forEach((target, index) => {
    const term = termFor(index, chars.length);
    const baseOrder = (index + 1) * 10;

    let writeWord = chooseWord(target, grade, "write") || fallbackWriteWord(target);
    let readWord = chooseWord(target, grade, "read") || writeWord || fallbackReadWord(target);
    const okuriWord = chooseOkuriWord(target);

    let writeText = renderPrompt(grade, writeWord, "write");
    if (!writeText) {
      writeText = buildDefinitionPrompt(target, writeWord.pronounced, "write");
    }
    if (!writeText) {
      writeWord = fallbackWriteWord(target);
      writeText = buildDefinitionPrompt(target, writeWord.pronounced, "write");
    }

    let readText = renderPrompt(grade, readWord, "read");
    if (!readText) {
      readText = buildDefinitionPrompt(target, readWord.pronounced, "read");
    }
    if (!readText) {
      readWord = fallbackReadWord(target);
      readText = buildDefinitionPrompt(target, readWord.pronounced, "read");
    }

    questions.push({
      id: `g${grade}-${target}-${index + 1}-write`,
      grade,
      term,
      order: baseOrder + 1,
      text: writeText,
      answer: writeWord.written,
      meaning: meaningFor(target, writeWord),
    });

    if (shouldIncludeReadQuestion(grade, readWord)) {
      questions.push({
        id: `g${grade}-${target}-${index + 1}-read`,
        grade,
        term,
        order: baseOrder + 2,
        text: readText,
        answer: readWord.pronounced,
        meaning: meaningFor(target, readWord),
      });
    }

    if (
      okuriWord
      && okuriWord.written !== target
      && okuriWord.written !== writeWord.written
    ) {
      questions.push({
        id: `g${grade}-${target}-${index + 1}-okuri`,
        grade,
        term,
        order: baseOrder + 3,
        text: renderPrompt(grade, okuriWord, "okuri"),
        answer: okuriWord.written,
        meaning: meaningFor(target, okuriWord),
      });
    }
  });

  return questions;
}

const gradeQuestions = {};
for (let grade = 1; grade <= 6; grade += 1) {
  gradeQuestions[grade] = grade === 4 ? buildGrade4Questions() : buildQuestionsForGrade(grade);
}

const output = `window.GRADE_QUESTIONS = ${JSON.stringify(gradeQuestions, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, "..", "generated-data.js"), output);
console.log("generated-data.js updated");
