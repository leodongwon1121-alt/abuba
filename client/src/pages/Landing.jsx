import { useNavigate } from 'react-router-dom';
import SeaWave from '../components/SeaWave.jsx';
import FishMascot from '../components/FishMascot.jsx';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="screen landing-screen page-transition">
      <div className="landing-content">
        <FishMascot size={80} className="landing-logo" />
        <h1 className="title-xl">어부바</h1>
        <p className="subtitle">부산 어부와 소비자를 잇는 수산물 플랫폼</p>

        <div style={{ width: '100%' }}>
          <button className="btn btn-primary" onClick={() => navigate('/signup/fisher')}>
            어부로 시작하기
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/signup/consumer')}>
            소비자로 시작하기
          </button>
        </div>

        <span className="link-muted">
          이미 계정이 있으신가요?{' '}
          <b onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
            로그인
          </b>
        </span>
      </div>

      <SeaWave />
    </div>
  );
}
