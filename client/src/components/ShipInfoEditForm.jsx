import { useState } from 'react';

const SHIP_TYPES = ['소형 어선', '중형 어선', '대형 어선', '양식선', '기타'];

export default function ShipInfoEditForm({ initialShipType, initialShipPurchaseDate, onSave, onCancel }) {
  const [shipType, setShipType] = useState(initialShipType ?? SHIP_TYPES[0]);
  const [shipPurchaseDate, setShipPurchaseDate] = useState(initialShipPurchaseDate ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({ shipType, shipPurchaseDate });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ship-edit-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="editShipType">선박 종류</label>
        <select id="editShipType" value={shipType} onChange={(e) => setShipType(e.target.value)}>
          {SHIP_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="editShipPurchaseDate">구매 날짜</label>
        <input
          id="editShipPurchaseDate"
          type="date"
          required
          value={shipPurchaseDate}
          onChange={(e) => setShipPurchaseDate(e.target.value)}
        />
      </div>
      <div className="harvest-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          저장
        </button>
      </div>
    </form>
  );
}
