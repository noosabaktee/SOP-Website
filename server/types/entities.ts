// Generated from the legacy SOP schema configuration.
export interface BaseRecord { id: string; createdAt?: string; updatedAt?: string }

export interface ProspectsRecord extends BaseRecord {
  prospectId?: string
  company: string
  contactPerson: string
  industry?: string
  source?: string
  qualification?: string
  potentialValue?: number
  probability?: number
  assignedTo?: string
  nextFollowUp?: string
  status?: string
  createdDate?: string
}

export interface CustomersRecord extends BaseRecord {
  customerCode: string
  customerName: string
  company?: string
  industry?: string
  customerType?: string
  npwp?: string
  email?: string
  phone?: string
  address?: string
  pic?: string
  salesOwner?: string
  creditLimit?: number
  paymentTerms?: string
  status?: string
}

export interface ActivitiesRecord extends BaseRecord {
  activityId?: string
  date?: string
  type?: string
  subject?: string
  customer?: string
  contact?: string
  pic?: string
  priority?: string
  dueDate?: string
  status?: string
  result?: string
  nextAction?: string
}

export interface QuotationRecord extends BaseRecord {
  quotationNo?: string
  quotationDate?: string
  customer?: string
  project?: string
  salesOwner?: string
  subtotal?: number
  discount?: number
  tax?: number
  grandTotal?: number
  validity?: string
  status?: string
  approval?: string
  createdBy?: string
}

export interface SalesOrdersRecord extends BaseRecord {
  soNumber?: string
  soDate?: string
  customer?: string
  quotation?: string
  project?: string
  salesOwner?: string
  subtotal?: number
  tax?: number
  grandTotal?: number
  deliveryStatus?: string
  invoiceStatus?: string
  paymentStatus?: string
  status?: string
}

export interface DeliveryRecord extends BaseRecord {
  bastNumber?: string
  deliveryDate?: string
  customer?: string
  salesOrder?: string
  project?: string
  deliveryLocation?: string
  pic?: string
  vehicle?: string
  driver?: string
  orderedQty?: number
  deliveredQty?: number
  remainingQty?: number
  condition?: string
  status?: string
}

export interface InvoiceRecord extends BaseRecord {
  invoiceNo?: string
  invoiceDate?: string
  customer?: string
  salesOrder?: string
  project?: string
  dueDate?: string
  subtotal?: number
  tax?: number
  total?: number
  paid?: number
  outstanding?: number
  status?: string
}

export interface SalesReturnRecord extends BaseRecord {
  returnNo?: string
  date?: string
  customer?: string
  invoice?: string
  product?: string
  qty?: number
  reason?: string
  condition?: string
  value?: number
  status?: string
}

export interface PaymentReceiptRecord extends BaseRecord {
  receiptNo?: string
  receiptDate?: string
  customer?: string
  invoice?: string
  paymentMethod?: string
  bankCash?: string
  amount?: number
  reference?: string
  status?: string
}

export interface ReceivableRecord extends BaseRecord {
  customer?: string
  invoice?: string
  invoiceDate?: string
  dueDate?: string
  invoiceAmount?: number
  paid?: number
  outstanding?: number
  daysOverdue?: number
  aging?: string
  collector?: string
  status?: string
}

export interface ProjectsRecord extends BaseRecord {
  projectCode?: string
  projectName?: string
  customer?: string
  projectManager?: string
  startDate?: string
  endDate?: string
  progress?: number
  status?: string
  budget?: number
  actualCost?: number
  revenue?: number
  profit?: number
  margin?: number
}

export interface WbsRecord extends BaseRecord {
  wbsCode?: string
  task?: string
  description?: string
  responsible?: string
  start?: string
  end?: string
  duration?: number
  weight?: number
  budget?: number
  status?: string
}

export interface TasksRecord extends BaseRecord {
  taskId?: string
  task?: string
  project?: string
  wbs?: string
  pic?: string
  priority?: string
  start?: string
  dueDate?: string
  progress?: number
  status?: string
  dependency?: string
}

