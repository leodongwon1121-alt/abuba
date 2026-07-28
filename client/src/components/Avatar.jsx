// 프로필 사진이 없으면 이름 첫 글자를 보여준다.
// 배경색은 이름 해시로 고정해 같은 사람은 항상 같은 색이 나오게 한다.
const PALETTE = [
  "#3f6f8f",
  "#5b6b86",
  "#4d7a72",
  "#7a5570",
  "#8a5a4a",
  "#42688a",
  "#4a5a73",
  "#6b7660",
];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export default function Avatar({ src, name = "", size = "md" }) {
  const initial = name.trim().charAt(0) || "?";

  return (
    <div
      className={`avatar avatar--${size}`}
      style={src ? undefined : { background: colorFor(name) }}
    >
      {src ? (
        <img src={src} alt="" className="avatar-img" />
      ) : (
        <span className="avatar-initial" aria-hidden="true">
          {initial}
        </span>
      )}
    </div>
  );
}
