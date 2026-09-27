<script setup lang="ts">
import { platformConfig, getPageConfig } from '~/config/platform'
const route = useRoute(); const router = useRouter()
const page = computed(() => getPageConfig(route.path) || { title: 'SOP', description: 'Sinergi Operational Platform', module: 'SOP' })
const collapsed = useState('platform-collapsed', () => false)
const mobileOpen = ref(false); const profileOpen = ref(false); const search = useState('platform-search', () => '')
const { toastMessage, toastVisible, showToast } = useToast()
const searchInput = ref<HTMLInputElement | null>(null)
const onKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
    searchInput.value?.select()
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    window.dispatchEvent(new Event('sop:save'))
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
watch(collapsed, v => { if (import.meta.client) document.body.classList.toggle('platform-collapsed', v) }, { immediate: true })
useHead({ bodyAttrs: { class: 'platform-page' } })
</script>
<template>
  <PlatformIconSprite />
  <div class="platform-sidebar-overlay" :class="{ show: mobileOpen }" @click="mobileOpen = false" />
  <aside class="platform-sidebar" :class="{ 'mobile-open': mobileOpen }">
    <div class="platform-brand"><div class="brand-word"><span>S</span><i></i><span>P</span></div><small>Sinergi Operational Platform</small><button class="platform-collapse" type="button" aria-label="Collapse sidebar" @click="collapsed = !collapsed"><AppIcon name="chevron-left" /></button></div>
    <nav class="platform-menu"><PlatformMenuItem v-for="item in platformConfig.menu" :key="item.route || item.label" :item="item" /></nav>
    <div class="platform-sidebar-bottom"><div class="slogan">People.<br>Process.<br>Technology.<br>For a Better Tomorrow.<i></i></div><div class="copy">© 2026 PT Sinergi Bisnis Indonesia<br>All rights reserved.</div></div>
  </aside>
  <div class="platform-app">
    <header class="platform-topbar">
      <button class="platform-mobile-menu" type="button" aria-label="Open menu" @click="mobileOpen = true"><AppIcon name="menu" /></button>
      <label class="platform-search"><span><AppIcon name="search" /></span><input ref="searchInput" v-model="search" type="search" placeholder="Search projects, quotations, customers, or anything..."><kbd>Ctrl + K</kbd></label>
      <div class="platform-top-actions">
        <button class="platform-icon-btn" type="button" @click="showToast('Notifications demo action.')"><AppIcon name="bell" /><span class="badge">3</span></button>
        <button class="platform-icon-btn platform-grid-button" type="button" @click="showToast('Applications demo action.')"><AppIcon name="grid" /></button><span class="platform-separator"></span>
        <button class="platform-user" type="button" :aria-expanded="profileOpen" @click.stop="profileOpen = !profileOpen"><img src="/assets/avatar.jpg" alt="User"><span><b>Irpan Hidayat Pamil</b><small>CEO</small></span><AppIcon name="down" /></button>
        <div class="platform-profile-menu" :class="{ show: profileOpen }"><button type="button" @click="showToast('Profile demo action.')"><AppIcon name="user" />Profile</button><button type="button" @click="showToast('My Settings demo action.')"><AppIcon name="settings" />My Settings</button><button type="button" @click="showToast('Help Center demo action.')"><AppIcon name="help" />Help Center</button><button type="button" class="danger" @click="router.push('/')"><AppIcon name="logout" />Sign Out</button></div>
      </div>
    </header>
    <div class="platform-mobile-search"><label class="platform-search"><span><AppIcon name="search" /></span><input v-model="search" type="search" placeholder="Search SOP..."></label></div>
    <main class="platform-main">
      <section class="platform-hero"><div><div class="platform-breadcrumb"><span>{{ page.module }}</span><b>›</b><strong>{{ page.title }}</strong></div><h1>{{ page.title }}</h1><p>{{ page.description }}</p></div><div class="platform-hero-tag">Integrated Operations<br>for a Better Tomorrow<i></i></div></section>
      <slot />
    </main>
  </div>
  <div class="toast" :class="{ show: toastVisible }" role="status">{{ toastMessage }}</div>
</template>
