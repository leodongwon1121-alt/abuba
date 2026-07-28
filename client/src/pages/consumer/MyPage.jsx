import EmptyState from "../../components/EmptyState.jsx";
import { UserIcon } from "../../components/icons.jsx";

export default function MyPage() {
  return (
    <EmptyState
      Icon={UserIcon}
      title="마이페이지 준비 중입니다"
      description="주문 내역과 계정 정보를 관리할 수 있게 될 예정이에요."
    />
  );
}
