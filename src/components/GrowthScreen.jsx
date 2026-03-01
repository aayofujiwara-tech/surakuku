import { ATTRIBUTES, GROWTH_STAGES } from '../data/gameData';
import SlimeSprite, { getGrowthStage } from './SlimeSprite';

export default function GrowthScreen({ save, battleResult, onContinue }) {
  const attr = ATTRIBUTES.find((a) => a.id === save.attribute);
  const stage = getGrowthStage(save.clearedDans);
  const growthInfo = GROWTH_STAGES.find((g) => g.stage === stage) || GROWTH_STAGES[0];

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

      <button className="primary-btn" onClick={onContinue}>
        つぎへ
      </button>
    </div>
  );
}
