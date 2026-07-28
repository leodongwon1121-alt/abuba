import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileHeader from "../../components/ProfileHeader.jsx";

export default function FisherPublicProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api
      .getFisherProfile(id)
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [id, user]);

  const toggleFollow = async () => {
    if (!user) return;
    setError("");
    setPending(true);
    try {
      const updated = profile.isFollowing
        ? await api.unfollowFisher(profile.id)
        : await api.followFisher(profile.id);
      setProfile(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  if (error && !profile) {
    return (
      <div className="screen page-transition">
        <p className="error-text">{error}</p>
        <Link to="/consumer/market" className="btn btn-secondary">
          수산시장으로
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="screen page-transition">
        <p className="section-desc">프로필을 불러오는 중...</p>
      </div>
    );
  }

  const followButton = user ? (
    <button
      type="button"
      className={`btn follow-btn${profile.isFollowing ? " following" : ""}`}
      onClick={toggleFollow}
      disabled={pending}
      aria-pressed={profile.isFollowing}
    >
      {profile.isFollowing ? "팔로잉" : "팔로우"}
    </button>
  ) : (
    <p className="signup-hint">로그인하면 이 어부를 팔로우할 수 있어요.</p>
  );

  return (
    <div className="screen page-transition">
      <ProfileHeader profile={profile} action={followButton} />

      {error && <p className="error-text">{error}</p>}

      <p className="signup-hint">
        팔로우는 "이 어부에게서 좋은 수산물을 받았다"는 표시예요. 별점은 구매를
        완료한 분만 남길 수 있어요.
      </p>

      <Link to="/consumer/market" className="btn btn-secondary">
        수산시장으로
      </Link>
    </div>
  );
}