export interface MilestonesRecord extends BaseRecord {
  milestone?: string
  project?: string
  dueDate?: string
  pic?: string
  progress?: number
  status?: string
  deliverable?: string
  approval?: string
}

export interface TeamRecord extends BaseRecord {
  employee?: string
  role?: string
  department?: string
  projectRole?: string
  allocation?: number
  start?: string
  end?: string
  hourlyRate?: number
  status?: string
}

export interface ProgressRecord extends BaseRecord {
  period?: string
  planned?: number
  actual?: number
  variance?: number
  notes?: string
}

export interface BudgetRecord extends BaseRecord {
  itemCode?: string
  category?: string
  description?: string
  qty?: number
  unit?: string
  unitPrice?: number
  budget?: number
  vendor?: string
  notes?: string
}

export interface ProjectCostRecord extends BaseRecord {
  date?: string
  costType?: string
  category?: string
  description?: string
  vendor?: string
  document?: string
  budget?: number
  actual?: number
  variance?: number
  status?: string
}

export interface ProjectProcurementRecord extends BaseRecord {
  pr?: string
  po?: string
  vendor?: string
  item?: string
  qty?: number
  poValue?: number
  received?: number
  invoice?: string
  payment?: string
  status?: string
}

export interface DocumentsRecord extends BaseRecord {
  documentNo?: string
  documentName?: string
  category?: string
  module?: string
  reference?: string
  version?: string
  owner?: string
  createdDate?: string
  updatedDate?: string
  status?: string
}

export interface ProfitabilityRecord extends BaseRecord {
  revenue?: number
  materialCost?: number
  laborCost?: number
  procurement?: number
  otherCost?: number
  totalCost?: number
  profit?: number
  margin?: number
}

export interface PurchaseRequestRecord extends BaseRecord {
  prNumber?: string
  date?: string
  requester?: string
  department?: string
  project?: string
  purpose?: string
  priority?: string
  requiredDate?: string
  estimatedValue?: number
  approval?: string
  status?: string
}

export interface PurchaseOrderRecord extends BaseRecord {
  poNumber?: string
  date?: string
  vendor?: string
  deliveryDate?: string
  project?: string
  currency?: string
  paymentTerms?: string
  shippingTerms?: string
  grandTotal?: number
  approval?: string
  status?: string
}

export interface GoodsReceiptRecord extends BaseRecord {
  grNumber?: string
  date?: string
  poNumber?: string
  vendor?: string
  warehouse?: string
  item?: string
  orderedQty?: number
  receivedQty?: number
  rejectedQty?: number
  condition?: string
  status?: string
}

export interface PurchaseReturnRecord extends BaseRecord {
  returnNo?: string
  date?: string
  vendor?: string
  po?: string
  gr?: string
  item?: string
  qty?: number
  reason?: string
  value?: number
  status?: string
}

export interface VendorsRecord extends BaseRecord {
  vendorCode?: string
  vendorName?: string
  category?: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  npwp?: string
  paymentTerms?: string
  rating?: number
  status?: string
}

export interface ContractsRecord extends BaseRecord {
  vendor?: string
  product?: string
  contractNo?: string
  startDate?: string
  endDate?: string
  unitPrice?: number
  currency?: string
  minimumQty?: number
  paymentTerms?: string
  status?: string
}

export interface StockRecord extends BaseRecord {
  sku?: string
  product?: string
  category?: string
  warehouse?: string
  location?: string
  qtyOnHand?: number
  reserved?: number
  available?: number
  unit?: string
  minimumStock?: number
  maximumStock?: number
  stockValue?: number
  status?: string
}

export interface StockMovementRecord extends BaseRecord {
  date?: string
  document?: string
  type?: string
  sku?: string
  product?: string
  warehouse?: string
  qtyIn?: number
  qtyOut?: number
  balance?: number
  reference?: string
  user?: string
}

