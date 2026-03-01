import { loadSave } from '../utils/saveManager';

export default function TitleScreen({ onNewGame, onContinue }) {
  const hasSave = !!loadSave();

  return (
    <div className="title-screen">
      <div className="title-logo">
        <h1 className="title-text">スラくく</h1>
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
          <text x="60" y="52" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" opacity="0.6">?</text>
        </svg>
      </div>

      <div className="title-buttons">
        <button className="title-btn primary-btn" onClick={onNewGame}>
          はじめから
        </button>
        {hasSave && (
          <button className="title-btn secondary-btn" onClick={onContinue}>
            つづきから
          </button>
        )}
      </div>

      <div className="title-footer">
        <p>九九モンスター育成バトルゲーム</p>
      </div>
    </div>
  );
}
