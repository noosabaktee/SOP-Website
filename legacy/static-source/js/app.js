
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const toast = $("#toast");
  let toastTimer;
  const inCrm = location.pathname.replace(/\\/g,"/").includes("/crm/");
  const rootPrefix = inCrm ? "../" : "";

  function showToast(msg){
    if(!toast) return;
    clearTimeout(toastTimer);
    toast.textContent=msg;
    toast.classList.add("show");
    toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
  }

  // LOGIN PAGE
  const loginForm = $("#loginForm");
  if(loginForm){
    const password = $("#password");
    $("#passwordToggle")?.addEventListener("click",()=>{
      const hidden = password.type === "password";
      password.type = hidden ? "text" : "password";
      $("#passwordToggle").setAttribute("aria-label",hidden?"Hide password":"Show password");
    });
    const langButton=$("#langButton"), langMenu=$("#langMenu");
    langButton?.addEventListener("click",(e)=>{
      e.stopPropagation();
      const open=langMenu.classList.toggle("show");
      langButton.setAttribute("aria-expanded",String(open));
    });
    $$("#langMenu button").forEach(b=>b.addEventListener("click",()=>{
      $("#languageLabel").textContent=b.dataset.lang;
      langMenu.classList.remove("show");
      langButton.setAttribute("aria-expanded","false");
    }));
    document.addEventListener("click",()=>langMenu?.classList.remove("show"));
    $("#forgotPassword")?.addEventListener("click",()=>showToast("Password recovery demo."));
    $("#microsoftButton")?.addEventListener("click",()=>showToast("Microsoft 365 sign-in demo."));
    $("#contactAdmin")?.addEventListener("click",()=>showToast("Please contact your SOP administrator."));
    loginForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const btn=$("#signinButton");
      const text=btn.querySelector("b");
      btn.classList.add("loading"); btn.disabled=true; text.textContent="Signing In...";
      setTimeout(()=>{ window.location.href="dashboard.html"; },1500);
    });
  }

  // SHARED APPLICATION SHELL
  const sidebar=$("#sidebar");
  if(sidebar){
    $("#collapseBtn")?.addEventListener("click",()=>document.body.classList.toggle("sidebar-collapsed"));
    const overlay=$("#sidebarOverlay");
    $("#mobileMenu")?.addEventListener("click",()=>{
      sidebar.classList.add("mobile-open"); overlay?.classList.add("show");
    });
    overlay?.addEventListener("click",()=>{
      sidebar.classList.remove("mobile-open"); overlay.classList.remove("show");
    });

    // Non-link menu items get demo feedback; real anchors navigate normally.
    $$(".nav-item").forEach(item=>{
      if(item.tagName.toLowerCase()==="a") return;
      item.addEventListener("click",()=>{
        if(item.classList.contains("crm-parent")){
          const submenu=$(".crm-submenu");
          if(submenu){
            const isHidden = getComputedStyle(submenu).display==="none";
            submenu.style.display = isHidden ? "block" : "none";
          }
          return;
        }
        const routeMap={
          "Quotation":"quotation/index.html",
          "Sales":"sales/orders/index.html",
          "Project":"project/index.html",
          "Procurement":"purchase/request/index.html",
          "Inventory":"inventory/stock/index.html",
          "Finance & Accounting":"finance/transactions/sales/index.html",
          "Reports":"reports/financial/index.html",
          "Master Data":"master/company/index.html",
          "Documents":"documents/index.html",
          "GMS":"meeting/agenda/index.html",
          "Settings":"settings/users/index.html"
        };
        const target=routeMap[item.dataset.label];
        if(target){ window.location.href=rootPrefix+target; return; }
        showToast(item.dataset.label+" demo section.");
      });
    });

    const profileButton=$("#profileButton"),profileMenu=$("#profileMenu");
    profileButton?.addEventListener("click",(e)=>{
      e.stopPropagation();
      const open=profileMenu.classList.toggle("show");
      profileButton.setAttribute("aria-expanded",String(open));
    });
    document.addEventListener("click",(e)=>{
      if(!e.target.closest(".profile-button")&&!e.target.closest(".profile-menu")){
        profileMenu?.classList.remove("show");
        profileButton?.setAttribute("aria-expanded","false");
      }
    });
    $("#signOut")?.addEventListener("click",()=>window.location.href=rootPrefix+"index.html");
    $$(".profile-menu button:not(#signOut)").forEach(b=>b.addEventListener("click",()=>showToast(b.textContent.trim()+" demo.")));

    // Ctrl/Cmd + K global focus
    document.addEventListener("keydown",(e)=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
        e.preventDefault();
        const target = innerWidth<=767 ? $("#mobileSearch") : $("#globalSearch");
        target?.focus(); target?.select();
      }
    });
  }

  // DASHBOARD PAGE SEARCH + DEMO
  if($(".dashboard-main") && !$(".leads-page")){
    const searches=[$("#globalSearch"),$("#mobileSearch")].filter(Boolean);
    function runDashboardSearch(value){
      const q=value.trim().toLowerCase();
      $$(".searchable").forEach(el=>{
        const hay=(el.dataset.search||el.textContent).toLowerCase();
        el.classList.toggle("hidden-by-search",q && !hay.includes(q));
      });
    }
    searches.forEach(input=>input.addEventListener("input",()=>{
      searches.forEach(other=>{if(other!==input) other.value=input.value});
      runDashboardSearch(input.value);
    }));
    $("#learnMore")?.addEventListener("click",()=>showToast("SOP integrates people, process, and technology."));
  }

  // CRM LEADS PAGE
  if(document.body.classList.contains("leads-page")){
    const tbody=$("#leadTableBody");
    const leadSearch=$("#leadSearch");
    const sourceFilter=$("#sourceFilter");
    const statusFilter=$("#statusFilter");
    const assignedFilter=$("#assignedFilter");
    const globalSearch=$("#globalSearch");
    const mobileSearch=$("#mobileSearch");

    function rows(){ return $$(".lead-row",tbody); }

    function normalizeDate(str){
      // "16 Sep 2026" -> timestamp
      return Date.parse(str.replace("Sep","Sep").replace("Aug","Aug"));
    }

    let useDateFilter=false;
    function applyLeadFilters(){
      const q=(leadSearch?.value||"").trim().toLowerCase();
      const source=sourceFilter?.value||"All Sources";
      const status=statusFilter?.value||"All Status";
      const assigned=assignedFilter?.value||"All Team Members";
      const from=$("#dateFrom")?.value ? new Date($("#dateFrom").value+"T00:00:00").getTime() : -Infinity;
      const to=$("#dateTo")?.value ? new Date($("#dateTo").value+"T23:59:59").getTime() : Infinity;
      let visible=0;
      rows().forEach(row=>{
        const search=[row.dataset.name,row.dataset.company,row.dataset.email,row.dataset.phone].join(" ").toLowerCase();
        const date=normalizeDate(row.dataset.date);
        const okQ=!q||search.includes(q);
        const okSource=source==="All Sources"||row.dataset.source===source;
        const okStatus=status==="All Status"||row.dataset.status===status;
        const okAssigned=assigned==="All Team Members"||row.dataset.assigned===assigned;
        const okDate=!useDateFilter||(date>=from&&date<=to);
        const show=okQ&&okSource&&okStatus&&okAssigned&&okDate;
        row.classList.toggle("hidden-by-search",!show);
        if(show) visible++;
      });
      $("#noResults")?.classList.toggle("show",visible===0);
      const totalBase=248 + Math.max(0, rows().length-10);
      $("#showingText").textContent = visible
        ? `Showing 1 - ${visible} of ${totalBase} leads`
        : `Showing 0 of ${totalBase} leads`;
    }

    leadSearch?.addEventListener("input",applyLeadFilters);
    $("#applyFilters")?.addEventListener("click",()=>{
      useDateFilter=true;
      applyLeadFilters(); showToast("Filters applied.");
    });
    $("#resetFilters")?.addEventListener("click",()=>{
      if(leadSearch) leadSearch.value="";
      if(sourceFilter) sourceFilter.value="All Sources";
      if(statusFilter) statusFilter.value="All Status";
      if(assignedFilter) assignedFilter.value="All Team Members";
      if($("#dateFrom")) $("#dateFrom").value="2026-09-01";
      if($("#dateTo")) $("#dateTo").value="2026-09-30";
      if(globalSearch) globalSearch.value="";
      if(mobileSearch) mobileSearch.value="";
      useDateFilter=false;
      applyLeadFilters(); showToast("Filters reset.");
    });

    [globalSearch,mobileSearch].filter(Boolean).forEach(input=>{
      input.addEventListener("input",()=>{
        const value=input.value;
        if(leadSearch) leadSearch.value=value;
        if(globalSearch&&globalSearch!==input) globalSearch.value=value;
        if(mobileSearch&&mobileSearch!==input) mobileSearch.value=value;
        applyLeadFilters();
      });
    });

    function longDate(shortDate){
      const parts=shortDate.split(" ");
      const months={Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"};
      return `${parts[0]} ${months[parts[1]]||parts[1]} ${parts[2]}`;
    }

    function initials(name){
      return name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
    }

    function statusClass(status){
      return ({
        "New":"new","In Progress":"in-progress","Qualified":"qualified","Nurturing":"nurturing",
        "Contacted":"contacted","Proposal":"proposal","Lost":"lost","Converted":"converted"
      })[status]||"new";
    }

    function selectLead(row){
      rows().forEach(r=>r.classList.remove("selected"));
      row.classList.add("selected");
      $("#detailAvatar").textContent=initials(row.dataset.name);
      $("#detailName").textContent=row.dataset.name;
      $("#detailCompany").textContent=row.dataset.company;
      $("#detailCompanyField").textContent=row.dataset.company;
      $("#detailEmail").textContent=row.dataset.email;
      $("#detailPhone").textContent=row.dataset.phone;
      $("#detailIndustry").textContent=row.dataset.industry||"—";
      $("#detailSource").textContent=row.dataset.source;
      $("#detailValue").textContent=row.dataset.value;
      $("#detailAssigned").textContent=row.dataset.assigned;
      $("#detailDate").textContent=longDate(row.dataset.date);
      $("#detailActivity").textContent=longDate(row.dataset.date);
      $("#convertLeadName").textContent=row.dataset.name;
      const st=$("#detailStatus");
      st.textContent=row.dataset.status;
      st.className="lead-status "+statusClass(row.dataset.status);
    }

    tbody?.addEventListener("click",(e)=>{
      const row=e.target.closest(".lead-row");
      if(!row) return;
      if(e.target.closest(".row-check")) return;
      if(e.target.closest(".row-more")){
        showToast("Lead actions menu demo.");
        return;
      }
      selectLead(row);
    });

    // Selection / bulk actions
    function updateSelection(){
      const selected=$$(".row-check:checked",tbody).length;
      $("#selectedCount").textContent=selected;
      $("#bulkToolbar")?.classList.toggle("show",selected>0);
      const all=$("#selectAll");
      if(all){
        all.checked=selected>0&&selected===rows().length;
        all.indeterminate=selected>0&&selected<rows().length;
      }
    }
    tbody?.addEventListener("change",(e)=>{if(e.target.classList.contains("row-check")) updateSelection()});
    $("#selectAll")?.addEventListener("change",(e)=>{
      rows().forEach(r=>{ const c=$(".row-check",r); if(!r.classList.contains("hidden-by-search")) c.checked=e.target.checked; });
      updateSelection();
    });
    $("#bulkAssign")?.addEventListener("click",()=>showToast("Bulk assignment demo."));
    $("#bulkDelete")?.addEventListener("click",()=>showToast("Bulk delete demo."));

    // Tabs
    $$(".detail-tabs button").forEach(btn=>btn.addEventListener("click",()=>{
      $$(".detail-tabs button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      $$(".detail-panel").forEach(p=>p.classList.toggle("active",p.dataset.panel===btn.dataset.tab));
    }));
    $("#detailMore")?.addEventListener("click",()=>showToast("More lead actions."));
    $("#editLead")?.addEventListener("click",()=>showToast("Edit Lead demo."));

    // Add dropdown
    $("#addLeadDrop")?.addEventListener("click",(e)=>{
      e.stopPropagation(); $("#addMenu")?.classList.toggle("show");
    });
    $$("#addMenu button").forEach(b=>b.addEventListener("click",()=>{showToast(b.textContent.trim()+" demo.");$("#addMenu").classList.remove("show")}));
    document.addEventListener("click",(e)=>{if(!e.target.closest(".add-lead-wrap")) $("#addMenu")?.classList.remove("show")});

    // Modals
    function openModal(id){
      const modal=$("#"+id); if(!modal) return;
      modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
      const focusable=modal.querySelector("input,select,button"); focusable?.focus();
    }
    function closeModal(id){
      const modal=$("#"+id); if(!modal) return;
      modal.classList.remove("show"); modal.setAttribute("aria-hidden","true");
    }
    $("#addLeadButton")?.addEventListener("click",()=>openModal("addLeadModal"));
    $("#convertLead")?.addEventListener("click",()=>openModal("convertModal"));
    $$("[data-close-modal]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.closeModal)));
    $$(".modal-overlay").forEach(m=>m.addEventListener("click",(e)=>{if(e.target===m) closeModal(m.id)}));
    document.addEventListener("keydown",(e)=>{if(e.key==="Escape") $$(".modal-overlay.show").forEach(m=>closeModal(m.id))});
    $("#confirmConvert")?.addEventListener("click",()=>{
      closeModal("convertModal"); showToast("Lead converted to opportunity.");
    });

    // Add lead demo row
    const sourceClass={"Website":"website","Referral":"referral","Event":"event","Cold Call":"cold-call","LinkedIn":"linkedin"};
    $("#addLeadForm")?.addEventListener("submit",(e)=>{
      e.preventDefault();
      const form=e.currentTarget, data=Object.fromEntries(new FormData(form).entries());
      const save=$("#saveLeadButton"),label=$("b",save);
      save.classList.add("loading"); save.disabled=true; label.textContent="Saving...";
      setTimeout(()=>{
        const tr=document.createElement("tr");
        tr.className="lead-row selected";
        tr.dataset.name=data.name; tr.dataset.company=data.company; tr.dataset.email=data.email; tr.dataset.phone=data.phone;
        tr.dataset.source=data.source; tr.dataset.status=data.status; tr.dataset.value=data.value||"Rp 0"; tr.dataset.assigned=data.assigned;
        tr.dataset.date="16 Sep 2026"; tr.dataset.industry="—";
        const assignedInitials=initials(data.assigned);
        tr.innerHTML=`
          <td class="check-col"><label class="table-check"><input type="checkbox" class="row-check"><span></span></label></td>
          <td class="num-col">1</td>
          <td><button type="button" class="lead-name-button">${escapeHtml(data.name)}</button></td>
          <td>${escapeHtml(data.company)}</td>
          <td class="contact-cell"><span>${escapeHtml(data.email)}</span><small>${escapeHtml(data.phone)}</small></td>
          <td><span class="source-badge ${sourceClass[data.source]||"website"}">${escapeHtml(data.source)}</span></td>
          <td><span class="lead-status ${statusClass(data.status)}">${escapeHtml(data.status)}</span></td>
          <td class="money-cell">${escapeHtml(data.value||"Rp 0")}</td>
          <td><span class="assigned-cell"><i>${assignedInitials}</i>${escapeHtml(data.assigned)}</span></td>
          <td class="date-cell">16 Sep 2026</td>
          <td class="actions-cell"><button type="button" class="table-icon view-lead" aria-label="View lead"><svg><use href="#i-eye"></use></svg></button><button type="button" class="table-icon row-more" aria-label="More actions"><svg><use href="#i-more"></use></svg></button></td>`;
        rows().forEach(r=>r.classList.remove("selected"));
        tbody.prepend(tr);
        // Renumber rows
        rows().forEach((r,i)=>{$(".num-col",r).textContent=i+1});
        selectLead(tr);
        form.reset();
        closeModal("addLeadModal");
        save.classList.remove("loading"); save.disabled=false; label.textContent="Save Lead";
        applyLeadFilters();
        showToast("Lead added successfully.");
      },900);
    });

    function escapeHtml(value){
      return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
    }

    // Pagination demo
    $$(".page-btn").forEach(btn=>btn.addEventListener("click",()=>{
      const page=btn.dataset.page;
      if(["prev","next","last"].includes(page)){showToast("Pagination demo.");return}
      $$(".page-btn").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
      showToast("Showing page "+page+" (demo).");
    }));
    $("#perPage")?.addEventListener("change",(e)=>showToast(`${e.target.value} rows per page selected.`));

    applyLeadFilters();
  }

  // COMING SOON pages share shell behavior.
  if(document.body.classList.contains("coming-soon-page")){
    $("#comingBack")?.addEventListener("click",()=>window.location.href="leads.html");
  }
})();
