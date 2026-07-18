export function formatCurrency(value: number) {
  const roundedValue = Math.round(Number(value ?? 0))
  return `$${roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}
