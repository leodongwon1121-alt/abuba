import { useEffect, useState } from 'react';

const QUICK_SPECIES = ['고등어', '갈치', '전갱이', '멸치', '삼치'];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return { species: '', amountKg: '', date: todayStr(), regionId: '' };
}

export default function HarvestForm({ regions, editingRecord, onSubmit, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setForm({
        species: editingRecord.species,
        amountKg: String(editingRecord.amountKg),
        date: editingRecord.date,
        regionId: editingRecord.regionId,
      });
    } else {
      setForm(emptyForm());
    }
  }, [editingRecord]);

  const isEditing = Boolean(editingRecord);
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        species: form.species,
        amountKg: Number(form.amountKg),
        date: form.date,
        regionId: form.regionId,
      });
      if (!isEditing) {
        setForm(emptyForm());
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="harvest-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="species">어종</label>
        <input
          id="species"
          type="text"
          required
          placeholder="예: 고등어"
          value={form.species}
          onChange={update('species')}
        />
        <div className="species-chip-row">
          {QUICK_SPECIES.map((name) => (
            <button
              key={name}
              type="button"
              className={`species-chip${form.species === name ? ' active' : ''}`}
              aria-pressed={form.species === name}
              onClick={() => setForm((prev) => ({ ...prev, species: name }))}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="harvest-form-row">
        <div className="field">
          <label htmlFor="amountKg">수확량 (kg)</label>
          <input
            id="amountKg"
            type="number"
            min="0"
            step="0.1"
            required
            value={form.amountKg}
            onChange={update('amountKg')}
          />
        </div>
        <div className="field">
          <label htmlFor="date">날짜</label>
          <input id="date" type="date" required value={form.date} onChange={update('date')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="regionId">장소</label>
        <select id="regionId" required value={form.regionId} onChange={update('regionId')}>
          <option value="" disabled>
            구역 선택
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div className="harvest-form-actions">
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            취소
          </button>
        )}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {isEditing ? '수정 완료' : '기록 추가하기'}
        </button>
      </div>
    </form>
  );
}
