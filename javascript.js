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
   // Increment once per calendar day using localStorage (survives refresh/tab reopen).
   // On same day after first visit, just read the current total without incrementing.
   const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
   const lastVisit = localStorage.getItem('nrj_visit_date');
   const alreadyCountedToday = lastVisit === today;
   const url = alreadyCountedToday
      ? 'https://api.counterapi.dev/v1/naveenreddyjanagama/site-visits'
      : 'https://api.counterapi.dev/v1/naveenreddyjanagama/site-visits/up';
   fetch(url, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
         const n = d.count ?? d.value ?? d.hits ?? d.total ?? 0;
         el.textContent = fmt(n);
         if (!alreadyCountedToday) localStorage.setItem('nrj_visit_date', today);
      })
      .catch(() => { el.textContent = '—'; });
}

/* =========================================================
   DATA
   ========================================================= */
const TECH_CATEGORIES = [
   { key: 'cloud', title: 'Cloud Platforms', icon: 'fa-cloud', items: [
      ['aws.svg','AWS'],['azure.png','Microsoft Azure'],['vmss.png','EC2 / Azure VMs'],
      ['storage.png','S3 / Blob Storage'],['azure-networking.png','Route 53 / DNS'],
      ['migrate.png','Cloud Migration'],['azure-networking.png','Auto Scaling'],
      ['config.png','Cloud Formation'],['migrate.png','Multi-Cloud Ops'] ] },
   { key: 'devops', title: 'DevOps &amp; CI/CD', icon: 'fa-infinity', items: [
      ['github-actions.png','GitHub Actions'],['octopus.png','Octopus Deploy'],['jira.png','Jenkins'],
      ['cicd.png','Release Management'],['git.svg','Git'],['github.png','GitHub'],
      ['cicd.png','Deployment Pipelines'],['cicd.png','Blue-Green Deploy'],
      ['cicd.png','Auto Rollback'],['runbooks.png','Runbook Automation'] ] },
   { key: 'containers', title: 'Containers &amp; Kubernetes', icon: 'fa-cubes', items: [
      ['docker.png','Docker'],['aks.png','AKS (Azure)'],['kubernetes.png','EKS (AWS)'],
      ['containerization.png','Containerization'],['kubernetes.png','Microservices'],
      ['kubernetes.png','Cluster Administration'] ] },
   { key: 'iac', title: 'Infrastructure as Code', icon: 'fa-code', items: [
      ['terraform.png','Terraform'],['chef.svg','Chef'],['powershell.png','PowerShell'],
      ['config.png','Bicep'],['config.png','CloudFormation'],
      ['config.png','Config Management'],['runbooks.png','Runbook Automation'] ] },
   { key: 'monitoring', title: 'Observability &amp; Monitoring', icon: 'fa-chart-line', items: [
      ['splunk.png','Splunk'],['dynatrace.png','Dynatrace'],['monitoring.png','AppDynamics'],
      ['azure-monitor.png','CloudWatch'],['Grafana.png','Grafana'],['loganalytics.png','SolarWinds'],
      ['monitoring.png','Prometheus'],['monitoring.png','Datadog'],['monitoring.png','Oberv'] ] },
   { key: 'platform', title: 'Platform, Data &amp; Network', icon: 'fa-server', items: [
      ['iis.png','IIS'],['appservice.png','IBM WebSphere'],['ngnix.png','F5 BIG-IP'],
      ['sql.png','SQL Server'],['postgres_sql.png','MySQL'],['cosmos_db.png','Oracle'],
      ['networking-security.png','Active Directory'],['networking-security.png','Akamai CDN'],
      ['networking-security.png','Load Balancing'],['networking-security.png','VMware'],
      ['iis.png','Windows Server'] ] },
   { key: 'itsm', title: 'ITSM &amp; Reliability', icon: 'fa-shield-halved', items: [
      ['servicenow.png','ServiceNow'],['bmc.png','BMC Remedy'],['jira.png','Jira'],
      ['incident.png','Incident Management'],['incident.png','Change Management'],
      ['incident.png','Problem Management'],['incident.png','Service Requests'],
      ['scalability.png','DR &amp; Resiliency'],['keyvault.png','SSL / Cert Mgmt'],
      ['scalability.png','Zero Downtime'],['incident.png','KB Articles'] ] },
   { key: 'languages', title: 'Languages &amp; Scripting', icon: 'fa-terminal', items: [
      ['powershell.png','PowerShell'],['python.png','Python'],
      ['config.png','HTML / CSS'],['config.png','Bash / Shell'],
      ['config.png','YAML / JSON'] ] },
   { key: 'ai', title: 'AI Tools &amp; Adoption', icon: 'fa-robot', items: [
      ['chatops.png','GitHub Copilot'],['aiops.png','Claude Code'],
      ['aiops.png','ChatGPT'],['aiops.png','Roo Code'],
      ['aiops.png','Cline'],['aiops.png','VS Code + AI'],
      ['aiops.png','AI-Driven Ops'],['chatops.png','Playwright / Testing'] ] },
];

