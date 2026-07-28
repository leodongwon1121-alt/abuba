import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polygon, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGION_POLYGONS } from '../data/regionPolygons.js';
import MarineInfoPopup from './MarineInfoPopup.jsx';

const INITIAL_CENTER = [35.1, 129.1];
const INITIAL_ZOOM = 10;
// mirrors --color-navy in global.css (Leaflet pathOptions needs a literal color string)
const REGION_COLOR = '#324e7a';
const GRID_COLOR = 'rgba(50, 78, 122, 0.22)';
const GRID_STEP = 0.03; // degrees — graph-paper cell size

// 구역 경계 좌표를 모눈 격자선 위로 스냅해서, 구역이 실제로 그리드 셀의 조합처럼 보이게 한다.
function snapToGrid(value) {
  return Math.round(value / GRID_STEP) * GRID_STEP;
}

const SNAPPED_REGION_POLYGONS = Object.fromEntries(
  Object.entries(REGION_POLYGONS).map(([id, positions]) => [
    id,
    positions.map(([lat, lng]) => [snapToGrid(lat), snapToGrid(lng)]),
  ]),
);

function centroid(positions) {
  const lat = positions.reduce((sum, [la]) => sum + la, 0) / positions.length;
  const lng = positions.reduce((sum, [, ln]) => sum + ln, 0) / positions.length;
  return [lat, lng];
}

function buildGridLines() {
  const allPoints = Object.values(SNAPPED_REGION_POLYGONS).flat();
  const lats = allPoints.map(([lat]) => lat);
  const lngs = allPoints.map(([, lng]) => lng);
  const pad = GRID_STEP * 2;
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;

  const lines = [];
  for (let lat = Math.floor(minLat / GRID_STEP) * GRID_STEP; lat <= maxLat; lat += GRID_STEP) {
    lines.push([[lat, minLng], [lat, maxLng]]);
  }
  for (let lng = Math.floor(minLng / GRID_STEP) * GRID_STEP; lng <= maxLng; lng += GRID_STEP) {
    lines.push([[minLat, lng], [maxLat, lng]]);
  }
  return lines;
}

function labelIcon(name) {
  return L.divIcon({
    className: 'region-label-icon',
    html: `<span class="region-label-text">${name}</span>`,
    iconSize: [0, 0],
  });
}

function ResetViewButton({ center, zoom }) {
  const map = useMap();
  return (
    <button
      type="button"
      className="map-reset-btn"
      onClick={() => map.setView(center, zoom)}
    >
      부산 연안으로 돌아가기
    </button>
  );
}

function MapBackgroundClick({ onBackgroundClick }) {
  useMapEvents({
    click: () => onBackgroundClick(),
  });
  return null;
}

function PopupAnchor({ activeId, children }) {
  const map = useMap();
  const [point, setPoint] = useState(null);

  useEffect(() => {
    if (!activeId) {
      setPoint(null);
      return undefined;
    }
    const positions = SNAPPED_REGION_POLYGONS[activeId];
    if (!positions) return undefined;

    const update = () => setPoint(map.latLngToContainerPoint(centroid(positions)));
    update();
    map.on('move zoom', update);
    return () => map.off('move zoom', update);
  }, [activeId, map]);

  if (!activeId || !point) return null;

  const mapSize = map.getSize();
  return children({ point, mapSize });
}

export default function LeafletCoastMap({
  regions,
  activeId,
  pinned,
  data,
  loading,
  error,
  onHoverStart,
  onHoverEnd,
  onClick,
  onClose,
}) {
  const [showSeaMap, setShowSeaMap] = useState(false);
  const gridLines = useMemo(buildGridLines, []);
  const activeRegion = regions.find((region) => region.id === activeId) ?? null;

  return (
    <div className="leaflet-wrap">
      <div className="map-toolbar">
        <button
          type="button"
          className={`map-toggle${showSeaMap ? ' active' : ''}`}
          onClick={() => setShowSeaMap((prev) => !prev)}
        >
          해도 오버레이 {showSeaMap ? '끄기' : '켜기'}
        </button>
      </div>

      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom
        className="leaflet-map"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap 기여자"
        />
        {showSeaMap && (
          <TileLayer url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" opacity={0.9} />
        )}

        <MapBackgroundClick onBackgroundClick={() => pinned && onClose()} />

        {gridLines.map((line, i) => (
          <Polyline
            key={`grid-${i}`}
            positions={line}
            interactive={false}
            pathOptions={{ color: GRID_COLOR, weight: 1 }}
          />
        ))}

        {regions.map((region) => {
          const positions = SNAPPED_REGION_POLYGONS[region.id];
          if (!positions) return null;
          const isActive = activeId === region.id;
          const isPinned = isActive && pinned;

          return (
            <Polygon
              key={region.id}
              positions={positions}
              pathOptions={{
                color: REGION_COLOR,
                weight: isPinned ? 2.5 : isActive ? 2 : 1.5,
                opacity: isActive ? 0.9 : 0.55,
                fillColor: REGION_COLOR,
                fillOpacity: isPinned ? 0.35 : isActive ? 0.22 : 0.06,
              }}
              eventHandlers={{
                mouseover: () => onHoverStart(region.id),
                mouseout: () => onHoverEnd(region.id),
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  onClick(region.id);
                },
              }}
            />
          );
        })}

        {regions.map((region) => {
          const positions = SNAPPED_REGION_POLYGONS[region.id];
          if (!positions) return null;

          return (
            <Marker
              key={`${region.id}-label`}
              position={centroid(positions)}
              icon={labelIcon(region.name)}
              interactive={false}
            />
          );
        })}

        <ResetViewButton center={INITIAL_CENTER} zoom={INITIAL_ZOOM} />

        <PopupAnchor activeId={activeId}>
          {({ point, mapSize }) => (
            <MarineInfoPopup
              region={activeRegion}
              data={data}
              loading={loading}
              error={error}
              point={point}
              mapSize={mapSize}
              pinned={pinned}
              onClose={onClose}
            />
          )}
        </PopupAnchor>
      </MapContainer>
    </div>
  );
}
