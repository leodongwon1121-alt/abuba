import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { REGIONS } from "../../data/marineRegions.js";
import FishThumb from "../../components/FishThumb.jsx";
import PriceChange from "../../components/PriceChange.jsx";
import StarRating from "../../components/StarRating.jsx";
import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { MarketIcon, SearchIcon } from "../../components/icons.jsx";

export default function FishMarket() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [meta, setMeta] = useState(null);
  const [following, setFollowing] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [query, setQuery] = useState("");
  const [fisherResults, setFisherResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listMarket(), api.getMarketMeta()]).then(
      ([items, metaData]) => {
        setListings(items);
        setMeta(metaData);
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    if (!user) {
      setFollowing([]);
      return;
    }
    api.listFollowing().then(setFollowing).catch(() => setFollowing([]));
  }, [user]);

  // 어부 검색은 입력이 있을 때만 서버에 묻는다.
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setFisherResults([]);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      api
        .searchFishers(term)
        .then((res) => {
          if (!cancelled) setFisherResults(res);
        })
        .catch(() => {
          if (!cancelled) setFisherResults([]);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, user]);

  const regionName = (id) => REGIONS.find((r) => r.id === id)?.name ?? id;

  const onSale = listings.filter((l) => l.status !== "sold");
  const visible = speciesFilter
    ? onSale.filter((l) => l.speciesId === speciesFilter)
    : onSale;

  const followingIds = useMemo(
    () => new Set(following.map((f) => f.id)),
    [following],
  );
  const followedListings = onSale.filter((l) => followingIds.has(l.sellerId));

  const speciesOptions = Array.from(
    new Map(onSale.map((l) => [l.speciesId, l.speciesName])).entries(),
  );

  const renderCard = (listing) => (
    <Link
      to={`/consumer/market/${listing.id}`}
      className="market-card market-card--link"
    >
      <FishThumb speciesId={listing.speciesId} />
      <div className="market-card-body">
        <div className="market-card-top">
          <span className="market-card-species">{listing.speciesName}</span>
        </div>
        <p className="market-card-meta">
          {listing.count}마리 · 총 {listing.totalKg} kg ·{" "}
          {regionName(listing.regionId)}
        </p>
        <p className="market-card-price">
          {listing.price.toLocaleString("ko-KR")}원
        </p>
        <p className="market-card-seller">
          {listing.sellerName}
          {listing.sellerRating?.avg ? (
            <span className="market-card-rating">
              ★ {listing.sellerRating.avg.toFixed(1)}
            </span>
          ) : null}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="screen page-transition">
      <h2 className="section-title">수산시장</h2>
      <p className="section-desc">
        도매 후 남은 물량을 어부에게 직접 소량으로 구매하세요
      </p>

      <div className="search-field">
        <SearchIcon width={18} height={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="어부 이름으로 검색"
          aria-label="어부 검색"
        />
      </div>

      {query.trim() && (
        <>
          <h3 className="market-section-heading">어부 검색 결과</h3>
          {fisherResults.length === 0 ? (
            <p className="section-desc">일치하는 어부가 없어요.</p>
          ) : (
            <ul className="follow-list">
              {fisherResults.map((f) => (
                <li key={f.id}>
                  <Link to={`/consumer/fisher/${f.id}`} className="follow-card">
                    <Avatar src={f.avatar} name={f.name} size="sm" />
                    <div className="follow-card-body">
                      <p className="follow-card-name">{f.name}</p>
                      <StarRating
                        value={f.rating?.avg ?? 0}
                        count={f.rating?.count}
                      />
                    </div>
                    {f.isFollowing && <span className="badge">팔로잉</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {followedListings.length > 0 && (
        <>
          <h3 className="market-section-heading">팔로우한 어부의 상품</h3>
          <ul className="market-list">
            {followedListings.map((listing) => (
              <li key={`followed-${listing.id}`}>{renderCard(listing)}</li>
            ))}
          </ul>
        </>
      )}

      {meta && (
        <>
          <h3 className="market-section-heading">오늘 인기 어종</h3>
          <div className="ranking-row">
            {meta.popular.map((item, index) => (
              <div key={item.speciesId} className="ranking-card">
                <span className="ranking-rank">{index + 1}</span>
                <span className="ranking-name">{item.speciesName}</span>
                <span className="ranking-price">
                  {item.quote.current.toLocaleString("ko-KR")}원/kg
                </span>
                <PriceChange
                  diff={item.quote.diff}
                  diffRate={item.quote.diffRate}
                />
              </div>
            ))}
          </div>

          <h3 className="market-section-heading">지금 제철</h3>
          <div className="season-row">
            {meta.inSeason.map((item) => (
              <div key={item.speciesId} className="season-card">
                <FishThumb speciesId={item.speciesId} />
                <div>
                  <p className="season-card-name">{item.speciesName}</p>
                  <p className="season-card-note">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="market-section-heading">판매 중인 상품</h3>
      <div className="species-chip-row">
        <button
          type="button"
          className={`species-chip${speciesFilter === "" ? " active" : ""}`}
          aria-pressed={speciesFilter === ""}
          onClick={() => setSpeciesFilter("")}
        >
          전체
        </button>
        {speciesOptions.map(([id, name]) => (
          <button
            key={id}
            type="button"
            className={`species-chip${speciesFilter === id ? " active" : ""}`}
            aria-pressed={speciesFilter === id}
            onClick={() => setSpeciesFilter(id)}
          >
            {name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="section-desc">상품을 불러오는 중...</p>
      ) : visible.length === 0 ? (
        <EmptyState
          Icon={MarketIcon}
          title="판매 중인 상품이 없어요"
          description="다른 어종을 선택해보세요."
        />
      ) : (
        <ul className="market-list">
          {visible.map((listing) => (
            <li key={listing.id}>{renderCard(listing)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
