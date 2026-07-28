import EmptyState from './EmptyState.jsx';
import { HarvestIcon } from './icons.jsx';

export default function HarvestList({ records, regions, onEdit, onDelete }) {
  const regionName = (id) => regions.find((r) => r.id === id)?.name ?? id;

  if (records.length === 0) {
    return (
      <EmptyState
        Icon={HarvestIcon}
        title="아직 등록된 수확 기록이 없어요"
        description="위 양식으로 오늘의 수확을 기록해보세요."
      />
    );
  }

  return (
    <ul className="harvest-list">
      {records.map((record) => (
        <li key={record.id} className="harvest-item">
          <div className="harvest-item-main">
            <span className="harvest-item-species">{record.species}</span>
            <span className="harvest-item-amount">{record.amountKg} kg</span>
          </div>
          <div className="harvest-item-meta">
            <span>{record.date}</span>
            <span>·</span>
            <span>{regionName(record.regionId)}</span>
          </div>
          <div className="harvest-item-actions">
            <button type="button" onClick={() => onEdit(record)}>
              수정
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('이 수확 기록을 삭제할까요?')) onDelete(record);
              }}
            >
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
