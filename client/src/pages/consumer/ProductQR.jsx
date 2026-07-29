import { useEffect, useRef, useState } from "react";
import { CameraIcon } from "../../components/icons.jsx";

const EXAMPLE_RESULT = {
  species: "고등어",
  shipName: "부산호 (중형 어선)",
  captainName: "김어부",
  caughtDate: "2026-07-20",
};

function getCameraErrorMessage(err) {
  if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
    return "카메라 권한이 필요해요. 브라우저 설정에서 카메라 접근을 허용해주세요.";
  }
  if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
    return "사용 가능한 카메라를 찾을 수 없어요.";
  }
  return "카메라를 연결하는 중 문제가 발생했어요.";
}

export default function ProductQR() {
  const [status, setStatus] = useState("idle"); // idle | starting | active | error
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const cameraSupported =
    typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
  };

  const startCamera = async () => {
    setErrorMessage("");
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // autoPlay가 막히는 브라우저가 있어 명시적으로 재생을 시도한다.
        videoRef.current.play?.().catch(() => {});
      }
      setStatus("active");
    } catch (err) {
      setErrorMessage(getCameraErrorMessage(err));
      setStatus("error");
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="screen page-transition">
      <h2 className="section-title">상품 QR 스캔</h2>
      <p className="section-desc">
        물고기에 붙은 QR 라벨을 스캔하면 잡은 선박·선장·조업 날짜를 확인할 수
        있어요.
      </p>

      {/* video는 항상 렌더한다. 조건부로 렌더하면 스트림을 넣는 시점에 아직 DOM에 없어
          videoRef.current가 null이라 화면이 검게 남는다. 안내문은 위에 겹쳐 띄운다. */}
      <div className="qr-scan-frame">
        <video ref={videoRef} className="qr-scan-video" autoPlay playsInline muted />
        {status === "active" ? (
          <>
            <span className="qr-scan-corner qr-scan-corner-tl" />
            <span className="qr-scan-corner qr-scan-corner-tr" />
            <span className="qr-scan-corner qr-scan-corner-bl" />
            <span className="qr-scan-corner qr-scan-corner-br" />
          </>
        ) : (
          <div className="qr-scan-placeholder">
            <div className="qr-scan-placeholder-icon">
              <CameraIcon width={26} height={26} />
            </div>
            <p className="qr-scan-placeholder-text">
              {status === "error"
                ? errorMessage
                : cameraSupported
                  ? "카메라를 연결해주세요"
                  : "이 브라우저는 카메라 기능을 지원하지 않아요."}
            </p>
          </div>
        )}
      </div>

      <div className="qr-scan-actions">
        {status === "active" ? (
          <button type="button" className="btn btn-secondary" onClick={stopCamera}>
            카메라 끄기
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={startCamera}
            disabled={status === "starting" || !cameraSupported}
          >
            {status === "starting" ? "연결 중..." : "카메라로 스캔하기"}
          </button>
        )}
      </div>

      <div className="qr-example-heading">
        <h3>스캔하면 이렇게 표시돼요</h3>
        <span className="badge">예시</span>
      </div>
      <div className="ship-card">
        <div className="ship-card-header">
          <span className="ship-card-label">{EXAMPLE_RESULT.species} · 어획 정보</span>
        </div>
        <div className="ship-card-grid">
          <div className="ship-card-item">
            <span className="ship-card-item-label">선박</span>
            <span className="ship-card-item-value">{EXAMPLE_RESULT.shipName}</span>
          </div>
          <div className="ship-card-item">
            <span className="ship-card-item-label">선장</span>
            <span className="ship-card-item-value">{EXAMPLE_RESULT.captainName}</span>
          </div>
          <div className="ship-card-item">
            <span className="ship-card-item-label">잡은 날짜</span>
            <span className="ship-card-item-value">{EXAMPLE_RESULT.caughtDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
