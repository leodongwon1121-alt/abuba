import { useMemo, useState } from "react";
import {
  FISH_SPECIES,
  isCurrentlyClosedSeason,
  overlapsMonth,
} from "../../data/fishRegulations.js";
import ClosedSeasonCard from "../../components/ClosedSeasonCard.jsx";
import SizeLimitCard from "../../components/SizeLimitCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { CalendarIcon } from "../../components/icons.jsx";

const SEGMENTS = [
  { id: "season", label: "금어기" },
  { id: "size", label: "체장" },
];

const FILTERS = [
  { id: "today", label: "오늘" },
  { id: "month", label: "이번 달" },
  { id: "year", label: "1년" },
];

export default function ClosedSeason() {
  const [segment, setSegment] = useState("season");
  const [filter, setFilter] = useState("today");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);

  const currentMonth = new Date().getMonth() + 1;

  const filteredSpecies = useMemo(() => {
    if (filter === "today") {
      return FISH_SPECIES.filter((species) => isCurrentlyClosedSeason(species));
    }
    if (filter === "month") {
      return FISH_SPECIES.filter((species) =>
        overlapsMonth(species, currentMonth),
      );
    }
    return FISH_SPECIES;
  }, [filter, currentMonth]);

  const selectedSpecies =
    FISH_SPECIES.find((species) => species.id === selectedSpeciesId) ?? null;

  return (
    <div className="screen page-transition">
      <h2 className="section-title">금어기·체장 정보</h2>
      <p className="section-desc">확인하고 싶은 항목을 선택하세요</p>

      <div className="toggle-group segment-toggle">
        {SEGMENTS.map((seg) => (
          <button
            key={seg.id}
            type="button"
            className={`toggle-option${segment === seg.id ? " active" : ""}`}
            aria-pressed={segment === seg.id}
            onClick={() => setSegment(seg.id)}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {segment === "season" ? (
        <>
          <div className="toggle-group filter-toggle">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`toggle-option${filter === f.id ? " active" : ""}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredSpecies.length === 0 ? (
            <EmptyState
              Icon={CalendarIcon}
              title="해당하는 어종이 없어요"
              description="다른 기간을 선택해보세요."
            />
          ) : (
            <div className="season-list">
              {filteredSpecies.map((species) => (
                <ClosedSeasonCard
                  key={species.id}
                  species={species}
                  showMonthBar={filter === "year"}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="section-desc">
            어종을 선택하면 체장 기준을 확인할 수 있어요.
          </p>
          <div className="species-chip-row">
            {FISH_SPECIES.map((species) => (
              <button
                key={species.id}
                type="button"
                className={`species-chip${selectedSpeciesId === species.id ? " active" : ""}`}
                aria-pressed={selectedSpeciesId === species.id}
                onClick={() => setSelectedSpeciesId(species.id)}
              >
                {species.어종명}
              </button>
            ))}
          </div>

          {selectedSpecies && <SizeLimitCard species={selectedSpecies} />}
        </>
      )}
    </div>
  );
}
