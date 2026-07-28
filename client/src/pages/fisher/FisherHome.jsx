import { Outlet } from 'react-router-dom';
import BottomTabBar from '../../components/BottomTabBar.jsx';
import PageTransition from '../../components/PageTransition.jsx';
import FishMascot from '../../components/FishMascot.jsx';
import { WeatherIcon, HarvestIcon, CalendarIcon, WrenchIcon } from '../../components/icons.jsx';

const TABS = [
  { to: '/fisher/weather', label: '날씨', Icon: WeatherIcon },
  { to: '/fisher/harvest', label: '수확기록', Icon: HarvestIcon },
  { to: '/fisher/closed-season', label: '금어기·체장', Icon: CalendarIcon },
  { to: '/fisher/maintenance', label: '선박정비', Icon: WrenchIcon },
];

export default function FisherHome() {
  return (
    <>
      <header className="home-header">
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
