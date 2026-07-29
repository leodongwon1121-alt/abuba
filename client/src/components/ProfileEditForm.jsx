import { useRef, useState } from "react";
import Avatar from "./Avatar.jsx";

const MAX_SIZE = 256;

// 업로드한 이미지를 canvas로 256px 이하로 줄여 base64로 만든다.
// 목업이라 서버 메모리에 그대로 들고 있으므로, 원본을 넣으면 금방 비대해진다.
function shrinkToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("이미지를 읽지 못했어요."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
      img.onload = () => {
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileEditForm({ user, onSave, onCancel }) {
  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      setAvatar(await shrinkToDataUrl(file));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({ nickname, bio, avatar });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="harvest-form" onSubmit={handleSubmit}>
      <div className="profile-edit-avatar">
        <Avatar src={avatar} name={nickname || user.email || ""} size="lg" />
        <div className="profile-edit-avatar-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileRef.current?.click()}
          >
            사진 변경
          </button>
          {avatar && (
            <button
              type="button"
              className="link-muted"
              onClick={() => setAvatar(null)}
            >
              사진 삭제
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
        />
      </div>

      <div className="field">
        <label htmlFor="nickname">이름</label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예: 김대성"
        />
      </div>

      <div className="field">
        <label htmlFor="bio">소개</label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="어떤 수산물을 어떻게 잡는지 소개해주세요."
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="harvest-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
