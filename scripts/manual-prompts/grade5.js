const makeEntry = (written, pronounced, category, example) => ({
  written,
  pronounced,
  category,
  example,
});

module.exports = {
  grade: 5,
  entries: {
    圧: {
      write: makeEntry("気圧", "きあつ", "nature", "天気よほうで {} の 変化を 調べる。"),
    },
    移: {
      write: makeEntry("移動", "いどう", "action", "見学では 列で {} する。"),
    },
    因: {
      write: makeEntry("原因", "げんいん", "abstract", "じこが 起きた {} を 考える。"),
    },
    永: {
      write: makeEntry("永久", "えいきゅう", "abstract", "平和が {} に 続くと よい。"),
    },
    営: {
      write: makeEntry("営業", "えいぎょう", "action", "店の {} 時間を たしかめる。"),
    },
    衛: {
      write: makeEntry("衛生", "えいせい", "abstract", "手洗いを して {} に 気をつける。"),
    },
    易: {
      write: makeEntry("易しい", "やさしい", "adjective", "この せつ明は {}。"),
    },
    益: {
      write: makeEntry("有益", "ゆうえき", "adjective", "この 本は 学習に {} だ。"),
    },
    液: {
      write: makeEntry("液体", "えきたい", "nature", "この {} が こおる 温度を 調べる。"),
    },
    演: {
      write: makeEntry("演技", "えんぎ", "action", "学芸会で {} を する。"),
    },
    応: {
      write: makeEntry("応援", "おうえん", "action", "試合に 出る 友だちを {} する。"),
    },
    往: {
      write: makeEntry("往復", "おうふく", "action", "家と 学校を {} する。"),
    },
    桜: {
      write: makeEntry("桜", "さくら", "nature", "春に {} が さく。"),
    },
    恩: {
      write: makeEntry("恩返し", "おんがえし", "action", "お世話に なった 人に {} を したい。"),
    },
    可: {
      write: makeEntry("可能", "かのう", "adjective", "じっけんが {} か たしかめる。"),
    },
    仮: {
      write: makeEntry("仮名", "かな", "thing", "国語で {} の 使い方を 学ぶ。"),
    },
    価: {
      write: makeEntry("価格", "かかく", "thing", "二つの 品物の {} を くらべる。"),
    },
    河: {
      write: makeEntry("河川", "かせん", "nature", "地図で {} の 流れを たどる。"),
    },
    過: {
      write: makeEntry("過去", "かこ", "time", "{} を ふり返って 学ぶ。"),
    },
    賀: {
      write: makeEntry("年賀状", "ねんがじょう", "thing", "お正月に {} を 出す。"),
    },
    快: {
      write: makeEntry("快晴", "かいせい", "adjective", "遠足の日は {} だった。"),
    },
    解: {
      write: makeEntry("解決", "かいけつ", "action", "みんなで 話し合って 問題を {} する。"),
    },
    格: {
      write: makeEntry("格好", "かっこう", "thing", "運動しやすい {} で 集まる。"),
    },
    確: {
      write: makeEntry("確認", "かくにん", "action", "出発の 前に 持ち物を {} する。"),
    },
    額: {
      write: makeEntry("差額", "さがく", "thing", "二つの ねだんの {} を 計算する。"),
    },
    刊: {
      write: makeEntry("刊行", "かんこう", "action", "新しい 本が {} される。"),
    },
    幹: {
      write: makeEntry("幹線道路", "かんせんどうろ", "place", "地図で {} を たどる。"),
    },
    慣: {
      write: makeEntry("習慣", "しゅうかん", "abstract", "早ね早起きの {} を つける。"),
    },
    眼: {
      write: makeEntry("眼鏡", "めがね", "thing", "本を 読む ときは {} を かける。"),
      read: makeEntry("眼鏡", "めがね", "thing", "{} を かけて 本を 読む。"),
    },
    基: {
      write: makeEntry("基本", "きほん", "abstract", "まず {} を しっかり 覚える。"),
    },
    寄: {
      write: makeEntry("寄付", "きふ", "action", "こまっている 人の ために {} を する。"),
    },
    規: {
      write: makeEntry("規則", "きそく", "abstract", "学校の {} を 守る。"),
    },
    技: {
      write: makeEntry("技術", "ぎじゅつ", "abstract", "くり返し 練習して {} を みがく。"),
    },
    義: {
      write: makeEntry("意義", "いぎ", "abstract", "この 活動の {} を 考える。"),
    },
    逆: {
      write: makeEntry("逆上がり", "さかあがり", "action", "体育で {} の 練習を する。"),
    },
    久: {
      write: makeEntry("久しぶり", "ひさしぶり", "adjective", "{} に 友だちと 会った。"),
    },
    旧: {
      write: makeEntry("旧校舎", "きゅうこうしゃ", "place", "学校の {} を 見学する。"),
    },
    居: {
      write: makeEntry("居間", "いま", "place", "家族が {} に 集まる。"),
    },
    許: {
      write: makeEntry("許可", "きょか", "action", "先生に {} を もらって 入る。"),
    },
    境: {
      write: makeEntry("国境", "こっきょう", "place", "地図で {} の 線を たどる。"),
    },
    均: {
      write: makeEntry("平均", "へいきん", "abstract", "テストの {} 点を 計算する。"),
    },
    禁: {
      write: makeEntry("禁止", "きんし", "abstract", "この 場所は 立ち入り {} だ。"),
    },
    句: {
      write: makeEntry("句読点", "くとうてん", "thing", "文の 終わりに {} を つける。"),
    },
    群: {
      write: makeEntry("群れ", "むれ", "nature", "鳥の {} が 空を 飛ぶ。"),
    },
    経: {
      write: makeEntry("経験", "けいけん", "abstract", "しっぱいも 大切な {} に なる。"),
    },
    潔: {
      write: makeEntry("清潔", "せいけつ", "adjective", "教室を {} に 保つ。"),
    },
    件: {
      write: makeEntry("用件", "ようけん", "abstract", "先生に 話したい {} を 先に まとめる。"),
    },
    券: {
      write: makeEntry("乗車券", "じょうしゃけん", "thing", "駅で {} を 買う。"),
    },
    険: {
      write: makeEntry("危険", "きけん", "adjective", "{} な 場所には 近づかない。"),
    },
    検: {
      write: makeEntry("点検", "てんけん", "action", "出発の 前に 自転車を {} する。"),
    },
    限: {
      write: makeEntry("制限", "せいげん", "abstract", "時間に {} が あるので 急ぐ。"),
    },
    現: {
      write: makeEntry("現れる", "あらわれる", "verb", "月が 雲の 間から {}。"),
    },
    減: {
      write: makeEntry("増減", "ぞうげん", "action", "人数の {} を 記録する。"),
    },
    故: {
      write: makeEntry("故郷", "こきょう", "place", "夏休みに {} を 訪ねる。"),
    },
    個: {
      write: makeEntry("個人", "こじん", "abstract", "{} の ちがいを 大切に する。"),
    },
    護: {
      write: makeEntry("看護", "かんご", "action", "病気の 人を {} する 仕事も ある。"),
    },
    効: {
      write: makeEntry("効率", "こうりつ", "abstract", "作業の {} を 上げる くふうを 考える。"),
    },
    厚: {
      write: makeEntry("厚い", "あつい", "adjective", "{} 本を 図書館で 借りる。"),
    },
    耕: {
      write: makeEntry("耕す", "たがやす", "verb", "春に 畑を {}。"),
    },
    鉱: {
      write: makeEntry("鉱物", "こうぶつ", "thing", "理科で いろいろな {} の 色や 形を くらべる。"),
    },
    構: {
      write: makeEntry("構成", "こうせい", "action", "文の {} を 考えて 作文を 書く。"),
    },
    興: {
      write: makeEntry("興味", "きょうみ", "abstract", "理科に {} を もつ。"),
    },
    講: {
      write: makeEntry("講堂", "こうどう", "place", "学校の {} に 集まる。"),
    },
    混: {
      write: makeEntry("混む", "こむ", "verb", "朝の 電車は よく {}。"),
    },
    査: {
      write: makeEntry("調査", "ちょうさ", "action", "町の ようすを {} して まとめる。"),
    },
    再: {
      write: makeEntry("再利用", "さいりよう", "action", "古い 紙を {} する。"),
    },
    災: {
      write: makeEntry("防災", "ぼうさい", "abstract", "地しんに そなえて {} について 学ぶ。"),
    },
    妻: {
      write: makeEntry("夫妻", "ふさい", "person", "会場に なかのよい {} が 来ていた。"),
    },
    採: {
      write: makeEntry("採用", "さいよう", "action", "話し合いで よい 意見を {} する。"),
    },
    際: {
      write: makeEntry("実際", "じっさい", "abstract", "{} に やってみると むずかしい。"),
    },
    在: {
      write: makeEntry("在校生", "ざいこうせい", "person", "式で {} が 歌を うたう。"),
    },
    財: {
      write: makeEntry("財産", "ざいさん", "abstract", "文化財は 大切な {} だ。"),
    },
    罪: {
      write: makeEntry("罪", "つみ", "abstract", "{} の ない 人を うたがっては いけない。"),
    },
    雑: {
      write: makeEntry("雑音", "ざつおん", "thing", "しずかな 教室では {} が 気に なる。"),
    },
    酸: {
      write: makeEntry("酸素", "さんそ", "thing", "生きものは {} を 取り入れて 生きている。"),
    },
    賛: {
      write: makeEntry("賛成", "さんせい", "action", "わたしは この 意見に {} する。"),
    },
    支: {
      write: makeEntry("支える", "ささえる", "verb", "家族が くらしを {}。"),
    },
    志: {
      write: makeEntry("志す", "こころざす", "verb", "将来は 医師を {}。"),
    },
    枝: {
      write: makeEntry("枝葉", "えだは", "thing", "木の {} が 風で ゆれる。"),
    },
    師: {
      write: makeEntry("医師", "いし", "person", "けがを したので {} に 診てもらう。"),
    },
    資: {
      write: makeEntry("資料", "しりょう", "thing", "発表の ために {} を 集める。"),
    },
    飼: {
      write: makeEntry("飼育", "しいく", "action", "学校で うさぎの {} を する。"),
    },
    示: {
      write: makeEntry("指示", "しじ", "action", "先生の {} を よく 聞く。"),
    },
    似: {
      write: makeEntry("似る", "にる", "verb", "親子の 顔が よく {}。"),
    },
    識: {
      write: makeEntry("知識", "ちしき", "abstract", "読書で {} を 広げる。"),
    },
    質: {
      write: makeEntry("性質", "せいしつ", "abstract", "金ぞくの {} を 実験で 調べる。"),
    },
    舎: {
      write: makeEntry("校舎", "こうしゃ", "place", "雨の日に {} の 中で 待つ。"),
    },
    謝: {
      write: makeEntry("感謝", "かんしゃ", "action", "手つだってくれた 人に {} を 伝える。"),
    },
    授: {
      write: makeEntry("授業", "じゅぎょう", "action", "次の {} で 発表する。"),
    },
    修: {
      write: makeEntry("修理", "しゅうり", "action", "こわれた 自転車を {} する。"),
    },
    述: {
      write: makeEntry("述べる", "のべる", "verb", "自分の 考えを {}。"),
    },
    術: {
      write: makeEntry("美術", "びじゅつ", "thing", "美術館で {} 作品を 見る。"),
    },
    準: {
      write: makeEntry("準備", "じゅんび", "action", "出発の 前に {} を すませる。"),
    },
    序: {
      write: makeEntry("順序", "じゅんじょ", "abstract", "作業の {} を 考えて 進める。"),
    },
    招: {
      write: makeEntry("招待", "しょうたい", "action", "友だちを 家に {} する。"),
    },
    承: {
      write: makeEntry("承知", "しょうち", "action", "先生の 話を よく {} しました。"),
    },
    証: {
      write: makeEntry("証拠", "しょうこ", "thing", "たしかな {} を 集める。"),
    },
    条: {
      write: makeEntry("条件", "じょうけん", "abstract", "試合に 出るには {} が ある。"),
    },
    状: {
      write: makeEntry("案内状", "あんないじょう", "thing", "会の {} が 家に 届く。"),
    },
    常: {
      write: makeEntry("常に", "つねに", "abstract", "{} 安全に 気をつけて 行動する。"),
    },
    情: {
      write: makeEntry("感情", "かんじょう", "abstract", "相手の {} を 想像する。"),
    },
    織: {
      write: makeEntry("組織", "そしき", "thing", "大きな {} では 役目の 分担が 大切だ。"),
    },
    職: {
      write: makeEntry("職員", "しょくいん", "person", "学校の {} に あいさつする。"),
    },
    制: {
      write: makeEntry("制度", "せいど", "abstract", "社会で いろいろな {} を 学ぶ。"),
    },
    性: {
      write: makeEntry("性格", "せいかく", "abstract", "友だちの {} を 認め合う。"),
    },
    政: {
      write: makeEntry("政治", "せいじ", "abstract", "社会で {} の しくみを 学ぶ。"),
    },
    勢: {
      write: makeEntry("勢い", "いきおい", "abstract", "ボールの {} が 強すぎた。"),
    },
    精: {
      write: makeEntry("精一杯", "せいいっぱい", "action", "{} がんばった。"),
    },
    製: {
      write: makeEntry("製図", "せいず", "action", "図を 正しく かく {} を 学ぶ。"),
    },
    税: {
      write: makeEntry("税金", "ぜいきん", "thing", "社会で {} の しくみを 学ぶ。"),
    },
    責: {
      write: makeEntry("責任", "せきにん", "abstract", "当番の 仕事に {} を もつ。"),
    },
    績: {
      write: makeEntry("成績", "せいせき", "thing", "テストの {} を ふり返る。"),
    },
    接: {
      write: makeEntry("接する", "せっする", "verb", "年下の 子にも やさしく {}。"),
    },
    設: {
      write: makeEntry("建設", "けんせつ", "action", "新しい 橋を {} する 工事が 進む。"),
    },
    舌: {
      write: makeEntry("舌", "した", "thing", "熱い 物で {} を やけどした。"),
    },
    絶: {
      write: makeEntry("絶対", "ぜったい", "abstract", "{} に あきらめない。"),
    },
    銭: {
      write: makeEntry("小銭", "こぜに", "thing", "さいふの 中の {} を 数える。"),
    },
    祖: {
      write: makeEntry("祖父", "そふ", "person", "{} から むかしの 話を 聞く。"),
    },
    素: {
      write: makeEntry("素直", "すなお", "adjective", "先生の 助言を {} に 聞く。"),
    },
    総: {
      write: makeEntry("総合", "そうごう", "action", "学習した ことを {} して まとめる。"),
    },
    造: {
      write: makeEntry("造る", "つくる", "verb", "土で 皿を {}。"),
    },
    像: {
      write: makeEntry("映像", "えいぞう", "thing", "きろくした {} を 見返す。"),
    },
    増: {
      write: makeEntry("増える", "ふえる", "verb", "学校の 本が {} と うれしい。"),
    },
    則: {
      write: makeEntry("原則", "げんそく", "abstract", "話し合いの {} を 先に 決める。"),
    },
    測: {
      write: makeEntry("測る", "はかる", "verb", "長さを ものさしで {}。"),
    },
    属: {
      write: makeEntry("金属", "きんぞく", "thing", "理科で {} の 性質を 調べる。"),
    },
    率: {
      write: makeEntry("確率", "かくりつ", "abstract", "さいころの {} を 考える。"),
    },
    損: {
      write: makeEntry("損害", "そんがい", "abstract", "台風の {} が 広がった。"),
    },
    退: {
      write: makeEntry("退く", "しりぞく", "verb", "危ないので 一歩 {}。"),
    },
    貸: {
      write: makeEntry("貸し出し", "かしだし", "action", "図書館で 本の {} を する。"),
    },
    態: {
      write: makeEntry("態度", "たいど", "abstract", "相手に しつ礼のない {} で 話す。"),
    },
    団: {
      write: makeEntry("団体", "だんたい", "thing", "地域の {} で 活動する。"),
    },
    断: {
      write: makeEntry("判断", "はんだん", "action", "話を よく 聞いて {} する。"),
    },
    築: {
      write: makeEntry("建築", "けんちく", "thing", "古い {} の くふうを 学ぶ。"),
    },
    張: {
      write: makeEntry("緊張", "きんちょう", "abstract", "発表の 前で {} する。"),
    },
    提: {
      write: makeEntry("提案", "ていあん", "action", "よい 考えを {} する。"),
    },
    程: {
      write: makeEntry("日程", "にってい", "thing", "旅行の {} が 決まる。"),
    },
    適: {
      write: makeEntry("適した", "てきした", "adjective", "この 道具は その 作業に {}。"),
    },
    敵: {
      write: makeEntry("敵", "てき", "person", "物語の {} と 主人公が 戦う。"),
    },
    統: {
      write: makeEntry("統計", "とうけい", "thing", "集めた 数字を {} に まとめる。"),
    },
    銅: {
      write: makeEntry("銅像", "どうぞう", "thing", "駅前に {} が 立っている。"),
    },
    導: {
      write: makeEntry("指導", "しどう", "action", "先生の {} を 受ける。"),
    },
    徳: {
      write: makeEntry("道徳", "どうとく", "thing", "{} の 時間に 命の 大切さを 学ぶ。"),
    },
    独: {
      write: makeEntry("独自", "どくじ", "adjective", "この クラブは {} の くふうを している。"),
    },
    任: {
      write: makeEntry("任せる", "まかせる", "verb", "当番の 仕事を 友だちに {}。"),
    },
    燃: {
      write: makeEntry("燃える", "もえる", "verb", "まきが よく {}。"),
    },
    能: {
      write: makeEntry("能力", "のうりょく", "abstract", "自分の {} を のばす。"),
    },
    破: {
      write: makeEntry("破れる", "やぶれる", "verb", "古い ふくが {}。"),
    },
    犯: {
      write: makeEntry("犯人", "はんにん", "person", "けいさつが じけんの {} を さがす。"),
    },
    判: {
      write: makeEntry("判定", "はんてい", "action", "しん判が 勝ち負けを {} する。"),
    },
    版: {
      write: makeEntry("版画", "はんが", "thing", "図工で {} を ほる。"),
    },
    比: {
      write: makeEntry("比べる", "くらべる", "verb", "二つの 記録を {}。"),
    },
    肥: {
      write: makeEntry("肥料", "ひりょう", "thing", "畑に {} を まく。"),
    },
    非: {
      write: makeEntry("非常に", "ひじょうに", "abstract", "{} 速い ボールだった。"),
    },
    備: {
      write: makeEntry("設備", "せつび", "thing", "学校の {} を 点検する。"),
    },
    俵: {
      write: makeEntry("土俵", "どひょう", "place", "力士が {} に 上がる。"),
    },
    評: {
      write: makeEntry("評判", "ひょうばん", "abstract", "その 店は {} が よい。"),
    },
    貧: {
      write: makeEntry("貧しい", "まずしい", "adjective", "{} くらしの 国を 社会で 学ぶ。"),
    },
    布: {
      write: makeEntry("毛布", "もうふ", "thing", "ねる 前に {} を かける。"),
    },
    婦: {
      write: makeEntry("夫婦", "ふうふ", "person", "その 店は {} で きりもりしている。"),
    },
    富: {
      write: makeEntry("豊富", "ほうふ", "adjective", "川には 水が {} に ある。"),
    },
    武: {
      write: makeEntry("武士", "ぶし", "person", "社会で むかしの {} の くらしを 学ぶ。"),
    },
    復: {
      write: makeEntry("復習", "ふくしゅう", "action", "家で 今日の {} を する。"),
    },
    複: {
      write: makeEntry("複雑", "ふくざつ", "adjective", "この しくみは 少し {} だ。"),
    },
    仏: {
      write: makeEntry("大仏", "だいぶつ", "thing", "見学で {} を 見上げる。"),
    },
    編: {
      write: makeEntry("編集", "へんしゅう", "action", "学級新聞を {} する。"),
    },
    弁: {
      write: makeEntry("弁当", "べんとう", "thing", "遠足の日は 早起きして {} を 作る。"),
    },
    保: {
      write: makeEntry("保管", "ほかん", "action", "大切な 書類を 箱に 入れて {} する。"),
    },
    墓: {
      write: makeEntry("墓地", "ぼち", "place", "しずかな {} に 花を そなえる。"),
    },
    報: {
      write: makeEntry("報告", "ほうこく", "action", "調べた ことを みんなに {} する。"),
    },
    豊: {
      write: makeEntry("豊か", "ゆたか", "adjective", "自然が {} な 土地で 米を 作る。"),
    },
    防: {
      write: makeEntry("防ぐ", "ふせぐ", "verb", "じこを {} ために ヘルメットを かぶる。"),
    },
    貿: {
      write: makeEntry("貿易", "ぼうえき", "abstract", "日本と 外国の {} は くらしと つながる。"),
    },
    暴: {
      write: makeEntry("暴れる", "あばれる", "verb", "強い 風で 木が {}。"),
    },
    務: {
      write: makeEntry("義務", "ぎむ", "abstract", "子どもにも 学ぶ {} が ある。"),
    },
    夢: {
      write: makeEntry("夢", "ゆめ", "abstract", "将来の {} を ノートに 書く。"),
    },
    迷: {
      write: makeEntry("迷う", "まよう", "verb", "どの 本を 借りるか {}。"),
    },
    綿: {
      write: makeEntry("木綿", "もめん", "thing", "{} の シャツは やわらかい。"),
      read: makeEntry("木綿", "もめん", "thing", "{} の シャツは やわらかい。"),
    },
    輸: {
      write: makeEntry("輸入", "ゆにゅう", "action", "外国から 小麦を {} する。"),
    },
    余: {
      write: makeEntry("余る", "あまる", "verb", "給食の パンが {}。"),
    },
    預: {
      write: makeEntry("預ける", "あずける", "verb", "大切な 荷物を 先生に {}。"),
    },
    容: {
      write: makeEntry("容器", "ようき", "thing", "水を 入れる {} を 用意する。"),
    },
    略: {
      write: makeEntry("省略", "しょうりゃく", "action", "長い あいさつを {} する。"),
    },
    留: {
      write: makeEntry("留守", "るす", "thing", "家が {} の あいだに 電話が あった。"),
    },
    領: {
      write: makeEntry("領土", "りょうど", "thing", "国の {} を 地図で 確かめる。"),
    },
  },
};
