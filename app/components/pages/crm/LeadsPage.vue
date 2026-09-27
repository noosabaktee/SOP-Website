<script setup lang="ts">
const router=useRouter(); const {showToast}=useToast();
onMounted(()=>{
 document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();router.push(a.getAttribute('href')||'/')}))
 const qs=<T extends Element=HTMLElement>(s:string)=>document.querySelector<T>(s); const qsa=<T extends Element=HTMLElement>(s:string)=>Array.from(document.querySelectorAll<T>(s)); const tbody=qs('#leadTableBody');
 const apply=()=>{const term=(qs<HTMLInputElement>('#leadSearch')?.value||'').toLowerCase();let visible=0;qsa<HTMLElement>('.lead-row').forEach(row=>{const hay=[row.dataset.name,row.dataset.company,row.dataset.email,row.dataset.phone].join(' ').toLowerCase();const ok=!term||hay.includes(term);row.classList.toggle('hidden-by-search',!ok);if(ok)visible++});const t=qs('#showingText');if(t)t.textContent=`Showing 1 - ${visible} leads`};qs<HTMLInputElement>('#leadSearch')?.addEventListener('input',apply);qs('#resetFilters')?.addEventListener('click',()=>{const s=qs<HTMLInputElement>('#leadSearch');if(s)s.value='';apply();showToast('Filters reset.')});qs('#applyFilters')?.addEventListener('click',()=>{apply();showToast('Filters applied.')})
 qs('#collapseBtn')?.addEventListener('click',()=>document.body.classList.toggle('sidebar-collapsed'));qs('#addLeadButton')?.addEventListener('click',()=>qs('#addLeadModal')?.classList.add('show'));qsa<HTMLElement>('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>qs('#'+(b.dataset.closeModal||''))?.classList.remove('show')));qs('#convertLead')?.addEventListener('click',()=>qs('#convertModal')?.classList.add('show'));qs('#confirmConvert')?.addEventListener('click',()=>{qs('#convertModal')?.classList.remove('show');showToast('Lead converted to opportunity.')});apply()
})
useHead({title:'SOP — CRM Leads',bodyAttrs:{class:'dashboard-page leads-page'}})
</script><template><div><svg aria-hidden="true" class="svg-sprite">
<symbol id="i-home" viewbox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10.5V21h14V10.5"></path><path d="M9 21v-6h6v6"></path></symbol>
<symbol id="i-users" viewbox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></symbol>
<symbol id="i-user" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></symbol>
<symbol id="i-target" viewbox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><path d="M21 3l-6 6M21 3l-5 1-1 5"></path></symbol>
<symbol id="i-filter" viewbox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8Z"></path></symbol>
<symbol id="i-handshake" viewbox="0 0 24 24"><path d="m8 11 2 2c1 1 2.5 1 3.5 0l4-4"></path><path d="m2 12 4-4 4 1 3-2 4 2 5 5-7 7-5-3-2 1-6-7Z"></path></symbol>
<symbol id="i-x" viewbox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19"></path></symbol>
<symbol id="i-file" viewbox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8M8 17h6"></path></symbol>
<symbol id="i-cart" viewbox="0 0 24 24"><circle cx="9" cy="20" r="1"></circle><circle cx="19" cy="20" r="1"></circle><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"></path></symbol>
<symbol id="i-briefcase" viewbox="0 0 24 24"><rect height="13" rx="2" width="18" x="3" y="7"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path></symbol>
<symbol id="i-box" viewbox="0 0 24 24"><path d="M21 8 12 3 3 8l9 5 9-5Z"></path><path d="m3 8 9 5v9"></path><path d="m21 8-9 5v9"></path></symbol>
<symbol id="i-chart" viewbox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"></path></symbol>
<symbol id="i-grid" viewbox="0 0 24 24"><rect height="7" rx="1" width="7" x="3" y="3"></rect><rect height="7" rx="1" width="7" x="14" y="3"></rect><rect height="7" rx="1" width="7" x="3" y="14"></rect><rect height="7" rx="1" width="7" x="14" y="14"></rect></symbol>
<symbol id="i-settings" viewbox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.08A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1.03-1.56V3h4v.08A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.56 1.03H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"></path></symbol>
<symbol id="i-search" viewbox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></symbol>
<symbol id="i-bell" viewbox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></symbol>
<symbol id="i-down" viewbox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></symbol>
<symbol id="i-up" viewbox="0 0 24 24"><path d="m6 15 6-6 6 6"></path></symbol>
<symbol id="i-menu" viewbox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></symbol>
<symbol id="i-eye" viewbox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="2.5"></circle></symbol>
<symbol id="i-more" viewbox="0 0 24 24"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></symbol>
<symbol id="i-mail" viewbox="0 0 24 24"><rect height="14" rx="2" width="18" x="3" y="5"></rect><path d="m3 7 9 6 9-6"></path></symbol>
<symbol id="i-phone" viewbox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z"></path></symbol>
<symbol id="i-building" viewbox="0 0 24 24"><path d="M3 21h18M5 21V4h10v17M15 9h4v12"></path><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1"></path></symbol>
<symbol id="i-factory" viewbox="0 0 24 24"><path d="M3 21V10l6 3v-3l6 3V7l6 3v11Z"></path><path d="M7 17h2M12 17h2M17 17h2"></path></symbol>
<symbol id="i-tag" viewbox="0 0 24 24"><path d="M20 13 13 20 4 11V4h7Z"></path><circle cx="8.5" cy="8.5" r="1"></circle></symbol>
<symbol id="i-money" viewbox="0 0 24 24"><path d="M4 6h16v12H4z"></path><circle cx="12" cy="12" r="3"></circle><path d="M7 9h.01M17 15h.01"></path></symbol>
<symbol id="i-calendar" viewbox="0 0 24 24"><rect height="16" rx="2" width="18" x="3" y="5"></rect><path d="M16 3v4M8 3v4M3 10h18"></path></symbol>
<symbol id="i-edit" viewbox="0 0 24 24"><path d="M12 20h9"></path><path d="m16.5 3.5 4 4L9 19l-5 1 1-5Z"></path></symbol>
<symbol id="i-help" viewbox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9a2.8 2.8 0 1 1 4.4 2.3c-1.2.8-1.9 1.4-1.9 2.7"></path><path d="M12 17h.01"></path></symbol>
<symbol id="i-logout" viewbox="0 0 24 24"><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"></path></symbol>
<symbol id="i-plus" viewbox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></symbol>
<symbol id="i-arrow-left" viewbox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></symbol>
</svg>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<aside class="sidebar crm-sidebar" id="sidebar">
<div class="sidebar-brand">
<div class="sop-logo side-logo"><span>S</span><i></i><span>P</span></div>
<div class="sidebar-brand-name">Sinergi Operational Platform</div>
</div>
<nav class="sidebar-nav crm-nav">
<a class="nav-item" data-label="Dashboard" href="/dashboard"><svg><use href="#i-home"></use></svg><span>Dashboard</span><svg class="nav-chevron"><use href="#i-down"></use></svg></a>
<button class="nav-item crm-parent expanded" data-label="CRM &amp; Sales" type="button"><svg><use href="#i-users"></use></svg><span>CRM &amp; Sales</span><svg class="nav-chevron"><use href="#i-up"></use></svg></button>
<div class="crm-submenu">
<a class="nav-item sub active" data-label="Leads" href="/crm/leads"><svg><use href="#i-user"></use></svg><span>Leads</span></a>
<a class="nav-item sub" data-label="Prospects" href="/crm/prospects"><svg><use href="#i-target"></use></svg><span>Prospects</span></a>
<a class="nav-item sub" data-label="Customers" href="/crm/customers"><svg><use href="#i-users"></use></svg><span>Customers</span></a>
<a class="nav-item sub" data-label="Activities" href="/crm/activities"><svg><use href="#i-calendar"></use></svg><span>Activities</span></a>
<a class="nav-item sub" data-label="Sales Pipeline" href="/crm/sales-pipeline"><svg><use href="#i-filter"></use></svg><span>Sales Pipeline</span></a>
</div>
<button class="nav-item" data-label="Quotation" type="button"><svg><use href="#i-file"></use></svg><span>Quotation</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Sales" type="button"><svg><use href="#i-cart"></use></svg><span>Sales</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Project" type="button"><svg><use href="#i-briefcase"></use></svg><span>Project</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Procurement" type="button"><svg><use href="#i-cart"></use></svg><span>Procurement</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Inventory" type="button"><svg><use href="#i-box"></use></svg><span>Inventory</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Finance &amp; Accounting" type="button"><svg><use href="#i-chart"></use></svg><span>Finance &amp; Accounting</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Reports" type="button"><svg><use href="#i-chart"></use></svg><span>Reports</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Master Data" type="button"><svg><use href="#i-grid"></use></svg><span>Master Data</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Documents" type="button"><svg><use href="#i-file"></use></svg><span>Documents</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="GMS" type="button"><svg><use href="#i-briefcase"></use></svg><span>GMS</span><svg class="nav-chevron"><use href="#i-down"></use></svg></button>
<button class="nav-item" data-label="Settings" type="button"><svg><use href="#i-settings"></use></svg><span>Settings</span></button>
</nav>
<div class="sidebar-bottom">
<div class="sidebar-photo"></div>
<div class="sidebar-tagline">People.<br/>Process.<br/>Technology.<br/>For a Better Tomorrow.<i></i></div>
<div class="sidebar-copyright">© 2026 PT Sinergi Bisnis Indonesia<br/>All rights reserved.</div>
</div>
</aside>
<div class="app crm-app">
<header class="topnav crm-topnav">
<button aria-label="Collapse sidebar" class="back-collapse" id="collapseBtn" type="button"><svg><use href="#i-arrow-left"></use></svg></button>
<button aria-label="Open menu" class="mobile-menu" id="mobileMenu" type="button"><svg><use href="#i-menu"></use></svg></button>
<div class="top-mobile-logo"><div class="sop-logo tiny"><span>S</span><i></i><span>P</span></div></div>
<label class="searchbox crm-global-search" for="globalSearch">
<svg><use href="#i-search"></use></svg>
<input id="globalSearch" placeholder="Search leads, companies, contacts, or anything..." type="search"/>
<kbd>Ctrl + K</kbd>
</label>
<div class="top-actions">
<button aria-label="Notifications" class="icon-button notification" type="button"><svg><use href="#i-bell"></use></svg><span>3</span></button>
<button aria-label="Applications" class="icon-button app-grid" type="button"><svg><use href="#i-grid"></use></svg></button>
<span class="top-separator"></span>
<button aria-expanded="false" class="profile-button" id="profileButton" type="button">
<img alt="Irpan Hidayat Pamil" src="/assets/avatar.jpg"/>
<span><b>Irpan Hidayat Pamil</b><small>CEO</small></span>
<svg><use href="#i-down"></use></svg>
</button>
<div class="profile-menu" id="profileMenu">
<button type="button"><svg><use href="#i-user"></use></svg>Profile</button>
<button type="button"><svg><use href="#i-settings"></use></svg>My Settings</button>
<button type="button"><svg><use href="#i-bell"></use></svg>Notifications</button>
<button type="button"><svg><use href="#i-help"></use></svg>Help Center</button>
<hr/>
<button class="signout" id="signOut" type="button"><svg><use href="#i-logout"></use></svg>Sign Out</button>
</div>
</div>
</header>
<div class="mobile-search-row">
<label class="searchbox mobile-search" for="mobileSearch">
<svg><use href="#i-search"></use></svg><input id="mobileSearch" placeholder="Search leads, companies, contacts..." type="search"/>
</label>
</div>
<main class="leads-main page-enter">
<section class="leads-hero">
<div>
<div class="breadcrumb"><span>CRM &amp; Sales</span><b>›</b><strong>Leads</strong></div>
<h1>Leads</h1>
<p>Capture, track, and convert your potential customers into valuable opportunities.</p>
</div>
<div class="leads-hero-tagline">More Opportunities<br/>A Stronger Tomorrow<i></i></div>
</section>
<section class="lead-kpis">
<article class="lead-kpi reveal"><span class="lead-kpi-icon blue"><svg><use href="#i-users"></use></svg></span><div><small>Total Leads</small><strong>248</strong><p class="trend up">⬆ +12% <span>vs last month</span></p></div></article>
<article class="lead-kpi reveal"><span class="lead-kpi-icon green"><svg><use href="#i-target"></use></svg></span><div><small>New Leads (This Month)</small><strong>32</strong><p class="trend up">⬆ +28% <span>vs last month</span></p></div></article>
<article class="lead-kpi reveal"><span class="lead-kpi-icon orange"><svg><use href="#i-filter"></use></svg></span><div><small>In Progress</small><strong>156</strong><p class="trend warm">⬆ +8% <span>vs last month</span></p></div></article>
<article class="lead-kpi reveal"><span class="lead-kpi-icon purple"><svg><use href="#i-handshake"></use></svg></span><div><small>Converted</small><strong>28</strong><p class="trend up">⬆ +40% <span>vs last month</span></p></div></article>
<article class="lead-kpi reveal"><span class="lead-kpi-icon red"><svg><use href="#i-x"></use></svg></span><div><small>Lost</small><strong>64</strong><p class="trend down">⬇ -10% <span>vs last month</span></p></div></article>
</section>
<section class="lead-toolbar reveal">
<div class="toolbar-search"><svg><use href="#i-search"></use></svg><input id="leadSearch" placeholder="Search by name, company, email, or phone..." type="search"/></div>
<label class="filter-control"><span>Lead Source</span><select id="sourceFilter">
<option>All Sources</option><option>Website</option><option>Referral</option><option>Event</option><option>Cold Call</option><option>LinkedIn</option>
</select></label>
<label class="filter-control"><span>Status</span><select id="statusFilter">
<option>All Status</option><option>New</option><option>In Progress</option><option>Qualified</option><option>Nurturing</option><option>Contacted</option><option>Proposal</option><option>Converted</option><option>Lost</option>
</select></label>
<label class="filter-control assigned-filter"><span>Assigned To</span><select id="assignedFilter">
<option>All Team Members</option><option>Budi Santoso</option><option>Sari Dewi</option><option>Andi Wijaya</option><option>Rina Marlina</option>
</select></label>
<div class="filter-control date-filter"><span>Date Range</span><div class="date-pair"><svg><use href="#i-calendar"></use></svg><input id="dateFrom" type="date" value="2026-09-01"/><b>–</b><input id="dateTo" type="date" value="2026-09-30"/></div></div>
<button class="filter-button" id="applyFilters" type="button"><svg><use href="#i-filter"></use></svg>Filter</button>
<button class="reset-button" id="resetFilters" type="button">Reset</button>
<div class="add-lead-wrap">
<button class="add-lead-main" id="addLeadButton" type="button"><span>＋</span>Add Lead</button>
<button aria-label="More add lead options" class="add-lead-drop" id="addLeadDrop" type="button"><svg><use href="#i-down"></use></svg></button>
<div class="add-menu" id="addMenu"><button type="button">Import Leads</button><button type="button">Bulk Add</button></div>
</div>
</section>
<section class="bulk-toolbar" id="bulkToolbar"><strong id="selectedCount">0</strong> leads selected <button id="bulkAssign" type="button">Assign</button><button id="bulkDelete" type="button">Delete</button></section>
<section class="lead-content-grid">
<article class="lead-table-card reveal">
<div class="lead-table-scroll">
<table class="lead-table">
<thead><tr>
<th class="check-col"><label class="table-check"><input id="selectAll" type="checkbox"/><span></span></label></th>
<th class="num-col">#</th><th>Lead Name</th><th>Company</th><th>Contact</th><th>Lead Source</th><th>Status</th><th>Potential Value</th><th>Assigned To</th><th>Created Date</th><th>Actions</th>
</tr></thead>
<tbody id="leadTableBody">
<tr class="lead-row selected" data-assigned="Budi Santoso" data-company="PT ABC Kogen Dairy" data-date="16 Sep 2026" data-email="andi@abc.co.id" data-industry="Manufacturing" data-name="Andi Pratama" data-phone="+62 812 3456 7890" data-source="Website" data-status="New" data-value="Rp 250,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">1</td>
<td><button class="lead-name-button" type="button">Andi Pratama</button></td>
<td>PT ABC Kogen Dairy</td>
<td class="contact-cell"><span>andi@abc.co.id</span><small>+62 812 3456 7890</small></td>
<td><span class="source-badge website">Website</span></td>
<td><span class="lead-status new">New</span></td>
<td class="money-cell">Rp 250,000,000</td>
<td><span class="assigned-cell"><i>BS</i>Budi Santoso</span></td>
<td class="date-cell">16 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Sari Dewi" data-company="PT Uniguard" data-date="15 Sep 2026" data-email="siti@uniguard.co.id" data-industry="Security Services" data-name="Siti Rahmawati" data-phone="+62 813 9876 5432" data-source="Referral" data-status="In Progress" data-value="Rp 187,500,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">2</td>
<td><button class="lead-name-button" type="button">Siti Rahmawati</button></td>
<td>PT Uniguard</td>
<td class="contact-cell"><span>siti@uniguard.co.id</span><small>+62 813 9876 5432</small></td>
<td><span class="source-badge referral">Referral</span></td>
<td><span class="lead-status in-progress">In Progress</span></td>
<td class="money-cell">Rp 187,500,000</td>
<td><span class="assigned-cell"><i>SD</i>Sari Dewi</span></td>
<td class="date-cell">15 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Andi Wijaya" data-company="PT Kalbe Morinaga" data-date="14 Sep 2026" data-email="budi@kalbe.co.id" data-industry="Food &amp; Beverage" data-name="Budi Kurniawan" data-phone="+62 811 2233 4455" data-source="Event" data-status="Qualified" data-value="Rp 320,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">3</td>
<td><button class="lead-name-button" type="button">Budi Kurniawan</button></td>
<td>PT Kalbe Morinaga</td>
<td class="contact-cell"><span>budi@kalbe.co.id</span><small>+62 811 2233 4455</small></td>
<td><span class="source-badge event">Event</span></td>
<td><span class="lead-status qualified">Qualified</span></td>
<td class="money-cell">Rp 320,000,000</td>
<td><span class="assigned-cell"><i>AW</i>Andi Wijaya</span></td>
<td class="date-cell">14 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Sari Dewi" data-company="PT Pupuk Kujang" data-date="12 Sep 2026" data-email="rina@pupuk.co.id" data-industry="Manufacturing" data-name="Rina Sari" data-phone="+62 812 6677 8899" data-source="Website" data-status="Nurturing" data-value="Rp 1,380,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">4</td>
<td><button class="lead-name-button" type="button">Rina Sari</button></td>
<td>PT Pupuk Kujang</td>
<td class="contact-cell"><span>rina@pupuk.co.id</span><small>+62 812 6677 8899</small></td>
<td><span class="source-badge website">Website</span></td>
<td><span class="lead-status nurturing">Nurturing</span></td>
<td class="money-cell">Rp 1,380,000,000</td>
<td><span class="assigned-cell"><i>SD</i>Sari Dewi</span></td>
<td class="date-cell">12 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Budi Santoso" data-company="PT Dankos Farma" data-date="10 Sep 2026" data-email="dedi@dankos.co.id" data-industry="Pharmaceutical" data-name="Dedi Irawan" data-phone="+62 813 1122 3344" data-source="Cold Call" data-status="Contacted" data-value="Rp 260,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">5</td>
<td><button class="lead-name-button" type="button">Dedi Irawan</button></td>
<td>PT Dankos Farma</td>
<td class="contact-cell"><span>dedi@dankos.co.id</span><small>+62 813 1122 3344</small></td>
<td><span class="source-badge cold-call">Cold Call</span></td>
<td><span class="lead-status contacted">Contacted</span></td>
<td class="money-cell">Rp 260,000,000</td>
<td><span class="assigned-cell"><i>BS</i>Budi Santoso</span></td>
<td class="date-cell">10 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Andi Wijaya" data-company="PT Cimory" data-date="08 Sep 2026" data-email="maya@cimory.co.id" data-industry="Food &amp; Beverage" data-name="Maya Putri" data-phone="+62 812 9988 7766" data-source="Referral" data-status="Proposal" data-value="Rp 180,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">6</td>
<td><button class="lead-name-button" type="button">Maya Putri</button></td>
<td>PT Cimory</td>
<td class="contact-cell"><span>maya@cimory.co.id</span><small>+62 812 9988 7766</small></td>
<td><span class="source-badge referral">Referral</span></td>
<td><span class="lead-status proposal">Proposal</span></td>
<td class="money-cell">Rp 180,000,000</td>
<td><span class="assigned-cell"><i>AW</i>Andi Wijaya</span></td>
<td class="date-cell">08 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Rina Marlina" data-company="PT Tazaka Elektrik" data-date="05 Sep 2026" data-email="agus@tazaka.co.id" data-industry="Electrical" data-name="Agus Salim" data-phone="+62 821 5566 7788" data-source="LinkedIn" data-status="New" data-value="Rp 410,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">7</td>
<td><button class="lead-name-button" type="button">Agus Salim</button></td>
<td>PT Tazaka Elektrik</td>
<td class="contact-cell"><span>agus@tazaka.co.id</span><small>+62 821 5566 7788</small></td>
<td><span class="source-badge linkedin">LinkedIn</span></td>
<td><span class="lead-status new">New</span></td>
<td class="money-cell">Rp 410,000,000</td>
<td><span class="assigned-cell"><i>RM</i>Rina Marlina</span></td>
<td class="date-cell">05 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Budi Santoso" data-company="PT GGPC Lampung" data-date="02 Sep 2026" data-email="fitri@ggpc.co.id" data-industry="Agriculture" data-name="Fitri Handayani" data-phone="+62 812 3344 5566" data-source="Event" data-status="In Progress" data-value="Rp 275,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">8</td>
<td><button class="lead-name-button" type="button">Fitri Handayani</button></td>
<td>PT GGPC Lampung</td>
<td class="contact-cell"><span>fitri@ggpc.co.id</span><small>+62 812 3344 5566</small></td>
<td><span class="source-badge event">Event</span></td>
<td><span class="lead-status in-progress">In Progress</span></td>
<td class="money-cell">Rp 275,000,000</td>
<td><span class="assigned-cell"><i>BS</i>Budi Santoso</span></td>
<td class="date-cell">02 Sep 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Sari Dewi" data-company="PT Indofood" data-date="30 Aug 2026" data-email="arief@indofood.co.id" data-industry="Food &amp; Beverage" data-name="Arief Wibowo" data-phone="+62 811 7788 9900" data-source="Website" data-status="Lost" data-value="Rp 150,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">9</td>
<td><button class="lead-name-button" type="button">Arief Wibowo</button></td>
<td>PT Indofood</td>
<td class="contact-cell"><span>arief@indofood.co.id</span><small>+62 811 7788 9900</small></td>
<td><span class="source-badge website">Website</span></td>
<td><span class="lead-status lost">Lost</span></td>
<td class="money-cell">Rp 150,000,000</td>
<td><span class="assigned-cell"><i>SD</i>Sari Dewi</span></td>
<td class="date-cell">30 Aug 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr>
<tr class="lead-row" data-assigned="Andi Wijaya" data-company="PT Sinar Mas" data-date="28 Aug 2026" data-email="lina@sinaras.com" data-industry="Conglomerate" data-name="Lina Marlina" data-phone="+62 813 4455 6677" data-source="Cold Call" data-status="Converted" data-value="Rp 95,000,000">
<td class="check-col"><label class="table-check"><input class="row-check" type="checkbox"/><span></span></label></td>
<td class="num-col">10</td>
<td><button class="lead-name-button" type="button">Lina Marlina</button></td>
<td>PT Sinar Mas</td>
<td class="contact-cell"><span>lina@sinaras.com</span><small>+62 813 4455 6677</small></td>
<td><span class="source-badge cold-call">Cold Call</span></td>
<td><span class="lead-status converted">Converted</span></td>
<td class="money-cell">Rp 95,000,000</td>
<td><span class="assigned-cell"><i>AW</i>Andi Wijaya</span></td>
<td class="date-cell">28 Aug 2026</td>
<td class="actions-cell"><button aria-label="View lead" class="table-icon view-lead" type="button"><svg><use href="#i-eye"></use></svg></button><button aria-label="More actions" class="table-icon row-more" type="button"><svg><use href="#i-more"></use></svg></button></td>
</tr></tbody>
</table>
<div class="no-results" id="noResults">No leads match the current filters.</div>
</div>
<footer class="lead-pagination">
<div id="showingText">Showing 1 - 10 of 248 leads</div>
<div class="pagination-controls">
<select id="perPage"><option>10</option><option>25</option><option>50</option></select><span>per page</span>
<button class="page-btn" data-page="prev" type="button">‹</button>
<button class="page-btn active" data-page="1" type="button">1</button>
<button class="page-btn" data-page="2" type="button">2</button>
<button class="page-btn" data-page="3" type="button">3</button>
<button class="page-btn" data-page="4" type="button">4</button>
<button class="page-btn" data-page="5" type="button">5</button>
<span class="page-dots">…</span>
<button class="page-btn" data-page="25" type="button">25</button>
<button class="page-btn" data-page="next" type="button">›</button>
<button class="page-btn" data-page="last" type="button">»</button>
</div>
</footer>
</article>
<aside class="lead-detail-card reveal" id="leadDetail">
<div class="detail-head">
<div class="lead-avatar" id="detailAvatar">AP</div>
<div class="detail-title"><h2 id="detailName">Andi Pratama</h2><p id="detailCompany">PT ABC Kogen Dairy</p></div>
<span class="lead-status new" id="detailStatus">New</span>
<button class="detail-more" id="detailMore" type="button"><svg><use href="#i-more"></use></svg></button>
</div>
<div class="detail-tabs">
<button class="active" data-tab="details" type="button">Details</button>
<button data-tab="activities" type="button">Activities</button>
<button data-tab="notes" type="button">Notes</button>
<button data-tab="files" type="button">Files</button>
</div>
<div class="detail-panel active" data-panel="details">
<div class="detail-list">
<div><svg><use href="#i-mail"></use></svg><span>Email</span><b id="detailEmail">andi@abc.co.id</b></div>
<div><svg><use href="#i-phone"></use></svg><span>Phone</span><b id="detailPhone">+62 812 3456 7890</b></div>
<div><svg><use href="#i-building"></use></svg><span>Company</span><b id="detailCompanyField">PT ABC Kogen Dairy</b></div>
<div><svg><use href="#i-factory"></use></svg><span>Industry</span><b id="detailIndustry">Manufacturing</b></div>
<div><svg><use href="#i-tag"></use></svg><span>Lead Source</span><b id="detailSource">Website</b></div>
<div><svg><use href="#i-money"></use></svg><span>Potential Value</span><b id="detailValue">Rp 250,000,000</b></div>
<div><svg><use href="#i-user"></use></svg><span>Assigned To</span><b id="detailAssigned">Budi Santoso</b></div>
<div><svg><use href="#i-calendar"></use></svg><span>Created Date</span><b id="detailDate">16 September 2026</b></div>
<div><svg><use href="#i-target"></use></svg><span>Last Activity</span><b id="detailActivity">16 September 2026</b></div>
</div>
</div>
<div class="detail-panel detail-empty" data-panel="activities"><strong>Recent Activities</strong><p>Demo activity timeline for the selected lead will appear here.</p></div>
<div class="detail-panel detail-empty" data-panel="notes"><strong>Notes</strong><p>Add and review internal CRM notes for the selected lead.</p></div>
<div class="detail-panel detail-empty" data-panel="files"><strong>Files</strong><p>Lead attachments and supporting files will appear here.</p></div>
<div class="detail-actions">
<button class="edit-lead" id="editLead" type="button"><svg><use href="#i-edit"></use></svg>Edit Lead</button>
<button class="convert-lead" id="convertLead" type="button">Convert to Opportunity</button>
</div>
</aside>
</section>
</main>
</div>
 Add Lead Modal 
