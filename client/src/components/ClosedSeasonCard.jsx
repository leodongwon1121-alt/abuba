import SeasonBadge from './SeasonBadge.jsx';
import MonthlyClosedBar from './MonthlyClosedBar.jsx';
import {
  formatSeasonPeriod,
  isCurrentlyClosedSeason,
  monthsInSeason,
} from '../data/fishRegulations.js';

export default function ClosedSeasonCard({ species, showMonthBar }) {
  const closed = isCurrentlyClosedSeason(species);

  return (
    <div className="season-card">
      <div className="season-card-top">
        <span className="season-card-name">{species.어종명}</span>
        <SeasonBadge isClosed={closed} />
      </div>
      <p className="season-card-period">{formatSeasonPeriod(species)}</p>
      {showMonthBar && (
        <MonthlyClosedBar closedMonths={monthsInSeason(species.금어기시작, species.금어기종료)} />
      )}
    </div>
  );
}
