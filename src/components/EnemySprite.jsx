/**
 * 敵モンスターのSVG表示コンポーネント
 */
export default function EnemySprite({ stage, size = 100, damaged = false }) {
  const render = ENEMY_RENDERERS[stage.id] || ENEMY_RENDERERS[1];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`enemy-sprite ${damaged ? 'enemy-damaged' : ''}`}
    >
      {render()}
    </svg>
  );
}

const ENEMY_RENDERERS = {
  // イチモク - 一つ目
  1: () => (
    <g>
      <circle cx="50" cy="55" r="30" fill="#8B8B8B" opacity="0.8" />
      <circle cx="50" cy="50" r="14" fill="white" />
      <circle cx="52" cy="52" r="7" fill="#E53E3E" />
      <circle cx="54" cy="50" r="3" fill="#333" />
    </g>
  ),
  // ニブンカ - 2つに分裂
  2: () => (
    <g>
      <ellipse cx="35" cy="55" rx="20" ry="22" fill="#9C88FF" opacity="0.8" />
      <ellipse cx="65" cy="55" rx="20" ry="22" fill="#9C88FF" opacity="0.8" />
      <circle cx="30" cy="50" r="4" fill="white" />
      <circle cx="31" cy="51" r="2" fill="#333" />
      <circle cx="60" cy="50" r="4" fill="white" />
      <circle cx="61" cy="51" r="2" fill="#333" />
      <path d="M 45 55 Q 50 45 55 55" stroke="#9C88FF" strokeWidth="3" fill="none" />
    </g>
  ),
  // サンカク - 三角
  3: () => (
    <g>
      <polygon points="50,20 20,80 80,80" fill="#FF6B6B" opacity="0.85" />
      <circle cx="42" cy="55" r="4" fill="white" />
      <circle cx="58" cy="55" r="4" fill="white" />
      <circle cx="43" cy="56" r="2" fill="#333" />
      <circle cx="59" cy="56" r="2" fill="#333" />
      <path d="M 45 66 Q 50 72 55 66" stroke="#333" strokeWidth="1.5" fill="none" />
    </g>
  ),
  // シカクイ - 四角い壁
  4: () => (
    <g>
      <rect x="20" y="25" width="60" height="55" rx="5" fill="#FFA726" opacity="0.85" />
      <circle cx="38" cy="48" r="5" fill="white" />
      <circle cx="62" cy="48" r="5" fill="white" />
      <circle cx="39" cy="49" r="2.5" fill="#333" />
      <circle cx="63" cy="49" r="2.5" fill="#333" />
      <rect x="40" y="62" width="20" height="8" rx="3" fill="#333" opacity="0.5" />
    </g>
  ),
  // ゴボウシ - 星型
  5: () => (
    <g>
      <polygon points="50,15 58,40 85,40 64,55 72,80 50,65 28,80 36,55 15,40 42,40" fill="#FFD700" opacity="0.85" />
      <circle cx="42" cy="45" r="4" fill="white" />
      <circle cx="58" cy="45" r="4" fill="white" />
      <circle cx="43" cy="46" r="2" fill="#333" />
      <circle cx="59" cy="46" r="2" fill="#333" />
      <path d="M 45 56 Q 50 62 55 56" stroke="#333" strokeWidth="1.5" fill="none" />
    </g>
  ),
  // ロクロク - 六角形
  6: () => (
    <g>
      <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="#26C6DA" opacity="0.85" className="enemy-rotate" />
      <circle cx="42" cy="48" r="4" fill="white" />
      <circle cx="58" cy="48" r="4" fill="white" />
      <circle cx="43" cy="49" r="2" fill="#333" />
      <circle cx="59" cy="49" r="2" fill="#333" />
      <path d="M 44 58 L 56 58" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  // ナナイロ - 虹色
  7: () => (
    <g>
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="16%" stopColor="#FF8800" />
          <stop offset="33%" stopColor="#FFFF00" />
          <stop offset="50%" stopColor="#00FF00" />
          <stop offset="66%" stopColor="#0088FF" />
          <stop offset="83%" stopColor="#4400FF" />
          <stop offset="100%" stopColor="#8800FF" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="32" fill="url(#rainbow)" opacity="0.8" />
      <circle cx="40" cy="45" r="5" fill="white" />
      <circle cx="60" cy="45" r="5" fill="white" />
      <circle cx="41" cy="46" r="2.5" fill="#333" />
      <circle cx="61" cy="46" r="2.5" fill="#333" />
      <path d="M 42 60 Q 50 68 58 60" stroke="#333" strokeWidth="2" fill="none" />
    </g>
  ),
  // ハチマキ - タコ型
  8: () => (
    <g>
      <ellipse cx="50" cy="42" rx="25" ry="22" fill="#E91E63" opacity="0.8" />
      {/* 8本腕 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const x1 = 50 + Math.cos(angle) * 20;
        const y1 = 58 + Math.sin(angle) * 6;
        const x2 = 50 + Math.cos(angle) * 35;
        const y2 = 70 + Math.sin(angle) * 15 + 10;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${(x1 + x2) / 2 + 5} ${(y1 + y2) / 2} ${x2} ${y2}`}
            stroke="#E91E63"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        );
      })}
      <circle cx="42" cy="38" r="4" fill="white" />
      <circle cx="58" cy="38" r="4" fill="white" />
      <circle cx="43" cy="39" r="2" fill="#333" />
      <circle cx="59" cy="39" r="2" fill="#333" />
    </g>
  ),
  // キュウキョク - 9つの顔
  9: () => (
    <g>
      <circle cx="50" cy="50" r="35" fill="#7E57C2" opacity="0.8" />
      {/* 中央の顔 */}
      <circle cx="45" cy="46" r="4" fill="white" />
      <circle cx="55" cy="46" r="4" fill="white" />
      <circle cx="46" cy="47" r="2" fill="#333" />
      <circle cx="56" cy="47" r="2" fill="#333" />
      <path d="M 46 56 Q 50 60 54 56" stroke="#333" strokeWidth="1.5" fill="none" />
      {/* 周辺の小さな顔 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const cx = 50 + Math.cos(angle) * 26;
        const cy = 50 + Math.sin(angle) * 26;
        return (
          <g key={i}>
            <circle cx={cx - 2} cy={cy - 1} r="1.5" fill="white" />
            <circle cx={cx + 2} cy={cy - 1} r="1.5" fill="white" />
            <circle cx={cx - 1.5} cy={cy - 0.5} r="0.8" fill="#333" />
            <circle cx={cx + 2.5} cy={cy - 0.5} r="0.8" fill="#333" />
          </g>
        );
      })}
    </g>
  ),
  // ムゲン - 無限
  10: () => (
    <g>
      <defs>
        <linearGradient id="mugen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="50%" stopColor="#4A148C" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="url(#mugen-grad)" opacity="0.9" />
      {/* ∞ シンボル */}
      <path
        d="M 30 50 Q 30 38 40 38 Q 50 38 50 50 Q 50 62 60 62 Q 70 62 70 50 Q 70 38 60 38 Q 50 38 50 50 Q 50 62 40 62 Q 30 62 30 50"
        stroke="#E0E0E0"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <circle cx="40" cy="44" r="5" fill="#E0E0E0" opacity="0.8" />
      <circle cx="60" cy="44" r="5" fill="#E0E0E0" opacity="0.8" />
      <circle cx="41" cy="45" r="2.5" fill="#4A148C" />
      <circle cx="61" cy="45" r="2.5" fill="#4A148C" />
    </g>
  ),
};
