import { ATTRIBUTES, GROWTH_STAGES } from '../data/gameData';
import { getEarnedTitles, getTitleProgress, TITLES } from '../data/titles';
import SlimeSprite, { getGrowthStage } from './SlimeSprite';

export default function SlimeStatus({ save, onBack }) {
  const attr = ATTRIBUTES.find((a) => a.id === save.attribute);
  const stage = getGrowthStage(save.clearedDans);
  const growthInfo = GROWTH_STAGES.find((g) => g.stage === stage) || GROWTH_STAGES[0];
  const earnedTitles = getEarnedTitles(save);
  const { earned, total } = getTitleProgress(save);

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

      {/* 称号セクション */}
      <div className="titles-section">
        <div className="titles-header">
          <span className="titles-label">しょうごう</span>
          <span className="titles-progress">{earned} / {total}</span>
        </div>
        <div className="titles-grid">
          {TITLES.map((title) => {
            const isEarned = earnedTitles.some((t) => t.id === title.id);
            return (
              <div
                key={title.id}
                className={`title-badge ${isEarned ? 'earned' : 'locked'}`}
                title={isEarned ? `${title.name}: ${title.description}` : '???'}
              >
                <span
                  className="title-icon"
                  dangerouslySetInnerHTML={{ __html: isEarned ? title.icon : '&#x1F512;' }}
                />
                <span className="title-name">
                  {isEarned ? title.name : '???'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button className="secondary-btn" onClick={onBack}>
        もどる
      </button>
    </div>
  );
}
