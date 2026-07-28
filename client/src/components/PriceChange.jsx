function formatWon(value) {
  return `${Math.abs(value).toLocaleString("ko-KR")}원`;
}

export default function PriceChange({ diff, diffRate }) {
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const arrow = direction === "up" ? "▲" : direction === "down" ? "▼" : "—";
  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";

  return (
    <span className={`price-change price-change--${direction}`}>
      <span aria-hidden="true">{arrow}</span> {formatWon(diff)} ({sign}
      {Math.abs(diffRate)}%)
    </span>
  );
}
