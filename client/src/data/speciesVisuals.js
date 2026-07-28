// 실제 어종 사진이 없어서 어종별로 배경색만 다르게 준다.
// 카드 위에 흰 물고기 실루엣이 얹히므로 전부 중간~어두운 톤으로 맞춘다.
const COLORS = {
  mackerel: "#3f6f8f",
  hairtail: "#5b6b86",
  octopus: "#7a5570",
  snowcrab: "#8a5a4a",
  bluecrab: "#7c5a3f",
  gizzardshad: "#4d7a72",
  sailfinsandfish: "#6b7660",
  spanishmackerel: "#42688a",
  blackporgy: "#4a5a73",
  redseabream: "#8a4f55",
};

const FALLBACK = "#5a6a80";

export function speciesColor(speciesId) {
  return COLORS[speciesId] ?? FALLBACK;
}
