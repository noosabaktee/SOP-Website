<script setup lang="ts">
defineProps<{ open: boolean; title: string; message: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>
<template>
  <Teleport to="body">
    <div v-if="open" class="platform-modal-overlay show" @click.self="emit('cancel')">
      <div class="platform-modal confirm-modal" role="dialog" aria-modal="true">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="platform-modal-actions">
          <button class="btn-secondary" type="button" @click="emit('cancel')">Cancel</button>
          <button class="btn-primary" type="button" @click="emit('confirm')">Confirm</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
