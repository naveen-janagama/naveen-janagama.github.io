/* =========================================================
   Naveen Reddy Janagama — Portfolio interactions
   ========================================================= */

// ---------- Loading screen ----------
window.addEventListener('load', () => {
   setTimeout(() => document.getElementById('loadingScreen')?.classList.add('hidden'), 600);
});

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
   const y = document.getElementById('year'); if (y) y.textContent = '2026';
   renderTechnologies();
   renderTimeline();
   renderResponsibilities();
   renderProjects();
   initNav();
   initGallery();
   initLightbox();
   initContactForm();
   initMobileNav();
   initVisitCounter();
});

/* =========================================================
   VISIT COUNTER (free hosted counter API)
   ========================================================= */
function initVisitCounter() {
   const el = document.getElementById('visitCount');
   if (!el) return;
   const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));
   // increment once per browser session, otherwise just read the total
   const bumped = sessionStorage.getItem('nrj_visit_bumped') === '1';
   const url = bumped
      ? 'https://api.counterapi.dev/v1/naveenreddyjanagama/site-visits'
      : 'https://api.counterapi.dev/v1/naveenreddyjanagama/site-visits/up';
   fetch(url, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { const n = d.count ?? d.value ?? 0; el.textContent = fmt(n); sessionStorage.setItem('nrj_visit_bumped', '1'); })
      .catch(() => { el.textContent = '—'; });
}

/* =========================================================
   DATA
   ========================================================= */
const TECH_CATEGORIES = [
   { key: 'cloud', title: 'Cloud Platforms', icon: 'fa-cloud', items: [
      ['aws.svg','AWS'],['azure.png','Microsoft Azure'],['vmss.png','EC2 / Azure VMs'],
      ['storage.png','S3 / Blob Storage'],['azure-networking.png','Route 53 / DNS'],['migrate.png','Cloud Migration'] ] },
   { key: 'devops', title: 'DevOps &amp; CI/CD', icon: 'fa-infinity', items: [
      ['github-actions.png','GitHub Actions'],['octopus.png','Octopus Deploy'],['jira.png','Jenkins'],
      ['cicd.png','Release Mgmt'],['git.svg','Git'],['github.png','GitHub'] ] },
   { key: 'containers', title: 'Containers &amp; Kubernetes', icon: 'fa-cubes', items: [
      ['docker.png','Docker'],['aks.png','AKS'],['kubernetes.png','Kubernetes (EKS)'],['containerization.png','Containerization'] ] },
   { key: 'iac', title: 'Infrastructure as Code', icon: 'fa-code', items: [
      ['terraform.png','Terraform'],['chef.svg','Chef'],['config.png','Config Mgmt'],['powershell.png','PowerShell'],['runbooks.png','Runbook Automation'] ] },
   { key: 'monitoring', title: 'Monitoring &amp; Observability', icon: 'fa-chart-line', items: [
      ['splunk.png','Splunk'],['dynatrace.png','Dynatrace'],['monitoring.png','AppDynamics'],
      ['azure-monitor.png','CloudWatch'],['Grafana.png','Grafana'],['loganalytics.png','SolarWinds'] ] },
   { key: 'platform', title: 'Platform, Data &amp; Network', icon: 'fa-server', items: [
      ['iis.png','IIS'],['appservice.png','IBM WebSphere'],['ngnix.png','F5 BIG-IP'],
      ['sql.png','SQL Server'],['postgres_sql.png','MySQL'],['cosmos_db.png','Oracle'],['networking-security.png','Security'] ] },
   { key: 'itsm', title: 'ITSM &amp; Reliability', icon: 'fa-shield-halved', items: [
      ['servicenow.png','ServiceNow'],['bmc.png','BMC Remedy'],['incident.png','Incident Mgmt'],['scalability.png','DR &amp; Resiliency'],['keyvault.png','SSL / Certs'] ] },
   { key: 'ai', title: 'AI Tools', icon: 'fa-robot', items: [
      ['chatops.png','GitHub Copilot'],['aiops.png','Claude / AI Assist'] ] },
];

