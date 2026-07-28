import { useNavigate } from "react-router-dom";
import FishMascot from "../components/FishMascot.jsx";
import landingBg from "../assets/landing-bg.jpg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="screen landing-screen page-transition">
      <div
        className="landing-photo"
        style={{ backgroundImage: `url(${landingBg})` }}
      />
      <div className="landing-scrim" />

      <div className="landing-content">
        <div className="landing-logo-badge">
          <FishMascot size={44} />
        </div>
        <h1 className="title-xl">어부바</h1>
        <p className="subtitle">부산 어부와 소비자를 잇는 수산물 플랫폼</p>

        <div className="landing-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/signup/fisher")}
          >
            어부로 시작하기
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/signup/consumer")}
          >
            소비자로 시작하기
          </button>
        </div>

        <span className="link-muted">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            className="link-inline"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </span>
      </div>
    </div>
  );
}