const TIMELINE = [
   { logo:'commbank.png', role:'SRE, DevOps &amp; Platform Engineer', org:'Commonwealth Bank of Australia — CommBiz Platform', domain:'Banking &amp; Financial Services', date:'Jan 2022 – Present', current:true,
     bullets:[
      'Own end-to-end production release management for CommBiz (online business banking) using Octopus Deploy and ACDC pipelines — blue-green deployments, controlled rollouts, auto-rollback, and ServiceNow change records ensuring zero-downtime delivery for 500K+ business customers.',
      'Drive AWS cloud operations and infrastructure reliability — EC2, S3, Route 53, Auto Scaling, and Akamai CDN configuration — supporting multi-region availability and disaster recovery strategies for mission-critical banking workloads.',
      'Architect and maintain Splunk and AppDynamics observability coverage: custom dashboards, intelligent alerting, log analytics, distributed tracing, and SLI/SLO metrics that cut MTTD by 40% and enable proactive incident prevention.',
      'Lead P1/P2 incident response, war-room coordination, root cause analysis (RCA), post-incident reviews, and problem management — driving repeat-incident reduction through structured ITIL V4 discipline and KB article authoring.',
      'Implement SSL certificate lifecycle management, critical vulnerability remediation, and Akamai WAF/CDN configuration changes across production environments under strict change management governance.',
      'Deliver platform automation using PowerShell and Python scripts — runbook automation, self-healing workflows, scheduled maintenance tasks, and deployment validation scripts that reduce toil and improve operational efficiency.',
      'Collaborate with development, architecture, and security teams on CI/CD pipeline improvements, GitHub Actions workflows, infrastructure hardening, and AI-assisted diagnostics using GitHub Copilot and Claude Code.',
      'Perform resiliency and chaos testing, capacity planning, and DR drills to validate SLA/SLO compliance and ensure the platform meets its 99.99% uptime commitments.'],
     tech:['AWS','Octopus Deploy','ACDC','ServiceNow','Splunk','AppDynamics','Akamai','GitHub Actions','PowerShell','Python','Route 53','Auto Scaling','Blue-Green','IaC'] },
   { logo:'fis.png', role:'Service Delivery Analyst / SRE', org:'FIS Global — Express SRO Payment Platform (USA)', domain:'Financial Services &amp; Payments', date:'Aug 2021 – Dec 2021',
     bullets:[
      'Deployed and operated applications across Microsoft Azure cloud environments supporting global ATM, POS, and online payment-gateway processing at millions of transactions per hour.',
      'Built proactive alerting and intelligent monitoring using Azure Monitor and Dynatrace — correlating metrics, logs, and traces to surface failed and fraudulent transaction patterns before customer impact.',
      'Managed high-priority P1/P2 incident response under strict financial SLAs — rapid triage, deep log analysis, SQL Server query optimization, and coordinated service restoration across distributed payment systems.',
      'Authored runbooks, KB articles, and incident playbooks to standardize response procedures and accelerate future resolution times.'],
     tech:['Microsoft Azure','Azure Monitor','Dynatrace','SQL Server','Incident Management','ITSM','Runbooks'] },
   { logo:'eurofins.png', role:'Senior Product Specialist / SRE', org:'Eurofins IT Solutions (USA)', domain:'E-commerce &amp; Laboratory Services', date:'Sep 2018 – Aug 2021',
     bullets:[
      'Managed full-stack application hosting on IIS and IBM WebSphere across dev, staging, and production environments — enforcing configuration standards and environment parity.',
      'Executed production deployments using Jenkins, Chef, and Octopus Deploy with standardized release processes, environment-specific config injection, and post-deployment smoke testing.',
      'Provisioned and maintained Azure VMs, cloud services, load balancers, and MySQL databases; authored PowerShell automation scripts for server configuration, patching cycles, and operational tasks.',
      'Maintained Windows Server environments, Active Directory, and IIS configurations across distributed application tiers — supporting 99.9% availability for customer-facing lab result portals.'],
     tech:['IIS','IBM WebSphere','Jenkins','Chef','Octopus Deploy','Azure VMs','MySQL','PowerShell','Windows Server','Active Directory','Load Balancing'] },
   { logo:'ironmountain.png', role:'System Engineer — Application Management', org:'Iron Mountain (USA)', domain:'Information Storage &amp; Data Management', date:'Feb 2016 – Sep 2018',
     bullets:[
      'Supported Hosted Accutrac (order management) and GroupTrak GTx (marketing fulfillment) platforms — maintaining 24×7 availability for enterprise storage customers.',
      'Managed IIS-hosted application deployments, Windows Server configurations, and SQL Server database support across multi-tier hosted environments.',
      'Handled incident management, change control, service requests, and structured problem management using ITSM processes — documenting resolutions in KB articles for recurring issues.'],
     tech:['Windows Server','IIS','SQL Server','ITSM','Incident Management','Change Management'] },
   { logo:'sieo.png', role:'System Engineer', org:'Sieo Technologies', domain:'IT Services', date:'2011', edu:false,
     bullets:['Started professional career at Sieo Technologies, building foundational expertise in system administration, infrastructure support, and IT operations.'],
     tech:['Windows Server','Networking','IT Support'] },
];

