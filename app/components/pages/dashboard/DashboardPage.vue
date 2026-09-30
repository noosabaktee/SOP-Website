<script setup lang="ts">
const router = useRouter()
const { toastMessage, toastVisible, showToast } = useToast()

const mobileOpen = ref(false)
const profileOpen = ref(false)
const search = ref('')
const globalSearch = ref<HTMLInputElement | null>(null)
const completedTasks = ref<number[]>([])
const scheduleMonth = ref(new Date(2026, 8, 1))

const monthLabel = computed(() => scheduleMonth.value.toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
}))
const hasSchedule = computed(() => scheduleMonth.value.getFullYear() === 2026 && scheduleMonth.value.getMonth() === 8)

const navigate = (path: string) => {
  mobileOpen.value = false
  profileOpen.value = false
  return router.push(path)
}

const toggleSidebar = () => {
  if (import.meta.client) document.body.classList.toggle('sidebar-collapsed')
}

const updateSearch = async () => {
  if (!import.meta.client) return
  const query = search.value.trim().toLowerCase()
  document.querySelectorAll<HTMLElement>('.searchable').forEach((element) => {
    const haystack = (element.dataset.search || element.textContent || '').toLowerCase()
    element.classList.toggle('hidden-by-search', Boolean(query) && !haystack.includes(query))
  })
}

const onKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    globalSearch.value?.focus()
    globalSearch.value?.select()
  }
  if (event.key === 'Escape') {
    profileOpen.value = false
    mobileOpen.value = false
    if (search.value) search.value = ''
  }
}

const changeMonth = (offset: number) => {
  scheduleMonth.value = new Date(
    scheduleMonth.value.getFullYear(),
    scheduleMonth.value.getMonth() + offset,
    1,
  )
}

const toggleTask = (index: number, checked: boolean) => {
  completedTasks.value = checked
    ? [...new Set([...completedTasks.value, index])]
    : completedTasks.value.filter(item => item !== index)
  showToast(checked ? 'Task marked as completed.' : 'Task reopened.')
}

const openQuickActions = () => {
  document.querySelector('.quick-actions')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

watch(search, updateSearch)
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('sidebar-collapsed')
})

