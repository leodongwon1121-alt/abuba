import { StarIcon } from "./icons.jsx";

const SCORES = [1, 2, 3, 4, 5];

// 읽기 모드: 평균 별 + 숫자. 입력 모드: 1~5 클릭.
export default function StarRating({
  value = 0,
  count,
  editable = false,
  onChange,
  size = 16,
  label = "별점",
}) {
  if (!editable) {
    return (
      <span className="star-rating">
        <span className="star-rating-stars" aria-hidden="true">
          {SCORES.map((score) => (
            <StarIcon
              key={score}
              filled={score <= Math.round(value)}
              width={size}
              height={size}
            />
          ))}
        </span>
        <span className="star-rating-text">
          {value ? value.toFixed(1) : "평가 없음"}
          {count !== undefined && count > 0 ? ` (${count})` : ""}
        </span>
      </span>
    );
  }

  return (
    <div
      className="star-rating star-rating--input"
      role="radiogroup"
      aria-label={label}
    >
      {SCORES.map((score) => (
        <button
          key={score}
          type="button"
          role="radio"
          aria-checked={value === score}
          aria-label={`${score}점`}
          className={`star-rating-btn${score <= value ? " active" : ""}`}
          onClick={() => onChange(score)}
        >
          <StarIcon filled={score <= value} width={size} height={size} />
        </button>
      ))}
    </div>
  );
}
