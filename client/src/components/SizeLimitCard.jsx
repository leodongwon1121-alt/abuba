import FishSilhouette from './FishSilhouette.jsx';

export default function SizeLimitCard({ species }) {
  return (
    <div className="size-card page-transition">
      <h3 className="size-card-title">{species.어종명}</h3>
      <FishSilhouette minLengthCm={species.최소전장cm} minHeightCm={species.최소체고cm} />
      <p className="size-card-notice">기준 미만은 방류 대상입니다</p>
    </div>
  );
}
