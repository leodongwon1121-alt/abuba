import { useState } from 'react';
import { MapContainer, Marker, Polygon, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGION_POLYGONS } from '../data/regionPolygons.js';

const INITIAL_CENTER = [35.1, 129.1];
const INITIAL_ZOOM = 10;

function centroid(positions) {
  const lat = positions.reduce((sum, [la]) => sum + la, 0) / positions.length;
  const lng = positions.reduce((sum, [, ln]) => sum + ln, 0) / positions.length;
  return [lat, lng];
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

export default function LeafletCoastMap({ regions, selectedId, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [showSeaMap, setShowSeaMap] = useState(false);

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

        {regions.map((region) => {
          const positions = REGION_POLYGONS[region.id];
          if (!positions) return null;
          const isSelected = selectedId === region.id;
          const isHovered = hoveredId === region.id;

          return (
            <Polygon
              key={region.id}
              positions={positions}
              pathOptions={{
                color: '#1b3a6b',
                weight: 2,
                fillColor: '#1b3a6b',
                fillOpacity: isSelected ? 0.35 : isHovered ? 0.25 : 0.15,
              }}
              eventHandlers={{
                mouseover: () => setHoveredId(region.id),
                mouseout: () => setHoveredId(null),
                click: () => onSelect(region.id),
              }}
            />
          );
        })}

        {regions.map((region) => {
          const positions = REGION_POLYGONS[region.id];
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
      </MapContainer>
    </div>
  );
}
