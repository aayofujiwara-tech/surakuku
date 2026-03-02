import { STAGES, ATTRIBUTES, GROWTH_STAGES } from '../data/gameData';
import { loadSave } from '../utils/saveManager';
import SlimeSprite, { getGrowthStage } from './SlimeSprite';
import EnemySprite from './EnemySprite';

export default function CollectionScreen({ save, onBack, onBackToTitle }) {
  const clearedSet = new Set(save?.clearedDans || []);
  const attr = ATTRIBUTES.find((a) => a.id === save?.attribute) || ATTRIBUTES[0];
  const currentGrowth = getGrowthStage(save?.clearedDans || []);

  const totalMonsters = STAGES.length;
  const discoveredMonsters = STAGES.filter((s) => clearedSet.has(s.dan)).length;

  return (
    <div className="collection-screen">
      <button className="back-to-title-btn" onClick={onBackToTitle}>
        ← タイトル
      </button>
      <h2 className="screen-title">ずかん</h2>

      {/* タブ切り替え風のセクション分け */}
      <div className="collection-section">
        <h3 className="collection-section-title">
          モンスター図鑑
          <span className="collection-count">{discoveredMonsters} / {totalMonsters}</span>
        </h3>

        <div className="collection-monster-grid">
          {STAGES.map((stage) => {
            const discovered = clearedSet.has(stage.dan);
            const record = save?.stageRecords?.[stage.dan];

            return (
              <div
                key={stage.id}
                className={`collection-monster-card ${discovered ? 'discovered' : 'undiscovered'}`}
              >
                <div className="collection-monster-sprite">
                  {discovered ? (
                    <EnemySprite stage={stage} size={60} />
                  ) : (
                    <div className="collection-unknown">?</div>
                  )}
                </div>
                <div className="collection-monster-info">
                  <div className="collection-monster-name">
                    {discovered ? stage.enemyName : '???'}
                  </div>
                  {discovered && (
                    <div className="collection-monster-desc">
                      {stage.enemyDescription}
                    </div>
                  )}
                  {discovered && record && (
                    <div className="collection-monster-record">
                      最大コンボ: {record.maxCombo || 0}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* スライム成長記録 */}
      <div className="collection-section">
        <h3 className="collection-section-title">
          スライム成長記録
        </h3>

        <div className="collection-growth-list">
          {GROWTH_STAGES.map((growth) => {
            const unlocked = currentGrowth >= growth.stage;

            return (
              <div
                key={growth.stage}
                className={`collection-growth-card ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="collection-growth-sprite">
                  {unlocked ? (
                    <SlimeSprite
                      attributeId={save?.attribute || 'fire'}
                      clearedDans={getDansForStage(growth.stage)}
                      size={50}
                      animated={false}
                    />
                  ) : (
                    <div className="collection-unknown collection-unknown-small">?</div>
                  )}
                </div>
                <div className="collection-growth-info">
                  <div className="collection-growth-name">
                    {unlocked ? growth.label : '???'}
                  </div>
                  {unlocked && (
                    <div className="collection-growth-desc">
                      {growth.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* マイルストーン */}
      {save?.milestones && Object.keys(save.milestones).length > 0 && (
        <div className="collection-section">
          <h3 className="collection-section-title">マイルストーン</h3>
          <div className="collection-milestones">
            {save.milestones.firstSkill && (
              <div className="milestone-card">
                <span className="milestone-icon">&#x2728;</span>
                <div className="milestone-info">
                  <div className="milestone-name">はじめての必殺技</div>
                  <div className="milestone-date">
                    {new Date(save.milestones.firstSkill).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            )}
            {save.milestones.allCleared && (
              <div className="milestone-card">
                <span className="milestone-icon">&#x1F451;</span>
                <div className="milestone-info">
                  <div className="milestone-name">全段クリア</div>
                  <div className="milestone-date">
                    {new Date(save.milestones.allCleared).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="secondary-btn" onClick={onBack}>
        もどる
      </button>
    </div>
  );
}

// 成長段階に必要な最低限のクリア段を返す（表示用）
function getDansForStage(stage) {
  switch (stage) {
    case 0: return [];
    case 1: return [1, 2];
    case 2: return [1, 2, 3, 4];
    case 3: return [1, 2, 3, 4, 5, 6];
    case 4: return [1, 2, 3, 4, 5, 6, 7, 8];
    case 5: return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    case 6: return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    default: return [];
  }
}
