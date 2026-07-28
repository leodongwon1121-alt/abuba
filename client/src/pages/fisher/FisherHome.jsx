import { Outlet } from "react-router-dom";
import BottomTabBar from "../../components/BottomTabBar.jsx";
import PageTransition from "../../components/PageTransition.jsx";
import FishMascot from "../../components/FishMascot.jsx";
import {
  HomeIcon,
  WeatherIcon,
  HarvestIcon,
  CalendarIcon,
  UserIcon,
} from "../../components/icons.jsx";
import landingBg from "../../assets/landing-bg.jpg";

const TABS = [
  { to: "/fisher/home", label: "홈", Icon: HomeIcon },
  { to: "/fisher/weather", label: "날씨", Icon: WeatherIcon },
  { to: "/fisher/harvest", label: "수확", Icon: HarvestIcon },
  { to: "/fisher/closed-season", label: "금어기", Icon: CalendarIcon },
  { to: "/fisher/profile", label: "프로필", Icon: UserIcon },
];

export default function FisherHome() {
  return (
    <>
      <header className="home-header fisher-header-photo">
        <div
          className="fisher-header-bg-photo"
          style={{ backgroundImage: `url(${landingBg})` }}
        />
        <div className="fisher-header-scrim" />
        <div className="home-header-icon">
          <FishMascot size={24} />
        </div>
        <div className="home-header-text">
          <p className="home-title">어부바</p>
          <p className="home-sub">바다는 어부에게 어부는 우리에게</p>
        </div>
      </header>
      <PageTransition>
        <Outlet />
      </PageTransition>
      <BottomTabBar tabs={TABS} />
    </>
  );
}
