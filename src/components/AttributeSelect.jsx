import { ATTRIBUTES } from '../data/gameData';

export default function AttributeSelect({ onSelect }) {
  return (
    <div className="attribute-select-screen">
      <h2 className="screen-title">タネをえらぼう！</h2>
      <p className="screen-description">
        キミのスライムに与える属性のタネを選んでね。<br />
        属性によって見た目と必殺技の演出が変わるよ！
      </p>

      <div className="attribute-grid">
        {ATTRIBUTES.map((attr) => (
          <button
            key={attr.id}
            className="attribute-card"
            style={{
              '--attr-color': attr.color,
              '--attr-from': attr.gradientFrom,
              '--attr-to': attr.gradientTo,
            }}
            onClick={() => onSelect(attr.id)}
          >
            <div className="attr-emoji">{attr.emoji}</div>
            <div className="attr-name">{attr.name}</div>
            <div className="attr-complete">{attr.completeName}</div>
            <div className="attr-skill">必殺技: {attr.skillName}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
