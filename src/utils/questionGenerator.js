/**
 * 九九の問題を生成するユーティリティ
 */

// フェーズ1（基礎）の問題を生成: ×1 → ×9 の順番で9問
export function generateStageQuestions(dan) {
  const questions = [];

  // 全段ミックス（最終ボス）
  if (dan === 0) {
    for (let i = 0; i < 9; i++) {
      const randomDan = Math.floor(Math.random() * 9) + 1;
      const randomMultiplier = Math.floor(Math.random() * 9) + 1;
      questions.push({
        a: randomDan,
        b: randomMultiplier,
        answer: randomDan * randomMultiplier,
        phase: 'basic',
      });
    }
    return questions;
  }

  // 基礎: 順番に9問
  for (let i = 1; i <= 9; i++) {
    questions.push({
      a: dan,
      b: i,
      answer: dan * i,
      phase: 'basic',
    });
  }

  return questions;
}

// ボスラッシュ用のランダム問題を1問生成（前回と被らないようにする）
export function generateBossRushQuestion(dan, lastB) {
  if (dan === 0) {
    // 全段ミックス
    let a, b;
    do {
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * 9) + 1;
    } while (b === lastB && a === dan);
    return { a, b, answer: a * b, phase: 'bossRush' };
  }

  let b;
  do {
    b = Math.floor(Math.random() * 9) + 1;
  } while (b === lastB);
  return { a: dan, b, answer: dan * b, phase: 'bossRush' };
}

// 配列をシャッフル（Fisher-Yates）
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 配列からランダムに1つ選ぶ
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 4択の選択肢を生成（正解1つ + 紛らわしい誤答3つ）
 *
 * @param {number} dan - 段（例: 3）
 * @param {number} n - 掛ける数（例: 7）
 * @param {number} answer - 正解（例: 21）
 * @param {'easy'|'medium'|'hard'} difficultyLevel - 難易度
 * @returns {number[]} シャッフルされた4つの選択肢
 */
export function generateChoices(dan, n, answer, difficultyLevel) {
  // カテゴリ別の候補を生成
  const catA = []; // 同じ段の隣の答え
  const catB = []; // 隣の段の同じ数
  const catC = []; // 正解 ± 小さいズレ
  const catD = []; // 同じ一の位を持つ九九の答え
  const catE = []; // 十の位が同じ九九の答え

  // カテゴリA：同じ段の隣の答え dan × (n ± 1)
  if (n > 1) {
    const v = dan * (n - 1);
    if (v !== answer && v > 0) catA.push(v);
  }
  if (n < 9) {
    const v = dan * (n + 1);
    if (v !== answer && v > 0) catA.push(v);
  }

  // カテゴリB：隣の段の同じ数 (dan ± 1) × n
  if (dan > 1) {
    const v = (dan - 1) * n;
    if (v !== answer && v > 0) catB.push(v);
  }
  if (dan < 9) {
    const v = (dan + 1) * n;
    if (v !== answer && v > 0) catB.push(v);
  }

  // カテゴリC：正解 ± 小さいズレ
  for (const offset of [1, -1, 2, -2, 3, -3]) {
    const v = answer + offset;
    if (v > 0 && v !== answer) catC.push(v);
  }

  // 正解から離れすぎない範囲（正解の大きさに応じて調整）
  const maxDistance = Math.max(15, Math.floor(answer * 0.6));

  // カテゴリD：同じ一の位を持つ九九の答え（距離制限付き）
  const onesDigit = answer % 10;
  for (let d = 1; d <= 9; d++) {
    for (let m = 1; m <= 9; m++) {
      const v = d * m;
      if (v % 10 === onesDigit && v !== answer && Math.abs(v - answer) <= maxDistance) {
        catD.push(v);
      }
    }
  }
  // 重複除去
  const catDUnique = [...new Set(catD)];

  // カテゴリE：十の位が同じ九九の答え
  const tensDigit = Math.floor(answer / 10);
  for (let d = 1; d <= 9; d++) {
    for (let m = 1; m <= 9; m++) {
      const v = d * m;
      if (Math.floor(v / 10) === tensDigit && v !== answer) catE.push(v);
    }
  }
  const catEUnique = [...new Set(catE)];

  const selected = new Set();

  // 選択済みに追加するヘルパー（重複・正解チェック付き）
  const tryAdd = (value) => {
    if (value > 0 && value !== answer && !selected.has(value)) {
      selected.add(value);
      return true;
    }
    return false;
  };

  // カテゴリの候補からまだ選ばれていない値を1つ選ぶ
  const pickFromCategory = (candidates) => {
    const available = candidates.filter((v) => v > 0 && v !== answer && !selected.has(v));
    if (available.length === 0) return false;
    return tryAdd(pickRandom(available));
  };

  if (difficultyLevel === 'medium') {
    // 中難度：A1つ + C1つ（±1〜2の近い値）+ D1つ
    pickFromCategory(catA);
    // Cから ±1〜2 のみ
    const closeCatC = catC.filter((v) => Math.abs(v - answer) <= 2);
    pickFromCategory(closeCatC.length > 0 ? closeCatC : catC);
    pickFromCategory(catDUnique);
  } else {
    // 低難度（デフォルト）：A1つ + B1つ + C〜E1つ
    pickFromCategory(catA);
    pickFromCategory(catB);
    // 残り1つはC〜Eからランダム
    const remaining = [...catC, ...catDUnique, ...catEUnique];
    pickFromCategory(remaining);
  }

  // 足りない場合のフォールバック（全カテゴリから、正解に近い順で補充）
  if (selected.size < 3) {
    const allCandidates = [...new Set([...catA, ...catB, ...catC, ...catDUnique, ...catEUnique])];
    allCandidates.sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer));
    for (const v of allCandidates) {
      if (selected.size >= 3) break;
      tryAdd(v);
    }
  }

  // それでも足りない場合（理論上ほぼないが安全策）
  let emergencyOffset = 1;
  while (selected.size < 3) {
    const v = answer + emergencyOffset;
    if (v > 0) tryAdd(v);
    emergencyOffset = emergencyOffset > 0 ? -emergencyOffset : -emergencyOffset + 1;
  }

  return shuffle([answer, ...selected]);
}

