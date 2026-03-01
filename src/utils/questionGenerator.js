/**
 * 九九の問題を生成するユーティリティ
 */

// ステージの出題構成を生成
// 前半（基礎）: ×1 → ×2 → ... → ×9（順番に9問）
// 後半（応用）: ランダム5問
// ボスラッシュ: ランダム3問
export function generateStageQuestions(dan) {
  const questions = [];

  // 全段ミックス（最終ボス）
  if (dan === 0) {
    for (let i = 0; i < 17; i++) {
      const randomDan = Math.floor(Math.random() * 9) + 1;
      const randomMultiplier = Math.floor(Math.random() * 9) + 1;
      questions.push({
        a: randomDan,
        b: randomMultiplier,
        answer: randomDan * randomMultiplier,
        phase: i < 9 ? 'basic' : i < 14 ? 'advanced' : 'boss',
      });
    }
    return questions;
  }

  // 前半（基礎）: 順番に9問
  for (let i = 1; i <= 9; i++) {
    questions.push({
      a: dan,
      b: i,
      answer: dan * i,
      phase: 'basic',
    });
  }

  // 後半（応用）: ランダム5問
  for (let i = 0; i < 5; i++) {
    const b = Math.floor(Math.random() * 9) + 1;
    questions.push({
      a: dan,
      b,
      answer: dan * b,
      phase: 'advanced',
    });
  }

  // ボスラッシュ: ランダム3問
  for (let i = 0; i < 3; i++) {
    const b = Math.floor(Math.random() * 9) + 1;
    questions.push({
      a: dan,
      b,
      answer: dan * b,
      phase: 'boss',
    });
  }

  return questions;
}

// 4択の選択肢を生成（正解1つ + 誤答3つ）
export function generateChoices(correctAnswer, dan) {
  const choices = new Set([correctAnswer]);

  // 紛らわしい誤答を生成
  while (choices.size < 4) {
    let wrong;
    const strategy = Math.random();

    if (strategy < 0.3) {
      // 隣の段の答え
      const nearDan = dan + (Math.random() < 0.5 ? 1 : -1);
      const b = Math.floor(Math.random() * 9) + 1;
      wrong = Math.max(1, nearDan) * b;
    } else if (strategy < 0.6) {
      // ±1〜9のずれ
      wrong = correctAnswer + (Math.floor(Math.random() * 9) + 1) * (Math.random() < 0.5 ? 1 : -1);
    } else {
      // 同じ段のランダムな答え
      wrong = dan * (Math.floor(Math.random() * 9) + 1);
    }

    if (wrong > 0 && wrong !== correctAnswer) {
      choices.add(wrong);
    }
  }

  // シャッフル
  return [...choices].sort(() => Math.random() - 0.5);
}
