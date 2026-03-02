/**
 * 称号（タイトル）定義
 * プレイヤーの実績に応じて自動的に付与される
 */

export const TITLES = [
  // バトル系
  {
    id: 'first_clear',
    name: 'はじめの一歩',
    description: 'はじめてステージをクリアした',
    icon: '&#x1F463;',
    check: (save) => save.clearedDans.length >= 1,
  },
  {
    id: 'three_clear',
    name: '九九のたまご',
    description: '3つの段をクリアした',
    icon: '&#x1F95A;',
    check: (save) => save.clearedDans.length >= 3,
  },
  {
    id: 'six_clear',
    name: '九九のつかいて',
    description: '6つの段をクリアした',
    icon: '&#x2B50;',
    check: (save) => save.clearedDans.length >= 6,
  },
  {
    id: 'all_clear',
    name: '九九マスター',
    description: 'すべての段をクリアした',
    icon: '&#x1F451;',
    check: (save) => [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => save.clearedDans.includes(d)),
  },
  {
    id: 'final_boss',
    name: 'ムゲンのかちぬし',
    description: '最終ボス ムゲンを倒した',
    icon: '&#x267E;&#xFE0F;',
    check: (save) => save.clearedDans.includes(0),
  },

  // コンボ系
  {
    id: 'combo_3',
    name: 'コンボビギナー',
    description: '3コンボを達成した',
    icon: '&#x1F525;',
    check: (save) => save.maxCombo >= 3,
  },
  {
    id: 'combo_5',
    name: 'コンボファイター',
    description: '5コンボを達成した',
    icon: '&#x1F4A5;',
    check: (save) => save.maxCombo >= 5,
  },
  {
    id: 'combo_9',
    name: 'コンボキング',
    description: '9コンボ（必殺技）を達成した',
    icon: '&#x1F31F;',
    check: (save) => save.maxCombo >= 9,
  },

  // 必殺技系
  {
    id: 'first_skill',
    name: 'ひっさつデビュー',
    description: 'はじめて必殺技を発動した',
    icon: '&#x26A1;',
    check: (save) => save.skillCount >= 1,
  },
  {
    id: 'skill_10',
    name: 'ひっさつのたつじん',
    description: '必殺技を10回以上発動した',
    icon: '&#x1F4AB;',
    check: (save) => save.skillCount >= 10,
  },

  // ダメージ系
  {
    id: 'damage_1000',
    name: 'ダメージディーラー',
    description: '総ダメージ1,000以上',
    icon: '&#x1F4AA;',
    check: (save) => save.totalDamage >= 1000,
  },
  {
    id: 'damage_10000',
    name: 'デストロイヤー',
    description: '総ダメージ10,000以上',
    icon: '&#x1F4A3;',
    check: (save) => save.totalDamage >= 10000,
  },

  // とっくん系
  {
    id: 'training_first',
    name: 'れんしゅう家',
    description: 'とっくんモードで練習した',
    icon: '&#x1F4D6;',
    check: (save) => {
      if (!save.trainingRecords) return false;
      return Object.keys(save.trainingRecords).length >= 1;
    },
  },
  {
    id: 'training_all',
    name: 'ぜんだんマスター',
    description: '全ての段をとっくんした',
    icon: '&#x1F393;',
    check: (save) => {
      if (!save.trainingRecords) return false;
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => save.trainingRecords[d]);
    },
  },
  {
    id: 'training_perfect',
    name: 'パーフェクト',
    description: 'とっくんで全問正解を達成した',
    icon: '&#x1F4AF;',
    check: (save) => {
      if (!save.trainingRecords) return false;
      return Object.values(save.trainingRecords).some((r) => r.perfectCount > 0);
    },
  },

  // タイムアタック系
  {
    id: 'timeattack_clear',
    name: 'スピードスター',
    description: 'タイムアタックを完走した',
    icon: '&#x23F1;&#xFE0F;',
    check: (save) => save.timeAttackBest != null,
  },
  {
    id: 'timeattack_fast',
    name: 'そくどのおに',
    description: 'タイムアタック3分以内クリア',
    icon: '&#x1F3CE;&#xFE0F;',
    check: (save) => save.timeAttackBest != null && save.timeAttackBest <= 180000,
  },
];

/**
 * セーブデータから獲得済みの称号一覧を返す
 */
export function getEarnedTitles(save) {
  if (!save) return [];
  return TITLES.filter((t) => t.check(save));
}

/**
 * 全称号数に対する獲得率
 */
export function getTitleProgress(save) {
  const earned = getEarnedTitles(save);
  return { earned: earned.length, total: TITLES.length };
}