useHead({ title: 'SOP — Dashboard', bodyAttrs: { class: 'dashboard-page' } })
</script><template><div @click="profileOpen = false"><svg aria-hidden="true" class="svg-sprite">
<symbol id="i-home" viewbox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10.5V21h14V10.5"></path><path d="M9 21v-6h6v6"></path></symbol>
<symbol id="i-users" viewbox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></symbol>
<symbol id="i-file" viewbox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8M8 17h6"></path></symbol>
<symbol id="i-cart" viewbox="0 0 24 24"><circle cx="9" cy="20" r="1"></circle><circle cx="19" cy="20" r="1"></circle><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"></path></symbol>
<symbol id="i-briefcase" viewbox="0 0 24 24"><rect height="13" rx="2" width="18" x="3" y="7"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path></symbol>
<symbol id="i-box" viewbox="0 0 24 24"><path d="M21 8 12 3 3 8l9 5 9-5Z"></path><path d="m3 8 9 5v9"></path><path d="m21 8-9 5v9"></path></symbol>
<symbol id="i-chart" viewbox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"></path></symbol>
<symbol id="i-grid" viewbox="0 0 24 24"><rect height="7" rx="1" width="7" x="3" y="3"></rect><rect height="7" rx="1" width="7" x="14" y="3"></rect><rect height="7" rx="1" width="7" x="3" y="14"></rect><rect height="7" rx="1" width="7" x="14" y="14"></rect></symbol>
<symbol id="i-settings" viewbox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.08A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1.03-1.56V3h4v.08A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.56 1.03H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"></path></symbol>
<symbol id="i-search" viewbox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></symbol>
<symbol id="i-bell" viewbox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></symbol>
<symbol id="i-chevron" viewbox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></symbol>
<symbol id="i-down" viewbox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></symbol>
<symbol id="i-menu" viewbox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></symbol>
<symbol id="i-folder" viewbox="0 0 24 24"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path></symbol>
<symbol id="i-money" viewbox="0 0 24 24"><path d="M8 4h8l1 4H7l1-4Z"></path><path d="M6 8c-2 2-3 5-3 8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5c0-3-1-6-3-8Z"></path><path d="M12 11v7M9.5 13h4a1.5 1.5 0 1 1 0 3h-3a1.5 1.5 0 1 0 0 3h4"></path></symbol>
<symbol id="i-plus" viewbox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></symbol>
<symbol id="i-invoice" viewbox="0 0 24 24"><path d="M6 2h9l4 4v16H6z"></path><path d="M14 2v5h5"></path><path d="M9 12h6M9 16h6"></path></symbol>
<symbol id="i-user" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></symbol>
<symbol id="i-help" viewbox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9a2.8 2.8 0 1 1 4.4 2.3c-1.2.8-1.9 1.4-1.9 2.7"></path><path d="M12 17h.01"></path></symbol>
<symbol id="i-logout" viewbox="0 0 24 24"><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"></path></symbol>
<symbol id="i-building" viewbox="0 0 24 24"><path d="M3 21h18M5 21V4h10v17M15 9h4v12"></path><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1"></path></symbol>
</svg>
<div class="sidebar-overlay" :class="{ show: mobileOpen }" @click="mobileOpen = false"></div>
<aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
<div class="sidebar-brand">
<div class="sop-logo side-logo"><span>S</span><i></i><span>P</span></div>
<div class="sidebar-brand-name">Sinergi Operational Platform</div>
<button aria-label="Collapse sidebar" class="collapse-btn" type="button" @click="toggleSidebar">‹</button>
</div>
<nav class="sidebar-nav"><a class="nav-item active" data-label="Dashboard" href="/dashboard" @click.prevent="navigate('/dashboard')">
<svg><use href="#i-home"></use></svg><span>Dashboard</span>
</a><a class="nav-item" data-label="CRM &amp; Sales" href="/crm/leads" @click.prevent="navigate('/crm/leads')">
<svg><use href="#i-users"></use></svg><span>CRM &amp; Sales</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</a><button class="nav-item" data-label="Quotation" type="button" @click="navigate('/quotation')">
<svg><use href="#i-file"></use></svg><span>Quotation</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Sales" type="button" @click="navigate('/sales/orders')">
<svg><use href="#i-cart"></use></svg><span>Sales</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Project" type="button" @click="navigate('/project')">
<svg><use href="#i-briefcase"></use></svg><span>Project</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Procurement" type="button" @click="navigate('/purchase/request')">
<svg><use href="#i-file"></use></svg><span>Procurement</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Inventory" type="button" @click="navigate('/inventory/stock')">
<svg><use href="#i-box"></use></svg><span>Inventory</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Finance &amp; Accounting" type="button" @click="navigate('/finance/transactions/sales')">
<svg><use href="#i-chart"></use></svg><span>Finance &amp; Accounting</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Reports" type="button" @click="navigate('/reports/management')">
<svg><use href="#i-chart"></use></svg><span>Reports</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Master Data" type="button" @click="navigate('/master/company')">
<svg><use href="#i-grid"></use></svg><span>Master Data</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Documents" type="button" @click="navigate('/documents')">
<svg><use href="#i-file"></use></svg><span>Documents</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="GMS" type="button" @click="navigate('/meeting/agenda')">
<svg><use href="#i-briefcase"></use></svg><span>GMS</span><svg class="nav-chevron"><use href="#i-down"></use></svg>
</button><button class="nav-item" data-label="Settings" type="button" @click="navigate('/settings/users')">
<svg><use href="#i-settings"></use></svg><span>Settings</span>
</button></nav>
<div class="sidebar-bottom">
<div class="sidebar-photo"></div>
<div class="sidebar-tagline">People.<br/>Process.<br/>Technology.<br/>For a Better Tomorrow.<i></i></div>
<div class="sidebar-copyright">© 2026 PT Sinergi Bisnis Indonesia<br/>All rights reserved.</div>
</div>
</aside>
<div class="app">
<header class="topnav">
<button aria-label="Open menu" class="mobile-menu" type="button" @click.stop="mobileOpen = true"><svg><use href="#i-menu"></use></svg></button>
<div class="top-mobile-logo"><div class="sop-logo tiny"><span>S</span><i></i><span>P</span></div></div>
<label class="searchbox" for="globalSearch">
<svg><use href="#i-search"></use></svg>
<input id="globalSearch" ref="globalSearch" v-model="search" placeholder="Search projects, quotations, customers, or anything..." type="search"/>
<kbd>Ctrl + K</kbd>
</label>
<div class="top-actions">
<button aria-label="Notifications" class="icon-button notification" type="button" @click="navigate('/settings/notifications')"><svg><use href="#i-bell"></use></svg><span>3</span></button>
<button aria-label="Quick actions" class="icon-button app-grid" type="button" @click="openQuickActions"><svg><use href="#i-grid"></use></svg></button>
<span class="top-separator"></span>
<button :aria-expanded="profileOpen" class="profile-button" type="button" @click.stop="profileOpen = !profileOpen">
<img alt="Irpan Hidayat Pamil" src="/assets/avatar.jpg"/>
<span><b>Irpan Hidayat Pamil</b><small>CEO</small></span>
<svg><use href="#i-down"></use></svg>
</button>
<div class="profile-menu" :class="{ show: profileOpen }" @click.stop>
<button type="button" @click="navigate('/settings/users')"><svg><use href="#i-user"></use></svg>Profile</button>
<button type="button" @click="navigate('/settings/parameters')"><svg><use href="#i-settings"></use></svg>My Settings</button>
<button type="button" @click="navigate('/settings/notifications')"><svg><use href="#i-bell"></use></svg>Notifications</button>
<button type="button" @click="showToast('Please contact the SOP administrator for assistance.'); profileOpen = false"><svg><use href="#i-help"></use></svg>Help Center</button>
<hr/>
<button class="signout" type="button" @click="navigate('/')"><svg><use href="#i-logout"></use></svg>Sign Out</button>
</div>
</div>
</header>
<div class="mobile-search-row">
<label class="searchbox mobile-search" for="mobileSearch">
<svg><use href="#i-search"></use></svg><input id="mobileSearch" v-model="search" placeholder="Search projects, quotations, customers..." type="search"/>
</label>
</div>
<main class="dashboard-main">
<section class="welcome">
<div class="welcome-copy"><small>Tuesday, 16 September 2026</small><h1>Good morning, Irpan!</h1><p>Here's what's happening with your operations today.</p></div>
<div class="welcome-tagline">Integrated Operations<br/>for a Better Tomorrow<i></i></div>
</section>
<section class="kpi-grid">
<article class="kpi-card reveal"><div class="kpi-icon blue"><svg><use href="#i-folder"></use></svg></div><div><small>Total Projects</small><strong>18</strong><p class="trend up">⬆ +12% <span>vs last month</span></p></div></article>
<article class="kpi-card reveal"><div class="kpi-icon green"><svg><use href="#i-money"></use></svg></div><div><small>Total Sales</small><strong>Rp 2,450,000,000</strong><p class="trend up">⬆ +8% <span>vs last month</span></p></div></article>
<article class="kpi-card reveal"><div class="kpi-icon orange"><svg><use href="#i-cart"></use></svg></div><div><small>Purchase Orders</small><strong>34</strong><p class="trend down">⬇ -5% <span>vs last month</span></p></div></article>
<article class="kpi-card reveal"><div class="kpi-icon purple"><svg><use href="#i-invoice"></use></svg></div><div><small>Total Invoices</small><strong>Rp 1,320,000,000</strong><p class="trend up">⬆ +12% <span>vs last month</span></p></div></article>
</section>
<section class="dashboard-grid top-grid">
<article class="dash-card project-progress reveal">
<div class="card-head"><h2>Project Progress</h2><button type="button" @click="navigate('/project/dashboard')">View All →</button></div>
<div class="chart-legend"><span><i class="green"></i>On Track</span><span><i class="orange"></i>At Risk</span><span><i class="red"></i>Delayed</span><span><i class="blue"></i>Completed</span></div>
<div class="bar-chart">
<div class="y-axis"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
<div class="bar-area"><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:10.4px"></i><i class="seg orange" style="height:2.6px"></i>
<i class="seg red" style="height:2.6px"></i><i class="seg blue" style="height:10.4px"></i>
</div><span>Jan</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:13.0px"></i><i class="seg orange" style="height:2.6px"></i>
<i class="seg red" style="height:2.6px"></i><i class="seg blue" style="height:13.0px"></i>
</div><span>Feb</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:15.600000000000001px"></i><i class="seg orange" style="height:5.2px"></i>
<i class="seg red" style="height:2.6px"></i><i class="seg blue" style="height:18.2px"></i>
</div><span>Mar</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:20.8px"></i><i class="seg orange" style="height:5.2px"></i>
<i class="seg red" style="height:5.2px"></i><i class="seg blue" style="height:18.2px"></i>
</div><span>Apr</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:23.400000000000002px"></i><i class="seg orange" style="height:7.800000000000001px"></i>
<i class="seg red" style="height:5.2px"></i><i class="seg blue" style="height:15.600000000000001px"></i>
</div><span>May</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:26.0px"></i><i class="seg orange" style="height:10.4px"></i>
<i class="seg red" style="height:5.2px"></i><i class="seg blue" style="height:15.600000000000001px"></i>
</div><span>Jun</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:23.400000000000002px"></i><i class="seg orange" style="height:7.800000000000001px"></i>
<i class="seg red" style="height:7.800000000000001px"></i><i class="seg blue" style="height:20.8px"></i>
</div><span>Jul</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:28.6px"></i><i class="seg orange" style="height:10.4px"></i>
<i class="seg red" style="height:7.800000000000001px"></i><i class="seg blue" style="height:18.2px"></i>
</div><span>Aug</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:31.200000000000003px"></i><i class="seg orange" style="height:13.0px"></i>
<i class="seg red" style="height:10.4px"></i><i class="seg blue" style="height:20.8px"></i>
</div><span>Sep</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:36.4px"></i><i class="seg orange" style="height:15.600000000000001px"></i>
<i class="seg red" style="height:10.4px"></i><i class="seg blue" style="height:23.400000000000002px"></i>
</div><span>Oct</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:39.0px"></i><i class="seg orange" style="height:15.600000000000001px"></i>
<i class="seg red" style="height:13.0px"></i><i class="seg blue" style="height:26.0px"></i>
</div><span>Nov</span></div><div class="bar-group"><div class="bar-stack">
<i class="seg green" style="height:44.2px"></i><i class="seg orange" style="height:18.2px"></i>
<i class="seg red" style="height:13.0px"></i><i class="seg blue" style="height:28.6px"></i>
</div><span>Dec</span></div></div>
</div>
</article>
<article class="dash-card task-status reveal">
<div class="card-head"><h2>Task Status</h2><button type="button" @click="navigate('/project/tasks')">View All →</button></div>
<div class="task-status-body">
<div class="donut"><div><strong>120</strong><span>Tasks</span></div></div>
<ul class="status-list">
<li><i class="green"></i><span>Completed</span><b>45 (37%)</b></li>
<li><i class="blue"></i><span>In Progress</span><b>50 (42%)</b></li>
<li><i class="orange"></i><span>On Hold</span><b>10 (8%)</b></li>
<li><i class="red"></i><span>Overdue</span><b>15 (13%)</b></li>
</ul>
</div>
</article>
<article class="dash-card my-tasks reveal">
<div class="card-head"><h2>My Tasks</h2><button type="button" @click="navigate('/project/tasks')">View All →</button></div>
<div class="task-list">
<label class="task-row searchable" :class="{ completed: completedTasks.includes(0) }" data-search="Finalize engineering design PRJ-001 EMS ABC Kogen Dairy"><input type="checkbox" @change="toggleTask(0, ($event.target as HTMLInputElement).checked)"/><span class="task-check"></span><span class="task-copy"><b>Finalize engineering design</b><small>PRJ-001 - EMS ABC Kogen Dairy</small></span><em class="today">Today</em></label>
<label class="task-row searchable" :class="{ completed: completedTasks.includes(1) }" data-search="Prepare vendor comparison PRC-002"><input type="checkbox" @change="toggleTask(1, ($event.target as HTMLInputElement).checked)"/><span class="task-check"></span><span class="task-copy"><b>Prepare vendor comparison</b><small>PRC-002</small></span><em>17 Sep 2026</em></label>
<label class="task-row searchable" :class="{ completed: completedTasks.includes(2) }" data-search="Review quotation customer QT-2026-014"><input type="checkbox" @change="toggleTask(2, ($event.target as HTMLInputElement).checked)"/><span class="task-check"></span><span class="task-copy"><b>Review quotation to customer</b><small>QT-2026-014</small></span><em>18 Sep 2026</em></label>
<label class="task-row searchable" :class="{ completed: completedTasks.includes(3) }" data-search="Project progress meeting PRJ-003"><input type="checkbox" @change="toggleTask(3, ($event.target as HTMLInputElement).checked)"/><span class="task-check"></span><span class="task-copy"><b>Project progress meeting</b><small>PRJ-003</small></span><em>18 Sep 2026</em></label>
<label class="task-row searchable" :class="{ completed: completedTasks.includes(4) }" data-search="Update monthly report Internal"><input type="checkbox" @change="toggleTask(4, ($event.target as HTMLInputElement).checked)"/><span class="task-check"></span><span class="task-copy"><b>Update monthly report</b><small>Internal</small></span><em>19 Sep 2026</em></label>
</div>
</article>
<article class="dash-card schedule reveal">
<div class="card-head"><h2>Upcoming Schedule</h2><button type="button" @click="navigate('/crm/activities')">View All →</button></div>
<div class="month-nav"><button type="button" :aria-label="`Previous month before ${monthLabel}`" @click="changeMonth(-1)">‹</button><b>{{ monthLabel }}</b><button type="button" :aria-label="`Next month after ${monthLabel}`" @click="changeMonth(1)">›</button></div>
<div v-if="hasSchedule" class="schedule-list">
<div class="schedule-row"><div class="date"><b>16</b><span>Tue</span></div><i class="dot blue"></i><div class="event"><b>Project meeting</b><small>PRJ-001</small></div><div class="event-time"><b>10:00 - 11:00</b><small>⌖ Meeting Room</small></div></div>
<div class="schedule-row"><div class="date"><b>17</b><span>Wed</span></div><i class="dot green"></i><div class="event"><b>Client presentation</b><small>PT ABC Kogen Dairy</small></div><div class="event-time"><b>13:00 - 14:00</b><small>⌖ Online</small></div></div>
<div class="schedule-row"><div class="date"><b>18</b><span>Thu</span></div><i class="dot purple"></i><div class="event"><b>Internal review</b><small>Project &amp; Finance</small></div><div class="event-time"><b>09:00 - 10:00</b><small>⌖ Meeting Room</small></div></div>
<div class="schedule-row"><div class="date"><b>21</b><span>Mon</span></div><i class="dot orange"></i><div class="event"><b>PO review</b><small>Procurement</small></div><div class="event-time"><b>10:00 - 11:00</b><small>⌖ Meeting Room</small></div></div>
</div>
<div v-else class="schedule-empty"><span>No schedules in {{ monthLabel }}.</span><button type="button" @click="scheduleMonth = new Date(2026, 8, 1)">Back to September</button></div>
</article>
</section>
<section class="dashboard-grid bottom-grid">
<article class="dash-card recent-projects reveal">
<div class="card-head"><h2>Recent Projects</h2><button type="button" @click="navigate('/project')">View All →</button></div>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Project Name</th><th>Customer</th><th>Progress</th><th>Status</th><th>End Date</th></tr></thead><tbody><tr class="searchable" data-search="PRJ-001 - EMS ABC Kogen Dairy ABC Kogen Dairy On Track">
<td>1</td><td>PRJ-001 - EMS ABC Kogen Dairy</td><td>ABC Kogen Dairy</td>
<td><div class="progress-cell"><div class="progress"><i style="width:75%"></i></div><b>75%</b></div></td>
<td><span class="status on-track">On Track</span></td><td>30 Jun 2026</td>
</tr><tr class="searchable" data-search="PRJ-002 - Access Control System PT Uniguard In Progress">
<td>2</td><td>PRJ-002 - Access Control System</td><td>PT Uniguard</td>
<td><div class="progress-cell"><div class="progress"><i style="width:40%"></i></div><b>40%</b></div></td>
<td><span class="status in-progress">In Progress</span></td><td>15 Oct 2026</td>
</tr><tr class="searchable" data-search="PRJ-003 - Network Infrastructure PT Kalbe Morinaga At Risk">
<td>3</td><td>PRJ-003 - Network Infrastructure</td><td>PT Kalbe Morinaga</td>
<td><div class="progress-cell"><div class="progress"><i style="width:20%"></i></div><b>20%</b></div></td>
<td><span class="status at-risk">At Risk</span></td><td>12 Dec 2026</td>
</tr><tr class="searchable" data-search="PRJ-004 - IT Managed Service PT Pupuk Kujang On Track">
<td>4</td><td>PRJ-004 - IT Managed Service</td><td>PT Pupuk Kujang</td>
<td><div class="progress-cell"><div class="progress"><i style="width:90%"></i></div><b>90%</b></div></td>
<td><span class="status on-track">On Track</span></td><td>30 Nov 2026</td>
</tr><tr class="searchable" data-search="PRJ-005 - Energy Monitoring PT Dankos Farma In Progress">
<td>5</td><td>PRJ-005 - Energy Monitoring</td><td>PT Dankos Farma</td>
<td><div class="progress-cell"><div class="progress"><i style="width:50%"></i></div><b>50%</b></div></td>
<td><span class="status in-progress">In Progress</span></td><td>20 Nov 2026</td>
</tr></tbody></table></div>
</article>
<article class="dash-card activities reveal">
<div class="card-head"><h2>Recent Activities</h2><button type="button" @click="navigate('/crm/activities')">View All →</button></div>
<div class="activity-list">
<div class="activity searchable" data-search="Invoice INV-2026-014 paid"><span class="activity-icon green"><svg><use href="#i-invoice"></use></svg></span><div><b>Invoice INV-2026-014 has been paid</b><small>2 hours ago</small></div></div>
<div class="activity searchable" data-search="PO-2026-001 approved"><span class="activity-icon blue"><svg><use href="#i-users"></use></svg></span><div><b>PO-2026-001 has been approved</b><small>5 hours ago</small></div></div>
<div class="activity searchable" data-search="Project PRJ-001 progress updated 75"><span class="activity-icon purple"><svg><use href="#i-chart"></use></svg></span><div><b>Project PRJ-001 progress updated to 75%</b><small>1 day ago</small></div></div>
<div class="activity searchable" data-search="New customer PT ABC Kogen Dairy added"><span class="activity-icon orange"><svg><use href="#i-users"></use></svg></span><div><b>New customer PT ABC Kogen Dairy added</b><small>1 day ago</small></div></div>
<div class="activity searchable" data-search="Quotation QT-2026-012 sent customer"><span class="activity-icon slate"><svg><use href="#i-file"></use></svg></span><div><b>Quotation QT-2026-012 sent to customer</b><small>2 days ago</small></div></div>
</div>
</article>
<article class="dash-card quick-actions reveal">
<div class="card-head"><h2>Quick Actions</h2></div>
<div class="quick-grid">
<button type="button" @click="navigate('/project')"><span class="green"><svg><use href="#i-plus"></use></svg></span>Create<br/>Project</button>
<button type="button" @click="navigate('/quotation/create')"><span class="blue"><svg><use href="#i-file"></use></svg></span>New<br/>Quotation</button>
<button type="button" @click="navigate('/purchase/request')"><span class="orange"><svg><use href="#i-cart"></use></svg></span>Purchase<br/>Request</button>
<button type="button" @click="navigate('/sales/invoices')"><span class="purple"><svg><use href="#i-invoice"></use></svg></span>Create<br/>Invoice</button>
<button type="button" @click="navigate('/crm/customers')"><span class="slate"><svg><use href="#i-user"></use></svg></span>Add<br/>Customer</button>
<button type="button" @click="navigate('/reports/management')"><span class="blue"><svg><use href="#i-chart"></use></svg></span>View<br/>Reports</button>
</div>
</article>
</section>
<section class="promo-banner reveal">
<img alt="" class="promo-illus" src="/assets/promo-illustration.jpg"/>
<div class="promo-copy"><h2>Streamline Your Operations<br/>with <span>SOP</span></h2><p>Integrate people, process, and technology for greater efficiency.</p></div>
<button type="button" @click="navigate('/documents')">Learn More <span>→</span></button>
<div class="promo-landscape"><div>Stronger Operations<br/>For a Sustainable Tomorrow<i></i></div></div>
</section>
</main>
</div>
<div class="toast" :class="{ show: toastVisible }" role="status">{{ toastMessage }}</div></div></template>
