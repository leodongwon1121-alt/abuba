import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api/client.js";
import { FISH_SPECIES } from "../../data/fishRegulations.js";
import { REGIONS } from "../../data/marineRegions.js";
import FishThumb from "../../components/FishThumb.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { MarketIcon } from "../../components/icons.jsx";

function emptyForm() {
  return {
    speciesId: "",
    count: "",
    kgPerFish: "",
    price: "",
    regionId: "",
  };
}

export default function FisherMarket() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.listMyListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, [user]);

  const totalKg = useMemo(() => {
    const count = Number(form.count);
    const kgPerFish = Number(form.kgPerFish);
    if (!count || !kgPerFish) return null;
    return Math.round(count * kgPerFish * 10) / 10;
  }, [form.count, form.kgPerFish]);

  if (!user) {
    return (
      <div className="screen page-transition">
        <EmptyState
          Icon={MarketIcon}
          title="로그인 후 이용해주세요"
          description="판매글을 올리려면 어부 계정으로 로그인하세요."
        />
      </div>
    );
  }

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const regionName = (id) => REGIONS.find((r) => r.id === id)?.name ?? id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.speciesId) {
      setError("어종을 선택해주세요.");
      return;
    }
    const species = FISH_SPECIES.find((s) => s.id === form.speciesId);
    setError("");
    setSubmitting(true);
    try {
      const created = await api.addListing({
        sellerId: user.id,
        sellerName: user.nickname || user.email?.split("@")[0] || "어부바 판매자",
        speciesId: species.id,
        speciesName: species.어종명,
        count: Number(form.count),
        kgPerFish: Number(form.kgPerFish),
        price: Number(form.price),
        regionId: form.regionId,
      });
      setListings((prev) => [...prev, created]);
      setForm(emptyForm());
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (listing) => {
    if (!window.confirm("이 판매글을 삭제할까요?")) return;
    try {
      await api.deleteListing(listing.id);
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="screen page-transition">
      <h2 className="section-title">판매 관리</h2>
      <p className="section-desc">
        도매 후 남은 물량을 소비자에게 직접 판매해보세요
      </p>

      {showForm ? (
        <form className="harvest-form" onSubmit={handleSubmit}>
          <div className="field">
            <label id="sellSpeciesLabel">어종</label>
            <div
              className="species-chip-row"
              role="group"
              aria-labelledby="sellSpeciesLabel"
            >
              {FISH_SPECIES.map((species) => (
                <button
                  key={species.id}
                  type="button"
                  className={`species-chip${form.speciesId === species.id ? " active" : ""}`}
                  aria-pressed={form.speciesId === species.id}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, speciesId: species.id }))
                  }
                >
                  {species.어종명}
                </button>
              ))}
            </div>
          </div>

          <div className="harvest-form-row">
            <div className="field">
              <label htmlFor="count">마리 수</label>
              <input
                id="count"
                type="number"
                min="1"
                step="1"
                required
                value={form.count}
                onChange={update("count")}
              />
            </div>
            <div className="field">
              <label htmlFor="kgPerFish">마리당 kg</label>
              <input
                id="kgPerFish"
                type="number"
                min="0"
                step="0.1"
                required
                value={form.kgPerFish}
                onChange={update("kgPerFish")}
              />
            </div>
          </div>

          {totalKg !== null && (
            <p className="signup-hint">총 중량 {totalKg} kg</p>
          )}

          <div className="harvest-form-row">
            <div className="field">
              <label htmlFor="price">판매 가격 (원)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="100"
                required
                value={form.price}
                onChange={update("price")}
              />
            </div>
            <div className="field">
              <label htmlFor="regionId">어획 해역</label>
              <select
                id="regionId"
                required
                value={form.regionId}
                onChange={update("regionId")}
              >
                <option value="" disabled>
                  구역 선택
                </option>
                {REGIONS.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="harvest-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
            >
              취소
            </button>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "등록 중..." : "판매 등록하기"}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="btn btn-primary maintenance-add-btn"
          onClick={() => setShowForm(true)}
        >
          판매 등록하기
        </button>
      )}

      {error && <p className="error-text">{error}</p>}

      <h3 className="section-title maintenance-list-title">내 판매글</h3>
      {loading ? (
        <p className="section-desc">불러오는 중...</p>
      ) : listings.length === 0 ? (
        <EmptyState
          Icon={MarketIcon}
          title="아직 등록한 판매글이 없어요"
          description="남은 물량을 등록하면 소비자가 바로 볼 수 있어요."
        />
      ) : (
        <ul className="market-list">
          {listings.map((listing) => (
            <li key={listing.id} className="market-card">
              <FishThumb speciesId={listing.speciesId} />
              <div className="market-card-body">
                <div className="market-card-top">
                  <span className="market-card-species">
                    {listing.speciesName}
                  </span>
                  <span
                    className={`season-badge ${listing.status === "sold" ? "season-badge--closed" : "season-badge--open"}`}
                  >
                    {listing.status === "sold" ? "판매완료" : "판매중"}
                  </span>
                </div>
                <p className="market-card-meta">
                  {listing.count}마리 · 총 {listing.totalKg} kg ·{" "}
                  {regionName(listing.regionId)}
                </p>
                <p className="market-card-price">
                  {listing.price.toLocaleString("ko-KR")}원
                </p>
                <div className="harvest-item-actions">
                  <button type="button" onClick={() => handleDelete(listing)}>
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
