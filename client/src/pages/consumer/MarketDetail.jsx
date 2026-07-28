import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client.js";
import { REGIONS } from "../../data/marineRegions.js";
import FishThumb from "../../components/FishThumb.jsx";
import PriceChange from "../../components/PriceChange.jsx";
import PriceChart from "../../components/PriceChart.jsx";
import Avatar from "../../components/Avatar.jsx";
import StarRating from "../../components/StarRating.jsx";
import { ChevronRightIcon } from "../../components/icons.jsx";

const PERIODS = [
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "6m", label: "6개월" },
  { id: "1y", label: "1년" },
  { id: "all", label: "전체" },
];

export default function MarketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [period, setPeriod] = useState("3m");
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    api
      .getMarketListing(id)
      .then(setListing)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!showQuote || !listing) return;
    api.getQuote(listing.speciesId, period).then(setQuote);
  }, [showQuote, period, listing]);

  if (error) {
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
        <p className="section-desc">상품을 불러오는 중...</p>
      </div>
    );
  }

  const regionName =
    REGIONS.find((r) => r.id === listing.regionId)?.name ?? listing.regionId;
  const unitPrice =
    listing.totalKg > 0 ? Math.round(listing.price / listing.totalKg) : 0;
  const isSold = listing.status === "sold";

  return (
    <div className="screen page-transition">
      <FishThumb speciesId={listing.speciesId} size="lg" />

      <h2 className="section-title market-detail-title">{listing.speciesName}</h2>
      <p className="market-detail-seller">{regionName} 어획</p>

      <Link
        to={`/consumer/fisher/${listing.sellerId}`}
        className="seller-card"
        aria-label={`${listing.sellerName} 어부 프로필 보기`}
      >
        <Avatar src={listing.sellerAvatar} name={listing.sellerName} size="sm" />
        <div className="seller-card-body">
          <p className="seller-card-name">{listing.sellerName}</p>
          {listing.sellerRating?.count ? (
            <StarRating
              value={listing.sellerRating.avg}
              count={listing.sellerRating.count}
            />
          ) : (
            <p className="seller-card-note">
              {listing.sellerShipType ?? "아직 받은 별점이 없어요"}
            </p>
          )}
        </div>
        <span className="seller-card-cta">
          프로필
          <ChevronRightIcon width={16} height={16} />
        </span>
      </Link>

      <div className="detail-grid market-detail-specs">
        <div className="detail-item">
          <span className="detail-label">마리 수</span>
          <span className="detail-value">{listing.count}마리</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">마리당</span>
          <span className="detail-value">{listing.kgPerFish} kg</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">총 중량</span>
          <span className="detail-value">{listing.totalKg} kg</span>
        </div>
      </div>

      <div className="market-price-block">
        <span className="market-price-label">판매가</span>
        <span className="market-price-value">
          {listing.price.toLocaleString("ko-KR")}원
        </span>
        <span className="market-price-unit">
          kg당 {unitPrice.toLocaleString("ko-KR")}원
        </span>

        <div className="market-quote-line">
          <span className="market-quote-label">최근 시세</span>
          <span className="market-quote-value">
            {listing.quote.current.toLocaleString("ko-KR")}원/kg
          </span>
          <PriceChange
            diff={listing.quote.diff}
            diffRate={listing.quote.diffRate}
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary market-quote-toggle"
          onClick={() => setShowQuote((prev) => !prev)}
        >
          {showQuote ? "시세 닫기" : "시세 보기"}
        </button>
      </div>

      {showQuote && (
        <section className="market-quote-panel">
          <div className="toggle-group filter-toggle">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`toggle-option${period === p.id ? " active" : ""}`}
                aria-pressed={period === p.id}
                onClick={() => setPeriod(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {quote ? (
            <>
              <PriceChart series={quote.series} />

              <h3 className="market-section-heading">같은 어종 판매자 비교</h3>
              {quote.avgUnitPrice !== null && (
                <p className="section-desc">
                  평균 kg당 {quote.avgUnitPrice.toLocaleString("ko-KR")}원
                </p>
              )}
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>판매자</th>
                    <th>중량</th>
                    <th>kg당</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.sellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className={seller.id === listing.id ? "compare-row--self" : ""}
                    >
                      <td>{seller.sellerName}</td>
                      <td>{seller.totalKg} kg</td>
                      <td>{seller.unitPrice.toLocaleString("ko-KR")}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="section-desc">시세를 불러오는 중...</p>
          )}
        </section>
      )}

      <button
        type="button"
        className="btn btn-primary market-buy-btn"
        disabled={isSold}
        onClick={() => navigate(`/consumer/market/${listing.id}/checkout`)}
      >
        {isSold ? "판매 완료된 상품이에요" : "구매하기"}
      </button>

      <Link to="/consumer/market" className="btn btn-secondary">
        목록으로
      </Link>
    </div>
  );
}
