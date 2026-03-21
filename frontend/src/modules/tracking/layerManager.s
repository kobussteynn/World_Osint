import * as Cesium from "cesium";
import { getAircraftColor } from "../aircraft/style";

function createDataSource(name) {
  return new Cesium.CustomDataSource(name);
}

function makeAircraftEntity(item) {
  const color = getAircraftColor(item.type);
  const altitude = Number(item.altitude ?? 0);
  const heading = Number(item.heading ?? 0);

  return {
    id: item.id,
    name: item.callsign || item.registration || item.hex || "Aircraft",
    position: Cesium.Cartesian3.fromDegrees(
      Number(item.longitude),
      Number(item.latitude),
      altitude
    ),
    point: {
      pixelSize: 8,
      color,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1.5,
    },
    label: {
      text: item.callsign || item.registration || item.hex || item.id,
      font: "12px sans-serif",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -14),
      scale: 0.85,
      showBackground: true,
    },
    properties: {
      category: item.type,
      speed: item.speed ?? null,
      heading,
      altitude,
      source: item.source || "live",
      operator: item.operator || "",
      aircraftType: item.aircraftType || "",
      hex: item.hex || "",
    },
  };
}

export function createTrackingLayerManager(viewer) {
  const layers = {
    aircraft: createDataSource("aircraft"),
    boats: createDataSource("boats"),
    satellites: createDataSource("satellites"),
  };

  Object.values(layers).forEach((source) => {
    viewer.dataSources.add(source);
  });

  return {
    renderAircraft(items) {
      const source = layers.aircraft;
      source.entities.removeAll();

      items
        .filter(
          (item) =>
            Number.isFinite(Number(item.latitude)) &&
            Number.isFinite(Number(item.longitude))
        )
        .forEach((item) => {
          source.entities.add(makeAircraftEntity(item));
        });
    },

    clearLayer(layerId) {
      const source = layers[layerId];
      if (!source) return;
      source.entities.removeAll();
    },

    setLayerVisibility(layerId, visible) {
      const source = layers[layerId];
      if (!source) return;
      source.show = visible;
    },
  };
}