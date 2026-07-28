import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../../components/icons.jsx";
import landingBg from "../../assets/landing-bg.jpg";

const MENU = [
  { to: "/fisher/weather", label: "날씨" },
  { to: "/fisher/harvest", label: "수확" },
  { to: "/fisher/closed-season", label: "금어기" },
  { to: "/fisher/market", label: "판매 관리" },
  { to: "/fisher/profile", label: "프로필" },
];

export default function FisherDashboard() {
  return (
    <div className="screen">
      <nav className="home-menu" aria-label="주요 기능">
        {MENU.map(({ to, label }) => (
          <Link key={to} to={to} className="home-menu-item">
            <span
              className="home-menu-photo"
              style={{ backgroundImage: `url(${landingBg})` }}
            />
            <span className="home-menu-scrim" />
            <span className="home-menu-label">{label}</span>
            <ChevronRightIcon className="home-menu-chevron" width={20} height={20} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