const TIMELINE = [
   { logo:'commbank.png', role:'SRE, DevOps &amp; Platform Engineer', org:'Commonwealth Bank — CommBiz (Australia)', domain:'Banking', date:'Jan 2022 – Present', current:true,
     bullets:[
      'Coordinate production releases using Octopus Deploy, ACDC, and ServiceNow change records with controlled implementation and rollback plans.',
      'Support AWS migration, cloud operations, and platform reliability for business-critical banking services.',
      'Build monitoring coverage with Splunk and AppDynamics — dashboards, alerts, and log analysis.',
      'Lead incident triage, smoke and resiliency testing, RCA support, and SLA-driven recovery for 24×7 operations.'],
     tech:['AWS','Octopus Deploy','ServiceNow','Splunk','AppDynamics','Akamai'] },
   { logo:'fis.png', role:'Service Delivery Analyst / SRE', org:'FIS Global — Express SRO (USA)', domain:'Financial Services', date:'Aug 2021 – Dec 2021',
     bullets:[
      'Deployed and supported applications across Azure Cloud environments for global payment processing.',
      'Monitored millions of ATM / POS / online transactions per hour; analyzed failed and fraud-related records.',
      'Engineered proactive alerts with Azure Monitor and Dynatrace; handled high-priority incidents and DB support.'],
     tech:['Microsoft Azure','Azure Monitor','Dynatrace','SQL Server'] },
   { logo:'eurofins.png', role:'Senior Product Specialist / SRE', org:'Eurofins IT Solutions (USA)', domain:'E-commerce', date:'Sep 2018 – Aug 2021',
     bullets:[
      'Managed application hosting and support on IIS and IBM WebSphere.',
      'Ran production deployments using Jenkins, Chef, and Octopus with standardized release processes.',
      'Provisioned and supported Azure VMs, cloud services, and MySQL databases; authored PowerShell automation.'],
     tech:['IIS','IBM WebSphere','Jenkins','Chef','Azure VMs','MySQL','PowerShell'] },
   { logo:'ironmountain.png', role:'System Engineer — Application Management', org:'Iron Mountain (USA)', domain:'Information Storage', date:'Feb 2016 – Sep 2018',
     bullets:[
      'Supported the Hosted Accutrac ordering platform and GroupTrak (GTx) fulfillment product.',
      'Handled application operations, deployments, and production support across hosted services.'],
     tech:['Windows Server','IIS','Production Ops'] },
   { logo:'jntu.png', role:'Bachelor of Technology', org:'JNTU, Hyderabad, India', domain:'Education', date:'2010', edu:true,
     bullets:['Academic foundation that launched my career in infrastructure, cloud operations, DevOps, and site reliability engineering.'],
     tech:[] },
];

const RESPONSIBILITIES = [
   ['fa-shield-heart','Site Reliability Engineering','Own SLO/SLI/SLA, error budgets, incident and problem management, RCA, and 24×7 production reliability.'],
   ['fa-layer-group','Platform Engineering','Build self-service, automation-first internal platforms that accelerate safe, repeatable software delivery.'],
   ['fa-sitemap','Cloud Architecture','Design secure, highly available, cost-aware architectures on AWS and Azure for enterprise workloads.'],
   ['fa-cloud','Multi-Cloud Infrastructure','Provision and operate workloads across AWS and Microsoft Azure with consistent guardrails.'],
   ['fa-dharmachakra','Kubernetes · AKS · EKS','Administer clusters, orchestration, scaling, and reliability across managed Kubernetes.'],
   ['fa-docker','Docker &amp; Containerization','Containerize workloads and standardize portable, scalable cloud-native deployments.'],
   ['fa-robot','Infrastructure Automation','Eliminate toil with Terraform, Chef, PowerShell, and runbook automation.'],
   ['fa-code-branch','GitHub Actions &amp; CI/CD','Design enterprise pipelines with GitHub Actions, Jenkins, and Octopus Deploy.'],
   ['fa-cubes-stacked','Infrastructure as Code','Version-controlled, reusable, repeatable infrastructure with Terraform and Chef.'],
   ['fa-rocket','Release Management','Controlled releases, change management, smoke testing, and rollback safety.'],
   ['fa-triangle-exclamation','Incident Management','Rapid triage, mitigation, communication, and SLA-driven recovery.'],
   ['fa-headset','Production Support','24×7 mission-critical support for high-availability, zero-downtime platforms.'],
   ['fa-chart-line','Observability &amp; Monitoring','End-to-end visibility with Splunk, AppDynamics, Dynatrace, CloudWatch, and Grafana.'],
   ['fa-brain','AI Enablement','AI-driven operational insights and AI-assisted diagnostics, scripting, and workflows.'],
   ['fa-gears','Enterprise Automation','Self-service capabilities and automation that improve operational efficiency at scale.'],
];

