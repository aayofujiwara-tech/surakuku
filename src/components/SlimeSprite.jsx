import { ATTRIBUTES, GROWTH_STAGES } from '../data/gameData';

/**
 * SVGベースのスライム表示コンポーネント
 * 属性と成長段階に応じて見た目が変化する
 */
export default function SlimeSprite({ attributeId, clearedDans = [], size = 120, animated = true, flash = false }) {
  const attr = ATTRIBUTES.find((a) => a.id === attributeId) || ATTRIBUTES[0];

  // 成長段階を計算
  const growthStage = getGrowthStage(clearedDans);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`slime-sprite ${animated ? 'slime-bounce' : ''} ${flash ? 'slime-flash' : ''}`}
    >
      <defs>
        <radialGradient id={`slime-grad-${attributeId}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={attr.gradientTo} stopOpacity="0.9" />
          <stop offset="100%" stopColor={attr.gradientFrom} stopOpacity="1" />
        </radialGradient>
        {/* 光沢 */}
        <radialGradient id="slime-shine" cx="35%" cy="30%" r="25%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 影 */}
      <ellipse cx="60" cy="108" rx={30 + growthStage * 2} ry="6" fill="rgba(0,0,0,0.15)" />

      {/* 本体 */}
      {growthStage === 0 && <SlimeStage0 attr={attr} />}
      {growthStage === 1 && <SlimeStage1 attr={attr} />}
      {growthStage === 2 && <SlimeStage2 attr={attr} />}
      {growthStage === 3 && <SlimeStage3 attr={attr} />}
      {growthStage === 4 && <SlimeStage4 attr={attr} />}
      {growthStage >= 5 && <SlimeStage5 attr={attr} growthStage={growthStage} />}
    </svg>
  );
}

function getGrowthStage(clearedDans) {
  const cleared = new Set(clearedDans);
  if (cleared.has(0)) return 6; // 究極体
  if (cleared.has(9)) return 5; // 完全体
  if (cleared.has(7) && cleared.has(8)) return 4;
  if (cleared.has(5) && cleared.has(6)) return 3;
  if (cleared.has(3) && cleared.has(4)) return 2;
  if (cleared.has(1) && cleared.has(2)) return 1;
  return 0;
}

// 第0形態：完全な不定形
function SlimeStage0({ attr }) {
  return (
    <g>
      <ellipse cx="60" cy="72" rx="32" ry="28" fill={`url(#slime-grad-${attr.id})`} />
      <ellipse cx="52" cy="66" rx="12" ry="10" fill="url(#slime-shine)" />
    </g>
  );
}

// 第1形態：目が現れる
function SlimeStage1({ attr }) {
  return (
    <g>
      <ellipse cx="60" cy="70" rx="34" ry="30" fill={`url(#slime-grad-${attr.id})`} />
      <ellipse cx="52" cy="64" rx="12" ry="10" fill="url(#slime-shine)" />
      {/* 目 */}
      <circle cx="50" cy="66" r="4" fill="white" />
      <circle cx="70" cy="66" r="4" fill="white" />
      <circle cx="51" cy="67" r="2" fill="#333" />
      <circle cx="71" cy="67" r="2" fill="#333" />
    </g>
  );
}

