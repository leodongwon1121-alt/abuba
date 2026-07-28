import Avatar from "./Avatar.jsx";
import StarRating from "./StarRating.jsx";

// 인스타그램 프로필의 "원형 아바타 + 숫자 지표 가로 배치" 구조만 참고한 레이아웃.
// 게시물 개념이 없으므로 지표는 별점 / 팔로워 2개뿐이다.
export default function ProfileHeader({ profile, action }) {
  const { name, avatar, bio, shipType, topSpecies, rating, followerCount } =
    profile;

  return (
    <section className="profile-header">
      <div className="profile-top">
        <Avatar src={avatar} name={name} size="lg" />

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">
              {rating?.avg ? rating.avg.toFixed(1) : "-"}
            </span>
            <span className="profile-stat-label">별점</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{followerCount ?? 0}</span>
            <span className="profile-stat-label">팔로워</span>
          </div>
        </div>
      </div>

      <h2 className="profile-name">{name}</h2>

      <div className="profile-meta">
        {shipType && <span className="badge">{shipType}</span>}
        {topSpecies && <span className="badge">주력 {topSpecies}</span>}
      </div>

      <div className="profile-rating-line">
        <StarRating value={rating?.avg ?? 0} count={rating?.count} />
      </div>

      {bio ? (
        <p className="profile-bio">{bio}</p>
      ) : (
        <p className="profile-bio profile-bio--empty">아직 소개가 없어요.</p>
      )}

      {action && <div className="profile-action">{action}</div>}
    </section>
  );
}
