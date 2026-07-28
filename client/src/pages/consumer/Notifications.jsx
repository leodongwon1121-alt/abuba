import EmptyState from "../../components/EmptyState.jsx";
import { BellIcon } from "../../components/icons.jsx";

export default function Notifications() {
  return (
    <EmptyState
      Icon={BellIcon}
      title="알림함 준비 중입니다"
      description="주문, 배송, 이벤트 알림을 이곳에서 받아보실 수 있게 될 예정이에요."
    />
  );
}
