
(() => {
"use strict";

const CFG = window.SOP_PLATFORM_CONFIG;
const ROUTE = window.SOP_ROUTE || document.body.dataset.route || "/";
const BASE = window.SOP_BASE || document.body.dataset.base || "./";
const PAGE = CFG.routes[ROUTE] || {title:"SOP",description:"Sinergi Operational Platform",type:"grid",schema:"generic",module:"SOP",kpis:[]};
const root = document.getElementById("sop-platform-root");

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
const pad=(n,l=4)=>String(n).padStart(l,"0");

const SVG_SPRITE = `
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<symbol id="ps-home" viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V21h14V10.5"/><path d="M9 21v-6h6v6"/></symbol>
<symbol id="ps-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
<symbol id="ps-file" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></symbol>
<symbol id="ps-cart" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"/></symbol>
<symbol id="ps-briefcase" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></symbol>
<symbol id="ps-box" viewBox="0 0 24 24"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="m3 8 9 5v9"/><path d="m21 8-9 5v9"/></symbol>
<symbol id="ps-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/></symbol>
<symbol id="ps-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></symbol>
<symbol id="ps-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.08A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1.03-1.56V3h4v.08A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.56 1.03H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/></symbol>
<symbol id="ps-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>
<symbol id="ps-bell" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></symbol>
<symbol id="ps-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="ps-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>
<symbol id="ps-search2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>
<symbol id="ps-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="ps-upload" viewBox="0 0 24 24"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></symbol>
<symbol id="ps-download" viewBox="0 0 24 24"><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></symbol>
<symbol id="ps-filter" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8Z"/></symbol>
<symbol id="ps-refresh" viewBox="0 0 24 24"><path d="M20 7V3l-3 3a8 8 0 1 0 2 8"/><path d="M20 3h-4"/></symbol>
<symbol id="ps-more" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></symbol>
<symbol id="ps-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
<symbol id="ps-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.8 2.8 0 1 1 4.4 2.3c-1.2.8-1.9 1.4-1.9 2.7"/><path d="M12 17h.01"/></symbol>
<symbol id="ps-logout" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"/></symbol>
<symbol id="ps-chevron-left" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
<symbol id="ps-edit" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="m16.5 3.5 4 4L9 19l-5 1 1-5Z"/></symbol>
<symbol id="ps-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></symbol>
<symbol id="ps-print" viewBox="0 0 24 24"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></symbol>
<symbol id="ps-trash" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v5M14 11v5"/></symbol>
<symbol id="ps-save" viewBox="0 0 24 24"><path d="M5 3h12l2 2v16H5z"/><path d="M8 3v6h8V3"/><path d="M8 14h8v7H8z"/></symbol>
<symbol id="ps-warning" viewBox="0 0 24 24"><path d="M12 3 2 21h20Z"/><path d="M12 9v5M12 18h.01"/></symbol>
<symbol id="ps-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></symbol>
<symbol id="ps-handshake" viewBox="0 0 24 24"><path d="m8 11 2 2c1 1 2.5 1 3.5 0l4-4"/><path d="m2 12 4-4 4 1 3-2 4 2 5 5-7 7-5-3-2 1-6-7Z"/></symbol>
<symbol id="ps-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
<symbol id="ps-x" viewBox="0 0 24 24"><path d="m5 5 14 14M19 5 5 19"/></symbol>
</svg>`;

const icon=(name,cls="")=>`<svg class="${cls}"><use href="#ps-${name}"></use></svg>`;

function routeHref(route){
  if(route==="/dashboard") return BASE+"dashboard.html";
  if(route==="/crm/leads") return BASE+"crm/leads.html";
  const clean=route.replace(/^\/+/,"");
  return BASE+clean+"/index.html";
}

function isRouteActive(route){
  if(route===ROUTE) return true;
  return false;
}
function routeBelongs(node){
  if(node.route) return node.route===ROUTE;
  if(node.children) return node.children.some(routeBelongs);
  if(node.groups) return node.groups.some(g=>g.children.some(routeBelongs));
  return false;
}

function menuNodeHtml(node){
  const active=routeBelongs(node);
  if(node.route){
    return `<a class="pm-item ${isRouteActive(node.route)?"active":""}" data-label="${esc(node.label)}" href="${routeHref(node.route)}">${icon(node.icon||"file")}<span class="pm-label">${esc(node.label)}</span></a>`;
  }
  if(node.groups){
    const groups=node.groups.map(g=>`<div class="pm-group-label">${esc(g.label)}</div>${g.children.map(menuNodeHtml).join("")}`).join("");
    return `<button class="pm-parent ${active?"open":""}" data-label="${esc(node.label)}" type="button">${icon(node.icon||"file")}<span class="pm-label">${esc(node.label)}</span>${icon("down","pm-caret")}</button><div class="pm-children ${active?"open":""}">${groups}</div>`;
  }
  const children=(node.children||[]).map(menuNodeHtml).join("");
  return `<button class="pm-parent ${active?"open":""}" data-label="${esc(node.label)}" type="button">${icon(node.icon||"file")}<span class="pm-label">${esc(node.label)}</span>${icon("down","pm-caret")}</button><div class="pm-children ${active?"open":""}">${children}</div>`;
}

function shellHtml(){
  return `${SVG_SPRITE}
  <div class="platform-sidebar-overlay" id="platformSidebarOverlay"></div>
  <aside class="platform-sidebar" id="platformSidebar">
    <div class="platform-brand">
      <div class="brand-word"><span>S</span><i></i><span>P</span></div>
      <small>Sinergi Operational Platform</small>
      <button class="platform-collapse" id="platformCollapse" type="button" aria-label="Collapse sidebar">${icon("chevron-left")}</button>
    </div>
    <nav class="platform-menu">${CFG.menu.map(menuNodeHtml).join("")}</nav>
    <div class="platform-sidebar-bottom">
      <div class="slogan">People.<br>Process.<br>Technology.<br>For a Better Tomorrow.<i></i></div>
      <div class="copy">© 2026 PT Sinergi Bisnis Indonesia<br>All rights reserved.</div>
    </div>
  </aside>
  <div class="platform-app">
    <header class="platform-topbar">
      <button class="platform-mobile-menu" id="platformMobileMenu" type="button" aria-label="Open menu">${icon("menu")}</button>
      <label class="platform-search"><span>${icon("search")}</span><input id="platformGlobalSearch" type="search" placeholder="Search projects, quotations, customers, or anything..."><kbd>Ctrl + K</kbd></label>
      <div class="platform-top-actions">
        <button class="platform-icon-btn" type="button" data-demo="Notifications">${icon("bell")}<span class="badge">3</span></button>
        <button class="platform-icon-btn platform-grid-button" type="button" data-demo="Applications">${icon("grid")}</button>
        <span class="platform-separator"></span>
        <button class="platform-user" id="platformUser" type="button" aria-expanded="false"><img src="${BASE}assets/avatar.jpg" alt="Irpan Hidayat Pamil"><span><b>Irpan Hidayat Pamil</b><small>CEO</small></span>${icon("down")}</button>
        <div class="platform-profile-menu" id="platformProfileMenu">
          <button type="button" data-demo="Profile">${icon("user")}Profile</button>
          <button type="button" data-demo="My Settings">${icon("settings")}My Settings</button>
          <button type="button" data-demo="Notifications">${icon("bell")}Notifications</button>
          <button type="button" data-demo="Help Center">${icon("help")}Help Center</button>
          <button type="button" class="danger" id="platformSignOut">${icon("logout")}Sign Out</button>
        </div>
      </div>
    </header>
    <div class="platform-mobile-search"><label class="platform-search"><span>${icon("search")}</span><input id="platformMobileSearch" type="search" placeholder="Search SOP..."></label></div>
    <main class="platform-main">
      <section class="platform-hero">
        <div><div class="platform-breadcrumb"><span>${esc(PAGE.module||"SOP")}</span><b>›</b><strong>${esc(PAGE.title)}</strong></div><h1>${esc(PAGE.title)}</h1><p>${esc(PAGE.description)}</p></div>
        <div class="platform-hero-tag">Integrated Operations<br>for a Better Tomorrow<i></i></div>
      </section>
      <div id="platformPageBody"></div>
    </main>
  </div>
  <div class="detail-drawer-overlay" id="drawerOverlay"></div>
  <aside class="detail-drawer" id="detailDrawer"></aside>
  <div id="platformModals"></div>
  <div class="toast" id="toast" role="status"></div>`;
}

root.innerHTML=shellHtml();

const toast=$("#toast");
let toastTimer;
function showToast(msg){
  clearTimeout(toastTimer);
  toast.textContent=msg; toast.classList.add("show");
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}

function initShell(){
  $("#platformCollapse")?.addEventListener("click",()=>document.body.classList.toggle("platform-collapsed"));
  const sidebar=$("#platformSidebar"), overlay=$("#platformSidebarOverlay");
  $("#platformMobileMenu")?.addEventListener("click",()=>{sidebar.classList.add("mobile-open");overlay.classList.add("show")});
  overlay?.addEventListener("click",()=>{sidebar.classList.remove("mobile-open");overlay.classList.remove("show")});
  $$(".pm-parent").forEach(btn=>btn.addEventListener("click",()=>{
    const children=btn.nextElementSibling;
    btn.classList.toggle("open");
    children?.classList.toggle("open");
  }));
  const user=$("#platformUser"), menu=$("#platformProfileMenu");
  user?.addEventListener("click",e=>{e.stopPropagation();const open=menu.classList.toggle("show");user.setAttribute("aria-expanded",String(open))});
  document.addEventListener("click",e=>{if(!e.target.closest(".platform-user")&&!e.target.closest(".platform-profile-menu")) menu?.classList.remove("show")});
  $("#platformSignOut")?.addEventListener("click",()=>location.href=BASE+"index.html");
  $$("[data-demo]").forEach(b=>b.addEventListener("click",()=>showToast(b.dataset.demo+" demo action.")));
  const global=$("#platformGlobalSearch"), mobile=$("#platformMobileSearch");
  [global,mobile].filter(Boolean).forEach(input=>input.addEventListener("input",()=>{
    const q=input.value;
    if(global!==input) global.value=q;if(mobile!==input) mobile.value=q;
    window.SOP_CURRENT_GRID?.filter(q);
  }));
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
      e.preventDefault();const target=innerWidth<=767?mobile:global;target?.focus();target?.select();
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){
      e.preventDefault(); window.SOP_CURRENT_GRID?.save(); showToast("Saved.");
    }
  });
}
initShell();

