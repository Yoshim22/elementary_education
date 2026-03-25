const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadData() {
  const filePath = path.join(__dirname, "../../data.js");
  const code = fs.readFileSync(filePath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window;
}

function inferCategory(written, example) {
  const source = `${written} ${example}`;

  if (/(学校|クラス|テスト|ノート|辞典|発表|宿題|授業|会議|説明|文字|意味)/.test(source)) {
    return "study";
  }
  if (/(実験|観察|気温|気候|温度|胃液|発芽|体積|面積|図形|半径|直径|量|氷|塩水)/.test(source)) {
    return "science";
  }
  if (/(地域|郡|都道府県|商店街|国旗|観光|警察|議会|選挙|港|漁業|交通|社会)/.test(source)) {
    return "society";
  }
  if (/(試合|競技|走る|記録|運動|応援)/.test(source)) {
    return "sports";
  }
  if (/(料理|ご飯|梅干し|食器|衣服|荷物|夫婦|約束|日記|家族)/.test(source)) {
    return "life";
  }

  return "general";
}

const { GRADE4_KANJI = [], WORD_EXAMPLES = {} } = loadData();

const EXAMPLE_OVERRIDES = {
  愛情: "かぞくへの {} を たいせつに する。",
  順位: "かけっこの {} が はっぴょうされた。",
  感覚: "手ざわりの ちがいを {} で たしかめる。",
  関係: "二つの できごとの {} を 考える。",
  郡部: "その {} の くらしを 社会で 学ぶ。",
  訓練: "ひなんの {} を くり返す。",
  芸名: "その かしゅの {} を おぼえる。",
  約束: "友だちと {} を する。",
  特典: "さんかした 人に {} が つく。",
  梅干し: "おにぎりに {} を 入れる。",
  ご飯: "あさの {} を しっかり 食べる。",
  夫婦: "なかよしの {} が 店を きりもりする。",
  粉物: "{} の りょうりを みんなで 作る。",
  兵隊: "むかしの {} の くらしを 学ぶ。",
  別々: "色ごとに {} に 分けて しまう。",
  辺り一帯: "この {} に 雪が つもった。",
  変化: "空の 色の {} に 気づく。",
  郵便: "{} を ポストに 入れる。",
  荷物: "重い {} を ふたりで はこぶ。",
  無理: "つかれた ときは {} を しない。",
  塩水: "水に しおを 入れて {} を 作る。",
  機械: "工場で {} が 正しく うごく。",
  希望: "しょうらいの {} を 書く。",
  季節: "{} の うつりかわりを かんじる。",
  共同: "ちいきで {} の 作業を する。",
  半径: "円の {} を はかる。",
  直径: "この 円の {} を 書く。",
  倉庫: "道具を {} に しまう。",
  健康: "{} に 気をつけて 生活する。",
  最初: "{} の 一歩を ふみ出す。",
  照明: "へやの {} を つける。",
  説明: "図を 使って {} する。",
  停車: "えきで 電車が {} する。",
  仲間: "{} と 力を あわせる。",
  不便: "{} な くらしを へらしたい。",
  放送: "校内 {} が 聞こえる。",
  北海道: "{} の 地図を ひらく。",
  満点: "テストで {} を 目ざす。",
  予想: "しあいの 結果を {} する。",
  浴衣: "夏まつりに {} を 着る。",
  理由: "そう考えた {} を 話す。",
  冷水: "{} で 手を あらう。",
  歴史: "{} の 本を 読む。",
  連絡: "先生に {} を 入れる。",
  老人: "{} を いたわる 気もちを もつ。",
  労働: "人びとの {} で 社会が ささえられる。",
  録画: "見たい 番組を {} して おく。",
};

const entries = {};

for (const item of GRADE4_KANJI) {
  const example = EXAMPLE_OVERRIDES[item.writeAnswer] || WORD_EXAMPLES[item.writeAnswer];

  if (!example) {
    throw new Error(`Missing write example for grade 4 answer: ${item.writeAnswer}`);
  }

  entries[item.kanji] = {
    write: {
      written: item.writeAnswer,
      pronounced: item.writeKana,
      category: inferCategory(item.writeAnswer, example),
      example,
    },
  };
}

module.exports = {
  grade: 4,
  entries,
};