const RESPONSIBILITIES = [
   ['fa-shield-heart','Site Reliability Engineering (SRE)','Define and own SLOs, SLIs, and SLAs; manage error budgets, incident/problem resolution, RCA, post-mortems, and 24×7 production reliability for mission-critical banking platforms.'],
   ['fa-layer-group','Platform Engineering','Build automation-first, self-service internal platforms that accelerate safe, repeatable software delivery and reduce developer friction across multi-team engineering organisations.'],
   ['fa-sitemap','Cloud Architecture &amp; Migration','Design and execute secure, highly available, multi-region architectures on AWS and Azure — including cloud migration strategies, IaaS/PaaS adoption, and CloudFormation/Bicep provisioning.'],
   ['fa-cloud','Multi-Cloud Infrastructure (AWS &amp; Azure)','Provision and operate production workloads across AWS (EC2, S3, Route 53, Auto Scaling, EKS) and Microsoft Azure (VMs, AKS, Azure Monitor, Blob, AD) with consistent security and governance guardrails.'],
   ['fa-dharmachakra','Kubernetes · AKS · EKS · Microservices','Administer managed Kubernetes clusters (AKS, EKS), orchestrate containerised microservices, tune autoscaling policies, and enforce platform reliability for distributed service architectures.'],
   ['fa-docker','Docker &amp; Containerisation','Containerise enterprise workloads, author production-grade Dockerfiles, and standardise portable, scalable cloud-native deployments with full CI/CD integration.'],
   ['fa-robot','Infrastructure as Code (IaC)','Deliver version-controlled, reusable, repeatable infrastructure with Terraform, CloudFormation, Bicep, and Chef — enabling consistent, auditable provisioning across all environments.'],
   ['fa-code-branch','CI/CD &amp; Deployment Pipelines','Design and operate enterprise delivery pipelines with GitHub Actions, Jenkins, and Octopus Deploy — incorporating blue-green deployments, auto rollback, smoke tests, and change-gate controls.'],
   ['fa-rocket','Release &amp; Change Management','Own controlled production releases under ITIL change management — coordinating implementation plans, rollback procedures, stakeholder communications, and ServiceNow change records.'],
   ['fa-triangle-exclamation','P1/P2 Incident Management','Lead war-room incident response, rapid triage, service restoration, root cause analysis, and structured post-incident reviews to drive repeat-incident reduction and SLA compliance.'],
   ['fa-chart-line','Observability &amp; Intelligent Monitoring','Build end-to-end observability platforms using Splunk, AppDynamics, Dynatrace, CloudWatch, Grafana, Prometheus, and SolarWinds — metrics, logs, traces, and intelligent alerting.'],
   ['fa-shield-halved','Security, SSL &amp; Vulnerability Management','Manage SSL/TLS certificate lifecycle, critical and high vulnerability remediation, Akamai WAF configuration, and security patching under change control for production environments.'],
   ['fa-headset','24×7 Production Operations','Provide round-the-clock mission-critical support, on-call escalation handling, and proactive platform health monitoring to guarantee zero-downtime for business-critical services.'],
   ['fa-gears','Automation &amp; Toil Elimination','Design PowerShell and Python automation for runbook execution, self-healing workflows, compliance checks, patching cycles, and operational tasks — reducing manual toil at scale.'],
   ['fa-rotate','DR, Resiliency &amp; Capacity Planning','Conduct disaster recovery drills, chaos/resiliency testing, failover validation, and capacity planning to ensure platforms exceed SLA commitments and recover within defined RTOs/RPOs.'],
   ['fa-brain','AI-Driven Engineering Adoption','Accelerate engineering velocity using GitHub Copilot, Claude Code, Roo Code, Cline, and ChatGPT for AI-assisted scripting, diagnostics, IaC generation, and intelligent operational workflows.'],
   ['fa-book','ITSM · ServiceNow · Jira','Manage incidents, changes, problems, and service requests through ServiceNow and Jira — authoring KB articles, runbooks, and documentation that build organisational knowledge and standardise operations.'],
   ['fa-network-wired','Load Balancing &amp; Networking','Configure and maintain F5 BIG-IP load balancers, Akamai CDN, Route 53 DNS, and network security policies to ensure performance, availability, and secure traffic routing across production platforms.'],
];