/* ---------- Data schemas ---------- */
const c=(key,title,type="text",extra={})=>Object.assign({key,title,type,editable:true,width:120},extra);
const SCHEMAS={
  prospects:[
    c("prospectId","Prospect ID","text",{editable:false,width:95}),c("company","Company","text",{required:true,width:160}),c("contactPerson","Contact Person","text",{required:true,width:135}),
    c("industry","Industry","dropdown",{source:["Manufacturing","Food & Beverage","Pharmaceutical","Electrical","Technology","Services"]}),c("source","Source","dropdown",{source:["Website","Referral","Event","Cold Call","LinkedIn"]}),
    c("qualification","Qualification","dropdown",{source:["Cold","Warm","Hot","Qualified"]}),c("potentialValue","Potential Value","currency"),c("probability","Probability","percent"),
    c("assignedTo","Assigned To","dropdown",{source:["Budi Santoso","Sari Dewi","Andi Wijaya","Rina Marlina"]}),c("nextFollowUp","Next Follow Up","date"),c("status","Status","status"),c("createdDate","Created Date","date",{editable:false})
  ],
  customers:[
    c("customerCode","Customer Code","text",{required:true,width:100}),c("customerName","Customer Name","text",{required:true,width:160}),c("company","Company","text",{width:170}),c("industry","Industry"),
    c("customerType","Customer Type","dropdown",{source:["Corporate","Enterprise","Distributor","Government"]}),c("npwp","NPWP"),c("email","Email","email",{width:175}),c("phone","Phone","text",{width:135}),
    c("address","Address","text",{width:220}),c("pic","PIC"),c("salesOwner","Sales Owner"),c("creditLimit","Credit Limit","currency"),c("paymentTerms","Payment Terms","dropdown",{source:["COD","14 Days","30 Days","45 Days","60 Days"]}),c("status","Status","status")
  ],
  activities:[
    c("activityId","Activity ID","text",{editable:false,width:92}),c("date","Date","date"),c("type","Type","dropdown",{source:["Call","Email","Meeting","Visit","Follow Up","WhatsApp","Task"]}),c("subject","Subject","text",{width:210}),
    c("customer","Customer","dropdown"),c("contact","Contact"),c("pic","PIC"),c("priority","Priority","dropdown",{source:["Low","Normal","High","Urgent"]}),c("dueDate","Due Date","date"),c("status","Status","status"),c("result","Result","text",{width:180}),c("nextAction","Next Action","text",{width:180})
  ],
  quotation:[
    c("quotationNo","Quotation No","text",{editable:false,width:115}),c("quotationDate","Quotation Date","date"),c("customer","Customer","dropdown",{width:170}),c("project","Project","dropdown",{width:170}),c("salesOwner","Sales Owner"),
    c("subtotal","Subtotal","currency"),c("discount","Discount","currency"),c("tax","Tax","currency"),c("grandTotal","Grand Total","currency"),c("validity","Validity","date"),c("status","Status","status"),c("approval","Approval","status"),c("createdBy","Created By")
  ],
  "sales-orders":[
    c("soNumber","SO Number","text",{editable:false,width:105}),c("soDate","SO Date","date"),c("customer","Customer","dropdown",{width:170}),c("quotation","Quotation"),c("project","Project","text",{width:160}),c("salesOwner","Sales Owner"),
    c("subtotal","Subtotal","currency"),c("tax","Tax","currency"),c("grandTotal","Grand Total","currency"),c("deliveryStatus","Delivery Status","status"),c("invoiceStatus","Invoice Status","status"),c("paymentStatus","Payment Status","status"),c("status","Status","status")
  ],
  delivery:[
    c("bastNumber","BAST Number","text",{editable:false,width:110}),c("deliveryDate","Delivery Date","date"),c("customer","Customer","text",{width:170}),c("salesOrder","Sales Order"),c("project","Project","text",{width:160}),c("deliveryLocation","Delivery Location","text",{width:180}),
    c("pic","PIC"),c("vehicle","Vehicle"),c("driver","Driver"),c("orderedQty","Ordered Qty","number"),c("deliveredQty","Delivered Qty","number"),c("remainingQty","Remaining Qty","number"),c("condition","Condition"),c("status","Status","status")
  ],
  invoice:[
    c("invoiceNo","Invoice No","text",{editable:false,width:110}),c("invoiceDate","Invoice Date","date"),c("customer","Customer","text",{width:170}),c("salesOrder","Sales Order"),c("project","Project","text",{width:160}),c("dueDate","Due Date","date"),
    c("subtotal","Subtotal","currency"),c("tax","Tax","currency"),c("total","Total","currency"),c("paid","Paid","currency"),c("outstanding","Outstanding","currency"),c("status","Status","status")
  ],
  "sales-return":[
    c("returnNo","Return No","text",{editable:false}),c("date","Date","date"),c("customer","Customer","text",{width:160}),c("invoice","Invoice"),c("product","Product","text",{width:170}),c("qty","Qty","number"),c("reason","Reason","text",{width:180}),c("condition","Condition"),c("value","Value","currency"),c("status","Status","status")
  ],
  "payment-receipt":[
    c("receiptNo","Receipt No","text",{editable:false}),c("receiptDate","Receipt Date","date"),c("customer","Customer","text",{width:170}),c("invoice","Invoice"),c("paymentMethod","Payment Method","dropdown",{source:["Bank Transfer","Cash","Cheque","Virtual Account"]}),
    c("bankCash","Bank/Cash"),c("amount","Amount","currency"),c("reference","Reference"),c("status","Status","status")
  ],
  receivable:[
    c("customer","Customer","text",{width:170}),c("invoice","Invoice"),c("invoiceDate","Invoice Date","date"),c("dueDate","Due Date","date"),c("invoiceAmount","Invoice Amount","currency"),c("paid","Paid","currency"),c("outstanding","Outstanding","currency"),
    c("daysOverdue","Days Overdue","number"),c("aging","Aging","status"),c("collector","Collector"),c("status","Status","status")
  ],
  projects:[
    c("projectCode","Project Code","text",{editable:false}),c("projectName","Project Name","text",{width:210}),c("customer","Customer","text",{width:170}),c("projectManager","Project Manager"),c("startDate","Start Date","date"),c("endDate","End Date","date"),
    c("progress","Progress","progress"),c("status","Status","status"),c("budget","Budget","currency"),c("actualCost","Actual Cost","currency"),c("revenue","Revenue","currency"),c("profit","Profit","currency"),c("margin","Margin","percent")
  ],
  wbs:[
    c("wbsCode","WBS Code","text",{width:90}),c("task","Task","text",{width:210}),c("description","Description","text",{width:220}),c("responsible","Responsible"),c("start","Start","date"),c("end","End","date"),c("duration","Duration","number"),c("weight","Weight","percent"),c("budget","Budget","currency"),c("status","Status","status")
  ],
  tasks:[
    c("taskId","Task ID","text",{editable:false}),c("task","Task","text",{width:220}),c("project","Project","text",{width:170}),c("wbs","WBS"),c("pic","PIC"),c("priority","Priority","dropdown",{source:["Low","Normal","High","Urgent"]}),
    c("start","Start","date"),c("dueDate","Due Date","date"),c("progress","Progress","progress"),c("status","Status","status"),c("dependency","Dependency")
  ],
  milestones:[
    c("milestone","Milestone","text",{width:220}),c("project","Project","text",{width:170}),c("dueDate","Due Date","date"),c("pic","PIC"),c("progress","Progress","progress"),c("status","Status","status"),c("deliverable","Deliverable","text",{width:200}),c("approval","Approval","status")
  ],
  team:[
    c("employee","Employee"),c("role","Role"),c("department","Department"),c("projectRole","Project Role"),c("allocation","Allocation %","percent"),c("start","Start","date"),c("end","End","date"),c("hourlyRate","Hourly Rate","currency"),c("status","Status","status")
  ],
  progress:[
    c("period","Period"),c("planned","Planned %","percent"),c("actual","Actual %","percent"),c("variance","Variance %","percent",{formula:"actual-planned"}),c("notes","Notes","text",{width:220})
  ],
  budget:[
    c("itemCode","Item Code"),c("category","Category","dropdown",{source:["Material","Labor","Equipment","Subcontractor","Other","Contingency"]}),c("description","Description","text",{width:220}),c("qty","Qty","number"),c("unit","Unit"),
    c("unitPrice","Unit Price","currency"),c("budget","Budget","currency",{formula:"qty*unitPrice",editable:false}),c("vendor","Vendor","dropdown",{width:170}),c("notes","Notes","text",{width:180})
  ],
  "project-cost":[
    c("date","Date","date"),c("costType","Cost Type"),c("category","Category"),c("description","Description","text",{width:200}),c("vendor","Vendor"),c("document","Document"),c("budget","Budget","currency"),c("actual","Actual","currency"),c("variance","Variance","currency",{formula:"budget-actual",editable:false}),c("status","Status","status")
  ],
  "project-procurement":[
    c("pr","PR"),c("po","PO"),c("vendor","Vendor","text",{width:170}),c("item","Item","text",{width:180}),c("qty","Qty","number"),c("poValue","PO Value","currency"),c("received","Received","number"),c("invoice","Invoice"),c("payment","Payment","status"),c("status","Status","status")
  ],
  documents:[
    c("documentNo","Document No","text",{editable:false}),c("documentName","Document Name","text",{width:220}),c("category","Category"),c("module","Module"),c("reference","Reference"),c("version","Version"),c("owner","Owner"),c("createdDate","Created Date","date"),c("updatedDate","Updated Date","date"),c("status","Status","status")
  ],
  profitability:[
    c("revenue","Revenue","currency"),c("materialCost","Material Cost","currency"),c("laborCost","Labor Cost","currency"),c("procurement","Procurement","currency"),c("otherCost","Other Cost","currency"),c("totalCost","Total Cost","currency",{formula:"materialCost+laborCost+procurement+otherCost",editable:false}),c("profit","Profit","currency",{formula:"revenue-totalCost",editable:false}),c("margin","Margin","percent",{formula:"profit/revenue*100",editable:false})
  ],
  "purchase-request":[
    c("prNumber","PR Number","text",{editable:false}),c("date","Date","date"),c("requester","Requester"),c("department","Department"),c("project","Project","text",{width:170}),c("purpose","Purpose","text",{width:200}),c("priority","Priority"),c("requiredDate","Required Date","date"),c("estimatedValue","Estimated Value","currency"),c("approval","Approval","status"),c("status","Status","status")
  ],
  "purchase-order":[
    c("poNumber","PO Number","text",{editable:false}),c("date","Date","date"),c("vendor","Vendor","text",{width:180}),c("deliveryDate","Delivery Date","date"),c("project","Project","text",{width:170}),c("currency","Currency"),c("paymentTerms","Payment Terms"),c("shippingTerms","Shipping Terms"),c("grandTotal","Grand Total","currency"),c("approval","Approval","status"),c("status","Status","status")
  ],
  "goods-receipt":[
    c("grNumber","GR Number","text",{editable:false}),c("date","Date","date"),c("poNumber","PO Number"),c("vendor","Vendor","text",{width:170}),c("warehouse","Warehouse"),c("item","Item","text",{width:180}),c("orderedQty","Ordered Qty","number"),c("receivedQty","Received Qty","number"),c("rejectedQty","Rejected Qty","number"),c("condition","Condition"),c("status","Status","status")
  ],
  "purchase-return":[
    c("returnNo","Return No","text",{editable:false}),c("date","Date","date"),c("vendor","Vendor","text",{width:170}),c("po","PO"),c("gr","GR"),c("item","Item","text",{width:180}),c("qty","Qty","number"),c("reason","Reason","text",{width:180}),c("value","Value","currency"),c("status","Status","status")
  ],
  vendors:[
    c("vendorCode","Vendor Code"),c("vendorName","Vendor Name","text",{width:180}),c("category","Category"),c("contact","Contact"),c("email","Email","email",{width:180}),c("phone","Phone"),c("address","Address","text",{width:200}),c("npwp","NPWP"),c("paymentTerms","Payment Terms"),c("rating","Rating","number"),c("status","Status","status")
  ],
  contracts:[
    c("vendor","Vendor","text",{width:170}),c("product","Product","text",{width:180}),c("contractNo","Contract No"),c("startDate","Start Date","date"),c("endDate","End Date","date"),c("unitPrice","Unit Price","currency"),c("currency","Currency"),c("minimumQty","Minimum Qty","number"),c("paymentTerms","Payment Terms"),c("status","Status","status")
  ],
  stock:[
    c("sku","SKU"),c("product","Product","text",{width:190}),c("category","Category"),c("warehouse","Warehouse"),c("location","Location"),c("qtyOnHand","Qty On Hand","number"),c("reserved","Reserved","number"),c("available","Available","number",{formula:"qtyOnHand-reserved",editable:false}),c("unit","Unit"),c("minimumStock","Minimum Stock","number"),c("maximumStock","Maximum Stock","number"),c("stockValue","Stock Value","currency"),c("status","Status","status")
  ],
  "stock-movement":[
    c("date","Date","date"),c("document","Document"),c("type","Type","dropdown",{source:["Receipt","Issue","Transfer","Return","Adjustment"]}),c("sku","SKU"),c("product","Product","text",{width:180}),c("warehouse","Warehouse"),c("qtyIn","Qty In","number"),c("qtyOut","Qty Out","number"),c("balance","Balance","number"),c("reference","Reference"),c("user","User")
  ],
  "warehouse-transfer":[
    c("transferNo","Transfer No"),c("date","Date","date"),c("fromWarehouse","From Warehouse"),c("toWarehouse","To Warehouse"),c("product","Product","text",{width:180}),c("qty","Qty","number"),c("requestedBy","Requested By"),c("approvedBy","Approved By"),c("status","Status","status")
  ],
  "stock-opname":[
    c("sku","SKU"),c("product","Product","text",{width:180}),c("systemQty","System Qty","number"),c("physicalQty","Physical Qty","number"),c("difference","Difference","number",{formula:"physicalQty-systemQty",editable:false}),c("unit","Unit"),c("valueDifference","Value Difference","currency"),c("counter","Counter"),c("status","Status","status")
  ],
  "stock-adjustment":[
    c("adjustmentNo","Adjustment No"),c("date","Date","date"),c("warehouse","Warehouse"),c("sku","SKU"),c("systemQty","System Qty","number"),c("adjustmentQty","Adjustment Qty","number"),c("finalQty","Final Qty","number",{formula:"systemQty+adjustmentQty",editable:false}),c("reason","Reason"),c("approvedBy","Approved By"),c("status","Status","status")
  ],
  "stock-card":[
    c("date","Date","date"),c("document","Document"),c("description","Description","text",{width:220}),c("qtyIn","Qty In","number"),c("qtyOut","Qty Out","number"),c("balance","Balance","number"),c("unitCost","Unit Cost","currency"),c("value","Value","currency"),c("reference","Reference")
  ],
  "finance-transaction":[
    c("date","Date","date"),c("document","Document"),c("party","Customer / Vendor","text",{width:170}),c("account","Account","text",{width:190}),c("debit","Debit","currency"),c("credit","Credit","currency"),c("tax","Tax","currency"),c("amount","Amount","currency"),c("status","Status","status")
  ],
  expenses:[
    c("date","Date","date"),c("expenseNo","Expense No"),c("category","Category"),c("description","Description","text",{width:200}),c("department","Department"),c("project","Project"),c("account","Account","text",{width:180}),c("amount","Amount","currency"),c("tax","Tax","currency"),c("paymentMethod","Payment Method"),c("attachment","Attachment"),c("status","Status","status")
  ],
  "finance-receipts":[
    c("receiptNo","Receipt No"),c("date","Date","date"),c("customer","Customer","text",{width:170}),c("invoice","Invoice"),c("account","Account"),c("amount","Amount","currency"),c("bankCash","Bank/Cash"),c("reference","Reference"),c("status","Status","status")
  ],
  "journal-entry":[
    c("account","Account","text",{width:200}),c("description","Description","text",{width:220}),c("debit","Debit","currency"),c("credit","Credit","currency"),c("tax","Tax","currency"),c("project","Project"),c("department","Department")
  ],
  "general-journal":[
    c("date","Date","date"),c("journalNo","Journal No"),c("account","Account","text",{width:200}),c("description","Description","text",{width:220}),c("reference","Reference"),c("debit","Debit","currency"),c("credit","Credit","currency"),c("department","Department"),c("project","Project")
  ],
  "trial-balance":[
    c("accountCode","Account Code"),c("accountName","Account Name","text",{width:210}),c("openingDebit","Opening Debit","currency"),c("openingCredit","Opening Credit","currency"),c("periodDebit","Period Debit","currency"),c("periodCredit","Period Credit","currency"),c("closingDebit","Closing Debit","currency"),c("closingCredit","Closing Credit","currency")
  ],
  reconciliation:[
    c("date","Date","date"),c("reference","Reference"),c("bookAmount","Book Amount","currency"),c("bankAmount","Bank Amount","currency"),c("difference","Difference","currency",{formula:"bookAmount-bankAmount",editable:false}),c("status","Status","status"),c("notes","Notes","text",{width:200})
  ],
  closing:[
    c("period","Period"),c("revenue","Revenue","currency"),c("expense","Expense","currency"),c("profit","Profit","currency",{formula:"revenue-expense",editable:false}),c("closingStatus","Closing Status","status"),c("closedBy","Closed By"),c("closedDate","Closed Date","date")
  ],
  cash:[
    c("date","Date","date"),c("transaction","Transaction"),c("reference","Reference"),c("cashIn","Cash In","currency"),c("cashOut","Cash Out","currency"),c("balance","Balance","currency"),c("account","Account"),c("description","Description","text",{width:220})
  ],
  "bank-accounts":[
    c("bank","Bank"),c("accountName","Account Name"),c("accountNumber","Account Number"),c("currency","Currency"),c("openingBalance","Opening Balance","currency"),c("currentBalance","Current Balance","currency"),c("status","Status","status")
  ],
  "bank-transfers":[
    c("transferNo","Transfer No"),c("date","Date","date"),c("fromAccount","From Account"),c("toAccount","To Account"),c("amount","Amount","currency"),c("reference","Reference"),c("description","Description","text",{width:200}),c("status","Status","status")
  ],
  "bank-reconciliation":[
    c("bankDate","Bank Date","date"),c("reference","Reference"),c("description","Description","text",{width:220}),c("bankAmount","Bank Amount","currency"),c("bookAmount","Book Amount","currency"),c("difference","Difference","currency",{formula:"bankAmount-bookAmount",editable:false}),c("matched","Matched","checkbox"),c("status","Status","status")
  ],
  coa:[
    c("accountCode","Account Code"),c("accountName","Account Name","text",{width:220}),c("accountType","Account Type","dropdown",{source:["Asset","Liability","Equity","Revenue","Expense"]}),c("parentAccount","Parent Account"),c("normalBalance","Normal Balance","dropdown",{source:["Debit","Credit"]}),c("taxCategory","Tax Category"),c("active","Active","checkbox")
  ],
  "master-customers":[
    c("customerCode","Customer Code"),c("customerName","Customer Name","text",{width:180}),c("legalName","Legal Name","text",{width:190}),c("industry","Industry"),c("npwp","NPWP"),c("nib","NIB"),c("address","Address","text",{width:220}),c("city","City"),c("province","Province"),c("pic","PIC"),c("email","Email","email",{width:170}),c("phone","Phone"),c("creditLimit","Credit Limit","currency"),c("paymentTerms","Payment Terms"),c("taxType","Tax Type"),c("status","Status","status")
  ],
  "master-vendors":[
    c("vendorCode","Vendor Code"),c("vendorName","Vendor Name","text",{width:180}),c("category","Category"),c("npwp","NPWP"),c("nib","NIB"),c("contact","Contact"),c("email","Email","email",{width:170}),c("phone","Phone"),c("address","Address","text",{width:220}),c("paymentTerms","Payment Terms"),c("bank","Bank"),c("accountNumber","Account Number"),c("status","Status","status")
  ],
  products:[
    c("sku","SKU"),c("productCode","Product Code"),c("productName","Product Name","text",{width:200}),c("type","Type","dropdown",{source:["Product","Service"]}),c("category","Category"),c("unit","Unit"),c("purchasePrice","Purchase Price","currency"),c("salesPrice","Sales Price","currency"),c("tax","Tax","percent"),c("warehouse","Warehouse"),c("minimumStock","Minimum Stock","number"),c("status","Status","status")
  ],
  assets:[
    c("assetCode","Asset Code"),c("assetName","Asset Name","text",{width:190}),c("category","Category"),c("acquisitionDate","Acquisition Date","date"),c("acquisitionCost","Acquisition Cost","currency"),c("usefulLife","Useful Life","number"),c("depreciationMethod","Depreciation Method"),c("accumulatedDepreciation","Accum. Depreciation","currency"),c("bookValue","Book Value","currency",{formula:"acquisitionCost-accumulatedDepreciation",editable:false}),c("location","Location"),c("pic","PIC"),c("status","Status","status")
  ],
  departments:[
    c("departmentCode","Department Code"),c("departmentName","Department Name","text",{width:180}),c("manager","Manager"),c("costCenter","Cost Center"),c("budget","Budget","currency"),c("status","Status","status")
  ],
  employees:[
    c("employeeId","Employee ID"),c("name","Name","text",{width:170}),c("department","Department"),c("position","Position"),c("email","Email","email",{width:170}),c("phone","Phone"),c("manager","Manager"),c("costCenter","Cost Center"),c("joinDate","Join Date","date"),c("status","Status","status")
  ],
  warehouses:[
    c("warehouseCode","Warehouse Code"),c("warehouseName","Warehouse Name","text",{width:180}),c("location","Location","text",{width:190}),c("pic","PIC"),c("capacity","Capacity","number"),c("status","Status","status")
  ],
  "pricing-tax":[
    c("product","Product","text",{width:180}),c("customerType","Customer Type"),c("priceList","Price List"),c("currency","Currency"),c("unitPrice","Unit Price","currency"),c("discount","Discount","percent"),c("tax","Tax","percent"),c("effectiveDate","Effective Date","date"),c("endDate","End Date","date"),c("status","Status","status")
  ],
  banks:[
    c("bank","Bank"),c("accountName","Account Name"),c("accountNumber","Account Number"),c("currency","Currency"),c("branch","Branch"),c("openingBalance","Opening Balance","currency"),c("currentBalance","Current Balance","currency"),c("status","Status","status")
  ],
  "generic-master":[
    c("code","Code"),c("name","Name","text",{width:200}),c("category","Category"),c("description","Description","text",{width:220}),c("updatedBy","Updated By"),c("updatedDate","Updated Date","date"),c("status","Status","status")
  ],
  "meeting-agenda":[
    c("agendaNo","Agenda No"),c("meeting","Meeting","text",{width:180}),c("topic","Topic","text",{width:220}),c("presenter","Presenter"),c("priority","Priority"),c("duration","Duration","number"),c("status","Status","status")
  ],
  "meeting-resolutions":[
    c("resolutionNo","Resolution No"),c("meeting","Meeting","text",{width:180}),c("decision","Decision","text",{width:240}),c("responsible","Responsible"),c("dueDate","Due Date","date"),c("status","Status","status"),c("followUp","Follow Up","text",{width:200})
  ],
  "meeting-documents":[
    c("document","Document","text",{width:220}),c("meeting","Meeting","text",{width:180}),c("type","Type"),c("version","Version"),c("owner","Owner"),c("date","Date","date"),c("status","Status","status")
  ],
  users:[
    c("user","User","text",{width:160}),c("email","Email","email",{width:180}),c("role","Role"),c("department","Department"),c("accessLevel","Access Level"),c("lastLogin","Last Login","date"),c("status","Status","status")
  ],
  workflow:[
    c("workflow","Workflow","text",{width:180}),c("module","Module"),c("step","Step","number"),c("approver","Approver"),c("threshold","Threshold","currency"),c("sequence","Sequence","number"),c("status","Status","status")
  ],
  numbering:[
    c("documentType","Document Type","text",{width:160}),c("prefix","Prefix"),c("format","Format","text",{width:160}),c("currentNumber","Current Number","number"),c("resetPeriod","Reset Period"),c("example","Example","text",{width:160}),c("status","Status","status")
  ],
  audit:[
    c("dateTime","Date & Time","date",{editable:false}),c("user","User","text",{editable:false}),c("module","Module","text",{editable:false}),c("action","Action","text",{editable:false}),c("record","Record","text",{editable:false}),c("oldValue","Old Value","text",{width:180,editable:false}),c("newValue","New Value","text",{width:180,editable:false}),c("ipAddress","IP Address","text",{editable:false}),c("status","Status","status",{editable:false})
  ],
  report:[
    c("period","Period"),c("document","Document"),c("entity","Entity","text",{width:180}),c("category","Category"),c("amount","Amount","currency"),c("budget","Budget","currency"),c("variance","Variance","currency",{formula:"budget-amount",editable:false}),c("status","Status","status")
  ],
  generic:[
    c("code","Code"),c("name","Name","text",{width:200}),c("description","Description","text",{width:220}),c("value","Value","currency"),c("status","Status","status"),c("updatedDate","Updated Date","date")
  ]
};

