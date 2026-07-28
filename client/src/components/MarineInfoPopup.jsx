import { CloseIcon } from "./icons.jsx";

const HALF_WIDTH = 110;
const EDGE_PADDING = 10;
const POPUP_HEIGHT = 230; // ≈ popup's max rendered height (loaded state), used to keep it inside the map
const GAP = 16;

export default function MarineInfoPopup({
  region,
  data,
  loading,
  error,
  point,
  mapSize,
  pinned,
  onClose,
}) {
  if (!region || !point || !mapSize) return null;

  const left = Math.min(
    Math.max(point.x, HALF_WIDTH + EDGE_PADDING),
    mapSize.x - HALF_WIDTH - EDGE_PADDING,
  );
  const showBelow = point.y < POPUP_HEIGHT + GAP;
  const top = showBelow
    ? Math.min(point.y + GAP, Math.max(mapSize.y - POPUP_HEIGHT, GAP))
    : Math.max(point.y - GAP, POPUP_HEIGHT);

  return (
    <div
      className={`marine-popup${showBelow ? " marine-popup-below" : ""}`}
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="marine-popup-header">
        <h3>{region.name}</h3>
        <button
          type="button"
          className="marine-popup-close"
          onClick={onClose}
          aria-label="닫기"
        >
          <CloseIcon width={14} height={14} />
        </button>
      </div>

      <span className="badge">참고 해구: {region.referenceZone}</span>

      {error ? (
        <p className="error-text">{error}</p>
      ) : loading || !data ? (
        <p className="marine-popup-loading">불러오는 중...</p>
      ) : (
        <div className="detail-grid marine-popup-grid">
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

      {!pinned && <p className="marine-popup-hint">눌러서 고정하기</p>}
    </div>
  );
}
