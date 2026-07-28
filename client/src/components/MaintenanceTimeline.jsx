import { formatKoreanDate } from '../utils/dateUtils.js';

export default function MaintenanceTimeline({ records, onEdit, onDelete }) {
  if (records.length === 0) {
    return <p className="section-desc">등록된 정비 기록이 없어요.</p>;
  }

  return (
    <ul className="timeline">
      {records.map((record) => (
        <li key={record.id} className="timeline-item">
          <span className="timeline-date">{formatKoreanDate(record.date)}</span>
          <span className="timeline-track">
            <span className="timeline-dot" />
            <span className="timeline-line" />
          </span>
          <div className="timeline-content">
            <span className="timeline-part">{record.part}</span>
            {record.memo && <p className="timeline-memo">{record.memo}</p>}
            <div className="timeline-actions">
              <button type="button" onClick={() => onEdit(record)}>
                수정
              </button>
              <button type="button" onClick={() => onDelete(record)}>
                삭제
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
