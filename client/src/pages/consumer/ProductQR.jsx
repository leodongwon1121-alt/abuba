import EmptyState from "../../components/EmptyState.jsx";
import { QrIcon } from "../../components/icons.jsx";

export default function ProductQR() {
  return (
    <EmptyState
      Icon={QrIcon}
      title="상품 QR 준비 중입니다"
      description="QR을 스캔해 수산물 이력을 확인할 수 있는 기능이 곧 추가돼요."
    />
  );
}
