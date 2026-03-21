import { useMemo, useState } from "react";
import GlobeView from "../components/GlobeView";
import Sidebar from "../components/Sidebar";
import { TRACKING_MODULES } from "../modules/tracking/registry";
import { DEFAULT_AIRCRAFT_FILTERS } from "../modules/aircraft/constants";

function Dashboard() {
  const [activeModules, setActiveModules] = useState({
    aircraft: true,
    boats: false,
    satellites: false,
  });

  const [aircraftFilters, setAircraftFilters] = useState(
    DEFAULT_AIRCRAFT_FILTERS
  );

  const moduleList = useMemo(() => TRACKING_MODULES, []);

  const handleToggleModule = (moduleId) => {
    setActiveModules((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }));
  };

  const handleToggleAircraftFilter = (filterKey) => {
    setAircraftFilters((current) => ({
      ...current,
      [filterKey]: !current[filterKey],
    }));
  };

  const handleSetAllAircraftFilters = (value) => {
    setAircraftFilters((current) =>
      Object.keys(current).reduce((acc, key) => {
        acc[key] = value;
        return acc;
      }, {})
    );
  };

  return (
    <div className="app-shell">
      <Sidebar
        moduleList={moduleList}
        activeModules={activeModules}
        aircraftFilters={aircraftFilters}
        onToggleModule={handleToggleModule}
        onToggleAircraftFilter={handleToggleAircraftFilter}
        onSetAllAircraftFilters={handleSetAllAircraftFilters}
      />

      <main className="main-view">
        <div className="topbar">
          <div>
            <h1>World OSINT Tracker</h1>
            <p>Live modular tracking for aircraft, boats, satellites, and more.</p>
          </div>
        </div>

        <GlobeView
          activeModules={activeModules}
          aircraftFilters={aircraftFilters}
        />
      </main>
    </div>
  );
}

export default Dashboard;