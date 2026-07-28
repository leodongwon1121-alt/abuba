import { EmptyIcon } from './icons.jsx';

export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state page-transition">
      <div className="empty-state-icon">
        <EmptyIcon width={28} height={28} />
      </div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}
