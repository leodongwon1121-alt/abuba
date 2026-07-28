import { formatKoreanDate, formatOwnershipDuration } from '../utils/dateUtils.js';

export default function ShipInfoCard({ shipType, shipPurchaseDate, lastMaintenanceDate, onEdit }) {
  return (
    <div className="ship-card">
      <div className="ship-card-header">
        <span className="ship-card-label">내 선박 정보</span>
        <button type="button" className="ship-card-edit" onClick={onEdit}>
          수정
        </button>
      </div>
      <div className="ship-card-grid">
        <div className="ship-card-item">
          <span className="ship-card-item-label">선박 종류</span>
          <span className="ship-card-item-value">{shipType}</span>
        </div>
        <div className="ship-card-item">
          <span className="ship-card-item-label">구매 날짜</span>
          <span className="ship-card-item-value">{formatKoreanDate(shipPurchaseDate)}</span>
        </div>
        <div className="ship-card-item">
          <span className="ship-card-item-label">보유 기간</span>
          <span className="ship-card-item-value">{formatOwnershipDuration(shipPurchaseDate)}</span>
        </div>
        <div className="ship-card-item">
          <span className="ship-card-item-label">마지막 정비일</span>
          <span className="ship-card-item-value">
            {lastMaintenanceDate ? formatKoreanDate(lastMaintenanceDate) : '정비 이력 없음'}
          </span>
        </div>
      </div>
    </div>
  );
}
