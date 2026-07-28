import { useEffect, useState } from 'react';
import { QUICK_PARTS } from '../data/maintenanceParts.js';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return { date: todayStr(), part: '', memo: '' };
}

export default function MaintenanceForm({ editingRecord, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setForm({
        date: editingRecord.date,
        part: editingRecord.part,
        memo: editingRecord.memo || '',
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
      await onSubmit(form);
      if (!isEditing) {
        setForm(emptyForm());
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="maintDate">정비 날짜</label>
        <input id="maintDate" type="date" required value={form.date} onChange={update('date')} />
      </div>

      <div className="field">
        <label htmlFor="maintPart">정비한 부품</label>
        <input
          id="maintPart"
          type="text"
          required
          placeholder="예: 엔진"
          value={form.part}
          onChange={update('part')}
        />
        <div className="species-chip-row">
          {QUICK_PARTS.map((name) => (
            <button
              key={name}
              type="button"
              className={`species-chip${form.part === name ? ' active' : ''}`}
              onClick={() => setForm((prev) => ({ ...prev, part: name }))}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="maintMemo">정비 내용 메모</label>
        <input
          id="maintMemo"
          type="text"
          placeholder="예: 엔진 오일 교체"
          value={form.memo}
          onChange={update('memo')}
        />
      </div>

      <div className="harvest-form-actions">
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            취소
          </button>
        )}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {isEditing ? '수정 완료' : '저장'}
        </button>
      </div>
    </form>
  );
}