export interface WarehouseTransferRecord extends BaseRecord {
  transferNo?: string
  date?: string
  fromWarehouse?: string
  toWarehouse?: string
  product?: string
  qty?: number
  requestedBy?: string
  approvedBy?: string
  status?: string
}

export interface StockOpnameRecord extends BaseRecord {
  sku?: string
  product?: string
  systemQty?: number
  physicalQty?: number
  difference?: number
  unit?: string
  valueDifference?: number
  counter?: string
  status?: string
}

export interface StockAdjustmentRecord extends BaseRecord {
  adjustmentNo?: string
  date?: string
  warehouse?: string
  sku?: string
  systemQty?: number
  adjustmentQty?: number
  finalQty?: number
  reason?: string
  approvedBy?: string
  status?: string
}

export interface StockCardRecord extends BaseRecord {
  date?: string
  document?: string
  description?: string
  qtyIn?: number
  qtyOut?: number
  balance?: number
  unitCost?: number
  value?: number
  reference?: string
}

export interface FinanceTransactionRecord extends BaseRecord {
  date?: string
  document?: string
  party?: string
  account?: string
  debit?: number
  credit?: number
  tax?: number
  amount?: number
  status?: string
}

export interface ExpensesRecord extends BaseRecord {
  date?: string
  expenseNo?: string
  category?: string
  description?: string
  department?: string
  project?: string
  account?: string
  amount?: number
  tax?: number
  paymentMethod?: string
  attachment?: string
  status?: string
}

export interface FinanceReceiptsRecord extends BaseRecord {
  receiptNo?: string
  date?: string
  customer?: string
  invoice?: string
  account?: string
  amount?: number
  bankCash?: string
  reference?: string
  status?: string
}

export interface JournalEntryRecord extends BaseRecord {
  account?: string
  description?: string
  debit?: number
  credit?: number
  tax?: number
  project?: string
  department?: string
}

export interface GeneralJournalRecord extends BaseRecord {
  date?: string
  journalNo?: string
  account?: string
  description?: string
  reference?: string
  debit?: number
  credit?: number
  department?: string
  project?: string
}

export interface TrialBalanceRecord extends BaseRecord {
  accountCode?: string
  accountName?: string
  openingDebit?: number
  openingCredit?: number
  periodDebit?: number
  periodCredit?: number
  closingDebit?: number
  closingCredit?: number
}

export interface ReconciliationRecord extends BaseRecord {
  date?: string
  reference?: string
  bookAmount?: number
  bankAmount?: number
  difference?: number
  status?: string
  notes?: string
}

export interface ClosingRecord extends BaseRecord {
  period?: string
  revenue?: number
  expense?: number
  profit?: number
  closingStatus?: string
  closedBy?: string
  closedDate?: string
}

export interface CashRecord extends BaseRecord {
  date?: string
  transaction?: string
  reference?: string
  cashIn?: number
  cashOut?: number
  balance?: number
  account?: string
  description?: string
}

export interface BankAccountsRecord extends BaseRecord {
  bank?: string
  accountName?: string
  accountNumber?: string
  currency?: string
  openingBalance?: number
  currentBalance?: number
  status?: string
}

export interface BankTransfersRecord extends BaseRecord {
  transferNo?: string
  date?: string
  fromAccount?: string
  toAccount?: string
  amount?: number
  reference?: string
  description?: string
  status?: string
}

export interface BankReconciliationRecord extends BaseRecord {
  bankDate?: string
  reference?: string
  description?: string
  bankAmount?: number
  bookAmount?: number
  difference?: number
  matched?: boolean
  status?: string
}

export interface CoaRecord extends BaseRecord {
  accountCode?: string
  accountName?: string
  accountType?: string
  parentAccount?: string
  normalBalance?: string
  taxCategory?: string
  active?: boolean
}

export interface MasterCustomersRecord extends BaseRecord {
  customerCode?: string
  customerName?: string
  legalName?: string
  industry?: string
  npwp?: string
  nib?: string
  address?: string
  city?: string
  province?: string
  pic?: string
  email?: string
  phone?: string
  creditLimit?: number
  paymentTerms?: string
  taxType?: string
  status?: string
}

