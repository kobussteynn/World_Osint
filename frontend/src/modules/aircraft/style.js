import * as Cesium from "cesium";

export function getAircraftColor(type) {
  switch (type) {
    case "military":
      return Cesium.Color.RED;
    case "commercial":
      return Cesium.Color.CYAN;
    case "cargo":
      return Cesium.Color.ORANGE;
    case "private":
      return Cesium.Color.LIME;
    case "helicopter":
      return Cesium.Color.YELLOW;
    case "civilian":
      return Cesium.Color.DODGERBLUE;
    default:
      return Cesium.Color.WHITE;
  }
}