<div aria-hidden="true" class="modal-overlay" id="addLeadModal">
<div aria-labelledby="addLeadTitle" aria-modal="true" class="modal-card" role="dialog">
<div class="modal-head"><div><h2 id="addLeadTitle">Add New Lead</h2><p>Create a new CRM lead record.</p></div><button class="modal-close" data-close-modal="addLeadModal" type="button">×</button></div>
<form class="lead-form" id="addLeadForm">
<label>Lead Name<input name="name" placeholder="e.g. Fajar Nugroho" required=""/></label>
<label>Company<input name="company" placeholder="Company name" required=""/></label>
<label>Email<input name="email" placeholder="name@company.com" required="" type="email"/></label>
<label>Phone<input name="phone" placeholder="+62 ..." required=""/></label>
<label>Lead Source<select name="source"><option>Website</option><option>Referral</option><option>Event</option><option>Cold Call</option><option>LinkedIn</option></select></label>
<label>Status<select name="status"><option>New</option><option>In Progress</option><option>Qualified</option><option>Nurturing</option><option>Contacted</option><option>Proposal</option></select></label>
<label>Potential Value<input name="value" placeholder="Rp 0"/></label>
<label>Assigned To<select name="assigned"><option>Budi Santoso</option><option>Sari Dewi</option><option>Andi Wijaya</option><option>Rina Marlina</option></select></label>
<label class="full-field">Notes<textarea name="notes" placeholder="Optional notes" rows="3"></textarea></label>
<div class="modal-actions full-field"><button class="modal-secondary" data-close-modal="addLeadModal" type="button">Cancel</button><button class="modal-primary" id="saveLeadButton" type="submit"><span class="mini-loader"></span><b>Save Lead</b></button></div>
</form>
</div>
</div>
 Convert Modal 
<div aria-hidden="true" class="modal-overlay" id="convertModal">
<div aria-labelledby="convertTitle" aria-modal="true" class="modal-card small-modal" role="dialog">
<div class="convert-icon"><svg><use href="#i-handshake"></use></svg></div>
<h2 id="convertTitle">Convert Lead to Opportunity?</h2>
<p>This will create an opportunity from <strong id="convertLeadName">Andi Pratama</strong>.</p>
<div class="modal-actions"><button class="modal-secondary" data-close-modal="convertModal" type="button">Cancel</button><button class="modal-primary" id="confirmConvert" type="button">Convert</button></div>
</div>
</div>
<div class="toast" id="toast" role="status"></div></div></template>
