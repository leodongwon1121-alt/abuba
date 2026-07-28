export const REGIONS = [
  { id: 'gijang', name: '기장·일광', referenceZone: '108-1' },
  { id: 'songjeong', name: '송정·해운대', referenceZone: '107-2' },
  { id: 'suyeong', name: '수영·광안', referenceZone: '106-4' },
  { id: 'yeongdo', name: '영도·남항', referenceZone: '105-3' },
  { id: 'dadaepo', name: '다대포·낙동강하구', referenceZone: '104-2' },
  { id: 'gadeokdo', name: '가덕도·천성', referenceZone: '103-1' },
];

const MOCK_MARINE_DATA = {
  gijang: { waterTemp: 19.2, waveHeight: 0.8, windSpeed: 4.1 },
  songjeong: { waterTemp: 20.1, waveHeight: 0.6, windSpeed: 3.4 },
  suyeong: { waterTemp: 20.6, waveHeight: 0.5, windSpeed: 2.9 },
  yeongdo: { waterTemp: 19.8, waveHeight: 0.9, windSpeed: 4.8 },
  dadaepo: { waterTemp: 21.3, waveHeight: 0.4, windSpeed: 3.1 },
  gadeokdo: { waterTemp: 20.9, waveHeight: 0.7, windSpeed: 3.9 },
};

// 나중에 실제 기상청/국립수산과학원 API로 교체할 때 이 함수 내부만 바꾸면 됨
export function getMarineData(regionId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MARINE_DATA[regionId] ?? null), 300);
  });
}
