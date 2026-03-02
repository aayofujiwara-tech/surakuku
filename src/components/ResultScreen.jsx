export default function ResultScreen({ battleResult, onRetry, onReturn, onBackToTitle }) {
  return (
    <div className="result-screen">
      <button className="back-to-title-btn" onClick={onBackToTitle}>
        ← タイトル
      </button>
      <h2 className="screen-title">ざんねん...</h2>
      <p className="result-message">もういちどチャレンジしよう！</p>

      <div className="battle-stats">
        <div className="stat-row">
          <span className="stat-label">最大コンボ</span>
          <span className="stat-value">{battleResult?.maxCombo || 0}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">総ダメージ</span>
          <span className="stat-value">{(battleResult?.totalDamage || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="result-buttons">
        <button className="primary-btn" onClick={onRetry}>
          もういちど
        </button>
        <button className="secondary-btn" onClick={onReturn}>
          マップにもどる
        </button>
      </div>
    </div>
  );
}
