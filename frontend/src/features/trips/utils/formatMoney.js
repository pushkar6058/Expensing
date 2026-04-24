export function formatMoney(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}
