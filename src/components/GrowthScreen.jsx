import { useEffect } from 'react';
import { GROWTH_STAGES } from '../data/gameData';
import SlimeSprite, { getGrowthStage } from './SlimeSprite';

export default function GrowthScreen({ save, battleResult, stageDan, onHintSeen, onContinue }) {
  const stage = getGrowthStage(save.clearedDans);
  const growthInfo = GROWTH_STAGES.find((g) => g.stage === stage) || GROWTH_STAGES[0];

  // ムゲン（dan: 0）初回撃破時にヒントフラグを更新
  const showHint = stageDan === 0 && !save.hasSeenHint;

  useEffect(() => {
    if (showHint && onHintSeen) {
      onHintSeen();
    }
  }, [showHint, onHintSeen]);

  return (
    <div className="growth-screen">
      <h2 className="screen-title">ステージクリア！</h2>

      <div className="growth-slime-display">
        <SlimeSprite
          attributeId={save.attribute}
          clearedDans={save.clearedDans}
          size={160}
        />
      </div>

      <div className="growth-info">
        <div className="growth-stage-label">{growthInfo.label}</div>
        <div className="growth-description">{growthInfo.description}</div>
      </div>

      <div className="battle-stats">
        <div className="stat-row">
          <span className="stat-label">最大コンボ</span>
          <span className="stat-value">{battleResult.maxCombo}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">総ダメージ</span>
          <span className="stat-value">{battleResult.totalDamage.toLocaleString()}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">必殺技</span>
          <span className="stat-value">{battleResult.skillCount}回</span>
        </div>
      </div>

      {showHint && (
        <div className="secret-hint">
          <div className="secret-hint-icon">🔮</div>
          <div className="secret-hint-label">ひみつのことば</div>
          <div className="secret-hint-text">
            「はじまりの もじを 10かい たたけば
            <br />
            すべてのカタチが ひらかれる」
          </div>
        </div>
      )}

      <button className="primary-btn" onClick={onContinue}>
        つぎへ
      </button>
    </div>
  );
}