// 第2形態：耳＋口
function SlimeStage2({ attr }) {
  return (
    <g>
      <ellipse cx="60" cy="70" rx="34" ry="30" fill={`url(#slime-grad-${attr.id})`} />
      {/* 耳 */}
      <ellipse cx="38" cy="48" rx="8" ry="12" fill={attr.color} transform="rotate(-15 38 48)" />
      <ellipse cx="82" cy="48" rx="8" ry="12" fill={attr.color} transform="rotate(15 82 48)" />
      <ellipse cx="52" cy="64" rx="12" ry="10" fill="url(#slime-shine)" />
      {/* 目 */}
      <circle cx="48" cy="64" r="5" fill="white" />
      <circle cx="72" cy="64" r="5" fill="white" />
      <circle cx="49" cy="65" r="2.5" fill="#333" />
      <circle cx="73" cy="65" r="2.5" fill="#333" />
      {/* 口 */}
      <path d="M 53 76 Q 60 82 67 76" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

// 第3形態：手足の輪郭
function SlimeStage3({ attr }) {
  return (
    <g>
      <ellipse cx="60" cy="68" rx="34" ry="30" fill={`url(#slime-grad-${attr.id})`} />
      {/* 耳 */}
      <ellipse cx="36" cy="46" rx="9" ry="14" fill={attr.color} transform="rotate(-15 36 46)" />
      <ellipse cx="84" cy="46" rx="9" ry="14" fill={attr.color} transform="rotate(15 84 46)" />
      {/* 手 */}
      <ellipse cx="28" cy="74" rx="8" ry="6" fill={attr.color} transform="rotate(-20 28 74)" />
      <ellipse cx="92" cy="74" rx="8" ry="6" fill={attr.color} transform="rotate(20 92 74)" />
      {/* 足 */}
      <ellipse cx="46" cy="98" rx="10" ry="6" fill={attr.color} />
      <ellipse cx="74" cy="98" rx="10" ry="6" fill={attr.color} />
      <ellipse cx="50" cy="60" rx="12" ry="10" fill="url(#slime-shine)" />
      {/* 目 */}
      <circle cx="48" cy="62" r="6" fill="white" />
      <circle cx="72" cy="62" r="6" fill="white" />
      <circle cx="49" cy="63" r="3" fill="#333" />
      <circle cx="73" cy="63" r="3" fill="#333" />
      {/* 口 */}
      <path d="M 52 76 Q 60 83 68 76" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

// 第4形態：はっきりした体形
function SlimeStage4({ attr }) {
  return (
    <g>
      <ellipse cx="60" cy="66" rx="32" ry="28" fill={`url(#slime-grad-${attr.id})`} />
      {/* 耳 */}
      <ellipse cx="36" cy="42" rx="10" ry="16" fill={attr.color} transform="rotate(-10 36 42)" />
      <ellipse cx="84" cy="42" rx="10" ry="16" fill={attr.color} transform="rotate(10 84 42)" />
      {/* 角装飾 */}
      <polygon points="60,20 56,36 64,36" fill={attr.gradientTo} />
      {/* 手 */}
      <ellipse cx="26" cy="70" rx="10" ry="7" fill={attr.color} transform="rotate(-15 26 70)" />
      <ellipse cx="94" cy="70" rx="10" ry="7" fill={attr.color} transform="rotate(15 94 70)" />
      {/* 足 */}
      <ellipse cx="44" cy="96" rx="12" ry="7" fill={attr.color} />
      <ellipse cx="76" cy="96" rx="12" ry="7" fill={attr.color} />
      <ellipse cx="48" cy="58" rx="12" ry="10" fill="url(#slime-shine)" />
      {/* 目 */}
      <circle cx="46" cy="60" r="7" fill="white" />
      <circle cx="74" cy="60" r="7" fill="white" />
      <circle cx="48" cy="61" r="3.5" fill="#333" />
      <circle cx="76" cy="61" r="3.5" fill="#333" />
      {/* 口 */}
      <path d="M 50 76 Q 60 84 70 76" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// 第5形態（完全体）& 第6形態（究極体）
function SlimeStage5({ attr, growthStage }) {
  const isUltimate = growthStage >= 6;
  return (
    <g>
      {/* 究極体のオーラ */}
      {isUltimate && (
        <ellipse cx="60" cy="66" rx="44" ry="40" fill="none" stroke={attr.gradientTo} strokeWidth="2" opacity="0.4" className="slime-aura" />
      )}
      <ellipse cx="60" cy="66" rx="32" ry="28" fill={`url(#slime-grad-${attr.id})`} />
      {/* 耳 */}
      <ellipse cx="34" cy="40" rx="10" ry="18" fill={attr.color} transform="rotate(-10 34 40)" />
      <ellipse cx="86" cy="40" rx="10" ry="18" fill={attr.color} transform="rotate(10 86 40)" />
      {/* 角 */}
      <polygon points="60,16 54,34 66,34" fill={attr.gradientTo} />
      {/* 翼/装飾 */}
      <path d="M 20 54 Q 10 40 24 36 Q 28 50 28 60" fill={attr.color} opacity="0.7" />
      <path d="M 100 54 Q 110 40 96 36 Q 92 50 92 60" fill={attr.color} opacity="0.7" />
      {/* 手 */}
      <ellipse cx="24" cy="72" rx="10" ry="7" fill={attr.color} transform="rotate(-15 24 72)" />
      <ellipse cx="96" cy="72" rx="10" ry="7" fill={attr.color} transform="rotate(15 96 72)" />
      {/* 足 */}
      <ellipse cx="44" cy="96" rx="12" ry="7" fill={attr.color} />
      <ellipse cx="76" cy="96" rx="12" ry="7" fill={attr.color} />
      <ellipse cx="48" cy="56" rx="12" ry="10" fill="url(#slime-shine)" />
      {/* 目 */}
      <circle cx="46" cy="58" r="8" fill="white" />
      <circle cx="74" cy="58" r="8" fill="white" />
      <circle cx="48" cy="60" r="4" fill="#333" />
      <circle cx="76" cy="60" r="4" fill="#333" />
      {/* 口 */}
      <path d="M 48 76 Q 60 86 72 76" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 究極体の王冠 */}
      {isUltimate && (
        <g>
          <polygon points="44,20 48,10 52,18 56,6 60,18 64,6 68,18 72,10 76,20" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <circle cx="56" cy="16" r="2" fill="#E53E3E" />
          <circle cx="64" cy="16" r="2" fill="#4FC3F7" />
        </g>
      )}
    </g>
  );
}

export { getGrowthStage };
