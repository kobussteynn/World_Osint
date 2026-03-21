export function classifyAircraft(item) {
  const category = (item.category || "").toLowerCase();
  const type = (item.aircraftType || "").toLowerCase();
  const operator = (item.operator || "").toLowerCase();
  const description = (item.description || "").toLowerCase();

  if (category) {
    if (category.includes("military")) return "military";
    if (category.includes("cargo")) return "cargo";
    if (category.includes("helicopter")) return "helicopter";
    if (category.includes("private")) return "private";
    if (category.includes("commercial")) return "commercial";
    if (category.includes("civilian")) return "civilian";
  }

  if (type.includes("heli")) return "helicopter";
  if (description.includes("helicopter")) return "helicopter";
  if (operator.includes("air force") || operator.includes("navy")) return "military";
  if (description.includes("cargo")) return "cargo";
  if (operator.includes("cargo")) return "cargo";
  if (operator.includes("airlines") || operator.includes("airways")) return "commercial";

  return "unknown";
}

export function filterAircraftByType(item, filters) {
  return !!filters[item.type];
}