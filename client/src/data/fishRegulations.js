import speciesData from "./fishSpecies.json";

// 실제 수산자원관리법 시행령 데이터로 교체할 때는 fishSpecies.json만 바꾸면 됨
export const FISH_SPECIES = speciesData;

export function todayMMDD() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export function isDateInSeason(mmdd, start, end) {
  if (start <= end) {
    return mmdd >= start && mmdd <= end;
  }
  // 연말~연초를 걸치는 금어기 (예: 12월~2월)
  return mmdd >= start || mmdd <= end;
}

export function isCurrentlyClosedSeason(species, refMMDD = todayMMDD()) {
  return isDateInSeason(refMMDD, species.금어기시작, species.금어기종료);
}

export function monthsInSeason(start, end) {
  const startMonth = Number(start.slice(0, 2));
  const endMonth = Number(end.slice(0, 2));
  const months = new Set();

  if (startMonth <= endMonth) {
    for (let m = startMonth; m <= endMonth; m += 1) months.add(m);
  } else {
    for (let m = startMonth; m <= 12; m += 1) months.add(m);
    for (let m = 1; m <= endMonth; m += 1) months.add(m);
  }

  return months;
}

export function overlapsMonth(species, month) {
  return monthsInSeason(species.금어기시작, species.금어기종료).has(month);
}

function formatMonthDay(mmdd) {
  const [m, d] = mmdd.split("-").map(Number);
  return `${m}월 ${d}일`;
}

export function formatSeasonPeriod(species) {
  return `${formatMonthDay(species.금어기시작)} ~ ${formatMonthDay(species.금어기종료)}`;
}

// 금어기 종료까지 남은 일수. 종료일 당일은 0. 참돔처럼 연말을 걸치는 경우도 처리.
export function daysUntilSeasonEnd(species, today = new Date()) {
  const [em, ed] = species.금어기종료.split("-").map(Number);
  const year = today.getFullYear();
  const todayUtc = Date.UTC(year, today.getMonth(), today.getDate());
  let endUtc = Date.UTC(year, em - 1, ed);
  if (endUtc < todayUtc) {
    endUtc = Date.UTC(year + 1, em - 1, ed);
  }
  return Math.round((endUtc - todayUtc) / 86400000);
}
