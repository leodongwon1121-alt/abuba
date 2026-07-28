import { CloseIcon } from './icons.jsx';

export default function MarineDetailCard({ region, data, loading, onClose }) {
  if (!region) return null;

  return (
    <div className="detail-sheet-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="detail-sheet-handle" />
        <div className="detail-sheet-header">
          <h2>{region.name}</h2>
          <button className="detail-sheet-close" onClick={onClose} aria-label="닫기">
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <span className="badge">참고 해구: {region.referenceZone}</span>

        {loading || !data ? (
          <p className="detail-sheet-loading">해양 정보를 불러오는 중...</p>
        ) : (
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">수온</span>
              <span className="detail-value">{data.waterTemp}°C</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">파고</span>
              <span className="detail-value">{data.waveHeight} m</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">풍속</span>
              <span className="detail-value">{data.windSpeed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
