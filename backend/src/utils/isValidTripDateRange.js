export function isValidTripDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  return startDate <= endDate;
}
