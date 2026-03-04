import { useState, useEffect, useRef } from 'react';
import { getDifficulty } from '../data/gameData';
import { generateChoices } from '../utils/questionGenerator';

const TOTAL_QUESTIONS = 9;

function generateTrainingQuestions(dan) {
  const questions = [];
  if (dan === 0) {
    // ミックス: 各段から1問ずつランダム
    for (let d = 1; d <= 9; d++) {
      const b = Math.floor(Math.random() * 9) + 1;
      questions.push({ a: d, b, answer: d * b });
    }
    // シャッフル
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  } else {
    for (let i = 1; i <= 9; i++) {
      questions.push({ a: dan, b: i, answer: dan * i });
    }
    // シャッフル
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }
  return questions;
}

export default function TrainingScreen({ dan, onFinish, onBack }) {
  const difficulty = getDifficulty(dan || 5);

  const [questions] = useState(() => generateTrainingQuestions(dan));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isAnswering, setIsAnswering] = useState(true);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [phase, setPhase] = useState('playing'); // playing | finished

  const elapsedTimerRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // 経過タイマー
  useEffect(() => {
    if (phase !== 'playing') return;
    elapsedTimerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(elapsedTimerRef.current);
  }, [startTime, phase]);

  // 選択肢生成
  useEffect(() => {
    if (currentQuestion) {
      setChoices(generateChoices(currentQuestion.a, currentQuestion.b, currentQuestion.answer, difficulty.level));
    }
  }, [currentIndex]);

  const processAnswer = (isCorrect) => {
    setIsAnswering(false);

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= questions.length) {
          // 全問完了
          clearInterval(elapsedTimerRef.current);
          const finalTime = Date.now() - startTime;
          setElapsed(finalTime);
          setPhase('finished');
          onFinish({
            dan,
            time: finalTime,
            mistakes,
            perfect: mistakes === 0,
          });
        } else {
          setCurrentIndex((prev) => prev + 1);
          setIsAnswering(true);
        }
      }, 400);
    } else {
      setMistakes((prev) => prev + 1);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setIsAnswering(true);
      }, 600);
    }
  };

  const handleChoiceClick = (value) => {
    if (!isAnswering) return;
    processAnswer(value === currentQuestion.answer);
  };

  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    const decimal = Math.floor((ms % 1000) / 100);
    return `${sec}.${decimal}秒`;
  };

  if (phase === 'finished') {
    return (
      <div className="training-result-screen">
        <h2 className="screen-title">とっくん完了！</h2>

        <div className="training-result-card">
          <div className="training-result-dan">
            {dan === 0 ? 'ミックス' : `${dan}の段`}
          </div>

          <div className="training-result-time">
            <span className="result-label">タイム</span>
            <span className="result-big-value">{formatTime(elapsed)}</span>
          </div>

          <div className="training-result-stats">
            <div className="stat-row">
              <span className="stat-label">まちがい</span>
              <span className="stat-value">{mistakes}回</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">もんだい数</span>
              <span className="stat-value">{TOTAL_QUESTIONS}問</span>
            </div>
          </div>

          {mistakes === 0 && (
            <div className="training-perfect">パーフェクト！</div>
          )}
        </div>

        <button className="primary-btn" onClick={onBack}>
          段をえらぶ
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="training-screen">
      {/* ヘッダー */}
      <div className="training-header">
        <button className="training-back-btn" onClick={onBack}>
          ← やめる
        </button>
        <div className="training-info">
          <span className="training-dan-label">
            {dan === 0 ? 'ミックス' : `${dan}の段`}
          </span>
          <span className="training-timer">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* 進捗 */}
      <div className="training-progress">
        <div className="training-progress-bar">
          <div
            className="training-progress-fill"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>
        <span className="training-progress-text">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* 問題 */}
      <div className={`training-question ${feedback === 'correct' ? 'training-correct' : ''} ${feedback === 'wrong' ? 'training-wrong' : ''}`}>
        <div className="training-question-text">
          {currentQuestion.a} × {currentQuestion.b} = ?
        </div>
      </div>

      {/* 回答（4択） */}
      <div className="choices-grid training-choices">
        {choices.map((choice, i) => (
          <button
            key={`${currentIndex}-${i}`}
            className="choice-button training-choice-btn"
            onClick={() => handleChoiceClick(choice)}
            disabled={!isAnswering}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* ミス表示 */}
      {mistakes > 0 && (
        <div className="training-mistakes">
          まちがい: {mistakes}回
        </div>
      )}
    </div>
  );
}
