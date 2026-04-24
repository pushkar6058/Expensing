function getLocalDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function getTripStatus(startDate, endDate, fallbackStatus = 'Planning') {
  if (!startDate || !endDate) return fallbackStatus;

  const today = getLocalDateString();

  if (today < startDate) return 'Planning';
  if (today > endDate) return 'Done';
  return 'Active';
}