const POOLS={
  customers:["PT ABC Kogen Dairy","PT Kalbe Morinaga Indonesia","PT Uniguard Tritunggal Indonesia","PT Pupuk Kujang","PT Dankos Farma","PT Cimory","PT Indofood","PT Sinar Mas","PT GGPC Lampung","PT Tazaka Elektrik Teknologi"],
  people:["Budi Santoso","Sari Dewi","Andi Wijaya","Rina Marlina","Dimas Saputra","Nadia Putri","Fajar Pratama","Arif Nugroho"],
  vendors:["PT Tazaka Elektrik Teknologi","PT Mitra Teknik Nusantara","PT Sentra Otomasi Indonesia","PT Prima Instrumentasi","PT Karya Mekanika"],
  projects:["PRJ-001 - EMS ABC Kogen Dairy","PRJ-002 - Access Control System","PRJ-003 - Network Infrastructure","PRJ-004 - IT Managed Service","PRJ-005 - Energy Monitoring"],
  products:["Industrial Sensor Package","Control Panel Assembly","Network Infrastructure Service","PLC Integration Service","Energy Meter","Preventive Maintenance Service","Cloud Monitoring Subscription"],
  accounts:["1101 - Cash","1102 - Bank BCA","1201 - Accounts Receivable","1301 - Inventory","4101 - Sales Revenue","5101 - Cost of Sales","6101 - Operating Expense","2101 - Accounts Payable"],
  departments:["Sales","Project","Procurement","Finance","Operations","Engineering","IT"],
  warehouses:["WH-JKT - Jakarta","WH-SNT - Sentul","WH-CKR - Cikarang"],
  statuses:["Draft","In Progress","Pending","Approved","Completed","Active","On Track"],
  industries:["Manufacturing","Food & Beverage","Pharmaceutical","Electrical","Technology","Agriculture"],
  banks:["BCA","Bank Mandiri","BNI","BRI"],
  units:["pcs","unit","lot","service","set","month"]
};
const money=n=>"Rp "+Math.round(n).toLocaleString("en-US");
const isoDate=i=>`${String(2+(i%24)).padStart(2,"0")} Sep 2026`;

function sampleStatus(schema,i){
  const map={
    prospects:["New","Qualified","Proposal","Converted"],
    customers:["Active","Active","Active","Inactive"],
    activities:["Open","In Progress","Completed","Overdue"],
    quotation:["Draft","Pending Approval","Sent","Negotiation","Approved","Rejected","Expired"],
    "sales-orders":["Open","Confirmed","Delivered","Completed"],
    delivery:["Draft","Scheduled","Delivered","Signed"],
    invoice:["Draft","Issued","Partially Paid","Paid","Overdue","Cancelled"],
    "sales-return":["Requested","Approved","Received","Completed"],
    "payment-receipt":["Draft","Posted","Allocated","Posted"],
    receivable:["Current","Overdue","Partially Paid","Paid"],
    projects:["Planning","Active","On Hold","Completed"],
    milestones:["Pending","In Progress","Approved","Completed"],
    "purchase-request":["Draft","Submitted","Approved","Rejected"],
    "purchase-order":["Draft","Pending Approval","Approved","Issued","Completed"],
    "goods-receipt":["Draft","Received","Inspected","Completed"],
    "purchase-return":["Requested","Approved","Received","Completed"],
    vendors:["Active","Active","On Hold","Inactive"],
    contracts:["Active","Active","Expired","Pending Renewal"],
    stock:["Healthy","Healthy","Low Stock","Out of Stock","Overstock"],
    "stock-opname":["Open","Counted","Variance","Approved"],
    "stock-adjustment":["Draft","Pending Approval","Approved","Posted"],
    "warehouse-transfer":["Draft","Requested","Approved","Completed"],
    "finance-transaction":["Posted","Posted","Draft","Posted"],
    expenses:["Draft","Pending Approval","Approved","Paid"],
    "finance-receipts":["Posted","Posted","Pending","Posted"],
    reconciliation:["Matched","Matched","Unmatched","Adjusted"],
    "bank-reconciliation":["Matched","Unmatched","Adjusted"],
    documents:["Active","Active","Approved","Archived"],
    "meeting-agenda":["Open","Confirmed","Completed"],
    "meeting-resolutions":["Open","In Progress","Completed","Overdue"],
    "meeting-documents":["Draft","Approved","Active"],
    workflow:["Active","Active","Inactive"],
    numbering:["Active","Active","Inactive"],
    closing:["Open","Ready","Closed"],
    users:["Active","Active","Inactive"],
    audit:["Success","Success","Success","Warning"]
  };
  return (map[schema]||POOLS.statuses)[i%(map[schema]||POOLS.statuses).length];
}

function sampleValue(key,i,schema){
  const customer=POOLS.customers[i%POOLS.customers.length], person=POOLS.people[i%POOLS.people.length], project=POOLS.projects[i%POOLS.projects.length], vendor=POOLS.vendors[i%POOLS.vendors.length];
  const base=150000000+(i*37500000);
  if(key==="tax"){
    if(schema==="pricing-tax"||schema==="products") return 11;
    return Math.round(base*0.11);
  }
  const dict={
    company:customer,customer:customer,customerName:customer,legalName:customer,party:customer,entity:customer,
    contactPerson:person,contact:person,pic:person,salesOwner:person,assignedTo:person,collector:person,requester:person,approvedBy:person,responsible:person,presenter:person,owner:person,user:person,manager:person,employee:person,name:person,closedBy:person,
    vendor:vendor,vendorName:vendor,
    project:project,projectName:project,
    product:POOLS.products[i%POOLS.products.length],item:POOLS.products[i%POOLS.products.length],productName:POOLS.products[i%POOLS.products.length],
    account:POOLS.accounts[i%POOLS.accounts.length],accountName:POOLS.accounts[i%POOLS.accounts.length],
    department:POOLS.departments[i%POOLS.departments.length],
    warehouse:POOLS.warehouses[i%POOLS.warehouses.length],fromWarehouse:POOLS.warehouses[i%POOLS.warehouses.length],toWarehouse:POOLS.warehouses[(i+1)%POOLS.warehouses.length],
    industry:POOLS.industries[i%POOLS.industries.length],
    email:`${person.toLowerCase().replace(/\s+/g,".")}@example.co.id`,phone:`+62 81${2+i%8} ${3456+i*37} ${7890-i*11}`,
    address:["Jl. Raya Bogor KM 42, Sentul","Kawasan Industri Cikarang, Bekasi","Jl. Gatot Subroto, Jakarta","Kawasan Industri Kujang, Cikampek"][i%4],
    city:["Jakarta","Bogor","Bekasi","Bandung"][i%4],province:["DKI Jakarta","Jawa Barat","Banten","Jawa Barat"][i%4],
    category:["Material","Labor","Equipment","Service","Electrical"][i%5],description:["Engineering and implementation","Project operational requirement","Integrated system component","Monthly service and support","Business operational activity"][i%5],
    priority:["Normal","High","Urgent","Low"][i%4],
    source:["Website","Referral","Event","Cold Call","LinkedIn"][i%5],qualification:["Warm","Hot","Qualified","Cold"][i%4],
    unit:POOLS.units[i%POOLS.units.length],currency:"IDR",paymentTerms:["30 Days","45 Days","14 Days","COD"][i%4],
    taxCategory:["PPN 11%","Non Tax","PPN 11%"][i%3],taxType:["PKP","Non-PKP"][i%2],
    status:sampleStatus(schema,i),approval:["Pending","Approved","Approved","Rejected"][i%4],payment:["Pending","Partially Paid","Paid"][i%3],
    result:["Interested","Follow up required","Proposal requested","Meeting completed"][i%4],nextAction:["Send proposal","Schedule meeting","Technical presentation","Follow up by WhatsApp"][i%4],
    notes:["Follow up customer requirement","Waiting internal approval","Commercial terms confirmed","Coordinate with project team"][i%4],
    condition:["Good","Good","Minor Damage"][i%3],reason:["Specification mismatch","Customer request","Damaged packaging","Quantity adjustment"][i%4],
    role:["Engineer","Project Manager","Sales Executive","Finance Officer"][i%4],projectRole:["PIC","Engineer","Coordinator","Reviewer"][i%4],position:["Manager","Supervisor","Engineer","Staff"][i%4],
    bank:POOLS.banks[i%POOLS.banks.length],bankCash:["BCA 1234567890","Mandiri 987654321","Petty Cash"][i%3],
    accountName:["PT Sinergi Bisnis Indonesia","Operational Account","Project Account"][i%3],accountNumber:`0${1234567890+i*137}`,
    reference:`REF-2026-${pad(i+1)}`,module:["CRM","Quotation","Sales","Project","Purchase","Finance"][i%6],action:["Create","Update","Approve","Export","Login"][i%5],
    oldValue:["Draft","Rp 100,000,000","Pending","—"][i%4],newValue:["Approved","Rp 125,000,000","Completed","Updated"][i%4],ipAddress:`10.10.1.${20+i}`,
    type:["Call","Email","Meeting","Visit","Follow Up","WhatsApp","Task"][i%7],
    subject:["Commercial follow up","Technical discussion","Proposal review","Project coordination","Customer meeting"][i%5],
    customerType:["Corporate","Enterprise","Government","Distributor"][i%4],
    npwp:`01.234.567.${890+i}-0${i%9}.000`,nib:`8120${pad(10000+i,5)}`,
    salesOwner:person,creditLimit:base*4,
    wbs:`1.${1+(i%3)}.${1+(i%4)}`,task:["Site Survey","Detailed Design","Procurement","Installation","Testing","Handover"][i%6],milestone:["Design Approval","Material Arrival","Installation Complete","UAT","Handover"][i%5],
    deliverable:["Approved drawing","Installed equipment","Test report","BAST document"][i%4],
    costType:["Material","Labor","Travel","Subcontractor"][i%4],document:`DOC-2026-${pad(i+1)}`,attachment:`ATT-${pad(i+1)}`,
    purpose:["Project material requirement","Operational equipment","Service procurement","Replacement stock"][i%4],
    shippingTerms:["Franco Site","Ex Works","Delivered Duty Paid"][i%3],
    location:["Sentul","Cikarang","Jakarta","Warehouse A"][i%4],
    counter:person,requestedBy:person,
    transaction:["Customer Receipt","Vendor Payment","Petty Cash Expense","Bank Transfer"][i%4],
    period:["Sep 2026","Aug 2026","Jul 2026","Q3 2026"][i%4],
    documentType:["Quotation","Sales Order","Purchase Order","Invoice","Purchase Request"][i%5],format:["QT-{YYYY}-{####}","SO-{YYYY}-{####}","PO-{YYYY}-{####}","INV-{YYYY}-{####}"][i%4],resetPeriod:"Yearly",
    example:["QT-2026-0001","SO-2026-0001","PO-2026-0001","INV-2026-0001"][i%4],
    topic:["Operations performance","Sales pipeline","Project delivery","Financial review"][i%4],meeting:["MTG-2026-001 - Management Review","MTG-2026-002 - Project Steering"][i%2],decision:["Approve next project phase","Revise commercial proposal","Complete outstanding action items"][i%3],followUp:["Monitor completion","Issue updated document","Schedule next review"][i%3],
    accessLevel:["Full","Standard","Read Only","Approver"][i%4],role:["Administrator","Manager","Staff","Approver"][i%4],
    workflow:["Quotation Approval","Purchase Order Approval","Expense Approval"][i%3],approver:["Sales Manager","Finance Manager","Director","Department Manager"][i%4],
    formatDate:"16 Sep 2026",reset:"Yearly",
    currencyName:"IDR"
  };
  if(key in dict) return dict[key];
  if(/date|Date|start|Start|end|End|due|Due|followUp|created|updated|lastLogin|bankDate|receiptDate|invoiceDate|deliveryDate|quotationDate|soDate|acquisitionDate|joinDate|effectiveDate/.test(key)) return isoDate(i);
  if(/status/i.test(key)) return sampleStatus(schema,i);
  if(/progress/i.test(key)) return [20,35,50,65,75,90,100][i%7];
  if(/probability|allocation|weight|margin|discount/i.test(key)) return [10,20,35,50,65,75,90][i%7];
  if(/qty|quantity|duration|rating|life|number$/i.test(key)) return 1+(i%8)*3;
  if(/budget|cost|value|amount|price|subtotal|total|revenue|profit|debit|credit|balance|tax|paid|outstanding|limit|threshold/i.test(key)) return base;
  if(/code$/i.test(key)) return `${PAGE.prefix||"MD"}-${pad(i+1)}`;
  if(/no$|number$|id$/i.test(key)) return `${PAGE.prefix||"DOC"}-2026-${pad(i+1)}`;
  if(/sku/i.test(key)) return `SKU-${pad(1001+i)}`;
  if(/active|matched/i.test(key)) return i%3!==0;
  return `${key.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())} ${i+1}`;
}

