import { ATTRIBUTES, GROWTH_STAGES } from '../data/gameData';
import SlimeSprite, { getGrowthStage } from './SlimeSprite';

export default function SlimeStatus({ save, onBack }) {
  const attr = ATTRIBUTES.find((a) => a.id === save.attribute);
  const stage = getGrowthStage(save.clearedDans);
  const growthInfo = GROWTH_STAGES.find((g) => g.stage === stage) || GROWTH_STAGES[0];

  return (
    <div className="slime-status-screen">
      <h2 className="screen-title">
        {attr.emoji} {attr.name.replace('タネ', 'スライム')}
      </h2>

      <div className="status-slime-display">
        <SlimeSprite
          attributeId={save.attribute}
          clearedDans={save.clearedDans}
          size={160}
        />
      </div>

      <div className="status-growth">
        <div className="growth-stage-label">{growthInfo.label}</div>
        <div className="growth-description">{growthInfo.description}</div>
      </div>

      <div className="status-dan-progress">
        <div className="dan-label">マスター済み</div>
        <div className="dan-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dan) => (
            <span
              key={dan}
              className={`dan-badge ${save.clearedDans.includes(dan) ? 'cleared' : ''}`}
            >
              {dan}
            </span>
          ))}
        </div>
      </div>

      <div className="battle-stats">
        <div className="stat-row">
          <span className="stat-label">最大コンボ</span>
          <span className="stat-value">{save.maxCombo}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">必殺技発動回数</span>
          <span className="stat-value">{save.skillCount}回</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">総ダメージ</span>
          <span className="stat-value">{save.totalDamage.toLocaleString()}</span>
        </div>
      </div>

      <button className="secondary-btn" onClick={onBack}>
        もどる
      </button>
    </div>
  );
}
