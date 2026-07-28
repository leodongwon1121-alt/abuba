export default function PartFilterChips({ parts, selected, onSelect }) {
  return (
    <div className="part-filter-row">
      <button
        type="button"
        className={`species-chip${selected === 'all' ? ' active' : ''}`}
        onClick={() => onSelect('all')}
      >
        전체
      </button>
      {parts.map((part) => (
        <button
          key={part}
          type="button"
          className={`species-chip${selected === part ? ' active' : ''}`}
          onClick={() => onSelect(part)}
        >
          {part}
        </button>
      ))}
    </div>
  );
}