function evaluateFormula(expr,row){
  if(!expr) return undefined;
  try{
    const safe=expr.replace(/[A-Za-z_][A-Za-z0-9_]*/g,key=>{
      const v=Number(row[key]??0); return Number.isFinite(v)?String(v):"0";
    });
    if(!/^[0-9+\-*/().\s]+$/.test(safe)) return 0;
    return Function(`"use strict";return (${safe})`)();
  }catch{return 0}
}
function recalcRow(row,columns){
  columns.forEach(col=>{if(col.formula) row[col.key]=evaluateFormula(col.formula,row)});
  return row;
}
function buildRows(schema,count=12){
  const columns=SCHEMAS[schema]||SCHEMAS.generic;
  const stored=localStorage.getItem("sop:data:"+ROUTE);
  if(stored){try{return JSON.parse(stored)}catch{}}
  const rows=Array.from({length:count},(_,i)=>{
    const row={__selected:false};
    columns.forEach(col=>row[col.key]=sampleValue(col.key,i,schema));
    if(schema==="wbs"){
      const codes=["1","1.1","1.1.1","1.1.2","1.2","1.2.1","1.2.2","1.3","1.3.1","1.3.2","1.4","1.4.1"];
      const tasks=["Project","Preparation","Site Survey","Detailed Design","Implementation","Installation","Testing","Handover","Training","BAST","Closeout","Lessons Learned"];
      row.wbsCode=codes[i%codes.length];
      row.task=(row.wbsCode.split(".").length>1?"↳ ".repeat(row.wbsCode.split(".").length-1):"")+tasks[i%tasks.length];
    }
    if(schema==="coa"){
      const codes=["1","1100","1101","1102","1200","1201","2","2100","2101","4","4101","5"];
      const names=["ASSETS","Current Assets","Cash","Bank","Receivables","Accounts Receivable","LIABILITIES","Current Liabilities","Accounts Payable","REVENUE","Sales Revenue","EXPENSES"];
      row.accountCode=codes[i%codes.length];
      row.accountName=(String(row.accountCode).length<=1?"":String(row.accountCode).length===4?"↳ ":"  ↳ ")+names[i%names.length];
      row.parentAccount=String(row.accountCode).length<=1?"":String(row.accountCode).slice(0,1);
    }
    // Cross-field realistic calculations
    if("qtyOnHand" in row){row.qtyOnHand=60+i*7;row.reserved=5+i%8;row.available=row.qtyOnHand-row.reserved;row.stockValue=(row.available)*1250000}
    if("systemQty" in row){row.systemQty=50+i*4;row.physicalQty=row.systemQty+[-2,0,1,3][i%4]}
    if("adjustmentQty" in row){row.systemQty=60+i*2;row.adjustmentQty=[-2,1,0,3][i%4]}
    if("debit" in row && "credit" in row){row.debit=i%2===0?150000000+i*1000000:0;row.credit=i%2?150000000+(i-1)*1000000:0}
    if("invoiceAmount" in row){row.invoiceAmount=baseValue(i);row.paid=i%3===0?row.invoiceAmount:Math.round(row.invoiceAmount*.4);row.outstanding=row.invoiceAmount-row.paid;row.daysOverdue=[0,12,38,67,104][i%5];row.aging=["Current","1-30 Days","31-60 Days","61-90 Days",">90 Days"][i%5]}
    if("subtotal" in row){row.subtotal=baseValue(i);row.discount=Math.round(row.subtotal*.05);row.tax=Math.round((row.subtotal-row.discount)*.11);row.grandTotal=row.subtotal-row.discount+row.tax}
    if("total" in row && "subtotal" in row){row.total=row.subtotal+(row.tax||0);row.paid=i%3===0?row.total:Math.round(row.total*.45);row.outstanding=row.total-row.paid}
    if("budget" in row && schema==="budget"){row.qty=2+i;row.unitPrice=1500000+i*250000;row.budget=row.qty*row.unitPrice}
    if(schema==="project-cost"){row.budget=baseValue(i);row.actual=Math.round(row.budget*(.75+(i%4)*.08));row.variance=row.budget-row.actual}
    if(schema==="profitability"){row.revenue=2500000000;row.materialCost=720000000+i*1000000;row.laborCost=420000000;row.procurement=310000000;row.otherCost=90000000;recalcRow(row,columns)}
    if(schema==="progress"){row.planned=[10,20,35,50,65,80,100][i%7];row.actual=Math.max(0,row.planned+[-4,-2,1,3,0,-5,0][i%7])}
    recalcRow(row,columns);
    return row;
  });
  return rows;
}
function baseValue(i){return 180000000+i*57500000}

function statusTone(value){
  const s=String(value||"").toLowerCase();
  if(/approved|completed|active|healthy|paid|converted|qualified|matched|signed|won|success|balanced|delivered|closed|on track/.test(s)) return "success";
  if(/rejected|lost|overdue|cancelled|out of stock|danger|failed|unmatched/.test(s)) return "danger";
  if(/pending|negotiation|nurturing|at risk|low stock|warning|submitted|scheduled|open/.test(s)) return "warning";
  if(/draft/.test(s)) return "neutral";
  return "info";
}
function formatCell(value,col){
  if(col.type==="currency"){
    if(typeof value==="string"&&value.startsWith("Rp")) return value;
    return money(Number(value||0));
  }
  if(col.type==="percent") return `${Number(value||0).toLocaleString("en-US",{maximumFractionDigits:1})}%`;
  if(col.type==="checkbox") return value?"Yes":"No";
  return value??"";
}
function rawNumber(value){
  if(typeof value==="number") return value;
  return Number(String(value||"").replace(/[^0-9.-]/g,""))||0;
}

/* ---------- Optional official Handsontable loader + native fallback ---------- */
let hotPromise;
function ensureHandsontable(){
  if(window.Handsontable) return Promise.resolve(true);
  if(hotPromise) return hotPromise;
  hotPromise=new Promise(resolve=>{
    // The application remains fully functional with the native fallback if CDN access is unavailable.
    if(!navigator.onLine){resolve(false);return}
    const css=document.createElement("link");css.rel="stylesheet";css.href="https://cdn.jsdelivr.net/npm/handsontable@15.2.0/dist/handsontable.full.min.css";css.onerror=()=>{};document.head.appendChild(css);
    const hyper=document.createElement("script");hyper.src="https://cdn.jsdelivr.net/npm/hyperformula@3.0.0/dist/hyperformula.full.min.js";hyper.async=true;
    hyper.onload=loadHot;hyper.onerror=loadHot;document.head.appendChild(hyper);
    function loadHot(){
      const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/handsontable@15.2.0/dist/handsontable.full.min.js";s.async=true;
      s.onload=()=>resolve(!!window.Handsontable);s.onerror=()=>resolve(false);document.head.appendChild(s);
    }
    setTimeout(()=>resolve(!!window.Handsontable),4000);
  });
  return hotPromise;
}

