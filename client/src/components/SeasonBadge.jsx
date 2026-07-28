export default function SeasonBadge({ isClosed }) {
  return (
    <span className={`season-badge${isClosed ? ' season-badge--closed' : ' season-badge--open'}`}>
      {isClosed ? '금어기' : '포획 가능'}
    </span>
  );
}
