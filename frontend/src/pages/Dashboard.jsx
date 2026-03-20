import GlobeView from "../components/GlobeView";

function Dashboard() {
  return (
    <div className="app-shell">
      <GlobeView />
      <div className="hud">
        <h1>OSINT Tracker</h1>
        <p>Google photorealistic 3D tiles</p>
      </div>
    </div>
  );
}

export default Dashboard;