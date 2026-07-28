import { useState } from "react";
import LeafletCoastMap from "../../components/LeafletCoastMap.jsx";
import { REGIONS, getMarineData } from "../../data/marineRegions.js";

export default function Weather() {
  const [activeId, setActiveId] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRegion = async (regionId) => {
    setActiveId(regionId);
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

  const closePopup = () => {
    setActiveId(null);
    setPinned(false);
    setData(null);
    setError("");
  };

  const handleHoverStart = (regionId) => {
    if (pinned) return;
    loadRegion(regionId);
  };

  const handleHoverEnd = (regionId) => {
    if (pinned || activeId !== regionId) return;
    closePopup();
  };

  const handleClick = (regionId) => {
    if (pinned && activeId === regionId) {
      closePopup();
      return;
    }
    setPinned(true);
    if (activeId !== regionId) {
      loadRegion(regionId);
    }
  };

  return (
    <div className="screen page-transition">
      <h2 className="section-title">부산 연안 해양 날씨</h2>
      <p className="section-desc">
        구역에 마우스를 올리거나 눌러 수온·파고·풍속을 확인하세요
      </p>

      <LeafletCoastMap
        regions={REGIONS}
        activeId={activeId}
        pinned={pinned}
        data={data}
        loading={loading}
        error={error}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        onClose={closePopup}
      />
    </div>
  );
}
