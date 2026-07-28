import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import FishThumb from "../../components/FishThumb.jsx";

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1-");
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function Checkout() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [status, setStatus] = useState("form"); // form | processing | done
  const [orderNo, setOrderNo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMarketListing(id)
      .then(setListing)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("processing");

    // 실제 결제 연동은 없다. 결제사 통신처럼 보이도록 잠깐 대기만 한다.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const result = await api.purchaseListing(id);
      setOrderNo(result.orderNo);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("form");
    }
  };

  if (error && !listing) {
    return (
      <div className="screen page-transition">
        <p className="error-text">{error}</p>
        <Link to="/consumer/market" className="btn btn-secondary">
          목록으로
        </Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="screen page-transition">
        <p className="section-desc">불러오는 중...</p>
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="screen page-transition checkout-processing">
        <div className="checkout-spinner" />
        <p className="checkout-processing-text">결제를 진행하고 있어요</p>
        <p className="section-desc">잠시만 기다려주세요...</p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="screen page-transition checkout-done">
        <div className="checkout-check">✓</div>
        <h2 className="section-title">결제가 완료되었어요</h2>
        <p className="section-desc">
          {listing.speciesName} {listing.totalKg} kg
        </p>

        <div className="ship-card">
          <div className="ship-card-header">
            <span className="ship-card-label">주문 정보</span>
          </div>
          <div className="ship-card-grid">
            <div className="ship-card-item">
              <span className="ship-card-item-label">주문번호</span>
              <span className="ship-card-item-value">{orderNo}</span>
            </div>
            <div className="ship-card-item">
              <span className="ship-card-item-label">결제 금액</span>
              <span className="ship-card-item-value">
                {listing.price.toLocaleString("ko-KR")}원
              </span>
            </div>
            <div className="ship-card-item">
              <span className="ship-card-item-label">판매자</span>
              <span className="ship-card-item-value">{listing.sellerName}</span>
            </div>
            <div className="ship-card-item">
              <span className="ship-card-item-label">상태</span>
              <span className="ship-card-item-value">결제 완료</span>
            </div>
          </div>
        </div>

        <Link to="/consumer/market" className="btn btn-primary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="screen page-transition">
      <h2 className="section-title">결제하기</h2>

      <div className="market-card checkout-summary">
        <FishThumb speciesId={listing.speciesId} />
        <div className="market-card-body">
          <span className="market-card-species">{listing.speciesName}</span>
          <p className="market-card-meta">
            {listing.count}마리 · 총 {listing.totalKg} kg
          </p>
          <p className="market-card-price">
            {listing.price.toLocaleString("ko-KR")}원
          </p>
        </div>
      </div>

      <form className="harvest-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="cardNumber">카드 번호</label>
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            required
            placeholder="0000-0000-0000-0000"
            value={card.number}
            onChange={(e) =>
              setCard((prev) => ({
                ...prev,
                number: formatCardNumber(e.target.value),
              }))
            }
          />
        </div>

        <div className="harvest-form-row">
          <div className="field">
            <label htmlFor="cardExpiry">유효기간</label>
            <input
              id="cardExpiry"
              type="text"
              inputMode="numeric"
              required
              placeholder="MM/YY"
              value={card.expiry}
              onChange={(e) =>
                setCard((prev) => ({
                  ...prev,
                  expiry: formatExpiry(e.target.value),
                }))
              }
            />
          </div>
          <div className="field">
            <label htmlFor="cardCvc">CVC</label>
            <input
              id="cardCvc"
              type="password"
              inputMode="numeric"
              required
              maxLength={3}
              placeholder="000"
              value={card.cvc}
              onChange={(e) =>
                setCard((prev) => ({
                  ...prev,
                  cvc: e.target.value.replace(/\D/g, "").slice(0, 3),
                }))
              }
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="cardName">카드 소유자명</label>
          <input
            id="cardName"
            type="text"
            required
            placeholder="홍길동"
            value={card.name}
            onChange={(e) =>
              setCard((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <p className="signup-hint">
          실제 결제가 이뤄지지 않는 데모 화면입니다. 카드 정보는 어디에도
          저장되지 않아요.
        </p>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" type="submit">
          {listing.price.toLocaleString("ko-KR")}원 결제하기
        </button>
      </form>

      <Link to={`/consumer/market/${listing.id}`} className="btn btn-secondary">
        돌아가기
      </Link>
    </div>
  );
}
