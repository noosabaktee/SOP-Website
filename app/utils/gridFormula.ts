import type { DataRow, GridColumn } from '~/types/platform'

const numeric = (value: unknown) => {
  const result = Number(value ?? 0)
  return Number.isFinite(result) ? result : 0
}

export const recalculateRow = (row: DataRow, columns: GridColumn[]) => {
  const n = (key: string) => numeric(row[key])
  for (const column of columns) {
    switch (column.formula) {
      case 'actual-planned': row[column.key] = n('actual') - n('planned'); break
      case 'qty*unitPrice': row[column.key] = n('qty') * n('unitPrice'); break
      case 'budget-actual': row[column.key] = n('budget') - n('actual'); break
      case 'materialCost+laborCost+procurement+otherCost': row[column.key] = n('materialCost') + n('laborCost') + n('procurement') + n('otherCost'); break
      case 'revenue-totalCost': row[column.key] = n('revenue') - n('totalCost'); break
      case 'profit/revenue*100': row[column.key] = n('revenue') ? (n('profit') / n('revenue')) * 100 : 0; break
      case 'qtyOnHand-reserved': row[column.key] = n('qtyOnHand') - n('reserved'); break
      case 'physicalQty-systemQty': row[column.key] = n('physicalQty') - n('systemQty'); break
      case 'systemQty+adjustmentQty': row[column.key] = n('systemQty') + n('adjustmentQty'); break
      case 'bookAmount-bankAmount': row[column.key] = n('bookAmount') - n('bankAmount'); break
      case 'revenue-expense': row[column.key] = n('revenue') - n('expense'); break
      case 'bankAmount-bookAmount': row[column.key] = n('bankAmount') - n('bookAmount'); break
      case 'acquisitionCost-accumulatedDepreciation': row[column.key] = n('acquisitionCost') - n('accumulatedDepreciation'); break
      case 'budget-amount': row[column.key] = n('budget') - n('amount'); break
    }
  }
  return row
}
