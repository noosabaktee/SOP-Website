<script setup lang="ts">
import type { MenuItem } from '~/types/platform'
const props = defineProps<{ item: MenuItem }>()
const route = useRoute()
const expanded = ref(false)
const belongs = (item: MenuItem): boolean => item.route === route.path || !!item.children?.some(belongs) || !!item.groups?.some(g => g.children.some(belongs))
onMounted(() => { expanded.value = belongs(props.item) })
watch(() => route.path, () => { if (belongs(props.item)) expanded.value = true })
</script>
<template>
  <NuxtLink v-if="item.route" class="pm-item" :class="{ active: route.path === item.route }" :to="item.route">
    <AppIcon :name="item.icon || 'file'" /><span class="pm-label">{{ item.label }}</span>
  </NuxtLink>
  <template v-else>
    <button class="pm-parent" :class="{ open: expanded }" type="button" @click="expanded = !expanded">
      <AppIcon :name="item.icon || 'file'" /><span class="pm-label">{{ item.label }}</span><AppIcon name="down" class="pm-caret" />
    </button>
    <div class="pm-children" :class="{ open: expanded }">
      <template v-if="item.groups">
        <template v-for="group in item.groups" :key="group.label">
          <div class="pm-group-label">{{ group.label }}</div>
          <PlatformMenuItem v-for="child in group.children" :key="child.route || child.label" :item="child" />
        </template>
      </template>
      <PlatformMenuItem v-else v-for="child in item.children || []" :key="child.route || child.label" :item="child" />
    </div>
  </template>
</template>
