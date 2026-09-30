<script setup lang="ts">
import type { GridSelectOption } from '~/types/platform'

const props = defineProps<{
  open: boolean
  title: string
  options: GridSelectOption[]
  currentValue?: string
  anchor?: { top: number; right: number; bottom: number; left: number; width: number }
  allowCreate?: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [value: string]
  create: [payload: { value: string; color: string }]
}>()

const search = ref('')
const newValue = ref('')
const creating = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const createInput = ref<HTMLInputElement | null>(null)
const selectedColor = ref('#2583E9')
const colorChoices = [
  { value: '#2583E9', label: 'Biru' },
  { value: '#20A36A', label: 'Hijau' },
  { value: '#D0912F', label: 'Kuning' },
  { value: '#E04B59', label: 'Merah' },
  { value: '#8061D9', label: 'Ungu' },
  { value: '#D94F8A', label: 'Merah muda' },
  { value: '#168C92', label: 'Toska' },
  { value: '#66758C', label: 'Abu-abu' },
]

const filteredOptions = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return props.options.filter(option => !query || option.value.toLocaleLowerCase().includes(query))
})

const panelStyle = computed(() => {
  const anchor = props.anchor
  if (!anchor || !import.meta.client) return {}
  const width = Math.min(320, Math.max(240, anchor.width))
  const left = Math.min(window.innerWidth - width - 10, Math.max(10, anchor.left))
  const roomBelow = window.innerHeight - anchor.bottom
  const top = roomBelow >= 300 ? anchor.bottom + 6 : Math.max(10, anchor.top - 336)
  return { width: `${width}px`, left: `${left}px`, top: `${top}px` }
})

watch(() => props.open, async (open) => {
  if (!open) return
  search.value = ''
  newValue.value = ''
  selectedColor.value = '#2583E9'
  creating.value = false
  await nextTick()
  searchInput.value?.focus()
})

watch(creating, async (value) => {
  if (!value) return
  newValue.value = search.value.trim()
  await nextTick()
  createInput.value?.focus()
  createInput.value?.select()
})

const submitNewOption = () => {
  const value = newValue.value.trim().replace(/\s+/g, ' ')
  if (!value) return
  const existing = props.options.find(option => option.value.toLocaleLowerCase() === value.toLocaleLowerCase())
  if (existing) emit('select', existing.value)
  else emit('create', { value, color: selectedColor.value })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <button class="grid-select-backdrop" type="button" aria-label="Close options" @click="emit('close')" />
      <section class="grid-select-menu" :style="panelStyle" role="dialog" :aria-label="`Choose ${title}`">
        <header class="grid-select-menu__head">
          <div>
            <small>PILIH DATA</small>
            <strong>{{ title }}</strong>
          </div>
          <button type="button" aria-label="Close" @click="emit('close')">×</button>
        </header>

        <label class="grid-select-menu__search">
          <AppIcon name="search" />
          <input ref="searchInput" v-model="search" type="search" placeholder="Cari pilihan...">
        </label>

        <div class="grid-select-menu__options">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            :class="{ active: option.value === currentValue }"
            @click="emit('select', option.value)"
          >
            <span class="grid-select-menu__dot" :style="option.color ? { backgroundColor: option.color, opacity: 1 } : undefined" />
            <span>{{ option.value }}</span>
            <span v-if="option.value === currentValue" class="grid-select-menu__check">✓</span>
          </button>
          <div v-if="filteredOptions.length === 0" class="grid-select-menu__empty">Pilihan tidak ditemukan.</div>
        </div>

        <footer v-if="allowCreate !== false" class="grid-select-menu__footer">
          <button v-if="!creating" type="button" @click="creating = true">
            <span>+</span> Tambah pilihan baru
          </button>
          <form v-else @submit.prevent="submitNewOption">
            <label>Nama pilihan baru</label>
            <div>
              <input ref="createInput" v-model="newValue" maxlength="120" placeholder="Contoh: Partner" @keydown.esc.prevent="creating = false">
              <button type="submit" :disabled="!newValue.trim()">Tambah</button>
            </div>
            <fieldset>
              <legend>Pilih warna</legend>
              <button
                v-for="color in colorChoices"
                :key="color.value"
                type="button"
                :class="{ active: selectedColor === color.value }"
                :style="{ '--option-color': color.value }"
                :aria-label="color.label"
                :title="color.label"
                @click="selectedColor = color.value"
              ><span /></button>
            </fieldset>
          </form>
        </footer>
      </section>
    </template>
  </Teleport>
</template>