class HandsontableGrid{
  constructor(el,props){
    this.el=el;this.props=props;this.data=props.data;this.columns=props.columns;this.hot=null;this.query="";this.filtered=this.data;
    this.renderFallback();
    ensureHandsontable().then(ok=>{if(ok&&document.body.contains(this.el)) this.renderOfficial()});
  }
  validateValue(col,value,rowIndex){
    if(col.required && String(value??"").trim()==="") return "Required field";
    if(col.type==="email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return "Invalid email";
    if((col.type==="number"||col.type==="currency"||col.type==="percent") && value!=="" && Number.isNaN(rawNumber(value))) return "Invalid number";
    if(/qty/i.test(col.key) && rawNumber(value)<0) return "Negative quantity is not allowed";
    if(rowIndex>=0 && /code$|No$|Number$|Id$/i.test(col.key) && value){
      const dup=this.data.filter((r,idx)=>idx!==rowIndex&&String(r[col.key])===String(value)).length;
      if(dup) return "Duplicate code/reference";
    }
    return "";
  }
  save(){
    localStorage.setItem("sop:data:"+ROUTE,JSON.stringify(this.data));
    setSaveState("Saved");
    this.props.onSave?.(this.data);
  }
  markChanged(){
    setSaveState("Saving...",true);
    clearTimeout(this.saveTimer);
    this.saveTimer=setTimeout(()=>this.save(),650);
    this.props.onChange?.(this.data);
  }
  filter(q){
    this.query=(q||"").toLowerCase().trim();
    this.filtered=this.query?this.data.filter(row=>Object.values(row).some(v=>String(v).toLowerCase().includes(this.query))):this.data;
    if(this.hot){
      // Search filtering by hiding non-matching rows.
      const hidden=this.data.map((r,i)=>this.filtered.includes(r)?null:i).filter(v=>v!==null);
      try{this.hot.updateSettings({hiddenRows:{rows:hidden,indicators:false}})}catch{}
    }else this.renderFallback();
    updateGridFooter(this.filtered.length,this.data.length);
    showEmpty(this.filtered.length===0);
  }
  getSelectedRows(){return this.data.filter(r=>r.__selected)}
  renderFallback(){
    this.hot?.destroy?.();this.hot=null;
    const rows=this.filtered||this.data;
    const headers=[{key:"__selected",title:"",type:"checkbox",editable:true,width:38},...this.columns];
    const html=`<div class="hot-fallback-wrap"><table class="hot-fallback"><thead><tr>${headers.map(h=>`<th style="min-width:${h.width||120}px">${esc(h.title)}</th>`).join("")}</tr></thead><tbody>
      ${rows.map((row,ri)=>`<tr data-row="${this.data.indexOf(row)}" class="${row.__selected?"selected":""}">
      ${headers.map(col=>{
        const val=row[col.key];
        if(col.key==="__selected") return `<td><input class="fallback-check" type="checkbox" ${val?"checked":""}></td>`;
        if(col.type==="status") return `<td><span class="status-pill status-${statusTone(val)}">${esc(val)}</span></td>`;
        if(col.type==="progress") return `<td><span class="progress-pill"><span class="progress-track"><i style="width:${Math.min(100,rawNumber(val))}%"></i></span><b>${rawNumber(val)}%</b></span></td>`;
        if(col.type==="checkbox") return `<td><input class="fallback-bool" type="checkbox" ${val?"checked":""} ${col.editable===false?"disabled":""}></td>`;
        const cls=`cell-${col.type}`;
        return `<td class="${cls}" ${col.editable===false?"":"contenteditable=\"true\""} data-key="${esc(col.key)}" title="">${esc(formatCell(val,col))}</td>`;
      }).join("")}</tr>`).join("")}
      </tbody></table></div>`;
    this.el.innerHTML=html;
    $$("tbody tr",this.el).forEach(tr=>{
      const rowIndex=Number(tr.dataset.row),row=this.data[rowIndex];
      tr.addEventListener("click",e=>{
        if(e.target.matches("input")||e.target.closest("[contenteditable]")) return;
        this.props.onRowSelect?.(row,rowIndex);
      });
      $(".fallback-check",tr)?.addEventListener("change",e=>{row.__selected=e.target.checked;tr.classList.toggle("selected",row.__selected);updateBulk(this)});
      $(".fallback-bool",tr)?.addEventListener("change",e=>{
        const td=e.target.closest("td"),ci=[...tr.children].indexOf(td)-1,col=this.columns[ci];if(col){row[col.key]=e.target.checked;this.markChanged()}
      });
      $$("[contenteditable]",tr).forEach(td=>td.addEventListener("blur",()=>{
        const key=td.dataset.key,col=this.columns.find(c=>c.key===key);
        let value=td.textContent.trim();
        if(["number","currency","percent"].includes(col.type)) value=rawNumber(value);
        const err=this.validateValue(col,value,rowIndex);
        if(err){td.style.boxShadow="inset 0 0 0 1.5px #ef4444";td.title=err;showToast(err);return}
        td.style.boxShadow="";td.title="";
        row[key]=value;recalcRow(row,this.columns);this.markChanged();this.renderFallback();
      }));
    });
  }
  renderOfficial(){
    if(!window.Handsontable) return;
    try{
      this.el.innerHTML="";
      const selection={data:"__selected",title:"",type:"checkbox",width:38};
      const cols=[selection,...this.columns.map((col,ci)=>{
        const out={data:col.key,title:col.title,width:col.width||120,readOnly:col.editable===false};
        if(col.type==="checkbox") out.type="checkbox";
        if(col.type==="dropdown"){out.type="dropdown";out.source=col.source||[]}
        if(col.type==="date"){out.type="date";out.dateFormat="DD MMM YYYY";out.correctFormat=false}
        if(["number","currency","percent"].includes(col.type)) out.type="numeric";
        out.validator=(value,callback)=>callback(!this.validateValue(col,value,-1));
        out.renderer=function(instance,td,row,column,prop,value,cellProps){
          window.Handsontable.renderers.TextRenderer.apply(this,arguments);
          if(col.type==="status") td.innerHTML=`<span class="status-pill status-${statusTone(value)}">${esc(value)}</span>`;
          else if(col.type==="currency"){td.textContent=formatCell(value,col);td.classList.add("htRight")}
          else if(col.type==="percent"){td.textContent=formatCell(value,col);td.classList.add("htRight")}
          else if(col.type==="progress"){td.innerHTML=`<span class="progress-pill"><span class="progress-track"><i style="width:${Math.min(100,rawNumber(value))}%"></i></span><b>${rawNumber(value)}%</b></span>`}
        };
        return out;
      })];
      const settings={
        data:this.data,columns:cols,colHeaders:true,rowHeaders:true,height:460,stretchH:"all",
        filters:true,dropdownMenu:true,contextMenu:{items:{"row_above":{},"row_below":{},"remove_row":{},"---------":{},"undo":{},"redo":{}}},
        manualColumnResize:true,manualRowResize:true,fixedColumnsStart:1,copyPaste:true,fillHandle:true,undo:true,
        columnSorting:true,hiddenColumns:{indicators:true},licenseKey:"non-commercial-and-evaluation",
        afterChange:(changes,source)=>{if(source==="loadData"||!changes)return;this.data.forEach(r=>recalcRow(r,this.columns));this.markChanged();updateBulk(this)},
        afterSelectionEnd:(r,c)=>{if(c>0&&r>=0)this.props.onRowSelect?.(this.data[r],r)},
        afterOnCellMouseDown:(event,coords)=>{if(coords.col===0&&coords.row>=0)setTimeout(()=>updateBulk(this),10)}
      };
      if(window.HyperFormula) settings.formulas={engine:window.HyperFormula};
      this.hot=new window.Handsontable(this.el,settings);
      this.filtered=this.data;
      updateGridFooter(this.data.length,this.data.length);
    }catch(err){
      console.warn("Handsontable fallback active:",err?.message||err);
      this.renderFallback();
    }
  }
}
window.HandsontableGrid=HandsontableGrid;

/* ---------- Page helpers ---------- */
const body=$("#platformPageBody");
function setSaveState(text,saving=false,unsaved=false){
  const el=$("#saveState");if(!el)return;
  el.classList.toggle("saving",saving);el.classList.toggle("unsaved",unsaved);
  el.innerHTML=`<i></i>${esc(text)}`;
}
function showSkeleton(){
  body.innerHTML=`<div class="page-skeleton"><div class="skeleton-kpis">${Array.from({length:5},()=>'<i class="skeleton"></i>').join("")}</div><div class="skeleton skeleton-block"></div></div>`;
}
function heroActionsHtml(primaryLabel="Create"){
  return `<div class="platform-page-actions">
    <button class="pa-btn primary" data-action="create">${icon("plus")}${esc(primaryLabel)}</button>
    <button class="pa-btn" data-action="import">${icon("upload")}Import</button>
    <button class="pa-btn" data-action="export">${icon("download")}Export</button>
    <button class="pa-btn" data-action="filter">${icon("filter")}Filter</button>
    <button class="pa-btn" data-action="refresh">${icon("refresh")}Refresh</button>
    <button class="pa-btn" data-action="more">${icon("more")}More</button>
    <span class="platform-save-state" id="saveState"><i></i>Saved</span>
  </div>`;
}
const KPI_VALUES={
 "Total Prospects":"248","New Prospects":"32","Qualified":"86","Proposal":"42","Converted":"28",
 "Total Customers":"186","Active Customers":"171","New This Month":"12","Top Customers":"24","Inactive Customers":"15",
 "Activities Today":"18","Open Follow Ups":"46","Meetings":"7","Overdue":"9","Completed":"124",
 "Pipeline Value":"Rp 8.45B","Weighted Pipeline":"Rp 5.72B","Won":"Rp 2.15B","Lost":"Rp 640M",
 "Total Quotations":"146","Draft":"18","Pending Approval":"12","Approved":"72","Grand Total":"Rp 12.8B",
 "Total Orders":"84","Open Orders":"23","Delivered":"42","Invoiced":"67","Order Value":"Rp 16.3B",
 "Total Invoices":"132","Issued":"34","Partially Paid":"18","Paid":"71","Outstanding":"Rp 3.8B",
 "Current":"Rp 1.82B","1-30 Days":"Rp 760M","31-60 Days":"Rp 420M","61-90 Days":"Rp 215M",">90 Days":"Rp 145M",
 "Active Projects":"18","On Track":"12","At Risk":"4","Completed":"36","Project Value":"Rp 24.5B",
 "SKUs":"1,248","Stock Value":"Rp 8.75B","Low Stock":"34","Out of Stock":"9","Warehouses":"3",
 "Total":"84","Open":"18","Completed":"52","Value":"Rp 6.8B"
};
function kpisHtml(labels){
  if(!labels?.length)return "";
  const colors=["blue","green","orange","purple","red"],icons=["file","users","chart","briefcase","warning"];
  return `<section class="platform-kpis">${labels.map((label,i)=>`<article class="platform-kpi"><span class="platform-kpi-icon ${colors[i%5]}">${icon(icons[i%5])}</span><div><small>${esc(label)}</small><strong>${esc(KPI_VALUES[label]||(["248","32","156","28","64"][i%5]))}</strong><p><b>${i===4?"-10%":"+12%"}</b> vs last month</p></div></article>`).join("")}</section>`;
}
function updateGridFooter(visible,total){
  const el=$("#gridCount");if(el)el.textContent=`Showing ${visible} of ${total} records`;
}
function showEmpty(show){
  const el=$("#gridEmpty");
  if(el) el.style.display=show?"grid":"none";
}
function gridCardHtml(){
  return `<section class="bulk-bar" id="bulkBar"><strong id="bulkCount">0</strong> rows selected
    <button data-bulk="approve">Approve</button><button data-bulk="reject">Reject</button><button data-bulk="export">Export</button><button data-bulk="assign">Assign</button><button data-bulk="status">Change Status</button><button data-bulk="print">Print</button><button class="danger" data-bulk="delete">Delete</button>
  </section>
  <section class="platform-card platform-grid-card">
    <div class="platform-card-head"><div><h2>${esc(PAGE.title)} Data</h2><p>Editable operational data with validation, copy/paste, export, and audit-ready detail.</p></div><div class="card-tools"><button class="card-tool" id="undoBtn">Undo</button><button class="card-tool" id="redoBtn">Redo</button></div></div>
    <div class="grid-toolbar" id="gridToolbar"><label class="grid-search">${icon("search")}<input id="gridSearch" type="search" placeholder="Search this dataset..."></label><select class="grid-filter" id="statusQuickFilter"><option value="">All Status</option><option>Active</option><option>Approved</option><option>Pending</option><option>Completed</option><option>Draft</option></select><button class="card-tool" id="clearGridFilter">Clear Filters</button></div>
    <div class="grid-shell"><div class="hot-mount" id="hotMount"></div><div class="empty-state" id="gridEmpty" style="display:none"><div>${icon("search")}<h3>No records found</h3><p>Try changing your filters or create a new record.</p><div class="state-actions"><button class="pa-btn" id="emptyClear">Clear Filters</button><button class="pa-btn primary" id="emptyCreate">Create</button></div></div></div>
    <footer class="grid-footer"><span id="gridCount">Showing records</span><div class="page-buttons"><button>‹</button><button class="active">1</button><button>2</button><button>3</button><button>4</button><button>›</button></div></footer>
  </section>`;
}
function updateBulk(grid){
  const selected=grid.getSelectedRows().length;
  $("#bulkCount") && ($("#bulkCount").textContent=selected);
  $("#bulkBar")?.classList.toggle("show",selected>0);
}
function bindBulk(grid){
  $$("[data-bulk]").forEach(btn=>btn.addEventListener("click",()=>{
    const action=btn.dataset.bulk, selected=grid.getSelectedRows();
    if(!selected.length)return;
    if(action==="delete"){
      confirmDialog(`Delete ${selected.length} selected record(s)?`,"This demo will remove the records from local browser state.",()=>{
        grid.data=grid.data.filter(r=>!r.__selected);grid.filtered=grid.data;grid.renderFallback();grid.save();updateBulk(grid);showToast("Selected records deleted.");
      });
    }else if(action==="export"){exportCSV(grid.data.filter(r=>r.__selected),grid.columns)}
    else showToast(`${action.replace(/^./,s=>s.toUpperCase())} applied to ${selected.length} record(s).`);
  }));
}
function openDrawer(row,columns){
  const drawer=$("#detailDrawer"),overlay=$("#drawerOverlay");
  const keys=columns.slice(0,10);
  const title=row.customerName||row.vendorName||row.projectName||row.company||row.name||row.documentName||row[columns[1]?.key]||row[columns[0]?.key]||PAGE.title;
  const id=row[columns[0]?.key]||PAGE.prefix||"Record";
  const status=row.status||row.approval||"Active";
  drawer.innerHTML=`<div class="drawer-head"><div class="drawer-avatar">${esc(String(title).split(/\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase())}</div><div class="drawer-title"><small>${esc(id)}</small><h2>${esc(title)}</h2><p>${esc(PAGE.module)} · ${esc(status)}</p></div><button class="drawer-close" id="drawerClose">×</button></div>
  <div class="drawer-tabs"><button class="active">Summary</button><button>Details</button><button>Documents</button><button>Activities</button><button>History</button></div>
  <div class="drawer-body"><div class="drawer-section"><h3>Record Details</h3><div class="drawer-fields">${keys.map(col=>`<div class="drawer-field"><span>${esc(col.title)}</span><b>${esc(formatCell(row[col.key],col))}</b></div>`).join("")}</div></div>
  <div class="drawer-section"><h3>Related Records</h3><div class="related-chips"><button class="related-chip">Customer</button><button class="related-chip">Quotation</button><button class="related-chip">Project</button><button class="related-chip">Invoice</button><button class="related-chip">Payment</button></div></div>
  <div class="drawer-section"><h3>Auditability</h3><div class="drawer-fields"><div class="drawer-field"><span>Created By</span><b>Irpan Hidayat Pamil</b></div><div class="drawer-field"><span>Created Date</span><b>16 Sep 2026</b></div><div class="drawer-field"><span>Updated By</span><b>Sari Dewi</b></div><div class="drawer-field"><span>Updated Date</span><b>16 Sep 2026</b></div></div></div></div>
  <div class="drawer-actions"><button class="primary" data-drawer-act="Edit">Edit</button><button data-drawer-act="Duplicate">Duplicate</button><button data-drawer-act="Print">Print</button><button data-drawer-act="Export">Export</button><button data-drawer-act="Open Full Detail">Full Detail</button><button class="danger" data-drawer-act="Delete">Delete</button></div>`;
  drawer.classList.add("show");overlay.classList.add("show");
  $("#drawerClose")?.addEventListener("click",closeDrawer);overlay.addEventListener("click",closeDrawer,{once:true});
  $$(".drawer-tabs button",drawer).forEach(b=>b.addEventListener("click",()=>{$$(".drawer-tabs button",drawer).forEach(x=>x.classList.remove("active"));b.classList.add("active");showToast(b.textContent+" view.")}));
  $$("[data-drawer-act]",drawer).forEach(b=>b.addEventListener("click",()=>showToast(b.dataset.drawerAct+" demo action.")));
  $$(".related-chip",drawer).forEach(b=>b.addEventListener("click",()=>showToast("Opening related "+b.textContent+" record.")));
}
function closeDrawer(){$("#detailDrawer")?.classList.remove("show");$("#drawerOverlay")?.classList.remove("show")}

function exportCSV(data,columns,filename){
  const head=columns.map(c=>`"${String(c.title).replace(/"/g,'""')}"`).join(",");
  const rows=data.map(r=>columns.map(c=>`"${String(formatCell(r[c.key],c)).replace(/"/g,'""')}"`).join(","));
  downloadBlob([head,...rows].join("\n"),filename||`${PAGE.title.replace(/\s+/g,"-").toLowerCase()}.csv`,"text/csv");
  showToast("CSV exported.");
}
function exportExcel(data,columns){
  const html=`<table><tr>${columns.map(c=>`<th>${esc(c.title)}</th>`).join("")}</tr>${data.map(r=>`<tr>${columns.map(c=>`<td>${esc(formatCell(r[c.key],c))}</td>`).join("")}</tr>`).join("")}</table>`;
  downloadBlob(html,`${PAGE.title.replace(/\s+/g,"-").toLowerCase()}.xls`,"application/vnd.ms-excel");
  showToast("Excel-compatible file exported.");
}
function downloadBlob(content,name,type){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)
}

function confirmDialog(title,text,onConfirm){
  const host=$("#platformModals");
  host.innerHTML=`<div class="platform-modal-overlay show" id="confirmOverlay"><div class="platform-modal confirm-modal"><div class="confirm-icon">${icon("warning")}</div><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="platform-modal-actions"><button class="btn-secondary" id="confirmCancel">Cancel</button><button class="btn-danger" id="confirmYes">Confirm</button></div></div></div>`;
  $("#confirmCancel").onclick=()=>host.innerHTML="";
  $("#confirmYes").onclick=()=>{host.innerHTML="";onConfirm?.()};
}

function openCreateModal(grid){
  const cols=grid.columns.filter(c=>c.editable!==false).slice(0,8);
  const host=$("#platformModals");
  host.innerHTML=`<div class="platform-modal-overlay show"><form class="platform-modal" id="createForm"><h2>Create ${esc(PAGE.title.replace(/ List$/,""))}</h2><p>Demo data is stored locally in your browser.</p><div class="modal-row">${cols.map(col=>`<label class="platform-field"><span>${esc(col.title)}</span>${fieldInput(col)}</label>`).join("")}</div><div class="platform-modal-actions"><button type="button" class="btn-secondary" id="createCancel">Cancel</button><button type="submit" class="btn-primary">Save</button></div></form></div>`;
  $("#createCancel").onclick=()=>host.innerHTML="";
  $("#createForm").onsubmit=e=>{
    e.preventDefault();const fd=new FormData(e.currentTarget),row={__selected:false};grid.columns.forEach(col=>row[col.key]=sampleValue(col.key,grid.data.length,PAGE.schema));
    cols.forEach(col=>{let v=fd.get(col.key);if(["number","currency","percent"].includes(col.type))v=rawNumber(v);if(col.type==="checkbox")v=!!v;row[col.key]=v});
    recalcRow(row,grid.columns);grid.data.unshift(row);grid.filtered=grid.data;grid.renderFallback();grid.save();host.innerHTML="";showToast("Record created.");
  };
}
function fieldInput(col){
  if(col.type==="dropdown")return `<select name="${esc(col.key)}">${(col.source||[]).map(v=>`<option>${esc(v)}</option>`).join("")}</select>`;
  if(col.type==="checkbox")return `<input name="${esc(col.key)}" type="checkbox">`;
  const type=col.type==="email"?"email":col.type==="date"?"date":"text";
  return `<input name="${esc(col.key)}" type="${type}" ${col.required?"required":""} placeholder="${esc(col.title)}">`;
}

