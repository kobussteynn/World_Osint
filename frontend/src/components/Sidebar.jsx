function Sidebar({
  moduleList,
  activeModules,
  aircraftFilters,
  onToggleModule,
  onToggleAircraftFilter,
  onSetAllAircraftFilters,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2>Layers</h2>
        <p>Toggle tracking modules and aircraft filters.</p>
      </div>

      <section className="sidebar__section">
        <h3>Modules</h3>

        <div className="sidebar__group">
          {moduleList.map((module) => (
            <label key={module.id} className="toggle-row">
              <span>
                <strong>{module.label}</strong>
                <small>{module.description}</small>
              </span>

              <input
                type="checkbox"
                checked={!!activeModules[module.id]}
                onChange={() => onToggleModule(module.id)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="sidebar__section">
        <div className="section-title-row">
          <h3>Aircraft Type</h3>

          <div className="section-actions">
            <button type="button" onClick={() => onSetAllAircraftFilters(true)}>
              All
            </button>
            <button type="button" onClick={() => onSetAllAircraftFilters(false)}>
              None
            </button>
          </div>
        </div>

        <div className="sidebar__group">
          {Object.entries(aircraftFilters).map(([key, enabled]) => (
            <label key={key} className="toggle-row">
              <span className="capitalize">{key}</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => onToggleAircraftFilter(key)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="sidebar__section">
        <h3>Future Modules</h3>
        <ul className="sidebar__list">
          <li>Boat providers</li>
          <li>Satellite feeds</li>
          <li>Provider switcher</li>
          <li>Altitude and speed filters</li>
          <li>Search and detail panel</li>
        </ul>
      </section>
    </aside>
  );
}

export default Sidebar;