export interface MasterVendorsRecord extends BaseRecord {
  vendorCode?: string
  vendorName?: string
  category?: string
  npwp?: string
  nib?: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  bank?: string
  accountNumber?: string
  status?: string
}

export interface ProductsRecord extends BaseRecord {
  sku?: string
  productCode?: string
  productName?: string
  type?: string
  category?: string
  unit?: string
  purchasePrice?: number
  salesPrice?: number
  tax?: number
  warehouse?: string
  minimumStock?: number
  status?: string
}

export interface AssetsRecord extends BaseRecord {
  assetCode?: string
  assetName?: string
  category?: string
  acquisitionDate?: string
  acquisitionCost?: number
  usefulLife?: number
  depreciationMethod?: string
  accumulatedDepreciation?: number
  bookValue?: number
  location?: string
  pic?: string
  status?: string
}

export interface DepartmentsRecord extends BaseRecord {
  departmentCode?: string
  departmentName?: string
  manager?: string
  costCenter?: string
  budget?: number
  status?: string
}

export interface EmployeesRecord extends BaseRecord {
  employeeId?: string
  name?: string
  department?: string
  position?: string
  email?: string
  phone?: string
  manager?: string
  costCenter?: string
  joinDate?: string
  status?: string
}

export interface WarehousesRecord extends BaseRecord {
  warehouseCode?: string
  warehouseName?: string
  location?: string
  pic?: string
  capacity?: number
  status?: string
}

export interface PricingTaxRecord extends BaseRecord {
  product?: string
  customerType?: string
  priceList?: string
  currency?: string
  unitPrice?: number
  discount?: number
  tax?: number
  effectiveDate?: string
  endDate?: string
  status?: string
}

export interface BanksRecord extends BaseRecord {
  bank?: string
  accountName?: string
  accountNumber?: string
  currency?: string
  branch?: string
  openingBalance?: number
  currentBalance?: number
  status?: string
}

export interface GenericMasterRecord extends BaseRecord {
  code?: string
  name?: string
  category?: string
  description?: string
  updatedBy?: string
  updatedDate?: string
  status?: string
}

export interface MeetingAgendaRecord extends BaseRecord {
  agendaNo?: string
  meeting?: string
  topic?: string
  presenter?: string
  priority?: string
  duration?: number
  status?: string
}

export interface MeetingResolutionsRecord extends BaseRecord {
  resolutionNo?: string
  meeting?: string
  decision?: string
  responsible?: string
  dueDate?: string
  status?: string
  followUp?: string
}

export interface MeetingDocumentsRecord extends BaseRecord {
  document?: string
  meeting?: string
  type?: string
  version?: string
  owner?: string
  date?: string
  status?: string
}

export interface UsersRecord extends BaseRecord {
  user?: string
  email?: string
  role?: string
  department?: string
  accessLevel?: string
  lastLogin?: string
  status?: string
}

export interface WorkflowRecord extends BaseRecord {
  workflow?: string
  module?: string
  step?: number
  approver?: string
  threshold?: number
  sequence?: number
  status?: string
}

export interface NumberingRecord extends BaseRecord {
  documentType?: string
  prefix?: string
  format?: string
  currentNumber?: number
  resetPeriod?: string
  example?: string
  status?: string
}

export interface AuditRecord extends BaseRecord {
  dateTime?: string
  user?: string
  module?: string
  action?: string
  record?: string
  oldValue?: string
  newValue?: string
  ipAddress?: string
  status?: string
}

export interface ReportRecord extends BaseRecord {
  period?: string
  document?: string
  entity?: string
  category?: string
  amount?: number
  budget?: number
  variance?: number
  status?: string
}

export interface GenericRecord extends BaseRecord {
  code?: string
  name?: string
  description?: string
  value?: number
  status?: string
  updatedDate?: string
}
