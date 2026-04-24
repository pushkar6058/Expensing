export function isTripMember(trip, userId) {
  if (!trip || !userId) return false;

  return (trip.members || []).some((member) => {
    const memberId = member?._id || member;
    return memberId?.toString() === userId.toString();
  });
}
