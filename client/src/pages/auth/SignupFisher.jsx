import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthHero from "../../components/AuthHero.jsx";
import SectionHeading from "../../components/SectionHeading.jsx";
import { isValidEmail } from "../../utils/validators.js";
import { authErrorMessage } from "../../utils/authErrors.js";

const SHIP_TYPES = ["소형 어선", "중형 어선", "대형 어선", "양식선", "기타"];

const STEPS = [
  { id: "account", label: "계정 정보" },
  { id: "ship", label: "선박 정보" },
  { id: "maintenance", label: "정비 이력" },
];

function YesNoToggle({ value, onChange, yesLabel = "있음", noLabel = "없음" }) {
  return (
    <div className="toggle-group">
      <button
        type="button"
        className={`toggle-option${value ? " active" : ""}`}
        aria-pressed={value}
        onClick={() => onChange(true)}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        className={`toggle-option${!value ? " active" : ""}`}
        aria-pressed={!value}
        onClick={() => onChange(false)}
      >
        {noLabel}
      </button>
    </div>
  );
}

export default function SignupFisher() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: "",
    shipType: SHIP_TYPES[0],
    shipPurchaseDate: "",
  });
  const [hasLicense, setHasLicense] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hasMaintenance, setHasMaintenance] = useState(false);
  const [maintenance, setMaintenance] = useState({
    date: "",
    parts: "",
    memo: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stepLabelRef = useRef(null);
  const focusedStepRef = useRef(step);

  const isLastStep = step === STEPS.length - 1;

  // 단계가 바뀌면 단계 라벨로 포커스를 옮겨 변경 사실이 읽히게 한다.
  // step 값을 비교해서 판단한다 — StrictMode는 마운트 시 effect를 두 번 실행하므로
  // "첫 실행인가" 플래그로는 진입 직후 포커스를 훔치는 걸 막을 수 없다.
  useEffect(() => {
    if (focusedStepRef.current === step) {
      return;
    }
    focusedStepRef.current = step;
    stepLabelRef.current?.focus();
  }, [step]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const updateMaintenance = (key) => (e) =>
    setMaintenance((prev) => ({ ...prev, [key]: e.target.value }));

  const validateStep = (index) => {
    if (index === 0) {
      if (!form.email) return "이메일을 입력해주세요.";
      if (!isValidEmail(form.email)) return "이메일 형식을 확인해주세요.";
      if (!form.password) return "비밀번호를 입력해주세요.";
      if (form.password.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
    }
    if (index === 1) {
      if (hasLicense && !licenseNumber) return "면허 번호를 입력해주세요.";
      if (!form.shipType) return "선박 종류를 선택해주세요.";
      if (!form.shipPurchaseDate) return "선박 구매 날짜를 입력해주세요.";
    }
    return "";
  };

  const goNext = () => {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goPrev = () => {
    setError("");
    if (step === 0) {
      navigate("/");
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    for (let i = 0; i < STEPS.length; i += 1) {
      const message = validateStep(i);
      if (message) {
        setError(message);
        setStep(i);
        return;
      }
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        license: hasLicense
          ? { hasLicense: true, licenseNumber }
          : { hasLicense: false },
        maintenance: hasMaintenance
          ? { hasMaintenance: true, ...maintenance }
          : { hasMaintenance: false },
      };
      const { password, ...profile } = payload;
      await signUp(form.email, password, () => api.signupFisher(profile));
      navigate("/fisher");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen signup-screen page-transition">
      <AuthHero
        title="어부 회원가입"
        onBack={goPrev}
        backLabel={step === 0 ? "시작 화면으로 돌아가기" : "이전 단계로"}
        backDisabled={submitting}
        stepLabel={`${step + 1} / ${STEPS.length} · ${STEPS[step].label}`}
        stepLabelRef={stepLabelRef}
        progress={{
          current: step + 1,
          max: STEPS.length,
          text: `${STEPS.length}단계 중 ${step + 1}단계 · ${STEPS[step].label}`,
        }}
      />

      <div className="signup-sheet">
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="signup-step page-transition" key={STEPS[step].id}>
            {step === 0 && (
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
            )}

            {step === 1 && (
              <>
                <section className="signup-section">
                  <SectionHeading>조업 면허</SectionHeading>
                  <div className="form-stack">
                    <div className="field">
                      <label>면허 보유 여부</label>
                      <YesNoToggle
                        value={hasLicense}
                        onChange={setHasLicense}
                      />
                    </div>
                    {hasLicense && (
                      <div className="conditional-fields">
                        <div className="field">
                          <label htmlFor="licenseNumber">면허 번호</label>
                          <input
                            id="licenseNumber"
                            type="text"
                            required
                            placeholder="예: 부산-12345"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="signup-section">
                  <SectionHeading>선박 정보</SectionHeading>
                  <div className="form-stack">
                    <div className="field">
                      <label id="shipTypeGroupLabel">선박 종류</label>
                      <div
                        className="species-chip-row"
                        role="group"
                        aria-labelledby="shipTypeGroupLabel"
                      >
                        {SHIP_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`species-chip${form.shipType === type ? " active" : ""}`}
                            aria-pressed={form.shipType === type}
                            onClick={() =>
                              setForm((prev) => ({ ...prev, shipType: type }))
                            }
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="shipPurchaseDate">선박 구매 날짜</label>
                      <input
                        id="shipPurchaseDate"
                        type="date"
                        required
                        value={form.shipPurchaseDate}
                        onChange={update("shipPurchaseDate")}
                      />
                    </div>
                  </div>
                </section>
              </>
            )}

            {step === 2 && (
              <section className="signup-section">
                <SectionHeading>정비 이력</SectionHeading>
                <div className="form-stack">
                  <div className="field">
                    <label>기존 정비 이력</label>
                    <YesNoToggle
                      value={hasMaintenance}
                      onChange={setHasMaintenance}
                    />
                  </div>
                  {hasMaintenance && (
                    <div className="conditional-fields">
                      <div className="field">
                        <label htmlFor="maintenanceDate">정비 일자</label>
                        <input
                          id="maintenanceDate"
                          type="date"
                          value={maintenance.date}
                          onChange={updateMaintenance("date")}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="maintenanceParts">교체/정비 부품</label>
                        <input
                          id="maintenanceParts"
                          type="text"
                          placeholder="예: 엔진, 프로펠러"
                          value={maintenance.parts}
                          onChange={updateMaintenance("parts")}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="maintenanceMemo">메모</label>
                        <input
                          id="maintenanceMemo"
                          type="text"
                          placeholder="예: 정기 점검 후 오일 교체"
                          value={maintenance.memo}
                          onChange={updateMaintenance("memo")}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="signup-hint">
                  {hasMaintenance
                    ? "정비 일자와 부품을 함께 입력하면 정비 이력에 자동으로 등록됩니다."
                    : "정비 이력은 선택 사항입니다. 가입 후 정비 화면에서도 추가할 수 있어요."}
                </p>
              </section>
            )}
          </div>

          <div className="signup-footer">
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <div className="signup-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary signup-btn-back"
                  onClick={goPrev}
                  disabled={submitting}
                >
                  뒤로
                </button>
              )}
              {isLastStep ? (
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "가입 중..." : "가입하기"}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={goNext}
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
