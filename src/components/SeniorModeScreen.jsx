import { useState, useEffect, useRef } from 'react';
import { generateSeniorQuestions, generateSeniorChoices } from '../utils/questionGenerator';

const OPERATIONS = [
  { id: 'addition', label: 'たしざん', symbol: '＋', emoji: '➕' },
  { id: 'subtraction', label: 'ひきざん', symbol: '−', emoji: '➖' },
  { id: 'multiplication', label: 'かけざん', symbol: '×', emoji: '✖️' },
];

const RANGES = [
  { id: 'easy', label: 'かんたん', description: '1〜5の数' },
  { id: 'normal', label: 'ふつう', description: '1〜9の数' },
];

const QUESTION_COUNT = 10;

export default function SeniorModeScreen({ onBack }) {
  const [phase, setPhase] = useState('setup'); // setup | playing | finished
  const [operation, setOperation] = useState(null);
  const [range, setRange] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswering, setIsAnswering] = useState(true);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const elapsedTimerRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // 経過タイマー
  useEffect(() => {
    if (phase !== 'playing') return;
    elapsedTimerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(elapsedTimerRef.current);
  }, [startTime, phase]);

  // 選択肢生成
  useEffect(() => {
    if (currentQuestion) {
      setChoices(generateSeniorChoices(currentQuestion.answer, currentQuestion.operation));
    }
  }, [currentIndex, questions]);

  const handleStart = () => {
    if (!operation || !range) return;
    const qs = generateSeniorQuestions(operation, range, QUESTION_COUNT);
    setQuestions(qs);
    setCurrentIndex(0);
    setMistakes(0);
    setCorrectCount(0);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase('playing');
    setIsAnswering(true);
    setFeedback(null);
    setShowAnswer(false);
  };

  const processAnswer = (selectedValue) => {
    if (!isAnswering) return;
    setIsAnswering(false);

    const isCorrect = selectedValue === currentQuestion.answer;

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount((prev) => prev + 1);
      setTimeout(() => {
        advanceQuestion();
      }, 800);
    } else {
      setMistakes((prev) => prev + 1);
      setFeedback('wrong');
      setShowAnswer(true);
      // 間違えたら正解を表示してから次へ
      setTimeout(() => {
        advanceQuestion();
      }, 1500);
    }
  };

  const advanceQuestion = () => {
    setFeedback(null);
    setShowAnswer(false);

    if (currentIndex + 1 >= questions.length) {
      clearInterval(elapsedTimerRef.current);
      const finalTime = Date.now() - startTime;
      setElapsed(finalTime);
      setPhase('finished');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswering(true);
    }
  };

  const handleRetry = () => {
    handleStart();
  };

  const handleChangeSettings = () => {
    setPhase('setup');
    setOperation(null);
    setRange(null);
  };

  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    if (min > 0) return `${min}分${remSec}秒`;
    return `${sec}秒`;
  };

  // --- セットアップ画面 ---
  if (phase === 'setup') {
    return (
      <div className="senior-mode-screen senior-setup">
        <h2 className="senior-title">のうトレ</h2>
        <p className="senior-subtitle">けいさんれんしゅう</p>

        <div className="senior-section">
          <div className="senior-section-label">もんだいの しゅるい</div>
          <div className="senior-operation-grid">
            {OPERATIONS.map((op) => (
              <button
                key={op.id}
                className={`senior-option-btn ${operation === op.id ? 'selected' : ''}`}
                onClick={() => setOperation(op.id)}
              >
                <span className="senior-option-emoji">{op.emoji}</span>
                <span className="senior-option-label">{op.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="senior-section">
          <div className="senior-section-label">むずかしさ</div>
          <div className="senior-range-grid">
            {RANGES.map((r) => (
              <button
                key={r.id}
                className={`senior-option-btn ${range === r.id ? 'selected' : ''}`}
                onClick={() => setRange(r.id)}
              >
                <span className="senior-option-label">{r.label}</span>
                <span className="senior-option-desc">{r.description}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="senior-start-btn"
          onClick={handleStart}
          disabled={!operation || !range}
        >
          はじめる
        </button>

        <button className="senior-back-btn" onClick={onBack}>
          もどる
        </button>
      </div>
    );
  }

  // --- 完了画面 ---
  if (phase === 'finished') {
    const opInfo = OPERATIONS.find((o) => o.id === operation);
    const rangeInfo = RANGES.find((r) => r.id === range);
    const isPerfect = mistakes === 0;

    return (
      <div className="senior-mode-screen senior-finished">
        <h2 className="senior-title">おつかれさまでした！</h2>

        {isPerfect && (
          <div className="senior-perfect-badge">パーフェクト！</div>
        )}

        <div className="senior-result-card">
          <div className="senior-result-type">
            {opInfo.emoji} {opInfo.label}（{rangeInfo.label}）
          </div>

          <div className="senior-result-row">
            <span className="senior-result-label">せいかい</span>
            <span className="senior-result-value">{correctCount} / {QUESTION_COUNT}</span>
          </div>

          <div className="senior-result-row">
            <span className="senior-result-label">まちがい</span>
            <span className="senior-result-value">{mistakes}回</span>
          </div>

          <div className="senior-result-row">
            <span className="senior-result-label">じかん</span>
            <span className="senior-result-value">{formatTime(elapsed)}</span>
          </div>
        </div>

        <div className="senior-finish-actions">
          <button className="senior-start-btn" onClick={handleRetry}>
            もういちど
          </button>
          <button className="senior-option-btn" onClick={handleChangeSettings}>
            せっていをかえる
          </button>
          <button className="senior-back-btn" onClick={onBack}>
            もどる
          </button>
        </div>
      </div>
    );
  }

  // --- プレイ画面 ---
  if (!currentQuestion) return null;

  return (
    <div className="senior-mode-screen senior-playing">
      {/* ヘッダー */}
      <div className="senior-play-header">
        <button className="senior-quit-btn" onClick={onBack}>
          やめる
        </button>
        <div className="senior-play-info">
          <span className="senior-play-progress">
            {currentIndex + 1} / {QUESTION_COUNT}
          </span>
        </div>
      </div>

      {/* 進捗バー */}
      <div className="senior-progress-bar">
        <div
          className="senior-progress-fill"
          style={{ width: `${(currentIndex / QUESTION_COUNT) * 100}%` }}
        />
      </div>

      {/* 問題 */}
      <div className={`senior-question-area ${feedback === 'correct' ? 'senior-correct-flash' : ''} ${feedback === 'wrong' ? 'senior-wrong-flash' : ''}`}>
        <div className="senior-question-text">
          {currentQuestion.a} {currentQuestion.symbol} {currentQuestion.b} = ?
        </div>
        {showAnswer && (
          <div className="senior-correct-answer">
            こたえ: {currentQuestion.answer}
          </div>
        )}
      </div>

      {/* 4択 */}
      <div className="senior-choices-grid">
        {choices.map((choice, i) => (
          <button
            key={`${currentIndex}-${i}`}
            className={`senior-choice-btn ${
              showAnswer && choice === currentQuestion.answer ? 'senior-choice-correct' : ''
            }`}
            onClick={() => processAnswer(choice)}
            disabled={!isAnswering}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
