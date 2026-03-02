import { loadSave } from '../utils/saveManager';

export default function TrainingSelect({ onSelectDan, onTimeAttack, onBack }) {
  const save = loadSave();
  const trainingRecords = save?.trainingRecords || {};

  const formatTime = (ms) => {
    if (!ms) return '--:--';
    const sec = Math.floor(ms / 1000);
    const decimal = Math.floor((ms % 1000) / 100);
    return `${sec}.${decimal}秒`;
  };

  return (
    <div className="training-select-screen">
      <h2 className="screen-title">とっくんモード</h2>
      <p className="screen-description">
        れんしゅうしたい段をえらんでね！
      </p>

      <div className="training-dan-list">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dan) => {
          const record = trainingRecords[dan];
          return (
            <button
              key={dan}
              className="training-dan-card"
              onClick={() => onSelectDan(dan)}
            >
              <div className="training-dan-number">{dan}の段</div>
              <div className="training-dan-preview">
                {dan} × 1 = {dan} 〜 {dan} × 9 = {dan * 9}
              </div>
              {record && (
                <div className="training-dan-record">
                  ベスト: {formatTime(record.bestTime)} | 全問正解: {record.perfectCount || 0}回
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="training-all-dan">
        <button
          className="training-dan-card training-all"
          onClick={() => onSelectDan(0)}
        >
          <div className="training-dan-number">ぜんぶミックス</div>
          <div className="training-dan-preview">
            1〜9の段をランダムに出題
          </div>
          {trainingRecords[0] && (
            <div className="training-dan-record">
              ベスト: {formatTime(trainingRecords[0].bestTime)} | 全問正解: {trainingRecords[0].perfectCount || 0}回
            </div>
          )}
        </button>
      </div>

      <div className="training-timeattack">
        <button
          className="training-dan-card training-timeattack-card"
          onClick={onTimeAttack}
        >
          <div className="training-dan-number">タイムアタック</div>
          <div className="training-dan-preview">
            全81問（1×1 〜 9×9）を最速で！
          </div>
          {save?.timeAttackBest && (
            <div className="training-dan-record">
              ベスト: {formatTime(save.timeAttackBest)}
            </div>
          )}
        </button>
      </div>

      <button className="secondary-btn" onClick={onBack}>
        もどる
      </button>
    </div>
  );
}
