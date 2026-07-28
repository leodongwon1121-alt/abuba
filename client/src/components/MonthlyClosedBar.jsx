const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MonthlyClosedBar({ closedMonths }) {
  return (
    <div className="month-bar">
      {MONTHS.map((month) => {
        const closed = closedMonths.has(month);
        return (
          <div
            key={month}
            className={`month-bar-cell${closed ? " is-closed" : ""}`}
            aria-label={`${month}월 ${closed ? "금어기" : "조업 가능"}`}
          >
            <span className="month-bar-label">{month}</span>
          </div>
        );
      })}
    </div>
  );
}
