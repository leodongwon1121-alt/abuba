const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MonthlyClosedBar({ closedMonths }) {
  return (
    <div className="month-bar">
      {MONTHS.map((month) => (
        <div key={month} className={`month-bar-cell${closedMonths.has(month) ? ' is-closed' : ''}`}>
          <span className="month-bar-label">{month}</span>
        </div>
      ))}
    </div>
  );
}
