export default function FishSilhouette({ minLengthCm, minHeightCm }) {
  return (
    <svg className="fish-silhouette" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker
          id="dim-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-text-muted)" />
        </marker>
      </defs>

      <path
        d="M30,95 C40,70 80,55 130,55 C170,55 195,65 205,80 L235,60 L215,95 L235,130 L205,110 C195,125 170,135 130,135 C80,135 40,120 30,95 Z"
        fill="var(--color-navy)"
      />
      <path d="M95,120 L80,145 L115,125 Z" fill="var(--color-navy)" />
      <circle cx="55" cy="85" r="5" fill="var(--color-bg)" />

      {/* 전장(total length) - 가로 치수선 */}
      <line x1="30" y1="140" x2="30" y2="165" className="dim-ext" />
      <line x1="235" y1="140" x2="235" y2="165" className="dim-ext" />
      <line
        x1="30"
        y1="165"
        x2="235"
        y2="165"
        className="dim-line"
        markerStart="url(#dim-arrow)"
        markerEnd="url(#dim-arrow)"
      />
      <text x="132" y="184" textAnchor="middle" className="dim-label">
        전장 {minLengthCm}cm 이상
      </text>

      {/* 체고(body height) - 세로 치수선 */}
      <line x1="150" y1="55" x2="270" y2="55" className="dim-ext" />
      <line x1="150" y1="135" x2="270" y2="135" className="dim-ext" />
      <line
        x1="270"
        y1="55"
        x2="270"
        y2="135"
        className="dim-line"
        markerStart="url(#dim-arrow)"
        markerEnd="url(#dim-arrow)"
      />
      <text x="278" y="92" className="dim-label">
        체고
      </text>
      <text x="278" y="106" className="dim-label">
        {minHeightCm}cm 이상
      </text>
    </svg>
  );
}
