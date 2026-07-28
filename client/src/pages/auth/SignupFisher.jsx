import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

const SHIP_TYPES = ['소형 어선', '중형 어선', '대형 어선', '양식선', '기타'];

function YesNoToggle({ value, onChange, yesLabel = '있음', noLabel = '없음' }) {
  return (
    <div className="toggle-group">
      <div
        className={`toggle-option${value ? ' active' : ''}`}
        onClick={() => onChange(true)}
      >
        {yesLabel}
      </div>
      <div
        className={`toggle-option${!value ? ' active' : ''}`}
        onClick={() => onChange(false)}
      >
        {noLabel}
      </div>
    </div>
  );
}

export default function SignupFisher() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    shipType: SHIP_TYPES[0],
    shipPurchaseDate: '',
  });
  const [hasLicense, setHasLicense] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hasMaintenance, setHasMaintenance] = useState(false);
  const [maintenance, setMaintenance] = useState({ date: '', parts: '', memo: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const updateMaintenance = (key) => (e) =>
    setMaintenance((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        license: hasLicense ? { hasLicense: true, licenseNumber } : { hasLicense: false },
        maintenance: hasMaintenance
          ? { hasMaintenance: true, ...maintenance }
          : { hasMaintenance: false },
      };
      const user = await api.signupFisher(payload);
      login(user);
      navigate('/fisher');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen page-transition">
      <h1 className="title-xl">어부 회원가입</h1>
      <p className="subtitle">조업 정보를 등록하고 시작해보세요</p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" required value={form.email} onChange={update('email')} />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={update('password')}
          />
        </div>

        <div className="field">
          <label>면허 번호</label>
          <YesNoToggle value={hasLicense} onChange={setHasLicense} />
        </div>
        {hasLicense && (
          <div className="conditional-fields">
            <div className="field">
              <label htmlFor="licenseNumber">면허 번호</label>
              <input
                id="licenseNumber"
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="field">
          <label htmlFor="shipType">선박 종류</label>
          <select id="shipType" value={form.shipType} onChange={update('shipType')}>
            {SHIP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="shipPurchaseDate">선박 구매 날짜</label>
          <input
            id="shipPurchaseDate"
            type="date"
            required
            value={form.shipPurchaseDate}
            onChange={update('shipPurchaseDate')}
          />
        </div>

        <div className="field">
          <label>기존 정비 이력</label>
          <YesNoToggle value={hasMaintenance} onChange={setHasMaintenance} />
        </div>
        {hasMaintenance && (
          <div className="conditional-fields">
            <div className="field">
              <label htmlFor="maintenanceDate">정비 일자</label>
              <input
                id="maintenanceDate"
                type="date"
                value={maintenance.date}
                onChange={updateMaintenance('date')}
              />
            </div>
            <div className="field">
              <label htmlFor="maintenanceParts">교체/정비 부품</label>
              <input
                id="maintenanceParts"
                type="text"
                placeholder="예: 엔진, 프로펠러"
                value={maintenance.parts}
                onChange={updateMaintenance('parts')}
              />
            </div>
            <div className="field">
              <label htmlFor="maintenanceMemo">메모</label>
              <input
                id="maintenanceMemo"
                type="text"
                value={maintenance.memo}
                onChange={updateMaintenance('memo')}
              />
            </div>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? '가입 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
}
