export const formatCurrency = (value: unknown) => `Rp ${Math.round(Number(value || 0)).toLocaleString('en-US')}`
export const formatNumber = (value: unknown) => Number(value || 0).toLocaleString('en-US')
export const formatPercentage = (value: unknown) => `${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 1 })}%`
export const formatDate = (value: unknown) => String(value ?? '')
export const statusTone = (value: unknown) => {
  const s = String(value || '').toLowerCase()
  if (/approved|completed|active|healthy|paid|converted|qualified|matched|signed|won|success|balanced|delivered|closed|on track/.test(s)) return 'success'
  if (/rejected|lost|overdue|cancelled|out of stock|danger|failed|unmatched/.test(s)) return 'danger'
  if (/pending|negotiation|nurturing|at risk|low stock|warning|submitted|scheduled|open/.test(s)) return 'warning'
  if (/draft/.test(s)) return 'neutral'
  return 'info'
}
