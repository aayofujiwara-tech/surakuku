/**
 * localStorage を使ったセーブ/ロードマネージャー
 */

const SAVE_KEY = 'surakuku_save';

const DEFAULT_SAVE = {
  attribute: null,       // 選択した属性タネ ID
  clearedDans: [],       // クリアした段の配列
  maxCombo: 0,           // 最大コンボ数
  totalDamage: 0,        // 総ダメージ
  skillCount: 0,         // 必殺技発動回数
  milestones: {},        // マイルストーン記録
  stageRecords: {},      // ステージごとの記録
  trainingRecords: {},   // とっくんモードの記録（段ごと）
  timeAttackBest: null,  // タイムアタック最速記録（ミリ秒）
};

export function loadSave() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      return { ...DEFAULT_SAVE, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('セーブデータの読み込みに失敗:', e);
  }
  return null;
}

export function saveSave(saveData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('セーブデータの保存に失敗:', e);
  }
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function createNewSave(attributeId) {
  const save = { ...DEFAULT_SAVE, attribute: attributeId };
  saveSave(save);
  return save;
}

export function updateSaveAfterBattle(save, { dan, maxCombo, totalDamage, skillCount }) {
  const updated = { ...save };

  // 段をクリア済みに追加
  if (!updated.clearedDans.includes(dan)) {
    updated.clearedDans = [...updated.clearedDans, dan];
  }

  // 最大コンボ更新
  if (maxCombo > updated.maxCombo) {
    updated.maxCombo = maxCombo;
  }

  // 総ダメージ加算
  updated.totalDamage += totalDamage;

  // 必殺技発動回数加算
  updated.skillCount += skillCount;

  // ステージ記録
  updated.stageRecords[dan] = {
    cleared: true,
    maxCombo: Math.max(maxCombo, updated.stageRecords[dan]?.maxCombo || 0),
    bestDamage: Math.max(totalDamage, updated.stageRecords[dan]?.bestDamage || 0),
  };

  // マイルストーン
  if (skillCount > 0 && !updated.milestones.firstSkill) {
    updated.milestones.firstSkill = new Date().toISOString();
  }
  if (updated.clearedDans.length === 9 && !updated.milestones.allCleared) {
    updated.milestones.allCleared = new Date().toISOString();
  }

  saveSave(updated);
  return updated;
}

export function updateSaveAfterTraining(save, { dan, time, mistakes, perfect }) {
  const updated = { ...save };
  if (!updated.trainingRecords) updated.trainingRecords = {};

  const prev = updated.trainingRecords[dan];
  updated.trainingRecords[dan] = {
    bestTime: prev?.bestTime ? Math.min(prev.bestTime, time) : time,
    perfectCount: (prev?.perfectCount || 0) + (perfect ? 1 : 0),
    totalAttempts: (prev?.totalAttempts || 0) + 1,
  };

  saveSave(updated);
  return updated;
}

export function unlockAllStages(existingSave) {
  const base = existingSave || { ...DEFAULT_SAVE };
  const updated = {
    ...base,
    attribute: null,
    clearedDans: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  };
  saveSave(updated);
  return updated;
}

export function updateSaveAfterTimeAttack(save, { time }) {
  const updated = { ...save };
  if (!updated.timeAttackBest || time < updated.timeAttackBest) {
    updated.timeAttackBest = time;
  }
  saveSave(updated);
  return updated;
}
