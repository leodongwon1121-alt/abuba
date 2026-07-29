import { useState } from "react";
import { speciesColor } from "../data/speciesVisuals.js";

export default function FishThumb({ speciesId, size = "sm" }) {
  // public/species/<어종id>.jpg 를 넣어두면 자동으로 사진이 붙는다.
  // 파일이 없는 어종은 onError로 기존 실루엣 그림으로 되돌아간다.
  const [photoFailed, setPhotoFailed] = useState(false);
  const photoSrc = `${import.meta.env.BASE_URL}species/${speciesId}.jpg`;

  return (
    <div
      className={`fish-thumb fish-thumb--${size}`}
      style={{ background: speciesColor(speciesId) }}
      aria-hidden="true"
    >
      {speciesId && !photoFailed ? (
        <img
          src={photoSrc}
          alt=""
          className="fish-thumb-photo"
          loading="lazy"
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <svg viewBox="0 0 200 120" className="fish-thumb-art">
          <path
            d="M20,62 C32,38 68,24 110,24 C142,24 164,34 174,48 L196,30 L182,62 L196,94 L174,76 C164,90 142,100 110,100 C68,100 32,86 20,62 Z"
            fill="rgba(255,255,255,0.92)"
          />
          <path d="M78,88 L64,110 L96,92 Z" fill="rgba(255,255,255,0.92)" />
          <circle cx="44" cy="54" r="4.5" fill="rgba(0,0,0,0.45)" />
        </svg>
      )}
    </div>
  );
}
