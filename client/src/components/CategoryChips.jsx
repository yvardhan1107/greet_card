import { categories } from '../utils/helpers';

export default function CategoryChips({ active, onChange }) {
  return (
    <div className="no-scrollbar" style={{ overflowX: 'auto', padding: '16px 0' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`chip ${active === cat.value ? 'chip-active' : ''}`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
