import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthHero from "../../components/AuthHero.jsx";
import SectionHeading from "../../components/SectionHeading.jsx";
import { isValidEmail } from "../../utils/validators.js";
import { authErrorMessage } from "../../utils/authErrors.js";

export default function SignupConsumer() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: "", nickname: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    if (!form.email) return "이메일을 입력해주세요.";
    if (!isValidEmail(form.email)) return "이메일 형식을 확인해주세요.";
    if (!form.nickname) return "닉네임을 입력해주세요.";
    if (!form.password) return "비밀번호를 입력해주세요.";
    if (form.password.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await signUp(form.email, form.password, () =>
        api.signupConsumer({ email: form.email, nickname: form.nickname }),
      );
      navigate("/consumer");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen signup-screen page-transition">
      <AuthHero
        title="소비자 회원가입"
        onBack={() => navigate("/")}
        backLabel="시작 화면으로 돌아가기"
        backDisabled={submitting}
      />

      <div className="signup-sheet">
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="signup-step">
            <section className="signup-section">
              <SectionHeading>계정 정보</SectionHeading>
              <div className="form-stack">
                <div className="field">
                  <label htmlFor="email">이메일</label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="abuba@example.com"
                    value={form.email}
                    onChange={update("email")}
                  />
                </div>
                <div className="field">
                  <label htmlFor="nickname">닉네임</label>
                  <input
                    id="nickname"
                    type="text"
                    required
                    autoComplete="nickname"
                    value={form.nickname}
                    onChange={update("nickname")}
                  />
                </div>
                <div className="field">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={update("password")}
                  />
                </div>
              </div>
              <p className="signup-hint">
                가입 후 이 이메일과 비밀번호로 로그인합니다.
              </p>
            </section>
          </div>

          <div className="signup-footer">
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <div className="signup-actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "가입 중..." : "가입하기"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