/**
 * シニアモード用の問題を生成
 *
 * @param {'addition'|'subtraction'|'multiplication'} operation - 演算種類
 * @param {'easy'|'normal'} range - 数の範囲（easy: 1-5, normal: 1-9）
 * @param {number} count - 問題数
 * @returns {Array} 問題配列
 */
export function generateSeniorQuestions(operation, range, count = 10) {
  const maxNum = range === 'easy' ? 5 : 9;
  const questions = [];

  for (let i = 0; i < count; i++) {
    let a = Math.floor(Math.random() * maxNum) + 1;
    let b = Math.floor(Math.random() * maxNum) + 1;

    if (operation === 'subtraction') {
      // 引き算は答えが0以上になるようにaを大きい方にする
      if (a < b) [a, b] = [b, a];
    }

    let answer;
    let symbol;
    switch (operation) {
      case 'addition':
        answer = a + b;
        symbol = '＋';
        break;
      case 'subtraction':
        answer = a - b;
        symbol = '−';
        break;
      case 'multiplication':
      default:
        answer = a * b;
        symbol = '×';
        break;
    }

    questions.push({ a, b, answer, symbol, operation });
  }

  return questions;
}

/**
 * シニアモード用の選択肢を生成（4択）
 * 正解に近い紛らわしすぎない値を生成
 *
 * @param {number} answer - 正解
 * @param {string} operation - 演算種類
 * @returns {number[]} シャッフルされた4つの選択肢
 */
export function generateSeniorChoices(answer, operation) {
  const selected = new Set();

  // 正解の近くから候補を生成（±1〜5の範囲）
  const offsets = operation === 'multiplication'
    ? [1, -1, 2, -2, 3, -3, 5, -5, 4, -4]
    : [1, -1, 2, -2, 3, -3];

  for (const offset of offsets) {
    const v = answer + offset;
    if (v >= 0 && v !== answer && !selected.has(v)) {
      selected.add(v);
      if (selected.size >= 3) break;
    }
  }

  // 足りない場合のフォールバック
  let offset = 1;
  while (selected.size < 3) {
    const v = answer + offset;
    if (v >= 0 && !selected.has(v) && v !== answer) selected.add(v);
    offset = offset > 0 ? -offset : -offset + 1;
  }

  return shuffle([answer, ...selected]);
}
