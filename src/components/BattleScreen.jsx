import { useState, useEffect, useRef, useCallback } from 'react';
import { STAGES, COMBO_THRESHOLDS, PLAYER_MAX_HP, FINISH_LINE_RATIO, BOSS_RUSH_COMBO_MULTIPLIER, getDifficulty } from '../data/gameData';
import { generateStageQuestions, generateBossRushQuestion, generateChoices } from '../utils/questionGenerator';
import SlimeSprite from './SlimeSprite';
import EnemySprite from './EnemySprite';

export default function BattleScreen({ stageId, save, onWin, onLose, onQuit, setBattleBackHandler }) {
  const stage = STAGES.find((s) => s.id === stageId);
  const difficulty = getDifficulty(stage.dan || 1);
  const finishLine = Math.floor(stage.hp * FINISH_LINE_RATIO);

  const [questions] = useState(() => generateStageQuestions(stage.dan));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(stage.hp);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty.timeLimit);
  const [inputValue, setInputValue] = useState('');
  const [choices, setChoices] = useState([]);

  // フェーズ管理: 'basic' | 'bossRush'
  const [stagePhase, setStagePhase] = useState('basic');
  const [showFinishHint, setShowFinishHint] = useState(false);
  const [showFinishEffect, setShowFinishEffect] = useState(false);

  // 演出状態
  const [showDamage, setShowDamage] = useState(null);
  const [showComboEffect, setShowComboEffect] = useState(null);
  const [enemyDamaged, setEnemyDamaged] = useState(false);
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [slimeFlash, setSlimeFlash] = useState(false);
  const [isAnswering, setIsAnswering] = useState(true);
  const [battlePhase, setBattlePhase] = useState('playing');
  const [enemyDefeated, setEnemyDefeated] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  // 統計
  const [stats, setStats] = useState({ maxCombo: 0, totalDamage: 0, skillCount: 0, missCount: 0 });

  // Refs to access latest values in callbacks without stale closures
  const comboRef = useRef(combo);
  const enemyHpRef = useRef(enemyHp);
  const playerHpRef = useRef(playerHp);
  const statsRef = useRef(stats);
  const currentIndexRef = useRef(currentIndex);
  const questionsRef = useRef(questions);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const isAnsweringRef = useRef(isAnswering);
  const stagePhaseRef = useRef(stagePhase);
  const lastBRef = useRef(null);
  const pausedRef = useRef(false);

  comboRef.current = combo;
  enemyHpRef.current = enemyHp;
  playerHpRef.current = playerHp;
  statsRef.current = stats;
  currentIndexRef.current = currentIndex;
  questionsRef.current = questions;
  isAnsweringRef.current = isAnswering;
  stagePhaseRef.current = stagePhase;

  const currentQuestion = questions[currentIndex];

  // 4択の選択肢を生成
  useEffect(() => {
    if (currentQuestion && difficulty.answerMode === 'choice') {
      setChoices(generateChoices(currentQuestion.a, currentQuestion.b, currentQuestion.answer, difficulty.level));
    }
  }, [currentIndex]);

  // 数値入力モードのフォーカス
  useEffect(() => {
    if (difficulty.answerMode === 'input' && inputRef.current && isAnswering) {
      inputRef.current.focus();
    }
  }, [currentIndex, isAnswering]);

  const advanceQuestion = () => {
    const idx = currentIndexRef.current;
    const qs = questionsRef.current;
    const phase = stagePhaseRef.current;

    if (phase === 'basic' && idx + 1 < qs.length) {
      // フェーズ1: 基礎問題を進める
      setCurrentIndex(idx + 1);
    } else {
      // フェーズ1終了 or ボスラッシュ中 → ボスラッシュの次の問題
      if (phase === 'basic') {
        setStagePhase('bossRush');
      }
      const lastQ = qs[idx];
      lastBRef.current = lastQ?.b;
      const newQ = generateBossRushQuestion(stage.dan, lastBRef.current);
      qs.push(newQ);
      setCurrentIndex(idx + 1);
    }
    setInputValue('');
    setIsAnswering(true);
  };

  const processAnswer = (isCorrect) => {
    clearInterval(timerRef.current);
    setIsAnswering(false);

    const currentQ = questionsRef.current[currentIndexRef.current];
    if (!currentQ) return;

    if (isCorrect) {
      const prevCombo = comboRef.current;
      const increment = stagePhaseRef.current === 'bossRush' ? BOSS_RUSH_COMBO_MULTIPLIER : 1;
      const newCombo = Math.min(prevCombo + increment, 9);
      setCombo(newCombo);

      // ダメージ計算
      let damage = currentQ.answer;
      let comboEffect = null;
      let isFinishBlow = false;

      // コンボ閾値チェック（大きい方から）— このステップで超えた最大の閾値を適用
      for (let i = COMBO_THRESHOLDS.length - 1; i >= 0; i--) {
        const threshold = COMBO_THRESHOLDS[i];
        if (prevCombo < threshold.combo && newCombo >= threshold.combo) {
          damage = threshold.multiplier * currentQ.answer;
          comboEffect = threshold;
          if (threshold.effect === 'ultimate') {
            setStats((prev) => ({ ...prev, skillCount: prev.skillCount + 1 }));
            isFinishBlow = true;
          }
          break;
        }
      }

      // HP計算: ボスラッシュ中はフィニッシュラインで止める（必殺技以外）
      let newEnemyHp;
      if (isFinishBlow) {
        // 必殺技 → 確殺
        newEnemyHp = 0;
      } else if (stagePhaseRef.current === 'bossRush') {
        // ボスラッシュ中: フィニッシュラインより下にしない
        newEnemyHp = Math.max(finishLine, enemyHpRef.current - damage);
        if (newEnemyHp <= finishLine) {
          setShowFinishHint(true);
        }
      } else {
        // フェーズ1: 通常通りダメージ
        newEnemyHp = Math.max(0, enemyHpRef.current - damage);
      }

      setEnemyHp(newEnemyHp);
      setEnemyDamaged(true);
      setShowDamage({ value: damage, isCombo: !!comboEffect });
      if (comboEffect) {
        setShowComboEffect(comboEffect);
        setSlimeFlash(true);
      }

      setStats((prev) => ({
        ...prev,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        totalDamage: prev.totalDamage + damage,
      }));

      const animDuration = isFinishBlow ? 2000 : comboEffect ? 1500 : 800;

      setTimeout(() => {
        setEnemyDamaged(false);
        setShowDamage(null);
        setShowComboEffect(null);
        setSlimeFlash(false);

        // 必殺技後はコンボをリセット
        if (comboEffect?.effect === 'ultimate') {
          setCombo(0);
        }

        if (isFinishBlow) {
          // 必殺技フィニッシュ → 勝利演出
          setEnemyDefeated(true);
          setTimeout(() => {
            setBattlePhase('won');
            const s = statsRef.current;
            onWin({
              maxCombo: Math.max(s.maxCombo, newCombo),
              totalDamage: s.totalDamage + damage,
              skillCount: s.skillCount + 1,
            });
          }, 1200);
        } else {
          advanceQuestion();
        }
      }, animDuration);
    } else {
      // 不正解
      setCombo(0);
      setStats((prev) => ({ ...prev, missCount: prev.missCount + 1 }));

      if (stagePhaseRef.current === 'bossRush') {
        // ボスラッシュ中: ダメージなし、コンボリセットのみ
        setPlayerDamaged(true);
        setTimeout(() => {
          setPlayerDamaged(false);
          advanceQuestion();
        }, 800);
      } else {
        // フェーズ1: 通常のダメージ処理
        const dmg = difficulty.enemyDamage;
        const newPlayerHp = Math.max(0, playerHpRef.current - dmg);
        setPlayerHp(newPlayerHp);
        setPlayerDamaged(true);

        setTimeout(() => {
          setPlayerDamaged(false);

          if (newPlayerHp <= 0) {
            setBattlePhase('lost');
            const s = statsRef.current;
            onLose({ maxCombo: s.maxCombo, totalDamage: s.totalDamage, skillCount: s.skillCount });
          } else {
            advanceQuestion();
          }
        }, 800);
      }
    }
  };

  // タイマー
  useEffect(() => {
    if (battlePhase !== 'playing' || !isAnswering) return;

    const q = questions[currentIndex];
    const limit = stagePhase === 'bossRush' ? difficulty.bossTimeLimit : difficulty.timeLimit;
    setTimeLeft(limit);

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          // タイムアウト = 不正解扱い
          processAnswer(false);
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, battlePhase, isAnswering]);

  const handleQuitOpen = useCallback(() => {
    pausedRef.current = true;
    setShowQuitDialog(true);
  }, []);

  // ブラウザ戻るボタン用ハンドラを登録
  useEffect(() => {
    if (setBattleBackHandler) {
      setBattleBackHandler(handleQuitOpen);
      return () => setBattleBackHandler(null);
    }
  }, [setBattleBackHandler, handleQuitOpen]);

  const handleQuitCancel = () => {
    pausedRef.current = false;
    setShowQuitDialog(false);
  };

  const handleQuitConfirm = () => {
    clearInterval(timerRef.current);
    onQuit();
  };

  const handleChoiceClick = (value) => {
    if (!isAnsweringRef.current) return;
    processAnswer(value === currentQuestion.answer);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!isAnsweringRef.current || !inputValue) return;
    processAnswer(parseInt(inputValue, 10) === currentQuestion.answer);
  };

  if (!currentQuestion) return null;

  const comboStars = Array.from({ length: 9 }, (_, i) => i < combo);
  const timeLimit = stagePhase === 'bossRush' ? difficulty.bossTimeLimit : difficulty.timeLimit;
  const timePercent = (timeLeft / timeLimit) * 100;
  const hpAtFinishLine = enemyHp <= finishLine && stagePhase === 'bossRush';

  // フェーズラベル
  let phaseLabel;
  if (stagePhase === 'basic') {
    phaseLabel = `きほん ${currentIndex + 1}/9`;
  } else {
    phaseLabel = 'ボスラッシュ！';
  }

  return (
    <div className="battle-screen">
      {/* やめるボタン */}
      {!enemyDefeated && battlePhase === 'playing' && (
        <button className="battle-quit-btn" onClick={handleQuitOpen}>✕</button>
      )}

      {/* フェーズ表示 */}
      <div className={`battle-phase-label ${stagePhase === 'bossRush' ? 'phase-boss-rush' : ''}`}>
        {phaseLabel}
      </div>

      {/* 敵エリア */}
      <div className="battle-enemy-area">
        <div className="enemy-name">{stage.enemyName}</div>
        <div className={`hp-bar enemy-hp-bar ${hpAtFinishLine ? 'hp-bar-critical' : ''}`}>
          <div className="hp-bar-fill" style={{ width: `${(enemyHp / stage.hp) * 100}%` }} />
          {/* フィニッシュラインマーカー */}
          <div className="finish-line-marker" style={{ left: `${FINISH_LINE_RATIO * 100}%` }} />
          <span className="hp-text">{enemyHp} / {stage.hp}</span>
        </div>
        <div className="enemy-sprite-container">
          <EnemySprite stage={stage} size={100} damaged={enemyDamaged} />
          {enemyDefeated && <div className="enemy-defeated-effect" />}
          {showDamage && (
            <div className={`damage-popup ${showDamage.isCombo ? 'combo-damage' : ''}`}>
              {showDamage.value}
            </div>
          )}
        </div>
      </div>

      {/* コンボ技演出 */}
      {showComboEffect && (
        <div className={`combo-effect combo-effect-${showComboEffect.effect}`}>
          {showComboEffect.label}！
        </div>
      )}

      {/* フィニッシュヒント */}
      {showFinishHint && stagePhase === 'bossRush' && !showComboEffect && !enemyDefeated && (
        <div className="finish-hint">ひっさつわざで とどめだ！</div>
      )}

      {/* スライムエリア */}
      <div className={`battle-slime-area ${playerDamaged ? 'player-hit' : ''}`}>
        <SlimeSprite
          attributeId={save.attribute}
          clearedDans={save.clearedDans}
          size={80}
          flash={slimeFlash}
        />
        <div className="hp-bar player-hp-bar">
          <div className="hp-bar-fill player-hp-fill" style={{ width: `${(playerHp / PLAYER_MAX_HP) * 100}%` }} />
          <span className="hp-text">HP {playerHp}</span>
        </div>
      </div>

      {/* コンボ */}
      <div className={`combo-bar ${stagePhase === 'bossRush' ? 'combo-bar-boss-rush' : ''}`}>
        <span className="combo-label">コンボ</span>
        <div className="combo-stars">
          {comboStars.map((filled, i) => (
            <span key={i} className={`combo-star ${filled ? 'filled' : ''}`}>
              {COMBO_THRESHOLDS.find((t) => t.combo === i + 1) ? '◆' : '★'}
            </span>
          ))}
        </div>
        <span className="combo-count">{combo}</span>
      </div>

      {/* 問題 */}
      <div className="question-area">
        <div className="question-text">
          {currentQuestion.a} × {currentQuestion.b} = ?
        </div>
      </div>

      {/* 回答 */}
      {difficulty.answerMode === 'choice' ? (
        <div className="choices-grid">
          {choices.map((choice, i) => (
            <button
              key={`${currentIndex}-${i}`}
              className="choice-button"
              onClick={() => handleChoiceClick(choice)}
              disabled={!isAnswering}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <form className="input-area" onSubmit={handleInputSubmit}>
          <input
            ref={inputRef}
            type="number"
            className="answer-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isAnswering}
            placeholder="こたえを入力"
            autoComplete="off"
          />
          <button type="submit" className="submit-button" disabled={!isAnswering || !inputValue}>
            こたえる！
          </button>
        </form>
      )}

      {/* タイマー */}
      <div className="timer-bar">
        <div
          className={`timer-fill ${timePercent < 30 ? 'timer-danger' : ''}`}
          style={{ width: `${timePercent}%` }}
        />
        <span className="timer-text">{timeLeft.toFixed(1)}秒</span>
      </div>

      {/* やめる確認ダイアログ */}
      {showQuitDialog && (
        <div className="unlock-dialog-overlay">
          <div className="unlock-dialog">
            <p className="unlock-dialog-title">バトルをやめますか？</p>
            <p className="unlock-dialog-message">
              しんちょくは ほぞんされません
            </p>
            <div className="unlock-dialog-buttons">
              <button className="primary-btn" onClick={handleQuitCancel}>つづける</button>
              <button className="secondary-btn" onClick={handleQuitConfirm}>やめる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
