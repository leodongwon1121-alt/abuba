import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/client.js';
import { REGIONS } from '../../data/marineRegions.js';
import HarvestStats from '../../components/HarvestStats.jsx';
import HarvestForm from '../../components/HarvestForm.jsx';
import HarvestList from '../../components/HarvestList.jsx';

export default function Harvest() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.listHarvest(user.id).then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, [user]);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id)),
    [records]
  );

  if (!user) {
    return (
      <div className="screen harvest-screen page-transition">
        <p className="section-desc">로그인 후 이용해주세요.</p>
      </div>
    );
  }

  const handleSubmit = async (payload) => {
    setError('');
    try {
      if (editingRecord) {
        const updated = await api.updateHarvest(editingRecord.id, { ...payload, userId: user.id });
        setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditingRecord(null);
      } else {
        const created = await api.addHarvest({ ...payload, userId: user.id });
        setRecords((prev) => [...prev, created]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (record) => {
    setError('');
    setEditingRecord(record);
  };

  const handleCancelEdit = () => setEditingRecord(null);

  const handleDelete = async (record) => {
    try {
      await api.deleteHarvest(record.id, user.id);
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
      if (editingRecord?.id === record.id) {
        setEditingRecord(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="screen harvest-screen page-transition">
      <HarvestStats records={records} />

      <HarvestForm
        regions={REGIONS}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="section-desc">기록을 불러오는 중...</p>
      ) : (
        <HarvestList
          records={sortedRecords}
          regions={REGIONS}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
