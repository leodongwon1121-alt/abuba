import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SignupConsumer() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', nickname: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await api.signupConsumer(form);
      login(user);
      navigate('/consumer');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen page-transition">
      <h1 className="title-xl">소비자 회원가입</h1>
      <p className="subtitle">신선한 수산물을 만나보세요</p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" required value={form.email} onChange={update('email')} />
        </div>
        <div className="field">
          <label htmlFor="nickname">닉네임</label>
          <input id="nickname" type="text" required value={form.nickname} onChange={update('nickname')} />
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

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? '가입 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
}