const PROJECTS = [
   { name:'CommBiz Online Banking Platform', date:'2022 – Present', org:'Commonwealth Bank of Australia · Banking', role:'Site Reliability / DevOps &amp; Deployment Engineer',
     desc:'A secure online banking platform enabling Australian businesses to manage payments, global trade, investments, balances, and transaction history across web, iOS, and Android.',
     bullets:['Owned end-to-end production releases via Octopus Deploy, ACDC, and ServiceNow with rollback plans.','Drove AWS migration and cloud operations while safeguarding application stability.','Built observability with Splunk and AppDynamics; ran incident triage, RCA, and SLA-driven recovery.'],
     tags:['AWS','Octopus Deploy','ServiceNow','Splunk','AppDynamics','Akamai'] },
   { name:'Express SRO — Payments Monitoring', date:'2021', org:'FIS Global · Financial Services', role:'Service Delivery Analyst / SRE',
     desc:'A high-throughput transaction monitoring platform processing millions of ATM, POS, and online payment-gateway records per hour worldwide — surfacing failed and fraudulent transactions.',
     bullets:['Deployed and supported applications across Azure Cloud environments.','Engineered proactive alerts with Azure Monitor and Dynatrace.','Handled high-priority incidents, deep log analysis, SQL jobs, and DB support under strict SLAs.'],
     tags:['Microsoft Azure','Azure Monitor','Dynatrace','SQL Server','Incident Mgmt'] },
   { name:'EOL — Eurofins Online', date:'2018 – 2021', org:'Eurofins IT Solutions · E-commerce', role:'Senior Product Specialist / SRE',
     desc:'A customer-facing web application used by Eurofins laboratories to capture sample details, process test orders, and deliver results.',
     bullets:['Managed application hosting on IIS and IBM WebSphere.','Delivered production deployments with Jenkins, Chef, and Octopus.','Provisioned Azure VMs, cloud services, and MySQL; authored PowerShell automation.'],
     tags:['IIS','IBM WebSphere','Jenkins','Chef','Azure VMs','MySQL','PowerShell'] },
   { name:'OSO — Off-Site Operations', date:'2018 – 2021', org:'Eurofins IT Solutions · E-commerce', role:'Site Reliability / Deployment Engineer',
     desc:'An operations platform supporting the physical locations where technicians perform sample collection — keeping regional applications, scheduled jobs, and data flows reliable.',
     bullets:['Created and supported Azure VMs, cloud services, and MySQL databases.','Monitored task-scheduler jobs, server logs, and weekly audit checklists.','Managed Octopus builds, deployments, and configuration across environments.'],
     tags:['Azure VMs','Octopus Deploy','IIS','MySQL','Config Mgmt'] },
   { name:'Hosted Accutrac', date:'2016 – 2018', org:'Iron Mountain · Information Storage', role:'System Engineer — Application Management',
     desc:'A hosted platform enabling customers to place orders for items stored in Iron Mountain data centers, with full reporting and tracking.',
     bullets:['Supported the ordering platform and its reporting and tracking capabilities.','Handled application operations, deployments, and production support.','Coordinated troubleshooting and service restoration for a business-critical system.'],
     tags:['Windows Server','IIS','Application Support','Production Ops'] },
   { name:'GroupTrak (GTx)', date:'2016 – 2018', org:'Iron Mountain Fulfillment Services (IMFS)', role:'System Engineer — Application Management',
     desc:'A marketing inventory fulfillment product with a web interface (GTx) on top of the GTi back-end system — managing inventory and fulfillment workflows.',
     bullets:['Supported the GTx web interface and its integration with the GTi back-end engine.','Managed deployments and configuration for a multi-tier fulfillment application.','Delivered ongoing application operations and production support.'],
     tags:['Windows Server','IIS','Deployments','Fulfillment Systems'] },
];

