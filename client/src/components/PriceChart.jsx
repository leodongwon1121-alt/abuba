const W = 320;
const H = 160;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 12;
const PAD_B = 22;

function niceTicks(min, max, count = 3) {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

export default function PriceChart({ series }) {
  if (!series || series.length < 2) {
    return <p className="section-desc">시세 데이터가 없습니다.</p>;
  }

  const prices = series.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;

  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const x = (i) => PAD_L + (i / (series.length - 1)) * plotW;
  const y = (price) => PAD_T + (1 - (price - min) / span) * plotH;

  const linePath = series
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.price).toFixed(1)}`,
    )
    .join(" ");

  const areaPath = `${linePath} L${x(series.length - 1).toFixed(1)},${PAD_T + plotH} L${PAD_L},${PAD_T + plotH} Z`;

  const ticks = niceTicks(min, max);
  const last = series[series.length - 1];
  const first = series[0];

  return (
    <div className="price-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="기간별 kg당 시세 추이"
      >
        {ticks.map((t) => (
          <line
            key={t}
            className="price-chart-grid"
            x1={PAD_L}
            x2={W - PAD_R}
            y1={y(t)}
            y2={y(t)}
          />
        ))}

        <path className="price-chart-area" d={areaPath} />
        <path className="price-chart-line" d={linePath} />

        <circle
          className="price-chart-dot"
          cx={x(series.length - 1)}
          cy={y(last.price)}
          r={4}
        />
      </svg>

      <div className="price-chart-axis">
        <span>{first.date}</span>
        <span>{last.date}</span>
      </div>
      <div className="price-chart-range">
        <span>최저 {min.toLocaleString("ko-KR")}원</span>
        <span>최고 {max.toLocaleString("ko-KR")}원</span>
      </div>
    </div>
  );
}
