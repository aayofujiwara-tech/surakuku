import { useState, useEffect, useRef } from 'react';

const TOTAL_QUESTIONS = 81;

function generateAllQuestions() {
  const questions = [];
  for (let d = 1; d <= 9; d++) {
    for (let m = 1; m <= 9; m++) {
      questions.push({ a: d, b: m, answer: d * m });
    }
  }
  // シャッフル
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions;
}

export default function TimeAttackScreen({ onFinish, onBack }) {
  const [phase, setPhase] = useState('ready'); // ready, playing, finished
  const [questions] = useState(() => generateAllQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isAnswering, setIsAnswering] = useState(false);

  const inputRef = useRef(null);
  const elapsedRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // カウントダウン
  useEffect(() => {
    if (phase !== 'ready') return;
    if (countdown <= 0) {
      setPhase('playing');
      setStartTime(Date.now());
      setIsAnswering(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  // 経過タイマー
  useEffect(() => {
    if (phase !== 'playing') return;
    elapsedRef.current = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 50);
    return () => clearInterval(elapsedRef.current);
  }, [phase, startTime]);

  // フォーカス
  useEffect(() => {
    if (phase === 'playing' && inputRef.current && isAnswering) {
      inputRef.current.focus();
    }
  }, [currentIndex, isAnswering, phase]);

  const processAnswer = (isCorrect) => {
    setIsAnswering(false);

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= TOTAL_QUESTIONS) {
          clearInterval(elapsedRef.current);
          const finalTime = Date.now() - startTime;
          setElapsed(finalTime);
          setPhase('finished');
          onFinish({ time: finalTime, mistakes });
        } else {
          setCurrentIndex((prev) => prev + 1);
          setInputValue('');
          setIsAnswering(true);
        }
      }, 200);
    } else {
      setMistakes((prev) => prev + 1);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setInputValue('');
        setIsAnswering(true);
      }, 400);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAnswering || !inputValue) return;
    processAnswer(parseInt(inputValue, 10) === currentQuestion.answer);
  };

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const decimal = Math.floor((ms % 1000) / 100);
    if (min > 0) return `${min}:${sec.toString().padStart(2, '0')}.${decimal}`;
    return `${sec}.${decimal}秒`;
  };

  // カウントダウン画面
  if (phase === 'ready') {
    return (
      <div className="timeattack-screen timeattack-countdown">
        <h2 className="screen-title">タイムアタック</h2>
        <p className="screen-description">全{TOTAL_QUESTIONS}問（1×1 〜 9×9）</p>
        <div className="timeattack-countdown-number">
          {countdown > 0 ? countdown : 'スタート！'}
        </div>
        <button className="training-back-btn" onClick={onBack} style={{ marginTop: '2rem' }}>
          ← やめる
        </button>
      </div>
    );
  }

  // 結果画面
  if (phase === 'finished') {
    return (
      <div className="timeattack-result-screen">
        <h2 className="screen-title">タイムアタック完了！</h2>

        <div className="training-result-card">
          <div className="training-result-dan">全{TOTAL_QUESTIONS}問</div>

          <div className="training-result-time">
            <span className="result-label">タイム</span>
            <span className="result-big-value">{formatTime(elapsed)}</span>
          </div>

          <div className="training-result-stats">
            <div className="stat-row">
              <span className="stat-label">まちがい</span>
              <span className="stat-value">{mistakes}回</span>
            </div>
          </div>

          {mistakes === 0 && (
            <div className="training-perfect">パーフェクト！</div>
          )}
        </div>

        <button className="primary-btn" onClick={onBack}>
          もどる
        </button>
      </div>
    );
  }

  // プレイ中
  return (
    <div className="timeattack-screen">
      {/* ヘッダー */}
      <div className="training-header">
        <button className="training-back-btn" onClick={onBack}>
          ← やめる
        </button>
        <div className="training-info">
          <span className="training-dan-label">タイムアタック</span>
          <span className="training-timer">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* 進捗 */}
      <div className="training-progress">
        <div className="training-progress-bar">
          <div
            className="training-progress-fill timeattack-progress-fill"
            style={{ width: `${(currentIndex / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
        <span className="training-progress-text">
          {currentIndex + 1} / {TOTAL_QUESTIONS}
        </span>
      </div>

      {/* 問題 */}
      <div className={`training-question ${feedback === 'correct' ? 'training-correct' : ''} ${feedback === 'wrong' ? 'training-wrong' : ''}`}>
        <div className="training-question-text">
          {currentQuestion.a} × {currentQuestion.b} = ?
        </div>
      </div>

      {/* 数値入力（タイムアタックは常に直接入力） */}
      <form className="input-area training-input-area" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="number"
          className="answer-input training-answer-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!isAnswering}
          placeholder="こたえ"
          autoComplete="off"
        />
        <button type="submit" className="submit-button" disabled={!isAnswering || !inputValue}>
          OK
        </button>
      </form>

      {mistakes > 0 && (
        <div className="training-mistakes">
          まちがい: {mistakes}回
        </div>
      )}
    </div>
  );
}
