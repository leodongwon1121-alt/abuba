// 어종별 kg당 시세 더미 시계열.
// Math.random()을 쓰지 않는 이유: 서버가 재시작(node --watch)될 때마다 그래프 모양이
// 바뀌면 "시세"라는 개념 자체가 깨진다. 어종 id를 시드로 한 결정적 의사난수를 쓴다.

const DAYS = 365;

// 어종별 기준 단가(원/kg)와 제철 정점 월. 제철에는 물량이 많아 값이 내려간다.
const BASE_PRICES = {
  mackerel: 12000,
  hairtail: 32000,
  octopus: 28000,
  snowcrab: 55000,
  bluecrab: 34000,
  gizzardshad: 18000,
  sailfinsandfish: 15000,
  spanishmackerel: 24000,
  blackporgy: 38000,
  redseabream: 42000,
};

const PEAK_MONTH = {
  mackerel: 10,
  hairtail: 10,
  octopus: 4,
  snowcrab: 12,
  bluecrab: 10,
  gizzardshad: 9,
  sailfinsandfish: 12,
  spanishmackerel: 11,
  blackporgy: 11,
  redseabream: 4,
};

function hashSeed(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function buildSeries(speciesId) {
  const base = BASE_PRICES[speciesId] ?? 20000;
  const peakMonth = PEAK_MONTH[speciesId] ?? 10;
  const rand = mulberry32(hashSeed(speciesId));

  const series = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 랜덤워크 누적분. 계절 성분과 합쳐 "추세 + 잡음"처럼 보이게 한다.
  let drift = 0;

  for (let i = DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const month = date.getMonth() + 1;
    // 제철 정점에서 -1, 반대편에서 +1 → 제철에 싸고 비수기에 비싸다.
    const seasonal = -Math.cos(((month - peakMonth) / 12) * 2 * Math.PI);

    drift += (rand() - 0.5) * 0.012;
    drift = Math.max(-0.12, Math.min(0.12, drift));

    const noise = (rand() - 0.5) * 0.04;
    const factor = 1 + seasonal * 0.18 + drift + noise;
    const price = Math.round((base * factor) / 100) * 100;

    series.push({ date: toISODate(date), price });
  }

  return series;
}

const cache = new Map();

function getFullSeries(speciesId) {
  if (!cache.has(speciesId)) {
    cache.set(speciesId, buildSeries(speciesId));
  }
  return cache.get(speciesId);
}

const PERIOD_DAYS = {
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  all: DAYS,
};

export function getSeries(speciesId, period = "3m") {
  const full = getFullSeries(speciesId);
  const days = PERIOD_DAYS[period] ?? PERIOD_DAYS["3m"];
  return full.slice(-days);
}

export function getLatestQuote(speciesId) {
  const full = getFullSeries(speciesId);
  const current = full[full.length - 1].price;
  const prevClose = full[full.length - 2].price;
  const diff = current - prevClose;
  const diffRate = prevClose === 0 ? 0 : (diff / prevClose) * 100;
  return {
    current,
    prevClose,
    diff,
    diffRate: Math.round(diffRate * 10) / 10,
  };
}
