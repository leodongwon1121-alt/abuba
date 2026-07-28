import { EmptyIcon } from "./icons.jsx";

export default function EmptyState({ title, description, Icon = EmptyIcon }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon width={28} height={28} />
      </div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}