/* =========================================================
   RENDERERS
   ========================================================= */
function renderTechnologies() {
   const wrap = document.getElementById('techCategories'); if (!wrap) return;
   wrap.innerHTML = TECH_CATEGORIES.map(cat => `
      <div class="tech-cat">
         <div class="tech-cat-head"><span class="tech-cat-ico"><i class="fa-solid ${cat.icon}"></i></span><h3>${cat.title}</h3></div>
         <div class="tech-cat-items">
            ${cat.items.map(([img,name]) => `
               <div class="tech-chip" title="${name.replace(/&amp;/g,'&')}">
                  <img src="images/tech/${img}" alt="${name}" loading="lazy">
                  <span>${name}</span>
               </div>`).join('')}
         </div>
      </div>`).join('');
}

function renderTimeline() {
   const wrap = document.getElementById('timeline'); if (!wrap) return;
   wrap.innerHTML = TIMELINE.map(t => `
      <div class="tl-item${t.current ? ' current' : ''}${t.edu ? ' edu' : ''}">
         <div class="tl-marker"><img src="images/companies/${t.logo}" alt="" loading="lazy"></div>
         <div class="tl-card">
            <div class="tl-top">
               <div><h3>${t.role}</h3><p class="tl-org">${t.org}</p></div>
               <span class="tl-date">${t.date}</span>
            </div>
            <span class="tl-domain">${t.domain}</span>
            <ul class="tl-bullets">${t.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
            ${t.tech.length ? `<div class="tl-tags">${t.tech.map(x => `<span>${x}</span>`).join('')}</div>` : ''}
         </div>
      </div>`).join('');
}

function renderResponsibilities() {
   const wrap = document.getElementById('respGrid'); if (!wrap) return;
   wrap.innerHTML = RESPONSIBILITIES.map(([ico,title,desc]) => `
      <div class="resp-card">
         <div class="resp-ico"><i class="fa-solid ${ico}"></i></div>
         <h3>${title}</h3>
         <p>${desc}</p>
      </div>`).join('');
}

function renderProjects() {
   const wrap = document.getElementById('projectsGrid'); if (!wrap) return;
   wrap.innerHTML = PROJECTS.map(p => `
      <article class="project-card">
         <div class="project-card-head">
            <h3>${p.name}</h3>
            <span class="project-date">${p.date}</span>
         </div>
         <p class="project-org">${p.org} · <span>${p.role}</span></p>
         <p class="project-desc">${p.desc}</p>
         <ul class="project-bullets">${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
         <div class="project-tags">${p.tags.map(x => `<span class="project-tag">${x}</span>`).join('')}</div>
      </article>`).join('');
}

/* =========================================================
   NAVIGATION — click to load section (no scrolling)
   ========================================================= */
function initNav() {
   const navLinks = Array.from(document.querySelectorAll('.sidebar-nav .nav-item[href^="#"]'));
   const sections = Array.from(document.querySelectorAll('.section'));

   function showSection(id) {
      const target = document.getElementById(id);
      if (!target) return;
      sections.forEach(s => s.classList.toggle('active', s === target));
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      const panel = document.getElementById('mainPanel');
      if (panel) panel.scrollTop = 0;
      history.replaceState(null, '', '#' + id);
      document.body.classList.remove('nav-open');
      if (id === 'introduction') animateStats();
   }

   navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
         e.preventDefault();
         showSection(link.getAttribute('href').slice(1));
      });
   });

   // expose for in-page CTA buttons
   window.goToSection = showSection;

   // default / deep-link
   const hash = (location.hash || '').replace('#', '');
   const valid = navLinks.some(l => l.getAttribute('href') === '#' + hash);
   showSection(valid ? hash : 'home');
}

/* =========================================================
   STATS COUNTER
   ========================================================= */
function animateStats() {
   document.querySelectorAll('.metric-value[data-target]').forEach((el, i) => {
      if (el.dataset.done === '1') return;
      el.dataset.done = '1';
      const target = parseInt(el.dataset.target, 10);
      let cur = 0; const step = Math.max(1, target / 40);
      setTimeout(() => {
         const t = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            el.textContent = Math.floor(cur);
         }, 30);
      }, i * 150);
   });
}

