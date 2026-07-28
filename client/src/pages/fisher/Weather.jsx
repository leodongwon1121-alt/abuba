import { useState } from "react";
import LeafletCoastMap from "../../components/LeafletCoastMap.jsx";
import MarineDetailCard from "../../components/MarineDetailCard.jsx";
import { REGIONS, getMarineData } from "../../data/marineRegions.js";

export default function Weather() {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRegion =
    REGIONS.find((region) => region.id === selectedId) ?? null;

  const handleSelect = async (regionId) => {
    setSelectedId(regionId);
    setData(null);
    setError("");
    setLoading(true);
    try {
      const result = await getMarineData(regionId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setData(null);
    setError("");
  };

  return (
    <div className="screen page-transition">
      <h2 className="section-title">부산 연안 해양 날씨</h2>
      <p className="section-desc">구역을 눌러 수온·파고·풍속을 확인하세요</p>

      <LeafletCoastMap
        regions={REGIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <MarineDetailCard
        region={selectedRegion}
        data={data}
        loading={loading}
        error={error}
        onClose={handleClose}
      />
    </div>
  );
}