function openLineItemEditor(kind,grid){
  const host=$("#platformModals");
  const labels=kind==="PO"?["PO Number","Vendor","Date","Delivery Date","Project","Currency","Payment Terms","Shipping Terms"]:
               kind==="Invoice"?["Invoice No","Customer","Invoice Date","Due Date","Sales Order","Project","Currency","Payment Terms"]:
               ["SO Number","Customer","SO Date","Quotation","Project","Sales Owner","Currency","Payment Terms"];
  host.innerHTML=`<div class="platform-modal-overlay show"><div class="platform-modal" style="width:min(900px,96vw)"><h2>Create ${kind==="PO"?"Purchase Order":kind==="Invoice"?"Invoice":"Sales Order"}</h2><p>Header and line items use the same SOP spreadsheet calculation model.</p><div class="modal-row">${labels.map((x,i)=>`<label class="platform-field"><span>${x}</span><input value="${i===0?(kind==="PO"?"PO-2026-0085":kind==="Invoice"?"INV-2026-0133":"SO-2026-0085"):i===1?(kind==="PO"?POOLS.vendors[0]:POOLS.customers[0]):i===2?"16 Sep 2026":""}"></label>`).join("")}</div><div class="platform-card" style="margin-top:8px"><div class="platform-card-head"><h2>Items</h2></div><div id="modalHot" class="hot-mount" style="min-height:240px"></div></div><div style="display:flex;justify-content:flex-end;gap:20px;margin-top:12px;font-size:12px"><span>Subtotal <b id="modalSubtotal">Rp 0</b></span><span>Tax <b id="modalTax">Rp 0</b></span><span>Total <b id="modalTotal">Rp 0</b></span></div><div class="platform-modal-actions"><button class="btn-secondary" id="lineCancel">Cancel</button><button class="btn-primary" id="lineSave">Save ${kind}</button></div></div></div>`;
  const lineCols=[
    c("product","Product / Service","dropdown",{source:POOLS.products,width:180}),
    c("description","Description","text",{width:190}),
    c("qty","Qty","number",{width:65}),
    c("unit","Unit","dropdown",{source:POOLS.units,width:70}),
    c("unitPrice","Unit Price","currency"),
    c("discountPct","Discount %","percent",{width:80}),
    c("discount","Discount","currency",{formula:"qty*unitPrice*discountPct/100",editable:false}),
    c("tax","Tax","currency",{formula:"(qty*unitPrice-discount)*11/100",editable:false}),
    c("subtotal","Subtotal","currency",{formula:"qty*unitPrice-discount+tax",editable:false})
  ];
  const lineRows=Array.from({length:4},(_,i)=>recalcRow({product:POOLS.products[i],description:"Business line item",qty:1+i,unit:POOLS.units[i],unitPrice:1800000+i*750000,discountPct:i%2?2.5:0},lineCols));
  const summarize=()=>{
    const sub=lineRows.reduce((s,r)=>s+rawNumber(r.qty)*rawNumber(r.unitPrice),0);
    const tax=lineRows.reduce((s,r)=>s+rawNumber(r.tax),0);
    const total=lineRows.reduce((s,r)=>s+rawNumber(r.subtotal),0);
    $("#modalSubtotal").textContent=money(sub);
    $("#modalTax").textContent=money(tax);
    $("#modalTotal").textContent=money(total);
  };
  new HandsontableGrid($("#modalHot"),{data:lineRows,columns:lineCols,onChange:summarize,onSave:summarize});
  summarize();
  $("#lineCancel").onclick=()=>host.innerHTML="";
  $("#lineSave").onclick=()=>{
    const row={__selected:false};
    grid.columns.forEach(col=>row[col.key]=sampleValue(col.key,grid.data.length,PAGE.schema));
    if("grandTotal" in row)row.grandTotal=lineRows.reduce((s,r)=>s+rawNumber(r.subtotal),0);
    if("total" in row)row.total=lineRows.reduce((s,r)=>s+rawNumber(r.subtotal),0);
    grid.data.unshift(row);
    grid.filtered=grid.data;
    grid.renderFallback();
    grid.save();
    host.innerHTML="";
    showToast(`${kind} created successfully.`);
  };
}

function openImportModal(grid){
  const host=$("#platformModals");
  host.innerHTML=`<div class="platform-modal-overlay show"><div class="platform-modal" id="importModal"><h2>Import ${esc(PAGE.title)}</h2><p>Upload → Preview → Map columns → Validate → Review errors → Confirm → Import.</p><div class="import-steps">${Array.from({length:7},(_,i)=>`<span class="${i===0?"active":""}"></span>`).join("")}</div><label class="import-drop"><div>${icon("upload")}<strong>Upload Excel or CSV</strong><span>Select a file to preview and validate before import.</span><input id="importFile" type="file" accept=".csv,.xls,.xlsx" style="margin-top:12px"></div></label><div id="importPreview"></div><div class="platform-modal-actions"><button class="btn-secondary" id="importCancel">Cancel</button><button class="btn-primary" id="importConfirm" disabled>Confirm Import</button></div></div></div>`;
  $("#importCancel").onclick=()=>host.innerHTML="";
  $("#importFile").onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    $("#importPreview").innerHTML=`<div class="validation-box">Validation complete: required fields, number formats, duplicate references, and invalid dates will be checked before import. Demo preview detected <b>${esc(file.name)}</b>.</div>`;
    $("#importConfirm").disabled=false;
    $$(".import-steps span").forEach((s,i)=>s.classList.toggle("active",i<6));
  };
  $("#importConfirm").onclick=()=>{host.innerHTML="";showToast("Import completed in demo local state.")};
}

/* ---------- Grid page ---------- */
function renderGridPage(){
  let columns=[...(SCHEMAS[PAGE.schema]||SCHEMAS.generic)];
  if(ROUTE==="/quotation/rejected") columns=[...columns,c("rejectReason","Reject Reason","text",{width:220})];
  if(ROUTE==="/quotation/expired") columns=[...columns,c("renewalAction","Renewal","status",{editable:false,width:100})];
  let data=buildRows(PAGE.schema,14);
  if(ROUTE==="/quotation/rejected") data.forEach((r,i)=>r.rejectReason=["Commercial terms not accepted","Scope requires revision","Budget postponed","Validity expired before approval"][i%4]);
  if(ROUTE==="/quotation/expired") data.forEach(r=>r.renewalAction="Ready to Renew");
  if(PAGE.statusFilter){
    const normalized=PAGE.statusFilter.toLowerCase();
    data=data.filter(r=>String(r.status||r.approval||"").toLowerCase().includes(normalized.split(" ")[0]));
    if(data.length<5)data=buildRows(PAGE.schema,14).map((r,i)=>{r.status=PAGE.statusFilter;return r}).slice(0,8);
  }
  const primaryLabel=PAGE.title==="Approved"?"Create Sales Order":PAGE.title==="Expired"?"Renew Quotation":ROUTE==="/purchase/orders"?"Create PO":ROUTE==="/sales/invoices"?"Create Invoice":ROUTE==="/sales/orders"?"Create Sales Order":"Create";
  body.innerHTML=heroActionsHtml(primaryLabel)+kpisHtml(PAGE.kpis)+gridCardHtml();
  const mount=$("#hotMount");
  const grid=new HandsontableGrid(mount,{data,columns,onRowSelect:r=>openDrawer(r,columns),onChange:()=>{},onSave:()=>{}});
  window.SOP_CURRENT_GRID=grid;
  updateGridFooter(data.length,data.length);bindGridActions(grid);bindBulk(grid);
  $("#gridSearch")?.addEventListener("input",e=>grid.filter(e.target.value));
  $("#statusQuickFilter")?.addEventListener("change",e=>grid.filter(e.target.value));
  $("#clearGridFilter")?.addEventListener("click",()=>{$("#gridSearch").value="";$("#statusQuickFilter").value="";grid.filter("")});
  $("#emptyClear")?.addEventListener("click",()=>{$("#gridSearch").value="";grid.filter("")});
  $("#emptyCreate")?.addEventListener("click",()=>openCreateModal(grid));
  $("#undoBtn")?.addEventListener("click",()=>{grid.hot?.undo?.();showToast("Undo.")});
  $("#redoBtn")?.addEventListener("click",()=>{grid.hot?.redo?.();showToast("Redo.")});
  if(ROUTE==="/finance/bank-reconciliation"){
    const tools=$(".platform-card-head .card-tools");
    tools?.insertAdjacentHTML("afterbegin",`<button class="card-tool" id="autoMatch">Auto Match</button><button class="card-tool" id="matchSelected">Match Selected</button><button class="card-tool" id="unmatchSelected">Unmatch</button>`);
    $("#autoMatch").onclick=()=>showToast("Auto Match completed: 8 transactions matched.");
    $("#matchSelected").onclick=()=>showToast("Selected bank transactions matched.");
    $("#unmatchSelected").onclick=()=>showToast("Selected transactions unmatched.");
  }
}

/* ---------- Page action bindings ---------- */
function bindGridActions(grid){
  $("[data-action=create]")?.addEventListener("click",()=>{
    if(ROUTE==="/quotation/approved"){showToast("Approved quotation converted to Sales Order draft.");return}
    if(ROUTE==="/quotation/expired"){showToast("Expired quotation renewed as a new draft.");return}
    if(ROUTE==="/purchase/orders"){openLineItemEditor("PO",grid);return}
    if(ROUTE==="/sales/invoices"){openLineItemEditor("Invoice",grid);return}
    if(ROUTE==="/sales/orders"){openLineItemEditor("SO",grid);return}
    openCreateModal(grid);
  });
  $("[data-action=import]")?.addEventListener("click",()=>openImportModal(grid));
  $("[data-action=export]")?.addEventListener("click",()=>{
    const host=$("#platformModals");
    host.innerHTML=`<div class="platform-modal-overlay show"><div class="platform-modal confirm-modal"><h2>Export ${esc(PAGE.title)}</h2><p>Select an export format.</p><div class="platform-modal-actions"><button class="btn-secondary" id="exportCancel">Cancel</button><button class="btn-secondary" id="exportCSV">CSV</button><button class="btn-primary" id="exportExcel">Excel</button></div></div></div>`;
    $("#exportCancel").onclick=()=>host.innerHTML="";
    $("#exportCSV").onclick=()=>{exportCSV(grid.data,grid.columns);host.innerHTML=""};
    $("#exportExcel").onclick=()=>{exportExcel(grid.data,grid.columns);host.innerHTML=""};
  });
  $("[data-action=filter]")?.addEventListener("click",()=>$("#gridToolbar")?.scrollIntoView({behavior:"smooth",block:"center"}));
  $("[data-action=refresh]")?.addEventListener("click",()=>{grid.filtered=grid.data;grid.filter("");showToast("Data refreshed.")});
  $("[data-action=more]")?.addEventListener("click",()=>{window.print()});
}

/* ---------- Kanban ---------- */
function renderKanban(){
  const stages=["New","Qualified","Proposal","Negotiation","Won","Lost"];
  const cards=Array.from({length:15},(_,i)=>({id:`OPP-2026-${pad(i+1)}`,name:["Energy Monitoring Expansion","Automation Upgrade","Network Infrastructure","Managed Service Renewal","Plant Integration"][i%5],customer:POOLS.customers[i%POOLS.customers.length],value:250000000+i*80000000,prob:[20,40,60,75,100,0][i%6],close:isoDate(i),owner:POOLS.people[i%4],stage:stages[i%6]}));
  body.innerHTML=heroActionsHtml("Add Opportunity")+kpisHtml(PAGE.kpis)+`<section class="kanban-board">${stages.map(stage=>`<div class="kanban-col" data-stage="${stage}"><div class="kanban-col-head">${stage}<span>${cards.filter(c=>c.stage===stage).length}</span></div><div class="kanban-drop">${cards.filter(c=>c.stage===stage).map(c=>`<article class="kanban-card" draggable="true" data-id="${c.id}"><h3>${esc(c.name)}</h3><p>${esc(c.customer)}</p><div class="kanban-meta"><span class="kanban-value">${money(c.value)}</span><span>${c.prob}%</span></div><div class="kanban-meta" style="margin-top:7px"><span>${c.close}</span><span>${esc(c.owner)}</span></div></article>`).join("")}</div></div>`).join("")}</section>`;
  let dragging;
  $$(".kanban-card").forEach(card=>{card.addEventListener("dragstart",()=>{dragging=card;card.classList.add("dragging")});card.addEventListener("dragend",()=>card.classList.remove("dragging"));card.addEventListener("click",()=>showToast("Opportunity detail drawer demo."))});
  $$(".kanban-col").forEach(col=>{col.addEventListener("dragover",e=>e.preventDefault());col.addEventListener("drop",()=>{if(dragging){$(".kanban-drop",col).appendChild(dragging);showToast(`Opportunity moved to ${col.dataset.stage}.`)}})});
  bindGenericActions();
}

