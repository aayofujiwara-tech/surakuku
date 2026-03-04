import { useState, useRef, useCallback } from 'react';
import { loadSave } from '../utils/saveManager';

const TAP_THRESHOLD = 10;
const TAP_TIMEOUT = 3000;
const SHAKE_START = 7;

export default function TitleScreen({ onNewGame, onContinue, onTraining, onSeniorMode, onViewSlime, onCollection, onUnlockAll }) {
  const hasSave = !!loadSave();
  const [showDialog, setShowDialog] = useState(false);
  const [logoClass, setLogoClass] = useState('');
  const tapCountRef = useRef(0);
  const timerRef = useRef(null);

  const handleLogoTap = useCallback(() => {
    if (showDialog) return;

    clearTimeout(timerRef.current);
    tapCountRef.current += 1;
    const count = tapCountRef.current;

    if (count >= TAP_THRESHOLD) {
      setLogoClass('logo-flash');
      tapCountRef.current = 0;
      setTimeout(() => {
        setLogoClass('');
        setShowDialog(true);
      }, 600);
      return;
    }

    if (count >= SHAKE_START) {
      setLogoClass('logo-shake');
    }

    timerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      setLogoClass('');
    }, TAP_TIMEOUT);
  }, [showDialog]);

  const handleConfirm = () => {
    setShowDialog(false);
    onUnlockAll();
  };

  const handleCancel = () => {
    setShowDialog(false);
    tapCountRef.current = 0;
  };

  return (
    <div className="title-screen">
      <div className="title-logo" onClick={handleLogoTap}>
        <h1 className={`title-text ${logoClass}`}>スラくく</h1>
        <p className="title-subtitle">キミの九九が、カタチになる。</p>
      </div>

      <div className="title-slime-decoration">
        <svg width="150" height="150" viewBox="0 0 120 120" className="slime-bounce">
          <defs>
            <radialGradient id="title-slime-grad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#B8E6FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#64B5F6" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="title-shine" cx="35%" cy="30%" r="25%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(0,0,0,0.1)" />
          <ellipse cx="60" cy="72" rx="36" ry="32" fill="url(#title-slime-grad)" />
          <ellipse cx="50" cy="64" rx="14" ry="12" fill="url(#title-shine)" />
          <circle cx="48" cy="66" r="5" fill="white" />
          <circle cx="72" cy="66" r="5" fill="white" />
          <circle cx="49" cy="67" r="2.5" fill="#333" />
          <circle cx="73" cy="67" r="2.5" fill="#333" />
          <path d="M 53 78 Q 60 84 67 78" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="title-buttons">
        {hasSave ? (
          <>
            <button className="title-btn primary-btn" onClick={onContinue}>
              つづきから
            </button>
            <button className="title-btn secondary-btn" onClick={onNewGame}>
              はじめから
            </button>
            <button className="title-btn secondary-btn" onClick={onTraining}>
              とっくんモード
            </button>
            <button className="title-btn secondary-btn" onClick={onViewSlime}>
              スライム
            </button>
            <button className="title-btn secondary-btn" onClick={onCollection}>
              ずかん
            </button>
            <button className="title-btn secondary-btn" onClick={onSeniorMode}>
              のうトレ
            </button>
          </>
        ) : (
          <>
            <button className="title-btn primary-btn" onClick={onNewGame}>
              はじめから
            </button>
            <button className="title-btn secondary-btn" disabled>
              つづきから
            </button>
            <button className="title-btn secondary-btn" onClick={onTraining}>
              とっくんモード
            </button>
            <button className="title-btn secondary-btn" onClick={onSeniorMode}>
              のうトレ
            </button>
          </>
        )}
      </div>

      <div className="title-footer">
        <p>九九モンスター育成バトルゲーム</p>
      </div>

      {showDialog && (
        <div className="unlock-dialog-overlay">
          <div className="unlock-dialog">
            <p className="unlock-dialog-title">ぜんかいほうモード！</p>
            <p className="unlock-dialog-message">
              すべてのステージが<br />あそべるようになるよ。<br />タネもえらびなおせるよ！
            </p>
            <div className="unlock-dialog-buttons">
              <button className="primary-btn" onClick={handleConfirm}>OK</button>
              <button className="secondary-btn" onClick={handleCancel}>やめる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
