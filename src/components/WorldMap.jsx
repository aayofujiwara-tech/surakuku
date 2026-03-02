import { STAGES } from '../data/gameData';

export default function WorldMap({ save, onSelectStage, onViewSlime, onTraining, onCollection, onBack }) {
  const clearedSet = new Set(save.clearedDans);

  // ステージのアンロック判定
  // 基本的に順番通り。ただし、1の段は最初から解放
  const isUnlocked = (stage) => {
    if (stage.dan === 1) return true;
    if (stage.dan === 0) {
      // 最終ボスは全9段クリアで解放
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => clearedSet.has(d));
    }
    // 前の段がクリア済みか
    return clearedSet.has(stage.dan - 1);
  };

  return (
    <div className="world-map-screen">
      <h2 className="screen-title">ワールドマップ</h2>

      <div className="stage-list">
        {STAGES.map((stage) => {
          const unlocked = isUnlocked(stage);
          const cleared = clearedSet.has(stage.dan);

          return (
            <button
              key={stage.id}
              className={`stage-card ${cleared ? 'cleared' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && onSelectStage(stage.id)}
              disabled={!unlocked}
            >
              <div className="stage-emoji">{unlocked ? stage.emoji : '🔒'}</div>
              <div className="stage-info">
                <div className="stage-name">
                  {stage.dan === 0 ? '最終ステージ' : `ステージ ${stage.dan}`}
                </div>
                <div className="stage-enemy-name">
                  {unlocked ? stage.enemyName : '???'}
                </div>
                {cleared && <div className="stage-cleared-badge">クリア！</div>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="map-actions">
        <button className="action-btn" onClick={onViewSlime}>
          スライム
        </button>
        <button className="action-btn" onClick={onCollection}>
          ずかん
        </button>
        <button className="action-btn" onClick={onTraining}>
          とっくん
        </button>
      </div>

      <button className="secondary-btn" onClick={onBack}>
        もどる
      </button>
    </div>
  );
}
