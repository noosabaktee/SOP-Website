<script setup lang="ts">
import type { DataRow, GridColumn, PageConfig } from '~/types/platform'

const props = defineProps<{ page: PageConfig; routePath: string }>()
const { showToast } = useToast()
const { rows, fetchRows, updateRow } = useResourceGrid(props.routePath)
const dirty = ref(false)

const columns: GridColumn[] = [
  { key: 'product', title: 'Product / Service', type: 'dropdown', editable: true, width: 180, source: ['Industrial Sensor Package','Control Panel Assembly','Network Infrastructure Service','PLC Integration Service','Energy Meter','Preventive Maintenance Service','Cloud Monitoring Subscription'] },
  { key: 'description', title: 'Description', type: 'text', editable: true, width: 220 },
  { key: 'qty', title: 'Qty', type: 'number', editable: true, width: 70 },
  { key: 'unit', title: 'Unit', type: 'dropdown', editable: true, width: 75, source: ['pcs','unit','lot','service','set','month'] },
  { key: 'unitPrice', title: 'Unit Price', type: 'currency', editable: true },
  { key: 'discountPct', title: 'Discount %', type: 'percent', editable: true, width: 85 },
  { key: 'discount', title: 'Discount', type: 'currency', editable: false },
  { key: 'tax', title: 'Tax', type: 'currency', editable: false },
  { key: 'subtotal', title: 'Subtotal', type: 'currency', editable: false },
]

const recalculate = (row: DataRow) => {
  const qty = Number(row.qty || 0)
  const price = Number(row.unitPrice || 0)
  const discountPct = Number(row.discountPct || 0)
  row.discount = qty * price * discountPct / 100
  row.tax = (qty * price - Number(row.discount || 0)) * 11 / 100
  row.subtotal = qty * price - Number(row.discount || 0) + Number(row.tax || 0)
}

onMounted(async () => { await fetchRows(); rows.value.forEach(recalculate) })
const onChange = () => { rows.value.forEach(recalculate); dirty.value = true }
const subtotal = computed(() => rows.value.reduce((sum,row)=>sum + Number(row.qty||0)*Number(row.unitPrice||0),0))
const discount = computed(() => rows.value.reduce((sum,row)=>sum + Number(row.discount||0),0))
const tax = computed(() => rows.value.reduce((sum,row)=>sum + Number(row.tax||0),0))
const grand = computed(() => rows.value.reduce((sum,row)=>sum + Number(row.subtotal||0),0))
const money = (value:number) => `Rp ${Math.round(value).toLocaleString('en-US')}`
const save = async () => { for (const row of rows.value) if(row.id) await updateRow(String(row.id), row); dirty.value=false; showToast('Quotation draft saved.') }
const submit = async () => { await save(); showToast('Quotation submitted for approval.') }
const print = () => { if(import.meta.client) window.print() }
const router = useRouter()
const onSaveShortcut=()=>save();onMounted(()=>window.addEventListener('sop:save',onSaveShortcut));onBeforeUnmount(()=>{if(import.meta.client)window.removeEventListener('sop:save',onSaveShortcut)})
</script>
<template>
  <PageActions primary-label="Save Draft" @create="save" @import="showToast('Quotation item import ready.')" @export="print" @filter="showToast('No additional filters on editor.')" @refresh="fetchRows" @more="print" />
  <section class="document-editor">
    <div class="editor-main">
      <div class="platform-card-head"><div><h2>Quotation Header</h2><p>Commercial and customer information.</p></div></div>
      <div class="editor-header-form">
        <label v-for="(field,index) in ['Quotation Number','Quotation Date','Customer','Contact','Project','Currency','Validity','Payment Terms','Delivery Terms','Sales Owner']" :key="field" class="platform-field"><span>{{field}}</span><input :value="['QT-2026-0146','16 Sep 2026','PT ABC Kogen Dairy','Budi Santoso','PRJ-001 - EMS ABC Kogen Dairy','IDR','30 Days','30 Days','Franco Site','Budi Santoso'][index]"></label>
      </div>
      <div class="editor-items"><div class="platform-card-head"><div><h2>Quotation Items</h2><p>Spreadsheet calculations update automatically.</p></div></div><AppDataGrid :rows="rows" :columns="columns" @change="onChange" /></div>
      <div class="editor-notes"><textarea placeholder="Notes">Prices exclude out-of-scope civil work unless stated otherwise.</textarea><textarea placeholder="Terms & Conditions">Payment 30 days after invoice. Quotation valid for 30 days.</textarea></div>
    </div>
    <aside class="editor-summary"><h2 style="font-size:14px;margin:0 0 10px">Summary</h2><div class="summary-row"><span>Subtotal</span><b>{{money(subtotal)}}</b></div><div class="summary-row"><span>Discount</span><b>{{money(discount)}}</b></div><div class="summary-row"><span>Tax</span><b>{{money(tax)}}</b></div><div class="summary-row total"><span>Grand Total</span><b>{{money(grand)}}</b></div><div class="editor-actions"><button class="btn-secondary" @click="save">Save Draft</button><button class="btn-primary" @click="submit">Submit for Approval</button><button class="btn-secondary" @click="print">Preview</button><button class="btn-secondary" @click="router.back()">Cancel</button></div><small v-if="dirty">Unsaved changes</small></aside>
  </section>
</template>