/* ---------- Activities ---------- */
function renderActivities(){
  const columns=SCHEMAS.activities,data=buildRows("activities",12);
  body.innerHTML=heroActionsHtml("Create Activity")+kpisHtml(PAGE.kpis)+`<div class="platform-page-actions" style="margin-top:0"><div class="activity-toggle"><button class="active" data-view="list">List</button><button data-view="calendar">Calendar</button></div></div><div id="activityView"></div>`;
  function list(){ $("#activityView").innerHTML=gridCardHtml();const grid=new HandsontableGrid($("#hotMount"),{data,columns,onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);$("#gridSearch")?.addEventListener("input",e=>grid.filter(e.target.value)) }
  function calendar(){ $("#activityView").innerHTML=`<section class="platform-card"><div class="platform-card-head"><h2>September 2026</h2></div><div class="activity-calendar">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>`<div class="calendar-cell"><b>${d}</b></div>`).join("")}${Array.from({length:28},(_,i)=>`<div class="calendar-cell"><b>${i+1}</b>${i%4===0?`<div class="calendar-event">${["Customer meeting","Follow up","Site visit","Proposal review"][i%4]}</div>`:""}</div>`).join("")}</div></section>`}
  list();$$(".activity-toggle button").forEach(b=>b.addEventListener("click",()=>{$$(".activity-toggle button").forEach(x=>x.classList.remove("active"));b.classList.add("active");b.dataset.view==="calendar"?calendar():list()}));
}

/* ---------- Aging ---------- */
function renderAging(){
  const columns=SCHEMAS.receivable,data=buildRows("receivable",14);
  body.innerHTML=heroActionsHtml("Create Collection Task")+kpisHtml(PAGE.kpis)+`<section class="report-layout"><article class="platform-card report-chart"><div class="platform-card-head"><h2>AR Aging</h2></div><div class="bar-report">${[85,62,44,28,19].map((h,i)=>`<div class="rbar" style="height:${h*2}px"><b>${["Rp 1.82B","Rp 760M","Rp 420M","Rp 215M","Rp 145M"][i]}</b><span>${["Current","1-30","31-60","61-90",">90"][i]}</span></div>`).join("")}</div></article><article class="platform-card report-chart"><div class="platform-card-head"><h2>Customer Aging Exposure</h2></div><div class="bar-report">${[72,58,47,34,25].map((h,i)=>`<div class="rbar" style="height:${h*2}px"><span>${["ABC","Kalbe","Uniguard","Dankos","Cimory"][i]}</span></div>`).join("")}</div></article></section>`+gridCardHtml();
  const grid=new HandsontableGrid($("#hotMount"),{data,columns,onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);$("#gridSearch")?.addEventListener("input",e=>grid.filter(e.target.value));
}

/* ---------- Document editor / formulas ---------- */
function renderDocumentEditor(){
  const lineCols=[
    c("product","Product / Service","dropdown",{source:POOLS.products,width:180}),c("description","Description","text",{width:220}),c("qty","Qty","number",{width:70}),c("unit","Unit","dropdown",{source:POOLS.units,width:75}),c("unitPrice","Unit Price","currency"),
    c("discountPct","Discount %","percent",{width:85}),c("discount","Discount","currency",{formula:"qty*unitPrice*discountPct/100",editable:false}),c("tax","Tax","currency",{formula:"(qty*unitPrice-discount)*11/100",editable:false}),c("subtotal","Subtotal","currency",{formula:"qty*unitPrice-discount+tax",editable:false})
  ];
  const data=Array.from({length:6},(_,i)=>recalcRow({__selected:false,product:POOLS.products[i%POOLS.products.length],description:"Integrated service line item",qty:1+i,unit:POOLS.units[i%POOLS.units.length],unitPrice:2500000+i*800000,discountPct:i%3*2.5},lineCols));
  body.innerHTML=`${heroActionsHtml("Save Draft")}<section class="document-editor"><div class="editor-main"><div class="platform-card-head"><div><h2>Quotation Header</h2><p>Commercial and customer information.</p></div></div><div class="editor-header-form">
    ${["Quotation Number","Quotation Date","Customer","Contact","Project","Currency","Validity","Payment Terms","Delivery Terms","Sales Owner"].map((x,i)=>`<label class="platform-field"><span>${x}</span>${i===2?`<select><option>${POOLS.customers[0]}</option><option>${POOLS.customers[1]}</option></select>`:`<input value="${i===0?"QT-2026-0146":i===1?"16 Sep 2026":i===4?POOLS.projects[0]:i===5?"IDR":i===6?"30 Days":i===7?"30 Days":i===8?"Franco Site":i===9?"Budi Santoso":""}">`}</label>`).join("")}
    </div><div class="editor-items"><div class="platform-card-head"><div><h2>Quotation Items</h2><p>Spreadsheet calculations update automatically.</p></div></div><div id="hotMount" class="hot-mount"></div></div><div class="editor-notes"><textarea placeholder="Notes">Prices exclude out-of-scope civil work unless stated otherwise.</textarea><textarea placeholder="Terms & Conditions">Payment 30 days after invoice. Quotation valid for 30 days.</textarea></div></div>
    <aside class="editor-summary"><h2 style="font-size:14px;margin:0 0 10px">Summary</h2><div class="summary-row"><span>Subtotal</span><b id="sumSubtotal">Rp 0</b></div><div class="summary-row"><span>Discount</span><b id="sumDiscount">Rp 0</b></div><div class="summary-row"><span>Tax</span><b id="sumTax">Rp 0</b></div><div class="summary-row total"><span>Grand Total</span><b id="sumGrand">Rp 0</b></div><div class="editor-actions"><button class="btn-secondary" id="saveDraft">Save Draft</button><button class="btn-primary" id="submitApproval">Submit for Approval</button><button class="btn-secondary" id="previewDoc">Preview</button><button class="btn-secondary" id="cancelDoc">Cancel</button></div></aside></section>`;
  function updateSummary(rows){
    const subtotal=rows.reduce((s,r)=>s+(rawNumber(r.qty)*rawNumber(r.unitPrice)),0),discount=rows.reduce((s,r)=>s+rawNumber(r.discount),0),tax=rows.reduce((s,r)=>s+rawNumber(r.tax),0),grand=rows.reduce((s,r)=>s+rawNumber(r.subtotal),0);
    $("#sumSubtotal").textContent=money(subtotal);$("#sumDiscount").textContent=money(discount);$("#sumTax").textContent=money(tax);$("#sumGrand").textContent=money(grand);
  }
  const grid=new HandsontableGrid($("#hotMount"),{data,columns:lineCols,onChange:rows=>updateSummary(rows),onSave:rows=>updateSummary(rows)});window.SOP_CURRENT_GRID=grid;updateSummary(data);
  $("#saveDraft").onclick=()=>{grid.save();showToast("Quotation draft saved.")};$("#submitApproval").onclick=()=>confirmDialog("Submit quotation for approval?","The quotation will move to Pending Approval.",()=>showToast("Quotation submitted for approval."));
  $("#previewDoc").onclick=()=>window.print();$("#cancelDoc").onclick=()=>history.back();
  bindGenericActions();
}

/* ---------- Project dashboard ---------- */
function renderProjectDashboard(){
  body.innerHTML=heroActionsHtml("Project Action")+`<section class="project-dashboard-grid">
  <article class="platform-card pd-overview"><div class="platform-card-head"><h2>Project Overview</h2></div><div class="metric-stack">${[["Progress","75%"],["Budget","Rp 3.20B"],["Actual Cost","Rp 2.18B"],["Revenue","Rp 4.10B"],["Profit","Rp 1.92B"],["Margin","46.8%"]].map(x=>`<div class="metric-box"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("")}</div></article>
  <article class="platform-card pd-chart"><div class="platform-card-head"><h2>S-Curve</h2></div><div class="line-chart"><svg viewBox="0 0 500 180" preserveAspectRatio="none"><polyline class="planned" points="0,165 70,145 140,120 210,90 280,65 350,40 420,20 500,5"/><polyline class="actual" points="0,165 70,150 140,130 210,103 280,78 350,55 420,39 500,28"/></svg></div></article>
  <article class="platform-card pd-chart"><div class="platform-card-head"><h2>Budget vs Actual</h2></div><div class="bar-report">${[80,55,67,48].map((h,i)=>`<div class="rbar" style="height:${h*2}px"><span>${["Material","Labor","PO","Other"][i]}</span></div>`).join("")}</div></article>
  <article class="platform-card pd-wide"><div class="platform-card-head"><h2>Upcoming Tasks & Milestones</h2></div><div style="padding:10px">${["Complete panel installation","UAT preparation","Milestone: System Integration","Customer training","BAST handover"].map((x,i)=>`<div class="drawer-field"><span>${isoDate(i+5)}</span><b>${x}</b></div>`).join("")}</div></article>
  <article class="platform-card pd-list"><div class="platform-card-head"><h2>Risks & Issues</h2></div><div style="padding:10px">${["Material lead time","Site access window","Interface dependency"].map((x,i)=>`<div class="agenda-item"><b>${x}</b><small>${i===0?"High":"Medium"} priority · Owner ${POOLS.people[i]}</small></div>`).join("")}</div></article>
  </section>`;
  bindGenericActions();
}

/* ---------- Planning ---------- */
function renderPlanning(){
  body.innerHTML=heroActionsHtml("Save Plan")+`<section class="meeting-layout"><article class="platform-card meeting-form-card"><div class="platform-card-head"><h2>Project Planning</h2></div><div class="meeting-form-grid" style="padding-top:12px">
  ${["Project","Objective","Scope","Start Date","End Date","Project Manager","Budget","Team"].map((x,i)=>`<label class="platform-field"><span>${x}</span>${["Objective","Scope"].includes(x)?`<textarea rows="3">${x==="Objective"?"Deliver integrated operational solution":"Engineering, procurement, installation, testing, and handover"}</textarea>`:`<input value="${i===0?POOLS.projects[0]:i===3?"16 Sep 2026":i===4?"30 Jun 2027":i===5?"Andi Wijaya":i===6?"Rp 3,200,000,000":i===7?"Engineering, Project, Finance":""}">`}</label>`).join("")}</div></article>
  <aside class="platform-card meeting-side"><div class="platform-card-head"><h2>Planning Summary</h2></div>${["Deliverables","Assumptions","Risks"].map((x,i)=>`<div class="agenda-item"><b>${x}</b><small>${["Approved design, installed system, test report, BAST","Site access available, customer PIC assigned","Material delay, integration dependency"][i]}</small></div>`).join("")}</aside></section><section class="platform-card platform-grid-card"><div class="platform-card-head"><h2>Deliverables & Assumptions</h2></div><div id="hotMount" class="hot-mount"></div></section>`;
  const cols=[c("type","Type","dropdown",{source:["Deliverable","Assumption","Risk"]}),c("description","Description","text",{width:260}),c("owner","Owner"),c("dueDate","Due Date","date"),c("status","Status","status")],data=Array.from({length:8},(_,i)=>({type:["Deliverable","Assumption","Risk"][i%3],description:["Approved engineering design","Customer site access","Long lead material","Testing protocol"][i%4],owner:POOLS.people[i%4],dueDate:isoDate(i+4),status:["Open","In Progress","Approved"][i%3]}));
  const grid=new HandsontableGrid($("#hotMount"),{data,columns:cols,onRowSelect:r=>openDrawer(r,cols)});window.SOP_CURRENT_GRID=grid;bindGenericActions();
}

/* ---------- Gantt ---------- */
function renderGantt(){
  const tasks=["Site Survey","Detailed Design","Panel Fabrication","Material Delivery","Installation","Testing & Commissioning","User Training","Handover"];
  body.innerHTML=heroActionsHtml("Add Task")+`<section class="platform-card platform-grid-card"><div class="platform-card-head"><div><h2>Project Timeline</h2><p>Drag bars horizontally to simulate start-date changes.</p></div><div class="card-tools"><button class="card-tool">Week</button><button class="card-tool">Month</button></div></div><div class="gantt-wrap"><div class="gantt">${tasks.map((t,i)=>`<div class="gantt-row"><div class="gantt-task"><b>${i+1}. ${t}</b><br><small>${POOLS.people[i%4]} · ${[20,35,60,80,45,10,0,0][i]}%</small></div><div class="gantt-timeline"><div class="gantt-bar ${i<2?"complete":i===3?"warning":""}" draggable="true" style="left:${4+i*8}%;width:${14+(i%3)*5}%">${[20,35,60,80,45,10,0,0][i]}%</div></div></div>`).join("")}</div></div></section>`;
  $$(".gantt-bar").forEach(bar=>{bar.addEventListener("dragend",e=>{const parent=bar.parentElement,rect=parent.getBoundingClientRect();const left=Math.max(0,Math.min(90,((e.clientX-rect.left)/rect.width)*100));bar.style.left=left+"%";showToast("Timeline updated and draft autosaved.")})});bindGenericActions();
}

/* ---------- Progress ---------- */
function renderProgress(){
  const columns=SCHEMAS.progress,data=buildRows("progress",10);
  body.innerHTML=heroActionsHtml("Update Progress")+`<section class="report-layout"><article class="platform-card report-chart"><div class="platform-card-head"><h2>S-Curve — Planned vs Actual</h2></div><div class="line-chart"><svg viewBox="0 0 500 180" preserveAspectRatio="none"><polyline class="planned" points="0,165 70,150 140,130 210,100 280,75 350,45 420,20 500,3"/><polyline class="actual" points="0,165 70,155 140,138 210,112 280,88 350,61 420,38 500,20"/></svg></div></article><article class="platform-card report-chart"><div class="platform-card-head"><h2>Variance</h2></div><div class="bar-report">${[20,32,45,38,55,62].map((h,i)=>`<div class="rbar" style="height:${h*2}px"><span>P${i+1}</span></div>`).join("")}</div></article></section>`+gridCardHtml();
  const grid=new HandsontableGrid($("#hotMount"),{data,columns,onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);$("#gridSearch")?.addEventListener("input",e=>grid.filter(e.target.value));
}

/* ---------- Profitability ---------- */
function renderProfitability(){
  const columns=SCHEMAS.profitability,data=buildRows("profitability",5);
  body.innerHTML=heroActionsHtml("Recalculate")+`<section class="platform-kpis">${[["Revenue","Rp 4.10B"],["Budget","Rp 3.20B"],["Actual Cost","Rp 2.18B"],["Gross Profit","Rp 1.92B"],["Margin","46.8%"]].map((x,i)=>`<article class="platform-kpi"><span class="platform-kpi-icon ${["blue","orange","red","green","purple"][i]}">${icon("chart")}</span><div><small>${x[0]}</small><strong>${x[1]}</strong><p>Connected project data</p></div></article>`).join("")}</section>`+gridCardHtml();
  const grid=new HandsontableGrid($("#hotMount"),{data,columns,onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);
}

/* ---------- Reports ---------- */
function renderReport(){
  const columns=SCHEMAS.report,data=buildRows("report",12);
  body.innerHTML=`${heroActionsHtml("Run Report")}<div class="report-filters"><label>Period<input type="month" value="2026-09"></label><label>Company<select><option>PT Sinergi Bisnis Indonesia</option></select></label><label>Department<select><option>All Departments</option>${POOLS.departments.map(x=>`<option>${x}</option>`)}</select></label><label>Project<select><option>All Projects</option>${POOLS.projects.map(x=>`<option>${x}</option>`)}</select></label><button class="pa-btn" id="runReport" style="align-self:end">Run</button></div>
  <section class="report-layout"><article class="platform-card report-chart"><div class="platform-card-head"><h2>${esc(PAGE.title)} Trend</h2></div><div class="bar-report">${[48,63,72,57,84,76,91,80].map((h,i)=>`<div class="rbar" style="height:${h*2.2}px"><b>${money((i+2)*125000000)}</b><span>${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][i]}</span></div>`).join("")}</div></article><article class="platform-card report-table"><div class="platform-card-head"><h2>Summary</h2></div><div id="hotMount" class="hot-mount"></div></article></section>`;
  const grid=new HandsontableGrid($("#hotMount"),{data,columns});window.SOP_CURRENT_GRID=grid;
  $("#runReport").onclick=()=>showToast("Report refreshed for selected filters.");
  $("[data-action=export]").onclick=()=>exportExcel(data,columns);
  $("[data-action=more]").onclick=()=>window.print();
  $("[data-action=create]").textContent="Export PDF";
  $("[data-action=create]").onclick=()=>{window.print();showToast("Use Print → Save as PDF.")};
  $("[data-action=filter]").onclick=()=>$(".report-filters")?.scrollIntoView({behavior:"smooth",block:"center"});
  $("[data-action=refresh]").onclick=()=>showToast("Report data refreshed.");
  $("[data-action=import]").style.display="none";
}

/* ---------- Statements ---------- */
function renderStatement(){
  const lines=PAGE.schema==="balance-sheet"?
    [["ASSETS","group"],["Current Assets","group"],["Cash","Rp 820,000,000"],["Bank","Rp 2,450,000,000"],["Accounts Receivable","Rp 3,380,000,000"],["Inventory","Rp 1,975,000,000"],["Other Current Assets","Rp 420,000,000"],["Non-Current Assets","group"],["Fixed Assets","Rp 4,250,000,000"],["Accumulated Depreciation","(Rp 980,000,000)"],["TOTAL ASSETS","Rp 12,315,000,000","total"],["LIABILITIES","group"],["Accounts Payable","Rp 2,140,000,000"],["Loans","Rp 1,800,000,000"],["Other Liabilities","Rp 675,000,000"],["EQUITY","group"],["Capital","Rp 5,000,000,000"],["Retained Earnings","Rp 1,760,000,000"],["Current Year Profit","Rp 940,000,000"],["TOTAL LIABILITIES & EQUITY","Rp 12,315,000,000","total"]]:
  PAGE.schema==="income-statement"?
    [["Revenue","Rp 18,450,000,000"],["Cost of Sales","(Rp 10,220,000,000)"],["Gross Profit","Rp 8,230,000,000","total"],["Operating Expenses","(Rp 5,860,000,000)"],["Operating Profit","Rp 2,370,000,000","total"],["Other Income","Rp 185,000,000"],["Other Expenses","(Rp 95,000,000)"],["Profit Before Tax","Rp 2,460,000,000","total"],["Tax","(Rp 541,000,000)"],["Net Profit","Rp 1,919,000,000","total"]]:
    [["Operating Activities","group"],["Customer Receipts","Rp 14,850,000,000"],["Supplier Payments","(Rp 8,920,000,000)"],["Operating Expenses","(Rp 3,650,000,000)"],["Net Operating Cash","Rp 2,280,000,000","total"],["Investing Activities","group"],["Asset Purchases","(Rp 620,000,000)"],["Financing Activities","group"],["Loan Repayment","(Rp 350,000,000)"],["Opening Cash","Rp 2,100,000,000"],["Net Cash Flow","Rp 1,310,000,000","total"],["Closing Cash","Rp 3,410,000,000","total"]];
  body.innerHTML=heroActionsHtml("Export PDF")+`<section class="platform-card statement-card"><div class="statement-toolbar"><select class="grid-filter"><option>Monthly</option><option>Quarterly</option><option>Yearly</option></select><select class="grid-filter"><option>Sep 2026</option><option>Aug 2026</option></select><button class="card-tool">Compare</button></div>${lines.map(l=>l[1]==="group"?`<div class="statement-section"><h3>${l[0]}</h3></div>`:`<div class="statement-line ${l[2]||""}"><span>${l[0]}</span><span>${l[1]}</span><span>${l[1]}</span></div>`).join("")}</section>`;
  $("[data-action=create]").onclick=()=>window.print();$("[data-action=export]").onclick=()=>showToast("Statement exported to Excel.");$("[data-action=import]").style.display="none";$("[data-action=filter]").onclick=()=>showToast("Comparison filters updated.");$("[data-action=refresh]").onclick=()=>showToast("Statement refreshed.");
}

/* ---------- Journal ---------- */
function renderJournal(){
  const columns=SCHEMAS[PAGE.schema]||SCHEMAS["journal-entry"],data=buildRows(PAGE.schema,10);
  body.innerHTML=heroActionsHtml("Post Journal")+`<section class="platform-kpis">${[["Total Debit","Rp 755,000,000"],["Total Credit","Rp 755,000,000"],["Difference","Rp 0"],["Status","Balanced"]].map((x,i)=>`<article class="platform-kpi"><span class="platform-kpi-icon ${i===3?"green":"blue"}">${icon("file")}</span><div><small>${x[0]}</small><strong>${x[1]}</strong><p>${i===3?"Ready to post":"Calculated automatically"}</p></div></article>`).join("")}</section>`+gridCardHtml();
  const grid=new HandsontableGrid($("#hotMount"),{data,columns,onChange:rows=>updateJournal(rows),onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);
  function updateJournal(rows){const d=rows.reduce((s,r)=>s+rawNumber(r.debit),0),c=rows.reduce((s,r)=>s+rawNumber(r.credit),0);showToast(d===c?"Journal is balanced.":`Unbalanced by ${money(Math.abs(d-c))}.`)}
}

/* ---------- Closing ---------- */
function renderClosing(){
  renderGridPage();
  const create=$("[data-action=create]");if(create){create.innerHTML=`${icon("check")}Close Period`;create.onclick=()=>confirmDialog("Close accounting period?","Closing a period prevents normal posting to the period. This action is simulated locally.",()=>showToast("Period closed successfully."))}
}

/* ---------- Company form ---------- */
function renderCompanyForm(){
  body.innerHTML=heroActionsHtml("Save Company")+`<section class="platform-card settings-form">${[
    ["Company Name","PT Sinergi Bisnis Indonesia"],["Legal Name","PT Sinergi Bisnis Indonesia"],["Address","Jakarta, Indonesia"],["Phone","+62 21 555 0199"],["Email","info@sinergibisnis.co.id"],["Website","www.sinergibisnis.co.id"],["NPWP","01.234.567.8-012.000"],["NIB","8120001234567"],["Bank","BCA"],["Currency","IDR"],["Fiscal Year","January - December"]
  ].map(x=>`<label class="platform-field"><span>${x[0]}</span><input value="${x[1]}"></label>`).join("")}<label class="platform-field full"><span>Company Logo</span><input type="file" accept="image/*"></label></section>`;
  bindFormSave();
}

/* ---------- Meeting ---------- */
function renderMeeting(){
  body.innerHTML=heroActionsHtml("Save Meeting")+`<section class="meeting-layout"><article class="platform-card meeting-form-card"><div class="platform-card-head"><h2>Meeting Information</h2></div><div class="meeting-form-grid" style="padding-top:12px">
  ${[["Meeting No","MTG-2026-009"],["Meeting Type","Management Review"],["Date","22 Sep 2026"],["Time","09:00 - 11:00"],["Location","Sentul Meeting Room"],["Chairman","Irpan Hidayat Pamil"],["Participants","Management, Project, Finance"],["Status","Scheduled"]].map(x=>`<label class="platform-field"><span>${x[0]}</span><input value="${x[1]}"></label>`).join("")}<label class="platform-field" style="grid-column:1/-1"><span>Agenda</span><textarea rows="5">1. Operational performance\n2. Project delivery\n3. Sales pipeline\n4. Finance and cash flow\n5. Action items</textarea></label></div></article><aside class="platform-card meeting-side"><div class="platform-card-head"><h2>Agenda Preview</h2></div>${["Operational performance","Project delivery","Sales pipeline","Finance and cash flow","Action items"].map((x,i)=>`<div class="agenda-item"><b>${i+1}. ${x}</b><small>${[20,25,20,25,10][i]} min · Presenter ${POOLS.people[i%4]}</small></div>`).join("")}</aside></section>`;bindFormSave();
}

/* ---------- Users matrix ---------- */
function renderUsersMatrix(){
  const columns=SCHEMAS.users,data=buildRows("users",10);
  body.innerHTML=heroActionsHtml("Add User")+gridCardHtml()+`<section class="platform-card platform-grid-card"><div class="platform-card-head"><h2>Role Permission Matrix</h2></div><div class="permission-matrix"><table><thead><tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th><th>Approve</th><th>Export</th></tr></thead><tbody>${["CRM & Sales","Quotation","Sales","Project","Purchase","Inventory","Finance & Accounting","Reports"].map((m,i)=>`<tr><td>${m}</td>${Array.from({length:6},(_,j)=>`<td><input type="checkbox" ${j<3||i<2?"checked":""}></td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
  const grid=new HandsontableGrid($("#hotMount"),{data,columns,onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);
}

/* ---------- Workflow ---------- */
function renderWorkflow(){
  const columns=SCHEMAS.workflow,data=buildRows("workflow",9);
  body.innerHTML=heroActionsHtml("Add Workflow")+`<section class="platform-card platform-grid-card"><div class="platform-card-head"><h2>Workflow Builder</h2></div><div class="workflow-canvas"><div class="workflow-step"><b>Quotation Submitted</b><small>Start event</small></div><div class="workflow-arrow">→</div><div class="workflow-step"><b>Sales Manager</b><small>Commercial approval</small></div><div class="workflow-arrow">→</div><div class="workflow-step"><b>Finance</b><small>Margin & tax review</small></div><div class="workflow-arrow">→</div><div class="workflow-step"><b>Director</b><small>Final approval above threshold</small></div></div></section>`+gridCardHtml();
  const grid=new HandsontableGrid($("#hotMount"),{data,columns,onRowSelect:r=>openDrawer(r,columns)});window.SOP_CURRENT_GRID=grid;bindGridActions(grid);bindBulk(grid);
}

/* ---------- Integrations ---------- */
function renderIntegrations(){
  const names=[["Microsoft 365","Email, identity, and productivity"],["WhatsApp","Customer messaging and alerts"],["Email","SMTP and business notifications"],["Bank","Bank statement and transaction connectivity"],["Tax","Tax reporting and reference integration"],["Payment Gateway","Online customer payment collection"],["Cloud Storage","Document and backup storage"],["API","External system integration"]];
  body.innerHTML=heroActionsHtml("Add Integration")+`<section class="integration-grid">${names.map((x,i)=>`<article class="integration-card"><div class="integration-icon">${icon(i%2?"settings":"grid")}</div><h3>${x[0]}</h3><p>${x[1]}</p><div class="integration-status ${i<3?"":"off"}"><i></i>${i<3?"Connected":"Not Connected"}</div><div class="integration-actions"><button class="${i<3?"":"primary"}" data-int="${x[0]}">${i<3?"Configure":"Connect"}</button>${i<3?`<button data-disconnect="${x[0]}">Disconnect</button>`:""}</div></article>`).join("")}</section>`;
  $$("[data-int]").forEach(b=>b.onclick=()=>showToast(b.textContent+" "+b.dataset.int+" demo."));
  $$("[data-disconnect]").forEach(b=>b.onclick=()=>confirmDialog("Disconnect integration?",`Disconnect ${b.dataset.disconnect}?`,()=>showToast("Integration disconnected in demo.")));
  hideUnusedActions();
}

/* ---------- Notifications ---------- */
function renderNotifications(){
  const events=["Approval","Due Date","Payment","Overdue","Project Update","Stock Alert"];
  body.innerHTML=heroActionsHtml("Save Settings")+`<section class="platform-card settings-form"><div class="full"><h2 style="font-size:14px;margin:0 0 10px">Channels</h2>${["Email Notification","WhatsApp Notification","In-App Notification"].map((x,i)=>`<div class="toggle-row"><div><b>${x}</b><small>Enable ${x.toLowerCase()} across SOP events.</small></div><button class="toggle ${i!==1?"on":""}" type="button"></button></div>`).join("")}</div><div class="full"><h2 style="font-size:14px;margin:12px 0 8px">Events</h2>${events.map(x=>`<div class="toggle-row"><div><b>${x}</b><small>Notify responsible users when this event occurs.</small></div><button class="toggle on" type="button"></button></div>`).join("")}</div></section>`;
  $$(".toggle").forEach(t=>t.onclick=()=>t.classList.toggle("on"));bindFormSave();
}

/* ---------- Backup ---------- */
function renderBackup(){
  body.innerHTML=heroActionsHtml("Backup Now")+`<section class="backup-overview">${[["Last Backup","21 Sep 2026 02:00"],["Backup Size","1.42 GB"],["Backup Type","Full"],["Status","Successful"]].map(x=>`<article class="platform-card backup-stat"><small>${x[0]}</small><strong>${x[1]}</strong></article>`).join("")}</section><section class="platform-card platform-grid-card" style="padding:14px"><h2 style="font-size:14px;margin-top:0">Backup & Restore</h2><p style="font-size:11px;color:#687b9d">Create an on-demand backup, download the latest backup file, or restore from a validated backup package.</p><div class="backup-actions"><button class="pa-btn primary" id="backupNow">Backup Now</button><button class="pa-btn" id="restoreBackup">Restore</button><button class="pa-btn" id="downloadBackup">Download Backup</button></div></section>`;
  $("#backupNow").onclick=()=>{showToast("Backup started…");setTimeout(()=>showToast("Backup completed successfully."),900)};
  $("#restoreBackup").onclick=()=>confirmDialog("Restore backup?","Current application data may be replaced. This demo does not modify server data.",()=>showToast("Restore completed in demo."));
  $("#downloadBackup").onclick=()=>downloadBlob("SOP demo backup metadata","SOP-backup-2026-09-21.txt","text/plain");
  hideUnusedActions();
}

/* ---------- Parameters ---------- */
function renderParameters(){
  body.innerHTML=heroActionsHtml("Save Parameters")+`<section class="platform-card settings-form">${[
    ["Company Currency","IDR"],["Fiscal Year","January - December"],["Date Format","DD MMM YYYY"],["Timezone","Asia/Jakarta"],["Tax Default","PPN 11%"],["Default Warehouse","WH-SNT - Sentul"],["Default Payment Terms","30 Days"],["Number Format","1,234,567.89"]
  ].map(x=>`<label class="platform-field"><span>${x[0]}</span><input value="${x[1]}"></label>`).join("")}</section>`;bindFormSave();
}

/* ---------- Generic helpers ---------- */
function bindFormSave(){
  const btn=$("[data-action=create]");if(btn){btn.onclick=()=>{setSaveState("Saving...",true);setTimeout(()=>{setSaveState("Saved");showToast("Settings saved.")},650)}}
  $("[data-action=import]")?.remove();$("[data-action=filter]")?.remove();
  $("[data-action=refresh]")?.addEventListener("click",()=>location.reload());
  $("[data-action=export]")?.addEventListener("click",()=>showToast("Configuration exported."));
}
function hideUnusedActions(){
  ["import","filter"].forEach(a=>$(`[data-action=${a}]`)?.remove());
  $("[data-action=create]")?.addEventListener("click",()=>showToast(PAGE.title+" action completed in demo mode."));
  $("[data-action=refresh]")?.addEventListener("click",()=>location.reload());
  $("[data-action=export]")?.addEventListener("click",()=>showToast("Export completed."));
  $("[data-action=more]")?.addEventListener("click",()=>showToast("More actions."));
}
function bindGenericActions(){
  $("[data-action=create]")?.addEventListener("click",()=>showToast(PAGE.title+" create action."));
  $("[data-action=import]")?.addEventListener("click",()=>showToast("Import wizard is available on data-grid pages."));
  $("[data-action=export]")?.addEventListener("click",()=>showToast("Export prepared."));
  $("[data-action=filter]")?.addEventListener("click",()=>showToast("Filter controls updated."));
  $("[data-action=refresh]")?.addEventListener("click",()=>showToast("Data refreshed."));
  $("[data-action=more]")?.addEventListener("click",()=>window.print());
}

/* ---------- Render dispatcher ---------- */
function render(){
  switch(PAGE.type){
    case "kanban": return renderKanban();
    case "calendar-list": return renderActivities();
    case "aging": return renderAging();
    case "document-editor": return renderDocumentEditor();
    case "project-dashboard": return renderProjectDashboard();
    case "planning": return renderPlanning();
    case "gantt": return renderGantt();
    case "progress": return renderProgress();
    case "profitability": return renderProfitability();
    case "report": return renderReport();
    case "statement": return renderStatement();
    case "journal": return renderJournal();
    case "closing": return renderClosing();
    case "company-form": return renderCompanyForm();
    case "meeting-form": return renderMeeting();
    case "users-matrix": return renderUsersMatrix();
    case "workflow": return renderWorkflow();
    case "integrations": return renderIntegrations();
    case "notifications": return renderNotifications();
    case "backup": return renderBackup();
    case "parameters": return renderParameters();
    case "documents": return renderGridPage();
    default: return renderGridPage();
  }
}

showSkeleton();
setTimeout(()=>{
  try{render()}
  catch(err){
    console.error(err);
    body.innerHTML=`<section class="platform-card error-state"><div>${icon("warning")}<h3>Something went wrong</h3><p>The page could not be rendered. No raw technical details are shown to users.</p><div class="state-actions"><button class="pa-btn primary" id="retryPage">Retry</button></div></div></section>`;
    $("#retryPage").onclick=()=>location.reload();
  }
},280);

})();
