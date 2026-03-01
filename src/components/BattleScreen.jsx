import { useState, useEffect, useRef } from 'react';
import { STAGES, COMBO_THRESHOLDS, PLAYER_MAX_HP, getDifficulty } from '../data/gameData';
import { generateStageQuestions, generateChoices } from '../utils/questionGenerator';
import SlimeSprite from './SlimeSprite';
import EnemySprite from './EnemySprite';

export default function BattleScreen({ stageId, save, onWin, onLose }) {
  const stage = STAGES.find((s) => s.id === stageId);
  const difficulty = getDifficulty(stage.dan || 1);

  const [questions] = useState(() => generateStageQuestions(stage.dan));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(stage.hp);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty.timeLimit);
  const [inputValue, setInputValue] = useState('');
  const [choices, setChoices] = useState([]);

  // 演出状態
  const [showDamage, setShowDamage] = useState(null);
  const [showComboEffect, setShowComboEffect] = useState(null);
  const [enemyDamaged, setEnemyDamaged] = useState(false);
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [slimeFlash, setSlimeFlash] = useState(false);
  const [isAnswering, setIsAnswering] = useState(true);
  const [battlePhase, setBattlePhase] = useState('playing');

  // 統計
  const [stats, setStats] = useState({ maxCombo: 0, totalDamage: 0, skillCount: 0 });

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

  comboRef.current = combo;
  enemyHpRef.current = enemyHp;
  playerHpRef.current = playerHp;
  statsRef.current = stats;
  currentIndexRef.current = currentIndex;
  questionsRef.current = questions;
  isAnsweringRef.current = isAnswering;

  const currentQuestion = questions[currentIndex];

  // 4択の選択肢を生成
  useEffect(() => {
    if (currentQuestion && difficulty.answerMode === 'choice') {
      setChoices(generateChoices(currentQuestion.answer, currentQuestion.a));
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
    if (idx + 1 < qs.length) {
      setCurrentIndex(idx + 1);
    } else {
      // 全問終了 → 敵HP残りあり = 追加問題
      const baseDan = qs[0].a || Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      qs.push({
        a: baseDan,
        b,
        answer: baseDan * b,
        phase: 'advanced',
      });
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
      const newCombo = comboRef.current + 1;
      setCombo(newCombo);

      // ダメージ計算
      let damage = currentQ.answer;
      let comboEffect = null;

      // コンボ閾値チェック（大きい方から）
      for (let i = COMBO_THRESHOLDS.length - 1; i >= 0; i--) {
        const threshold = COMBO_THRESHOLDS[i];
        if (newCombo >= threshold.combo && newCombo % threshold.combo === 0) {
          damage = threshold.multiplier * currentQ.answer;
          comboEffect = threshold;
          if (threshold.effect === 'ultimate') {
            setStats((prev) => ({ ...prev, skillCount: prev.skillCount + 1 }));
          }
          break;
        }
      }

      const newEnemyHp = Math.max(0, enemyHpRef.current - damage);
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

      setTimeout(() => {
        setEnemyDamaged(false);
        setShowDamage(null);
        setShowComboEffect(null);
        setSlimeFlash(false);

        if (newEnemyHp <= 0) {
          setBattlePhase('won');
          const s = statsRef.current;
          onWin({
            maxCombo: Math.max(s.maxCombo, newCombo),
            totalDamage: s.totalDamage + damage,
            skillCount: s.skillCount + (comboEffect?.effect === 'ultimate' ? 1 : 0),
          });
        } else {
          advanceQuestion();
        }
      }, comboEffect ? 1500 : 800);
    } else {
      // 不正解
      setCombo(0);
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
  };

  // タイマー
  useEffect(() => {
    if (battlePhase !== 'playing' || !isAnswering) return;

    const q = questions[currentIndex];
    const limit = q?.phase === 'boss' ? difficulty.bossTimeLimit : difficulty.timeLimit;
    setTimeLeft(limit);

    timerRef.current = setInterval(() => {
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
  const timeLimit = currentQuestion.phase === 'boss' ? difficulty.bossTimeLimit : difficulty.timeLimit;
  const timePercent = (timeLeft / timeLimit) * 100;
  const phaseLabel = currentQuestion.phase === 'basic' ? 'きほん' : currentQuestion.phase === 'advanced' ? 'おうよう' : 'ボスラッシュ';

  return (
    <div className="battle-screen">
      {/* フェーズ表示 */}
      <div className="battle-phase-label">{phaseLabel}</div>

      {/* 敵エリア */}
      <div className="battle-enemy-area">
        <div className="enemy-name">{stage.enemyName}</div>
        <div className="hp-bar enemy-hp-bar">
          <div className="hp-bar-fill" style={{ width: `${(enemyHp / stage.hp) * 100}%` }} />
          <span className="hp-text">{enemyHp} / {stage.hp}</span>
        </div>
        <div className="enemy-sprite-container">
          <EnemySprite stage={stage} size={100} damaged={enemyDamaged} />
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
      <div className="combo-bar">
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
    </div>
  );
}
