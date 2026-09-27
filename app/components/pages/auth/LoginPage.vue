<script setup lang="ts">
const router=useRouter(); const {showToast}=useToast(); const loading=ref(false)
onMounted(()=>{
 const q=(s:string)=>document.querySelector(s) as HTMLElement|null
 const pass=q('#password') as HTMLInputElement|null; q('#passwordToggle')?.addEventListener('click',()=>{if(pass)pass.type=pass.type==='password'?'text':'password'})
 const lang=q('#langMenu'); q('#langButton')?.addEventListener('click',(e)=>{e.stopPropagation();lang?.classList.toggle('show')})
 document.querySelectorAll('#langMenu button').forEach(b=>b.addEventListener('click',()=>{const label=q('#languageLabel');if(label)label.textContent=(b as HTMLElement).dataset.lang||'';lang?.classList.remove('show')}))
 q('#forgotPassword')?.addEventListener('click',()=>showToast('Password recovery demo.'));q('#microsoftButton')?.addEventListener('click',()=>showToast('Microsoft 365 sign-in demo.'));q('#contactAdmin')?.addEventListener('click',()=>showToast('Please contact your SOP administrator.'))
 const form=q('#loginForm') as HTMLFormElement|null; form?.addEventListener('submit',async(e)=>{e.preventDefault();loading.value=true;try{await $fetch('/api/auth/login',{method:'POST',body:{email:(q('#email') as HTMLInputElement)?.value,password:pass?.value}})}catch{/* demo auth accepts any non-empty credentials */}setTimeout(()=>router.push('/dashboard'),500)})
})
useHead({title:'SOP — Sign In',bodyAttrs:{class:'login-page'}})
</script><template><div><svg aria-hidden="true" class="svg-sprite">
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
<main class="login-shell">
<section aria-label="SOP product overview" class="login-visual"></section>
<section class="login-side">
<header class="login-topbar">
<div class="product-of"><span>A Product of</span><span class="mini-s">S</span><span>PT Sinergi Bisnis Indonesia</span></div>
<div class="language">
<button aria-expanded="false" class="lang-button" id="langButton" type="button">
<span class="globe-icon">◎</span><span id="languageLabel">English</span><svg><use href="#i-down"></use></svg>
</button>
<div class="lang-menu" id="langMenu">
<button data-lang="English" type="button">English</button>
<button data-lang="Bahasa Indonesia" type="button">Bahasa Indonesia</button>
</div>
</div>
</header>
<div class="mobile-login-logo">
<div class="sop-logo"><span>S</span><i></i><span>P</span></div>
</div>
<form class="login-card" id="loginForm">
<div class="login-brand">
<div class="sop-logo large"><span>S</span><i></i><span>P</span></div>
<div class="platform-name">Sinergi Operational Platform</div>
</div>
<h1>Sign In to SOP</h1>
<p class="login-subtitle">Access your account to continue</p>
<label class="field-label" for="email">Email Address</label>
<div class="login-input">
<svg><use href="#i-file"></use></svg>
<input autocomplete="email" id="email" placeholder="yourname@company.com" type="email"/>
</div>
<label class="field-label" for="password">Password</label>
<div class="login-input">
<svg><use href="#i-settings"></use></svg>
<input autocomplete="current-password" id="password" placeholder="Enter your password" type="password"/>
<button aria-label="Show password" class="password-toggle" id="passwordToggle" type="button">◉</button>
</div>
<div class="remember-row">
<label class="remember"><input checked="" type="checkbox"/><span></span>Remember me</label>
<button class="text-link" id="forgotPassword" type="button">Forgot password?</button>
</div>
<button class="signin-button" id="signinButton" type="submit"><span class="loader"></span><b>Sign In</b><span class="signin-arrow">→</span></button>
<div class="or-divider"><span>or</span></div>
<button class="microsoft-button" id="microsoftButton" type="button">
<span class="ms-mark"><i></i><i></i><i></i><i></i></span>Sign in with Microsoft 365
      </button>
<p class="account-help">Don't have an account? <button class="text-link" id="contactAdmin" type="button">Contact Administrator</button></p>
</form>
<footer class="login-footer">
<span>© 2026 PT Sinergi Bisnis Indonesia. All rights reserved.</span>
<div><strong>Stronger Operations<br/>For a Sustainable Tomorrow</strong><i></i></div>
</footer>
</section>
</main>
<div class="toast" id="toast" role="status"></div></div></template>