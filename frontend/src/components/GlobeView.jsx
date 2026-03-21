import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { createTrackingLayerManager } from "../modules/tracking/layerManager";
import {
  classifyAircraft,
  filterAircraftByType,
} from "../modules/aircraft/classifyAircraft";
import { fetchAircraftLive } from "../modules/aircraft/providers/liveAircraftProvider";

function GlobeView({ activeModules, aircraftFilters }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const layerManagerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

    if (!googleKey || !ionToken) {
      console.error("[Globe] Missing env keys");
      return;
    }

    Cesium.Ion.defaultAccessToken = ionToken;

    let destroyed = false;

    const init = async () => {
      try {
        const viewer = new Cesium.Viewer(containerRef.current, {
          terrain: Cesium.Terrain.fromWorldTerrain(),
          timeline: false,
          animation: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          scene3DOnly: true,
          requestRenderMode: false,
          shadows: true,
        });

        if (destroyed) {
          viewer.destroy();
          return;
        }

        viewerRef.current = viewer;
        viewer.scene.globe.depthTestAgainstTerrain = true;

        const osmBuildings = await Cesium.createOsmBuildingsAsync();
        if (!destroyed && !viewer.isDestroyed()) {
          viewer.scene.primitives.add(osmBuildings);
        }

        const googleTileset = await Cesium.Cesium3DTileset.fromUrl(
          `https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleKey}`
        );

        googleTileset.maximumScreenSpaceError = 16;
        googleTileset.skipLevelOfDetail = true;
        googleTileset.preferLeaves = true;

        if (!destroyed && !viewer.isDestroyed()) {
          viewer.scene.primitives.add(googleTileset);
        }

        layerManagerRef.current = createTrackingLayerManager(viewer);

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(18.4241, -33.9249, 12000),
          orientation: {
            heading: Cesium.Math.toRadians(20),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0,
          },
          duration: 2.5,
        });

        viewer.scene.requestRender();
      } catch (error) {
        console.error("[Globe] init failed:", error);
      }
    };

    init();

    return () => {
      destroyed = true;

      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }

      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    const layerManager = layerManagerRef.current;

    if (!viewer || !layerManager) return;

    layerManager.setLayerVisibility("aircraft", !!activeModules.aircraft);
    layerManager.setLayerVisibility("boats", !!activeModules.boats);
    layerManager.setLayerVisibility("satellites", !!activeModules.satellites);

    const loadAircraft = async () => {
      if (!activeModules.aircraft) {
        layerManager.clearLayer("aircraft");
        viewer.scene.requestRender();
        return;
      }

      try {
        const raw = await fetchAircraftLive();

        const aircraft = raw
          .map((item) => ({
            ...item,
            type: classifyAircraft(item),
          }))
          .filter((item) => filterAircraftByType(item, aircraftFilters));

        layerManager.renderAircraft(aircraft);
        viewer.scene.requestRender();
      } catch (error) {
        console.error("[Aircraft] live fetch failed:", error);
      }
    };

    loadAircraft();

    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    refreshTimerRef.current = setInterval(loadAircraft, 15000);

    if (!activeModules.boats) {
      layerManager.clearLayer("boats");
    }

    if (!activeModules.satellites) {
      layerManager.clearLayer("satellites");
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [activeModules, aircraftFilters]);

  return <div ref={containerRef} className="globe-container" />;
}

export default GlobeView;