/* =========================================================
   GALLERY — role-based CSV login + categories + uploads
   Roles: admin (view + upload + delete + download + category CRUD)
          user  (view + download only)
   ========================================================= */
const GALLERY_CSV = 'gallery-credentials.csv';
const GALLERY_MANIFEST = 'gallery/manifest.json';
const GALLERY_AUTH_KEY = 'nrj_gallery_auth_v3';     // stores {user, role}
const GALLERY_UPLOAD_KEY = 'nrj_gallery_uploads_v2';  // {catId: [{id,name,data}]}
const GALLERY_CUSTOMCAT_KEY = 'nrj_gallery_customcats_v1'; // [{id,label}]
let GALLERY_MODEL = { categories: [] };
let GALLERY_ACTIVE_CAT = null;
let GALLERY_ROLE = 'user';
let GALLERY_USERNAME = '';
let GALLERY_NAME = '';

async function initGallery() {
   const gate = document.getElementById('galleryGate');
   const dash = document.getElementById('galleryDashboard');
   const loginForm = document.getElementById('galleryLoginForm');
   const errEl = document.getElementById('gateError');
   if (!gate || !dash || !loginForm) return;

   // Load category manifest (repo folders)
   try {
      const res = await fetch(GALLERY_MANIFEST, { cache: 'no-store' });
      if (res.ok) GALLERY_MODEL = await res.json();
   } catch (e) { console.warn('gallery manifest load failed', e); }

   const showDash = (yes) => { gate.hidden = yes; dash.hidden = !yes; if (yes) { applyRoleUI(); renderGalleryDashboard(); } };

   // restore session
   try {
      const saved = JSON.parse(sessionStorage.getItem(GALLERY_AUTH_KEY) || 'null');
      if (saved && saved.user) { GALLERY_USERNAME = saved.user; GALLERY_ROLE = saved.role || 'user'; GALLERY_NAME = saved.name || saved.user; showDash(true); }
   } catch {}

   loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('galUser').value.trim();
      const p = document.getElementById('galPass').value;
      const match = await validateCsvLogin(u, p);
      if (match) {
         GALLERY_USERNAME = match.user; GALLERY_ROLE = match.role; GALLERY_NAME = match.name || match.user;
         sessionStorage.setItem(GALLERY_AUTH_KEY, JSON.stringify({ user: match.user, role: match.role, name: match.name }));
         errEl.hidden = true; loginForm.reset(); showDash(true);
      } else { errEl.hidden = false; }
   });

   document.getElementById('galLogout')?.addEventListener('click', () => {
      sessionStorage.removeItem(GALLERY_AUTH_KEY); GALLERY_ROLE = 'user'; GALLERY_USERNAME = ''; GALLERY_NAME = ''; showDash(false);
   });

   // Upload (admin only — guarded)
   document.getElementById('galUpload')?.addEventListener('change', (e) => {
      if (GALLERY_ROLE !== 'admin') return;
      const files = Array.from(e.target.files || []);
      if (!files.length || !GALLERY_ACTIVE_CAT) return;
      const store = getUploads();
      store[GALLERY_ACTIVE_CAT] = store[GALLERY_ACTIVE_CAT] || [];
      let pending = files.length;
      files.forEach(file => {
         const reader = new FileReader();
         reader.onload = () => {
            store[GALLERY_ACTIVE_CAT].push({ id:'u_'+Math.random().toString(36).slice(2), name:file.name, data:reader.result });
            if (--pending === 0) { setUploads(store); renderGalleryDashboard(); }
         };
         reader.readAsDataURL(file);
      });
      e.target.value = '';
   });

   // Bulk delete selected images (admin only)
   document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
      if (GALLERY_ROLE !== 'admin') return;
      const ids = selectedUploadIds();
      if (!ids.length) return;
      if (!confirm(`Delete ${ids.length} selected image(s)?`)) return;
      const store = getUploads();
      store[GALLERY_ACTIVE_CAT] = (store[GALLERY_ACTIVE_CAT] || []).filter(i => !ids.includes(i.id));
      setUploads(store); renderGalleryDashboard();
   });

   // Category management (admin only)
   const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
   document.getElementById('addCatBtn')?.addEventListener('click', () => {
      if (GALLERY_ROLE !== 'admin') return;
      const nameEl = document.getElementById('newCatName');
      const label = nameEl.value.trim();
      if (!label) return;
      const id = slug(label);
      if (!id) return;
      if (allCategories().some(c => c.id === id)) { alert('A category with that name already exists.'); return; }
      const cats = getCustomCats(); cats.push({ id, label }); setCustomCats(cats);
      nameEl.value = ''; GALLERY_ACTIVE_CAT = id; renderGalleryDashboard();
   });
   document.getElementById('renameCatBtn')?.addEventListener('click', () => {
      if (GALLERY_ROLE !== 'admin') return;
      const cats = getCustomCats();
      const cur = cats.find(c => c.id === GALLERY_ACTIVE_CAT);
      if (!cur) { alert('Only admin-created categories can be renamed. Repo categories are fixed.'); return; }
      const label = prompt('Rename category:', cur.label);
      if (label && label.trim()) { cur.label = label.trim(); setCustomCats(cats); renderGalleryDashboard(); }
   });
   document.getElementById('deleteCatBtn')?.addEventListener('click', () => {
      if (GALLERY_ROLE !== 'admin') return;
      const cats = getCustomCats();
      if (!cats.some(c => c.id === GALLERY_ACTIVE_CAT)) { alert('Only admin-created categories can be deleted. Repo categories are fixed.'); return; }
      if (!confirm('Delete this category and its uploaded images?')) return;
      setCustomCats(cats.filter(c => c.id !== GALLERY_ACTIVE_CAT));
      const ups = getUploads(); delete ups[GALLERY_ACTIVE_CAT]; setUploads(ups);
      GALLERY_ACTIVE_CAT = null; renderGalleryDashboard();
   });
}

