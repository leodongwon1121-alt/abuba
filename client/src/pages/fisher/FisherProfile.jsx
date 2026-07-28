import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileHeader from "../../components/ProfileHeader.jsx";
import ProfileEditForm from "../../components/ProfileEditForm.jsx";
import { LogoutIcon } from "../../components/icons.jsx";

export default function FisherProfile() {
  const { user, setProfile: setAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .getFisherProfile(user.id)
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [user]);

  if (!user) {
    return (
      <div className="screen page-transition">
        <h2 className="section-title">프로필</h2>
        <p className="section-desc">로그인하면 계정 정보를 확인할 수 있어요</p>
        <Link to="/login" className="btn btn-primary">
          로그인
        </Link>
      </div>
    );
  }

  const handleSaveProfile = async (payload) => {
    const updated = await api.updateProfile(payload);
    setAccount(updated);
    setProfile(await api.getFisherProfile(user.id));
    setEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="screen page-transition">
      <h2 className="section-title">프로필</h2>
      <p className="section-desc">소비자에게는 이렇게 보여요</p>

      {editing ? (
        <ProfileEditForm
          user={user}
          onSave={handleSaveProfile}
          onCancel={() => setEditing(false)}
        />
      ) : profile ? (
        <ProfileHeader
          profile={profile}
          action={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditing(true)}
            >
              프로필 편집
            </button>
          }
        />
      ) : (
        <p className="section-desc">프로필을 불러오는 중...</p>
      )}

      {error && <p className="error-text">{error}</p>}

      <p className="account-card-email profile-account-email">{user.email}</p>

      <Link to="/fisher/market" className="btn btn-secondary">
        판매 관리
      </Link>
      <Link to="/fisher/maintenance" className="btn btn-secondary">
        선박 정비 관리
      </Link>

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
