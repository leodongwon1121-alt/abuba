import { Outlet } from "react-router-dom";
import BottomTabBar from "../../components/BottomTabBar.jsx";
import PageTransition from "../../components/PageTransition.jsx";
import FishMascot from "../../components/FishMascot.jsx";
import { QrIcon, MarketIcon, UserIcon } from "../../components/icons.jsx";

const TABS = [
  { to: "/consumer/qr", label: "상품QR", Icon: QrIcon },
  { to: "/consumer/market", label: "수산시장", Icon: MarketIcon },
  { to: "/consumer/mypage", label: "마이페이지", Icon: UserIcon },
];

export default function ConsumerHome() {
  return (
    <>
      <header className="home-header">
        <div className="home-header-icon">
          <FishMascot size={24} />
        </div>
        <div className="home-header-text">
          <p className="home-title">어부바</p>
          <p className="home-sub">수산시장을 한손에</p>
        </div>
      </header>
      <PageTransition>
        <Outlet />
      </PageTransition>
      <BottomTabBar tabs={TABS} />
    </>
  );
}
