import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import SignupFisher from './pages/auth/SignupFisher.jsx';
import SignupConsumer from './pages/auth/SignupConsumer.jsx';
import Login from './pages/auth/Login.jsx';
import FisherHome from './pages/fisher/FisherHome.jsx';
import Weather from './pages/fisher/Weather.jsx';
import Harvest from './pages/fisher/Harvest.jsx';
import ClosedSeason from './pages/fisher/ClosedSeason.jsx';
import ShipMaintenance from './pages/fisher/ShipMaintenance.jsx';
import ConsumerHome from './pages/consumer/ConsumerHome.jsx';
import ProductQR from './pages/consumer/ProductQR.jsx';
import FishMarket from './pages/consumer/FishMarket.jsx';
import Notifications from './pages/consumer/Notifications.jsx';
import MyPage from './pages/consumer/MyPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/fisher" element={<SignupFisher />} />
        <Route path="/signup/consumer" element={<SignupConsumer />} />
        <Route path="/login" element={<Login />} />

        <Route path="/fisher" element={<FisherHome />}>
          <Route index element={<Navigate to="weather" replace />} />
          <Route path="weather" element={<Weather />} />
          <Route path="harvest" element={<Harvest />} />
          <Route path="closed-season" element={<ClosedSeason />} />
          <Route path="maintenance" element={<ShipMaintenance />} />
        </Route>

        <Route path="/consumer" element={<ConsumerHome />}>
          <Route index element={<Navigate to="qr" replace />} />
          <Route path="qr" element={<ProductQR />} />
          <Route path="market" element={<FishMarket />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
