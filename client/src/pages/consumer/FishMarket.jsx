import EmptyState from "../../components/EmptyState.jsx";
import { MarketIcon } from "../../components/icons.jsx";

export default function FishMarket() {
  return (
    <EmptyState
      Icon={MarketIcon}
      title="수산시장 준비 중입니다"
      description="어부님들이 올린 신선한 수산물을 만나보실 수 있어요."
    />
  );
}