// Returns {user, role} on success, or null
async function validateCsvLogin(user, pass) {
   try {
      const res = await fetch(GALLERY_CSV, { cache: 'no-store' });
      if (!res.ok) return null;
      const text = await res.text();
      const rows = text.trim().split(/\r?\n/).slice(1); // skip header
      for (const row of rows) {
         const [u, p, role, name] = row.split(',').map(s => (s || '').trim());
         if (u === user && p === pass) return { user: u, role: (role === 'admin' ? 'admin' : 'user'), name: name || u };
      }
      return null;
   } catch (e) { return null; }
}

function getUploads() { try { return JSON.parse(localStorage.getItem(GALLERY_UPLOAD_KEY)) || {}; } catch { return {}; } }
function setUploads(obj) { try { localStorage.setItem(GALLERY_UPLOAD_KEY, JSON.stringify(obj)); } catch { alert('Browser storage limit reached — try fewer / smaller images.'); } }
function getCustomCats() { try { return JSON.parse(localStorage.getItem(GALLERY_CUSTOMCAT_KEY)) || []; } catch { return []; } }
function setCustomCats(arr) { try { localStorage.setItem(GALLERY_CUSTOMCAT_KEY, JSON.stringify(arr)); } catch {} }

// merged categories: repo (from manifest) + admin custom (browser)
function allCategories() {
   const repo = (GALLERY_MODEL.categories || []).map(c => ({ id: c.id, label: c.label, images: c.images || [], repo: true }));
   const custom = getCustomCats().map(c => ({ id: c.id, label: c.label, images: [], repo: false }));
   return [...repo, ...custom];
}

// Show/hide admin-only controls based on role
function applyRoleUI() {
   const isAdmin = GALLERY_ROLE === 'admin';
   document.querySelectorAll('.admin-only').forEach(el => { el.style.display = isAdmin ? '' : 'none'; });
   const nameEl = document.getElementById('dashUser'); if (nameEl) nameEl.textContent = GALLERY_NAME || GALLERY_USERNAME || (isAdmin ? 'Administrator' : 'User');
   const roleEl = document.getElementById('dashRole');
   if (roleEl) { roleEl.textContent = isAdmin ? 'admin' : 'user'; roleEl.className = 'role-badge ' + (isAdmin ? 'admin' : 'user'); }
}

