export function formatDistance(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  if (meters > 100) {
    return `${Math.round(meters)} m`;
  }
  return `${meters.toFixed(1)} m`;
}

export function formatBattery(level: number) {
  const value = Math.max(0, Math.min(100, Math.round(level)));
  return `${value}%`;
}
