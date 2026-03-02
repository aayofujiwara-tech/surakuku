// ステージデータ（全9段＋最終ボス）
export const STAGES = [
  {
    id: 1,
    dan: 1,
    enemyName: 'イチモク',
    enemyDescription: '一つ目の小さな不定形',
    hp: 100,
    emoji: '👁️',
  },
  {
    id: 2,
    dan: 2,
    enemyName: 'ニブンカ',
    enemyDescription: '2つに分裂する',
    hp: 150,
    emoji: '🫧',
  },
  {
    id: 3,
    dan: 3,
    enemyName: 'サンカク',
    enemyDescription: '三角形のトゲトゲ',
    hp: 200,
    emoji: '🔺',
  },
  {
    id: 4,
    dan: 4,
    enemyName: 'シカクイ',
    enemyDescription: '四角い壁モンスター',
    hp: 260,
    emoji: '🟧',
  },
  {
    id: 5,
    dan: 5,
    enemyName: 'ゴボウシ',
    enemyDescription: '星型の中ボス',
    hp: 330,
    emoji: '⭐',
  },
  {
    id: 6,
    dan: 6,
    enemyName: 'ロクロク',
    enemyDescription: '六角形の回転体',
    hp: 400,
    emoji: '🔷',
  },
  {
    id: 7,
    dan: 7,
    enemyName: 'ナナイロ',
    enemyDescription: '虹色に変化する',
    hp: 480,
    emoji: '🌈',
  },
  {
    id: 8,
    dan: 8,
    enemyName: 'ハチマキ',
    enemyDescription: '8本腕のタコ型',
    hp: 560,
    emoji: '🐙',
  },
  {
    id: 9,
    dan: 9,
    enemyName: 'キュウキョク',
    enemyDescription: '9つの顔を持つ',
    hp: 560,
    emoji: '🎭',
  },
  {
    id: 10,
    dan: 0, // 全段ミックス
    enemyName: 'ムゲン',
    enemyDescription: '無限に形が変わる',
    hp: 800,
    emoji: '♾️',
  },
];

// 属性タネデータ
export const ATTRIBUTES = [
  {
    id: 'fire',
    name: 'ほのおのタネ',
    color: '#FF6B35',
    gradientFrom: '#FF6B35',
    gradientTo: '#FFD700',
    completeName: '炎をまとった獣型',
    skillName: '火柱ドーン',
    emoji: '🔥',
  },
  {
    id: 'water',
    name: 'みずのタネ',
    color: '#4FC3F7',
    gradientFrom: '#4FC3F7',
    gradientTo: '#0288D1',
    completeName: '流線型の魚竜型',
    skillName: '大波ザバーン',
    emoji: '🌊',
  },
  {
    id: 'wind',
    name: 'かぜのタネ',
    color: '#81C784',
    gradientFrom: '#81C784',
    gradientTo: '#2E7D32',
    completeName: '翼を持つ鳥型',
    skillName: '竜巻ビュオオ',
    emoji: '🌪️',
  },
  {
    id: 'light',
    name: 'ひかりのタネ',
    color: '#FFD54F',
    gradientFrom: '#FFD54F',
    gradientTo: '#FFFFFF',
    completeName: '光る精霊型',
    skillName: '閃光ピカーン',
    emoji: '✨',
  },
];

// コンボ閾値と倍率
export const COMBO_THRESHOLDS = [
  { combo: 3, label: '小技', multiplier: 3, effect: 'small' },
  { combo: 5, label: '中技', multiplier: 5, effect: 'medium' },
  { combo: 9, label: '必殺技', multiplier: 9, effect: 'ultimate' },
];

// 難易度設定
export const DIFFICULTY = {
  easy: {
    label: '1〜3の段',
    answerMode: 'choice', // 4択
    timeLimit: 8,
    bossTimeLimit: 5,
    enemyDamage: 5,
  },
  medium: {
    label: '4〜6の段',
    answerMode: 'choice', // 4択（紛らわしい選択肢）
    timeLimit: 6,
    bossTimeLimit: 4,
    enemyDamage: 10,
  },
  hard: {
    label: '7〜9の段',
    answerMode: 'input', // 数値直接入力
    timeLimit: 5,
    bossTimeLimit: 3,
    enemyDamage: 15,
  },
};

// スライム成長段階
export const GROWTH_STAGES = [
  { stage: 0, label: '第0形態', description: '完全な不定形。ぷるぷるした丸いスライム', requiredDans: [] },
  { stage: 1, label: '第1形態', description: 'うっすら目が現れる', requiredDans: [1, 2] },
  { stage: 2, label: '第2形態', description: '耳のような突起＋口が現れる', requiredDans: [3, 4] },
  { stage: 3, label: '第3形態', description: '手足の輪郭が見える。色が鮮やかに', requiredDans: [5, 6] },
  { stage: 4, label: '第4形態', description: 'はっきりした体形。装飾が増える', requiredDans: [7, 8] },
  { stage: 5, label: '完全体', description: '完全なカタチ。個性的なデザインに', requiredDans: [9] },
  { stage: 6, label: '究極体', description: '光るエフェクト＋王冠など特別装飾', requiredDans: [0] },
];

// 段 → 難易度マッピング
export function getDifficulty(dan) {
  if (dan >= 1 && dan <= 3) return { ...DIFFICULTY.easy, level: 'easy' };
  if (dan >= 4 && dan <= 6) return { ...DIFFICULTY.medium, level: 'medium' };
  return { ...DIFFICULTY.hard, level: 'hard' };
}

// プレイヤーHP
export const PLAYER_MAX_HP = 100;

// フィニッシュライン（敵HPの何%以下で必殺技待ちに入るか）
export const FINISH_LINE_RATIO = 0.2;
