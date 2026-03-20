import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

function GlobeView() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

    console.log("[Globe] google key exists:", !!googleKey);
    console.log("[Globe] ion token exists:", !!ionToken);

    if (!googleKey || !ionToken) {
      console.error("[Globe] Missing env keys");
      return;
    }

    Cesium.Ion.defaultAccessToken = ionToken;

    let destroyed = false;

    const init = async () => {
      try {
        console.log("[Globe] creating viewer...");

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
        viewer.scene.debugShowFramesPerSecond = true;

        console.log("[Globe] loading OSM fallback buildings...");
        const osmBuildings = await Cesium.createOsmBuildingsAsync();

        if (!destroyed && !viewer.isDestroyed()) {
          viewer.scene.primitives.add(osmBuildings);
          console.log("[Globe] OSM buildings added");
        }

        console.log("[Globe] loading Google photorealistic 3D tiles...");
        const googleTileset = await Cesium.Cesium3DTileset.fromUrl(
          `https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleKey}`
        );

        googleTileset.maximumScreenSpaceError = 16;
        googleTileset.skipLevelOfDetail = true;
        googleTileset.preferLeaves = true;

        if (!destroyed && !viewer.isDestroyed()) {
          viewer.scene.primitives.add(googleTileset);
          console.log("[Globe] Google 3D tiles added");
        }

        // Start somewhere mountainous + urban
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(18.4241, -33.9249, 12000),
          orientation: {
            heading: Cesium.Math.toRadians(20),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0,
          },
          duration: 3,
        });

        viewer.scene.requestRender();
      } catch (error) {
        console.error("[Globe] init failed:", error);
        console.error("[Globe] name:", error?.name);
        console.error("[Globe] message:", error?.message);
      }
    };

    init();

    return () => {
      destroyed = true;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} className="globe-container" />;
}

export default GlobeView;