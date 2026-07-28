import { formatKoreanDate } from '../utils/dateUtils.js';
import EmptyState from './EmptyState.jsx';
import { WrenchIcon } from './icons.jsx';

export default function MaintenanceTimeline({ records, onEdit, onDelete }) {
  if (records.length === 0) {
    return (
      <EmptyState
        Icon={WrenchIcon}
        title="등록된 정비 기록이 없어요"
        description="정비 기록 추가 버튼으로 이력을 남겨보세요."
      />
    );
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
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('이 정비 기록을 삭제할까요?')) onDelete(record);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