const PROJECTS = [
   { name:'CommBiz — Business Banking Platform (CBA)', date:'2022 – Present', org:'Commonwealth Bank of Australia · Banking &amp; Financial Services', role:'SRE, DevOps &amp; Platform Engineer',
     desc:'CommBiz is Commonwealth Bank\'s flagship digital platform serving 500,000+ Australian businesses — enabling payments, global trade finance, foreign exchange, cash management, term deposits, and transaction reporting across web, iOS, and Android. As the SRE and Platform Engineer, I own production reliability, deployment governance, observability, and incident response for this zero-downtime, mission-critical banking platform.',
     bullets:[
       'Architected and own the end-to-end release management process using Octopus Deploy and ACDC — blue-green deployments, feature-flag controlled rollouts, automated smoke testing, and auto-rollback pipelines ensuring zero-downtime releases under ServiceNow change governance.',
       'Drive AWS cloud operations and infrastructure reliability — EC2 auto-scaling groups, S3 lifecycle management, Route 53 DNS failover, Akamai CDN/WAF configuration, and multi-region DR strategies maintaining 99.99% platform availability.',
       'Built and maintain a full-stack Splunk observability platform: custom SPL dashboards, log analytics, correlation alerts, and SLI/SLO metrics dashboards — reducing MTTD by 40% and enabling proactive detection of payment processing anomalies.',
       'Deployed AppDynamics APM across application tiers with transaction flow mapping, business transaction baselining, and intelligent anomaly detection for real-time performance governance.',
       'Lead P1/P2 incident war rooms — owning triage, coordinated service restoration, stakeholder communication, and structured RCA/post-incident reviews that reduced repeat incidents by 30% through problem management discipline.',
       'Delivered PowerShell and Python automation for SSL certificate renewal, vulnerability patching workflows, runbook automation, deployment validation, and compliance reporting — saving 15+ engineering hours per release cycle.',
       'Implemented SSL/TLS lifecycle management and critical vulnerability remediation across 50+ production endpoints, coordinating with security, networking, and application teams under strict change control.',
       'Introduced AI-assisted engineering practices using GitHub Copilot and Claude Code for IaC generation, PowerShell script authoring, log pattern analysis, and incident diagnostics — accelerating toil reduction across the SRE team.'],
     tags:['AWS','Octopus Deploy','ACDC','ServiceNow','Splunk','AppDynamics','Akamai','Route 53','GitHub Actions','PowerShell','Python','Blue-Green','Auto Rollback','SLO/SLI','Incident Management','SSL Mgmt','IaC'] },
   { name:'Express SRO — Global Payments Monitoring Platform', date:'2021', org:'FIS Global · Financial Services', role:'Service Delivery Analyst / SRE',
     desc:'Express SRO is FIS Global\'s high-throughput transaction monitoring platform processing millions of ATM, POS, and online payment-gateway records per hour across 130+ countries — surfacing failed, declined, and fraudulent transactions in near real-time for one of the world\'s largest fintech organisations.',
     bullets:[
       'Deployed and operated multi-region applications across Microsoft Azure cloud environments — managing Azure VMs, App Services, load balancers, and SQL Server databases for global payment processing workloads.',
       'Engineered intelligent monitoring using Azure Monitor and Dynatrace — custom dashboards, distributed tracing, anomaly detection alerts, and correlated log queries that surfaced transaction failure patterns before business impact.',
       'Managed P1/P2 incident response under strict financial SLAs — rapid triage, deep SQL Server analysis, DB job monitoring, fraud transaction investigation, and coordinated service restoration across distributed payment systems.',
       'Authored incident runbooks, KB articles, and escalation playbooks that standardised response procedures and reduced mean time to resolve (MTTR) for recurring payment gateway failures.'],
     tags:['Microsoft Azure','Azure Monitor','Dynatrace','SQL Server','P1/P2 Incidents','Runbooks','ITSM','Load Balancing'] },
   { name:'EOL — Eurofins Online Laboratory Portal', date:'2018 – 2021', org:'Eurofins IT Solutions · E-commerce &amp; Laboratory Services', role:'Senior Product Specialist / SRE',
     desc:'Eurofins Online (EOL) is the customer-facing web portal used by 50,000+ Eurofins laboratory clients across 50 countries to submit sample orders, track test workflows, and retrieve certified results — a business-critical application where availability directly impacts revenue.',
     bullets:[
       'Managed full-stack application hosting on IIS and IBM WebSphere across dev, staging, and production — enforcing environment parity, configuration standards, and IIS application pool health for high-availability operation.',
       'Executed controlled production deployments using Jenkins CI, Chef configuration management, and Octopus Deploy with environment-specific config injection, pre/post-deployment smoke tests, and rollback procedures.',
       'Provisioned and maintained Azure VMs, cloud services, load balancers, MySQL databases, and Active Directory integration; authored PowerShell automation for patching, IIS configuration, and server maintenance tasks.',
       'Delivered Windows Server administration, SSL certificate management, and security hardening across application tiers — maintaining 99.9% uptime SLA for 24×7 global laboratory operations.'],
     tags:['IIS','IBM WebSphere','Jenkins','Chef','Octopus Deploy','Azure VMs','MySQL','PowerShell','Windows Server','Active Directory','SSL Management','Load Balancing'] },
   { name:'OSO — Off-Site Operations Platform', date:'2018 – 2021', org:'Eurofins IT Solutions · E-commerce &amp; Field Services', role:'Site Reliability / Deployment Engineer',
     desc:'OSO supports Eurofins\' global network of Patient Service Centres (PSCs) — the physical locations where phlebotomists perform sample collection. The platform keeps regional scheduling, appointment, and data-flow applications reliable for field operations across multiple continents.',
     bullets:[
       'Provisioned and maintained Azure VMs, cloud services, and MySQL databases for regional PSC application instances across multiple geographic deployments.',
       'Monitored Windows task-scheduler jobs, IIS application logs, and data-sync workflows; performed weekly audit checklists and proactive health checks to prevent field-facing outages.',
       'Managed Octopus Deploy builds, environment configurations, and regional rollouts — maintaining deployment consistency across 20+ environment instances with minimal operational variance.'],
     tags:['Azure VMs','Octopus Deploy','IIS','MySQL','Windows Server','Config Management','Monitoring'] },
   { name:'Hosted Accutrac — Iron Mountain Order Management', date:'2016 – 2018', org:'Iron Mountain · Information Storage &amp; Data Management', role:'System Engineer — Application Management',
     desc:'Hosted Accutrac is Iron Mountain\'s enterprise order management platform enabling global corporate customers to request retrieval, delivery, and destruction of physical records and media stored across Iron Mountain\'s 1,400+ global facilities.',
     bullets:[
       'Provided 24×7 application support for IIS-hosted Accutrac order management portal — handling incidents, change requests, and service restorations under ITSM governance.',
       'Managed Windows Server infrastructure, IIS configuration, SQL Server database support, and scheduled job monitoring across production and DR environments.',
       'Coordinated structured troubleshooting, root cause analysis, and KB article authoring for recurring issues — building a reusable knowledge base that reduced repeat incident resolution time.'],
     tags:['Windows Server','IIS','SQL Server','ITSM','Incident Management','Change Management','KB Articles'] },
   { name:'GroupTrak GTx — Marketing Fulfilment Platform', date:'2016 – 2018', org:'Iron Mountain Fulfillment Services (IMFS) · Information Management', role:'System Engineer — Application Management',
     desc:'GroupTrak (GTx) is Iron Mountain\'s enterprise marketing inventory and fulfilment platform — a multi-tier web application (GTx front-end over GTi back-end) managing inventory lifecycle, order fulfilment workflows, and distribution tracking for Fortune 500 clients.',
     bullets:[
       'Supported the GTx web interface and its integration with the GTi back-end fulfilment engine across production, staging, and UAT environments.',
       'Managed deployments, IIS configuration, and application tier updates for a multi-component, tightly coupled fulfilment system requiring careful release sequencing.',
       'Delivered ongoing incident management, service requests, and operational support — maintaining platform stability and data integrity for enterprise fulfilment SLAs.'],
     tags:['Windows Server','IIS','SQL Server','ITSM','Deployments','Multi-Tier Architecture','Fulfilment Systems'] },
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

   // Mobile bottom nav
   const mobileNav = document.getElementById('mobileNav');
   const mobItems = mobileNav ? Array.from(mobileNav.querySelectorAll('.mob-nav-item[data-section]')) : [];

   // Show/hide mobile nav based on screen width
   function applyMobileNav() {
      if (!mobileNav) return;
      mobileNav.style.display = window.innerWidth <= 640 ? 'flex' : 'none';
   }
   applyMobileNav();
   window.addEventListener('resize', applyMobileNav);

   function showSection(id) {
      const target = document.getElementById(id);
      if (!target) return;
      sections.forEach(s => s.classList.toggle('active', s === target));
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      mobItems.forEach(b => b.classList.toggle('active', b.dataset.section === id));
      // On mobile scroll page top; on desktop scroll panel top
      if (window.innerWidth <= 640) {
         window.scrollTo(0, 0);
      } else {
         const panel = document.getElementById('mainPanel');
         if (panel) panel.scrollTop = 0;
      }
      history.replaceState(null, '', '#' + id);
      if (id === 'introduction') animateStats();
   }

   navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
         e.preventDefault();
         showSection(link.getAttribute('href').slice(1));
      });
   });

   mobItems.forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.section));
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

/* Mobile nav toggle removed — sidebar always visible */
function initMobileNav() {}
