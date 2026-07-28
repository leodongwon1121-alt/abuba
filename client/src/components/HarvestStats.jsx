function isSameMonth(dateStr, refStr) {
  return dateStr.slice(0, 7) === refStr.slice(0, 7);
}

export default function HarvestStats({ records }) {
  const today = new Date().toISOString().slice(0, 10);
  const monthlyRecords = records.filter((r) => isSameMonth(r.date, today));
  const monthlyTotal = monthlyRecords.reduce((sum, r) => sum + r.amountKg, 0);

  const speciesTotals = monthlyRecords.reduce((acc, r) => {
    acc[r.species] = (acc[r.species] ?? 0) + r.amountKg;
    return acc;
  }, {});
  const topSpecies = Object.entries(speciesTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';

  const todayCount = records.filter((r) => r.date === today).length;

  return (
    <div className="stats-card">
      <div className="stats-item">
        <span className="stats-label">이번 달 총 수확량</span>
        <span className="stats-value">{monthlyTotal.toFixed(1)} kg</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">이번 달 최다 어종</span>
        <span className="stats-value">{topSpecies}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">오늘 기록</span>
        <span className="stats-value">{todayCount}건</span>
      </div>
    </div>
  );
}
