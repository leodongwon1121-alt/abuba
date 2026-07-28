import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import SignupFisher from "./pages/auth/SignupFisher.jsx";
import SignupConsumer from "./pages/auth/SignupConsumer.jsx";
import Login from "./pages/auth/Login.jsx";
import FisherHome from "./pages/fisher/FisherHome.jsx";
import FisherDashboard from "./pages/fisher/FisherDashboard.jsx";
import Weather from "./pages/fisher/Weather.jsx";
import Harvest from "./pages/fisher/Harvest.jsx";
import ClosedSeason from "./pages/fisher/ClosedSeason.jsx";
import ShipMaintenance from "./pages/fisher/ShipMaintenance.jsx";
import FisherProfile from "./pages/fisher/FisherProfile.jsx";
import FisherMarket from "./pages/fisher/FisherMarket.jsx";
import ConsumerHome from "./pages/consumer/ConsumerHome.jsx";
import ProductQR from "./pages/consumer/ProductQR.jsx";
import FishMarket from "./pages/consumer/FishMarket.jsx";
import MarketDetail from "./pages/consumer/MarketDetail.jsx";
import FisherPublicProfile from "./pages/consumer/FisherPublicProfile.jsx";
import Checkout from "./pages/consumer/Checkout.jsx";
import MyPage from "./pages/consumer/MyPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/fisher" element={<SignupFisher />} />
        <Route path="/signup/consumer" element={<SignupConsumer />} />
        <Route path="/login" element={<Login />} />

        <Route path="/fisher" element={<FisherHome />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<FisherDashboard />} />
          <Route path="weather" element={<Weather />} />
          <Route path="harvest" element={<Harvest />} />
          <Route path="closed-season" element={<ClosedSeason />} />
          <Route path="maintenance" element={<ShipMaintenance />} />
          <Route path="market" element={<FisherMarket />} />
          <Route path="profile" element={<FisherProfile />} />
        </Route>

        <Route path="/consumer" element={<ConsumerHome />}>
          <Route index element={<Navigate to="qr" replace />} />
          <Route path="qr" element={<ProductQR />} />
          <Route path="market" element={<FishMarket />} />
          <Route path="market/:id" element={<MarketDetail />} />
          <Route path="market/:id/checkout" element={<Checkout />} />
          <Route path="fisher/:id" element={<FisherPublicProfile />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
