import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/client.js';
import ShipInfoCard from '../../components/ShipInfoCard.jsx';
import ShipInfoEditForm from '../../components/ShipInfoEditForm.jsx';
import MaintenanceForm from '../../components/MaintenanceForm.jsx';
import MaintenanceTimeline from '../../components/MaintenanceTimeline.jsx';
import PartFilterChips from '../../components/PartFilterChips.jsx';

export default function ShipMaintenance() {
  const { user, updateUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingShip, setIsEditingShip] = useState(false);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [partFilter, setPartFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.listMaintenance(user.id).then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, [user]);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id)),
    [records]
  );

  const uniqueParts = useMemo(() => [...new Set(records.map((r) => r.part))], [records]);

  const filteredRecords = useMemo(
    () => (partFilter === 'all' ? sortedRecords : sortedRecords.filter((r) => r.part === partFilter)),
    [sortedRecords, partFilter]
  );

  const lastMaintenanceDate = sortedRecords[0]?.date ?? null;

  if (!user) {
    return (
      <div className="screen maintenance-screen page-transition">
        <p className="section-desc">로그인 후 이용해주세요.</p>
      </div>
    );
  }

  const handleSaveShip = async (payload) => {
    setError('');
    try {
      const updated = await api.updateFisherProfile(user.id, payload);
      updateUser(updated);
      setIsEditingShip(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitRecord = async (payload) => {
    setError('');
    try {
      if (editingRecord) {
        const updated = await api.updateMaintenance(editingRecord.id, { ...payload, userId: user.id });
        setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditingRecord(null);
        setIsAddingRecord(false);
      } else {
        const created = await api.addMaintenance({ ...payload, userId: user.id });
        setRecords((prev) => [...prev, created]);
        setIsAddingRecord(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (record) => {
    setError('');
    setEditingRecord(record);
    setIsAddingRecord(true);
  };

  const handleCancelForm = () => {
    setIsAddingRecord(false);
    setEditingRecord(null);
  };

  const handleDelete = async (record) => {
    try {
      await api.deleteMaintenance(record.id, user.id);
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
      if (editingRecord?.id === record.id) {
        setEditingRecord(null);
        setIsAddingRecord(false);
      }
      if (partFilter !== 'all' && !records.some((r) => r.id !== record.id && r.part === partFilter)) {
        setPartFilter('all');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="screen maintenance-screen page-transition">
      {isEditingShip ? (
        <ShipInfoEditForm
          initialShipType={user.shipType}
          initialShipPurchaseDate={user.shipPurchaseDate}
          onSave={handleSaveShip}
          onCancel={() => setIsEditingShip(false)}
        />
      ) : (
        <ShipInfoCard
          shipType={user.shipType}
          shipPurchaseDate={user.shipPurchaseDate}
          lastMaintenanceDate={lastMaintenanceDate}
          onEdit={() => setIsEditingShip(true)}
        />
      )}

      {error && <p className="error-text">{error}</p>}

      {!isAddingRecord ? (
        <button
          type="button"
          className="btn btn-secondary maintenance-add-btn"
          onClick={() => setIsAddingRecord(true)}
        >
          정비 기록 추가
        </button>
      ) : (
        <MaintenanceForm editingRecord={editingRecord} onSubmit={handleSubmitRecord} onCancel={handleCancelForm} />
      )}

      <h3 className="section-title maintenance-list-title">정비 이력</h3>

      {loading ? (
        <p className="section-desc">기록을 불러오는 중...</p>
      ) : (
        <>
          {uniqueParts.length > 0 && (
            <PartFilterChips parts={uniqueParts} selected={partFilter} onSelect={setPartFilter} />
          )}
          <MaintenanceTimeline records={filteredRecords} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
