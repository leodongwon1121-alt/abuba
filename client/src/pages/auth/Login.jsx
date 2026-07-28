import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthHero from "../../components/AuthHero.jsx";
import SectionHeading from "../../components/SectionHeading.jsx";
import { isValidEmail } from "../../utils/validators.js";
import { authErrorMessage } from "../../utils/authErrors.js";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    if (!form.email) return "이메일을 입력해주세요.";
    if (!isValidEmail(form.email)) return "이메일 형식을 확인해주세요.";
    if (!form.password) return "비밀번호를 입력해주세요.";
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
      const user = await signIn(form.email, form.password);
      navigate(user.accountType === "fisher" ? "/fisher" : "/consumer");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen signup-screen page-transition">
      <AuthHero
        title="로그인"
        onBack={() => navigate("/")}
        backLabel="시작 화면으로 돌아가기"
        backDisabled={submitting}
      />

      <div className="signup-sheet">
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="signup-step">
            <section className="signup-section">
              <SectionHeading>로그인 정보</SectionHeading>
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
                  <label htmlFor="password">비밀번호</label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={update("password")}
                  />
                </div>
              </div>
              <p className="signup-hint">어부바에서 다시 만나요.</p>
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
                {submitting ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
