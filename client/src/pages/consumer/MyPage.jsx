import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Avatar from "../../components/Avatar.jsx";
import StarRating from "../../components/StarRating.jsx";
import ProfileEditForm from "../../components/ProfileEditForm.jsx";
import FishThumb from "../../components/FishThumb.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { UserIcon, MarketIcon, LogoutIcon } from "../../components/icons.jsx";

const TABS = [
  { id: "purchases", label: "구매 내역" },
  { id: "following", label: "팔로잉" },
];

export default function MyPage() {
  const { user, setProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("purchases");
  const [editing, setEditing] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFor, setRatingFor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    Promise.all([api.listMyPurchases(), api.listFollowing()])
      .then(([p, f]) => {
        setPurchases(p);
        setFollowing(f);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="screen page-transition">
        <EmptyState
          Icon={UserIcon}
          title="로그인 후 이용해주세요"
          description="구매 내역과 팔로잉 목록을 보려면 로그인하세요."
        />
        <Link to="/login" className="btn btn-primary">
          로그인
        </Link>
      </div>
    );
  }

  const displayName = user.nickname || user.email?.split("@")[0] || "회원";

  const handleSaveProfile = async (payload) => {
    const updated = await api.updateProfile(payload);
    setProfile(updated);
    setEditing(false);
  };

  const handleRate = async (listingId, score) => {
    setError("");
    try {
      await api.rateListing(listingId, score);
      setPurchases((prev) =>
        prev.map((p) => (p.id === listingId ? { ...p, myRating: score } : p)),
      );
      setRatingFor(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="screen page-transition">
      <h2 className="section-title">마이페이지</h2>

      {editing ? (
        <ProfileEditForm
          user={user}
          onSave={handleSaveProfile}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="account-card">
          <Avatar src={user.avatar} name={displayName} size="md" />
          <div className="account-card-body">
            <p className="account-card-name">{displayName}</p>
            <p className="account-card-email">{user.email}</p>
            {user.bio && <p className="account-card-bio">{user.bio}</p>}
          </div>
          <button
            type="button"
            className="ship-card-edit account-card-edit"
            onClick={() => setEditing(true)}
          >
            프로필 편집
          </button>
        </div>
      )}

      <div className="toggle-group segment-toggle">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`toggle-option${tab === t.id ? " active" : ""}`}
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="section-desc">불러오는 중...</p>
      ) : tab === "purchases" ? (
        purchases.length === 0 ? (
          <EmptyState
            Icon={MarketIcon}
            title="아직 구매한 상품이 없어요"
            description="수산시장에서 신선한 수산물을 만나보세요."
          />
        ) : (
          <ul className="market-list">
            {purchases.map((p) => (
              <li key={p.id} className="market-card">
                <FishThumb speciesId={p.speciesId} />
                <div className="market-card-body">
                  <div className="market-card-top">
                    <span className="market-card-species">{p.speciesName}</span>
                  </div>
                  <p className="market-card-meta">
                    {p.count}마리 · 총 {p.totalKg} kg
                  </p>
                  <p className="market-card-price">
                    {p.price.toLocaleString("ko-KR")}원
                  </p>
                  <p className="market-card-seller">
                    {p.sellerName} · 주문번호 {p.orderNo}
                  </p>

                  {p.myRating ? (
                    <div className="purchase-rating">
                      <StarRating value={p.myRating} />
                    </div>
                  ) : ratingFor === p.id ? (
                    <div className="purchase-rating">
                      <StarRating
                        value={0}
                        editable
                        size={22}
                        onChange={(score) => handleRate(p.id, score)}
                        label={`${p.speciesName} 별점`}
                      />
                      <button
                        type="button"
                        className="link-muted"
                        onClick={() => setRatingFor(null)}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="harvest-item-actions">
                      <button type="button" onClick={() => setRatingFor(p.id)}>
                        별점 남기기
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )
      ) : following.length === 0 ? (
        <EmptyState
          Icon={UserIcon}
          title="팔로우한 어부가 없어요"
          description="수산시장에서 어부를 찾아 팔로우해보세요."
        />
      ) : (
        <ul className="follow-list">
          {following.map((f) => (
            <li key={f.id}>
              <Link to={`/consumer/fisher/${f.id}`} className="follow-card">
                <Avatar src={f.avatar} name={f.name} size="sm" />
                <div className="follow-card-body">
                  <p className="follow-card-name">{f.name}</p>
                  <StarRating value={f.rating?.avg ?? 0} count={f.rating?.count} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="btn btn-secondary logout-btn"
        onClick={handleLogout}
      >
        <LogoutIcon width={16} height={16} />
        로그아웃
      </button>
    </div>
  );
}