function renderGalleryDashboard() {
   const tabsEl = document.getElementById('galleryTabs');
   const gridEl = document.getElementById('galleryManageGrid');
   const emptyEl = document.getElementById('galleryEmpty');
   if (!tabsEl || !gridEl) return;

   const cats = allCategories();
   if (!cats.some(c => c.id === GALLERY_ACTIVE_CAT)) GALLERY_ACTIVE_CAT = cats[0]?.id || null;

   // Category tabs
   tabsEl.innerHTML = cats.map(c =>
      `<button class="gal-tab${c.id === GALLERY_ACTIVE_CAT ? ' active' : ''}" data-cat="${c.id}">
         <i class="fa-solid ${c.repo ? 'fa-folder' : 'fa-folder-plus'}"></i> ${c.label}
       </button>`).join('');
   tabsEl.querySelectorAll('.gal-tab').forEach(btn => btn.addEventListener('click', () => {
      GALLERY_ACTIVE_CAT = btn.dataset.cat; renderGalleryDashboard();
   }));

   const cat = cats.find(c => c.id === GALLERY_ACTIVE_CAT);
   const repoImgs = cat && cat.repo ? cat.images.map(im => ({
      src: `gallery/${cat.id}/${im.file}`, caption: im.caption || im.file, repo: true
   })) : [];
   const uploads = (getUploads()[GALLERY_ACTIVE_CAT] || []).map(u => ({ src: u.data, caption: u.name, repo: false, id: u.id }));
   const all = [...repoImgs, ...uploads];
   const isAdmin = GALLERY_ROLE === 'admin';

   emptyEl.hidden = all.length > 0;
   gridEl.innerHTML = all.map((img, idx) => `
      <figure class="g-thumb${img.repo ? '' : ' selectable'}" data-idx="${idx}">
         ${(isAdmin && !img.repo) ? `<label class="g-check" title="Select"><input type="checkbox" class="g-select" data-id="${img.id}"><span></span></label>` : ''}
         <img src="${img.src}" alt="${img.caption}" loading="lazy">
         <figcaption>${img.caption}</figcaption>
         <div class="g-actions">
            <a class="g-icon g-download" href="${img.src}" download="${img.caption}" title="Download" aria-label="Download image"><i class="fa-solid fa-download"></i></a>
            ${(isAdmin && !img.repo) ? `<button class="g-icon g-del" data-id="${img.id}" title="Delete" aria-label="Delete image"><i class="fa-solid fa-trash-can"></i></button>` : ''}
         </div>
         ${img.repo ? '<span class="g-badge">repo</span>' : ''}
      </figure>`).join('');

   // download click shouldn't open lightbox
   gridEl.querySelectorAll('.g-download').forEach(a => a.addEventListener('click', e => e.stopPropagation()));

   // single delete (admin, browser uploads only)
   gridEl.querySelectorAll('.g-del').forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteUpload(btn.dataset.id);
   }));

   // checkbox selection (admin) — toggle bulk-delete bar
   gridEl.querySelectorAll('.g-select').forEach(cb => {
      cb.addEventListener('click', e => e.stopPropagation());
      cb.addEventListener('change', updateBulkBar);
   });
   updateBulkBar();

   // open lightbox (all roles) — pass full image context for download/delete
   gridEl.querySelectorAll('.g-thumb').forEach((fig, i) => fig.addEventListener('click', (e) => {
      if (e.target.closest('.g-check') || e.target.closest('.g-actions')) return;
      openLightbox(all[i]);
   }));
}

// Bulk-delete bar: enabled only when >=1 uploaded image is selected
function selectedUploadIds() {
   return Array.from(document.querySelectorAll('.g-select:checked')).map(cb => cb.dataset.id);
}
function updateBulkBar() {
   const bar = document.getElementById('bulkBar');
   const btn = document.getElementById('bulkDeleteBtn');
   const countEl = document.getElementById('bulkCount');
   if (!bar || !btn) return;
   const ids = selectedUploadIds();
   const any = ids.length > 0;
   bar.classList.toggle('active', any);
   btn.disabled = !any;
   if (countEl) countEl.textContent = ids.length;
}

