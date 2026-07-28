import { BackIcon } from "./icons.jsx";
import landingBg from "../assets/landing-bg.jpg";

export default function AuthHero({
  title,
  onBack,
  backLabel,
  backDisabled,
  stepLabel,
  stepLabelRef,
  progress,
}) {
  return (
    <header className="signup-hero">
      <div
        className="signup-hero-photo"
        style={{ backgroundImage: `url(${landingBg})` }}
      />
      <div className="signup-hero-scrim" />

      <div className="signup-hero-content">
        <button
          type="button"
          className="signup-back"
          aria-label={backLabel}
          onClick={onBack}
          disabled={backDisabled}
        >
          <BackIcon />
        </button>

        <div className="signup-hero-bottom">
          {stepLabel && (
            <p className="signup-step-label" ref={stepLabelRef} tabIndex={-1}>
              {stepLabel}
            </p>
          )}
          <h1 className="title-xl">{title}</h1>
          {progress && (
            <div
              className="signup-progress"
              role="progressbar"
              aria-label="가입 진행률"
              aria-valuemin={1}
              aria-valuemax={progress.max}
              aria-valuenow={progress.current}
              aria-valuetext={progress.text}
            >
              <div
                className="signup-progress-fill"
                style={{ width: `${(progress.current / progress.max) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