// Delete an uploaded image by id from the active category, then refresh views
function deleteUpload(id) {
   if (GALLERY_ROLE !== 'admin') return;
   const store = getUploads();
   store[GALLERY_ACTIVE_CAT] = (store[GALLERY_ACTIVE_CAT] || []).filter(i => i.id !== id);
   setUploads(store);
   renderGalleryDashboard();
}

/* =========================================================
   LIGHTBOX (click thumbnail -> full image)
   ========================================================= */
let LB_CURRENT = null;  // currently viewed image {src, caption, repo, id}
function initLightbox() {
   const lb = document.getElementById('lightbox');
   if (!lb) return;
   // close on backdrop / close button (but not when clicking the image or toolbar)
   lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-close')) closeLightbox(); });
   document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
   // delete from within the lightbox (admin, uploaded images only)
   document.getElementById('lbDelete')?.addEventListener('click', () => {
      if (!LB_CURRENT || GALLERY_ROLE !== 'admin' || LB_CURRENT.repo) return;
      if (!confirm('Delete this image?')) return;
      deleteUpload(LB_CURRENT.id);
      closeLightbox();
   });
}
// accepts an image object {src, caption, repo, id}
function openLightbox(img) {
   const lb = document.getElementById('lightbox'); if (!lb || !img) return;
   LB_CURRENT = img;
   lb.querySelector('.lb-img').src = img.src;
   lb.querySelector('.lb-caption').textContent = img.caption || '';
   const dl = document.getElementById('lbDownload');
   if (dl) { dl.href = img.src; dl.setAttribute('download', img.caption || 'image'); }
   // delete button: only for admin AND non-repo (uploaded) images
   const del = document.getElementById('lbDelete');
   if (del) del.style.display = (GALLERY_ROLE === 'admin' && !img.repo) ? '' : 'none';
   lb.classList.add('open');
}
function closeLightbox() { document.getElementById('lightbox')?.classList.remove('open'); LB_CURRENT = null; }

/* =========================================================
   CONTACT FORM VALIDATION
   ========================================================= */
function initContactForm() {
   const form = document.getElementById('contactForm'); if (!form) return;
   const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const validateField = (field) => {
      const wrap = field.closest('.form-group');
      const err = wrap.querySelector('.field-error');
      let msg = '';
      const v = field.value.trim();
      if (!v) msg = 'This field is required.';
      else if (field.type === 'email' && !emailRe.test(v)) msg = 'Enter a valid email address.';
      else if (field.name === 'message' && v.length < 10) msg = 'Please write at least 10 characters.';
      err.textContent = msg;
      wrap.classList.toggle('invalid', !!msg);
      return !msg;
   };

   form.querySelectorAll('input, textarea').forEach(f => {
      f.addEventListener('blur', () => validateField(f));
      f.addEventListener('input', () => { if (f.closest('.form-group').classList.contains('invalid')) validateField(f); });
   });

   form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = Array.from(form.querySelectorAll('input, textarea'));
      const ok = fields.map(validateField).every(Boolean);
      if (!ok) { form.querySelector('.form-group.invalid input, .form-group.invalid textarea')?.focus(); return; }

      const btn = form.querySelector('.submit-btn');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';

      const endpoint = form.getAttribute('action');
      try {
         const res = await fetch(endpoint, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
         });
         if (res.ok) {
            btn.innerHTML = '<span>✓ Message Sent!</span>';
            btn.classList.add('sent');
            form.reset();
         } else {
            const data = await res.json().catch(() => ({}));
            const msg = data?.errors?.map(x => x.message).join(', ') || 'Something went wrong. Please try again.';
            btn.innerHTML = '<span>⚠ ' + msg + '</span>';
            btn.classList.add('error');
         }
      } catch (err) {
         btn.innerHTML = '<span>⚠ Network error — please email me directly.</span>';
         btn.classList.add('error');
      }
      setTimeout(() => { btn.innerHTML = original; btn.classList.remove('sent', 'error'); btn.disabled = false; }, 3500);
   });
}

/* =========================================================
   MOBILE NAV TOGGLE
   ========================================================= */
function initMobileNav() {
   document.getElementById('navToggle')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
}
