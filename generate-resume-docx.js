const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType, VerticalAlign,
  PageSize, PageOrientation, convertInchesToTwip, convertMillimetersToTwip,
  Header, Footer, PageNumber, NumberFormat, UnderlineType
} = require("docx");
const fs = require("fs");

// ── Colours ──────────────────────────────────────────────────────────────────
const C = {
  sidebar:    "0B1F3A",  // dark navy
  accent:     "0EA5E9",  // sky blue
  accent2:    "1D4ED8",  // indigo
  white:      "FFFFFF",
  offwhite:   "F0F7FF",
  ink:        "0F172A",
  muted:      "475569",
  border:     "BFDBFE",
  chipBg:     "DBEAFE",
  chipText:   "1E3A8A",
  lightBlue:  "EFF6FF",
  green:      "DCFCE7",
  greenText:  "166534",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const mm = (v) => convertMillimetersToTwip(v);

function sidebarHeading(text) {
  return new Paragraph({
    spacing: { before: mm(3), after: mm(2) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 18,
        color: "BFDBFE",
        font: "Segoe UI",
      }),
    ],
  });
}

function sidebarText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: mm(1), after: mm(1) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    children: [
      new TextRun({
        text,
        size: opts.size || 18,
        color: opts.color || "E2E8F0",
        bold: opts.bold || false,
        font: "Segoe UI",
      }),
    ],
  });
}

function sidebarBullet(text, opts = {}) {
  return new Paragraph({
    spacing: { before: mm(0.8), after: mm(0.8) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    bullet: { level: 0 },
    children: [
      new TextRun({
        text,
        size: opts.size || 17,
        color: opts.color || "CBD5E1",
        font: "Segoe UI",
      }),
    ],
  });
}

function contentHeading(text) {
  return new Paragraph({
    spacing: { before: mm(4), after: mm(2) },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent2 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 20,
        color: C.accent2,
        font: "Segoe UI",
      }),
    ],
  });
}

function roleRow(title, date) {
  return new Paragraph({
    spacing: { before: mm(4), after: mm(1) },
    children: [
      new TextRun({ text: title, bold: true, size: 24, color: C.ink, font: "Segoe UI" }),
      new TextRun({ text: "   ", size: 24 }),
      new TextRun({ text: date, size: 18, color: C.accent2, font: "Segoe UI", bold: true }),
    ],
  });
}

function companyRow(name) {
  return new Paragraph({
    spacing: { before: mm(1), after: mm(2) },
    shading: { type: ShadingType.CLEAR, fill: C.lightBlue },
    children: [
      new TextRun({ text: "🏢  " + name, bold: true, size: 19, color: C.ink, font: "Segoe UI" }),
    ],
  });
}

function bullet(runs) {
  const children = Array.isArray(runs)
    ? runs
    : [new TextRun({ text: runs, size: 19, color: C.muted, font: "Segoe UI" })];
  return new Paragraph({
    spacing: { before: mm(1), after: mm(1) },
    bullet: { level: 0 },
    children,
  });
}

function boldRun(text) {
  return new TextRun({ text, bold: true, size: 19, color: C.ink, font: "Segoe UI" });
}
function normalRun(text) {
  return new TextRun({ text, size: 19, color: C.muted, font: "Segoe UI" });
}

function chip(text, bg = C.chipBg, fg = C.chipText) {
  return new TextRun({
    text: ` ${text} `,
    size: 16,
    color: fg,
    bold: true,
    font: "Segoe UI",
    shading: { type: ShadingType.CLEAR, fill: bg },
  });
}

function chipPara(chips) {
  return new Paragraph({
    spacing: { before: mm(1), after: mm(2) },
    children: chips.map((c) => chip(c)),
  });
}

function summaryPara(text) {
  return new Paragraph({
    spacing: { before: mm(2), after: mm(2) },
    children: [new TextRun({ text, size: 19, color: C.ink, font: "Segoe UI" })],
  });
}

function spacer(n = 1) {
  return new Paragraph({ spacing: { before: mm(n), after: mm(n) }, children: [] });
}

// ── Sidebar cell builder ───────────────────────────────────────────────────────
function buildSidebar(paragraphs) {
  return new TableCell({
    width: { size: mm(64), type: WidthType.DXA },
    verticalAlign: VerticalAlign.TOP,
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.SINGLE, size: 4, color: C.accent },
    },
    children: paragraphs,
  });
}

function buildContent(paragraphs) {
  return new TableCell({
    width: { size: mm(210 - 64), type: WidthType.DXA },
    verticalAlign: VerticalAlign.TOP,
    shading: { type: ShadingType.CLEAR, fill: C.white },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    margins: { left: mm(5), right: mm(5), top: mm(5), bottom: mm(5) },
    children: paragraphs,
  });
}

function layoutTable(sidebarCell, contentCell) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [sidebarCell, contentCell],
        cantSplit: false,
      }),
    ],
  });
}

// ── PAGE 1 ────────────────────────────────────────────────────────────────────
const p1Sidebar = buildSidebar([
  // Name block
  new Paragraph({
    spacing: { before: mm(4), after: mm(1) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: "NAVEEN REDDY", bold: true, size: 32, color: C.white, font: "Segoe UI" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 0, after: mm(1) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: "JANAGAMA", bold: true, size: 32, color: C.white, font: "Segoe UI" }),
    ],
  }),
  new Paragraph({
    spacing: { before: mm(1), after: mm(4) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1E3A5F" } },
    children: [
      new TextRun({ text: "AI-Enabled SRE & DevOps Engineer", size: 17, color: "93C5FD", font: "Segoe UI", bold: true }),
      new TextRun({ text: "\nPlatform & Cloud Engineering Specialist", size: 16, color: "7DD3FC", font: "Segoe UI", break: 1 }),
    ],
  }),

  spacer(2),

  // Contact
  sidebarHeading("Contact"),
  sidebarText("📞  +91 99122 46990"),
  sidebarText("📧  naveen535990@gmail.com"),
  sidebarText("📍  Hyderabad, India"),
  sidebarText("🔗  linkedin.com/in/naveen-reddy-janagama"),
  sidebarText("🐙  github.com/naveen-janagama"),

  spacer(2),

  // Education
  sidebarHeading("Education"),
  sidebarText("Bachelor of Technology", { bold: true }),
  sidebarText("JNTU, Hyderabad, India"),
  sidebarText("2010"),

  spacer(2),

  // Certifications
  sidebarHeading("Certifications"),
  sidebarText("AWS: Certified Solutions Architect", { size: 17 }),
  sidebarText("AZURE: Microsoft Azure Administrator", { size: 17 }),
  sidebarText("ITIL: ITIL V4 Foundation", { size: 17 }),

  spacer(2),

  // Languages
  sidebarHeading("Languages"),
  sidebarText("English  ·  Hindi  ·  Telugu"),

  spacer(2),

  // Focus Areas
  sidebarHeading("Focus Areas"),
  sidebarBullet("SRE & Reliability"),
  sidebarBullet("Cloud Operations"),
  sidebarBullet("CI/CD & IaC"),
  sidebarBullet("Observability"),
  sidebarBullet("Incident Management"),
  sidebarBullet("AI-Driven Ops"),
  sidebarBullet("Zero Downtime"),
  sidebarBullet("Platform Engineering"),

  spacer(2),

  // Industry Domains
  sidebarHeading("Industry Domains"),
  sidebarBullet("Banking & Financial Services"),
  sidebarBullet("E-commerce & Laboratory Services"),
  sidebarBullet("Insurance & Utilities"),
  sidebarBullet("Information Storage & Data Mgmt"),
]);

const p1Content = buildContent([
  // Profile summary
  contentHeading("Profile Summary"),
  new Paragraph({
    spacing: { before: mm(2), after: mm(3) },
    shading: { type: ShadingType.CLEAR, fill: C.lightBlue },
    border: {
      left: { style: BorderStyle.SINGLE, size: 12, color: C.accent2 },
    },
    children: [
      boldRun("AI-Enabled Site Reliability, DevOps, and Platform Engineer"),
      normalRun(" with "),
      boldRun("15+ years"),
      normalRun(" delivering zero-downtime, enterprise-grade platforms for "),
      boldRun("Commonwealth Bank of Australia (CommBiz)"),
      normalRun(", FIS Global, and Eurofins across Banking, Financial Services, E-commerce, Insurance, and Information Storage domains. Currently owning end-to-end production reliability for CommBiz — CBA's flagship business banking platform serving "),
      boldRun("500,000+ customers"),
      normalRun(" — including blue-green release engineering via "),
      boldRun("Octopus Deploy & ACDC"),
      normalRun(", AWS cloud operations (EC2, Route 53, Auto Scaling, Akamai CDN/WAF), full-stack observability with "),
      boldRun("Splunk & AppDynamics"),
      normalRun(", and P1/P2 incident war-room leadership under ITIL V4 governance and ServiceNow change control."),
    ],
  }),
  new Paragraph({
    spacing: { before: mm(2), after: mm(3) },
    shading: { type: ShadingType.CLEAR, fill: C.offwhite },
    children: [
      normalRun("Deep expertise in multi-cloud infrastructure (AWS & Azure), Kubernetes (AKS & EKS), Docker containerisation, microservices, IaC (Terraform, CloudFormation, Bicep, Chef), CI/CD pipelines (GitHub Actions, Jenkins), and intelligent monitoring (Splunk, Dynatrace, Grafana, Prometheus, CloudWatch, SolarWinds, Datadog). An early AI adopter integrating "),
      boldRun("GitHub Copilot, Claude Code, Roo Code, Cline, and ChatGPT"),
      normalRun(" into engineering workflows. Certified: "),
      boldRun("AWS Solutions Architect · Azure Administrator (AZ-104) · ITIL V4 Foundation"),
      normalRun("."),
    ],
  }),

  // Chips row
  chipPara(["15+ Yrs · SRE & DevOps", "Zero-Downtime Releases", "AWS & Azure Multi-Cloud", "K8s · Docker · IaC", "AI-Driven Engineering"]),

  // Experience
  contentHeading("Professional Experience"),

  roleRow("SRE, DevOps & Platform Engineer", "Jan 2022 – Present"),
  companyRow("Commonwealth Bank of Australia — CommBiz Platform (IT Operations Senior Analyst)"),
  chipPara(["Banking", "CBA", "CommBiz", "500K+ Business Customers", "AWS", "Akamai"]),
  bullet([boldRun("Own end-to-end production release management"), normalRun(" for CommBiz using "), boldRun("Octopus Deploy"), normalRun(" and "), boldRun("ACDC"), normalRun(" — blue-green deployments, controlled rollouts, automated smoke tests, auto-rollback, and "), boldRun("ServiceNow"), normalRun(" change-gate governance ensuring zero-downtime for 500K+ business customers.")]),
  bullet([normalRun("Drive "), boldRun("AWS cloud operations"), normalRun(" — EC2, S3, Route 53 DNS failover, Auto Scaling groups, and "), boldRun("Akamai CDN/WAF"), normalRun(" — maintaining multi-region availability and executing DR strategies for mission-critical banking workloads.")]),
  bullet([normalRun("Architect and maintain "), boldRun("Splunk"), normalRun(" observability platform: custom SPL dashboards, log analytics, correlated alerting, and SLI/SLO metrics — reducing MTTD by ~40% and enabling proactive detection of payment processing anomalies before customer impact.")]),
  bullet([normalRun("Deploy and manage "), boldRun("AppDynamics APM"), normalRun(" across application tiers — transaction flow mapping, business transaction baselining, and intelligent anomaly detection for real-time performance governance of banking services.")]),
  bullet([normalRun("Lead "), boldRun("P1/P2 incident war rooms"), normalRun(": rapid triage, coordinated service restoration, stakeholder communications, structured RCA, and post-incident reviews — reducing repeat incidents by ~30% through ITIL V4 problem management discipline and KB article authoring.")]),
  bullet([normalRun("Deliver "), boldRun("SSL/TLS certificate lifecycle management"), normalRun(" and critical vulnerability remediation across 50+ production endpoints; manage Akamai WAF rule changes under strict change control.")]),
  bullet([normalRun("Develop "), boldRun("PowerShell and Python automation"), normalRun(" for runbook execution, self-healing workflows, deployment validation, compliance reporting, and patching cycles — saving 15+ engineering hours per release cycle.")]),
  bullet([normalRun("Integrate "), boldRun("GitHub Copilot and Claude Code"), normalRun(" into SRE workflows for AI-assisted IaC generation, log pattern analysis, PowerShell script authoring, and incident diagnostics.")]),
]);

// ── PAGE 2 ────────────────────────────────────────────────────────────────────
const p2Sidebar = buildSidebar([
  new Paragraph({
    spacing: { before: mm(4), after: mm(1) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 28, color: C.white, font: "Segoe UI" })],
  }),
  new Paragraph({
    spacing: { before: 0, after: mm(4) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1E3A5F" } },
    children: [new TextRun({ text: "Continued from Page 1", size: 16, color: "7DD3FC", font: "Segoe UI" })],
  }),

  spacer(2),

  sidebarHeading("Key Achievements"),
  sidebarBullet("Star of Month — CBA: Recognised for outstanding ownership & zero-downtime delivery.", { size: 16 }),
  sidebarBullet("MTTD –40%: Splunk observability stack with correlated dashboards.", { size: 16 }),
  sidebarBullet("Repeat Incidents –30%: Structured RCA & ITIL V4 problem management.", { size: 16 }),
  sidebarBullet("15+ Hrs Saved/Release: PowerShell & Python runbook automation.", { size: 16 }),
  sidebarBullet("Zero-Downtime Releases: Blue-green pipelines with auto-rollback.", { size: 16 }),
  sidebarBullet("AI Adoption Pioneer: GitHub Copilot, Claude Code, Roo Code, Cline, ChatGPT.", { size: 16 }),

  spacer(2),

  sidebarHeading("Day-to-Day Activities"),
  sidebarBullet("Blue-Green Releases"),
  sidebarBullet("Octopus Deploy / ACDC"),
  sidebarBullet("P1/P2 War Rooms"),
  sidebarBullet("Splunk Dashboards"),
  sidebarBullet("AppDynamics APM"),
  sidebarBullet("ServiceNow Changes"),
  sidebarBullet("RCA & Post-Mortems"),
  sidebarBullet("SSL & Vuln Mgmt"),
  sidebarBullet("AWS Cloud Ops"),
  sidebarBullet("PowerShell / Python"),
  sidebarBullet("Runbook Automation"),
  sidebarBullet("GitHub Copilot / AI"),

  spacer(2),

  sidebarHeading("Clients & Employers"),
  sidebarBullet("Commonwealth Bank"),
  sidebarBullet("FIS Global"),
  sidebarBullet("Eurofins"),
  sidebarBullet("Iron Mountain"),
  sidebarBullet("J.P. Morgan (via FIS)"),
  sidebarBullet("IMFS"),
]);

const p2Content = buildContent([
  contentHeading("Professional Experience (Continued)"),

  roleRow("Service Delivery Analyst / SRE", "Aug 2021 – Dec 2021"),
  companyRow("FIS Global — Express SRO Global Payments Platform (USA)"),
  chipPara(["Financial Services", "FIS Global", "130+ Countries", "Azure", "Dynatrace"]),
  bullet([normalRun("Deployed and operated multi-tier applications across "), boldRun("Microsoft Azure"), normalRun(" — Azure VMs, App Services, load balancers, and "), boldRun("SQL Server"), normalRun(" databases — supporting global ATM, POS, and online payment-gateway processing across 130+ countries.")]),
  bullet([normalRun("Engineered intelligent monitoring using "), boldRun("Azure Monitor and Dynatrace"), normalRun(" — custom dashboards, distributed tracing, anomaly detection alerts, and correlated log queries surfacing failed and fraudulent transaction patterns before business impact.")]),
  bullet([normalRun("Managed "), boldRun("P1/P2 incident response"), normalRun(" under strict financial SLAs: rapid triage, deep SQL Server query analysis, DB job monitoring, fraud transaction investigation, and coordinated service restoration.")]),
  bullet([normalRun("Authored incident runbooks, KB articles, and escalation playbooks standardising response procedures and reducing MTTR for recurring payment gateway failures.")]),

  spacer(2),

  roleRow("Senior Product Specialist / SRE", "Sep 2018 – Aug 2021"),
  companyRow("Eurofins IT Solutions — EOL & OSO Platforms (USA)"),
  chipPara(["E-commerce", "Eurofins", "50 Countries", "IIS", "Jenkins", "Azure"]),
  bullet([normalRun("Managed full-stack application hosting on "), boldRun("IIS and IBM WebSphere"), normalRun(" across dev, staging, and production — enforcing environment parity, configuration standards, and IIS application pool health for 99.9% SLA across 50 countries.")]),
  bullet([normalRun("Executed controlled production deployments using "), boldRun("Jenkins CI, Chef"), normalRun(" configuration management, and "), boldRun("Octopus Deploy"), normalRun(" — environment-specific config injection, pre/post-deployment smoke tests, and rollback procedures.")]),
  bullet([normalRun("Provisioned and maintained "), boldRun("Azure VMs, load balancers, and MySQL databases"), normalRun("; authored PowerShell automation for IIS configuration, server patching, and operational compliance; managed Active Directory and Windows Server infrastructure.")]),
  bullet([normalRun("Performed SSL certificate management, security hardening, and infrastructure setup for new regional PSC application deployments — supporting 24×7 global laboratory operations.")]),

  spacer(2),

  roleRow("System Engineer — Application Management", "Feb 2016 – Sep 2018"),
  companyRow("Iron Mountain — Hosted Accutrac & GroupTrak GTx (USA)"),
  chipPara(["Information Storage", "Iron Mountain", "Windows Server", "IIS", "SQL Server"]),
  bullet([normalRun("Provided 24×7 application support for IIS-hosted Hosted Accutrac (order management) and GroupTrak GTx (marketing fulfilment) platforms — handling incidents, change requests, and service restorations under ITSM governance.")]),
  bullet([normalRun("Managed "), boldRun("Windows Server, IIS, and SQL Server"), normalRun(" infrastructure — deployments, application tier configuration, DB job monitoring, and scheduled task management across production and DR environments.")]),
  bullet([normalRun("Coordinated structured troubleshooting, root cause analysis, and KB article authoring for recurring issues — building a reusable knowledge base that reduced repeat incident resolution time.")]),
]);

// ── PAGE 3 ────────────────────────────────────────────────────────────────────
const p3Sidebar = buildSidebar([
  new Paragraph({
    spacing: { before: mm(4), after: mm(1) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "SKILLS", bold: true, size: 28, color: C.white, font: "Segoe UI" })],
  }),
  new Paragraph({
    spacing: { before: 0, after: mm(4) },
    shading: { type: ShadingType.CLEAR, fill: C.sidebar },
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1E3A5F" } },
    children: [new TextRun({ text: "SRE · DevOps · Platform\nCloud · AI-Enabled Ops", size: 16, color: "7DD3FC", font: "Segoe UI" })],
  }),

  spacer(2),

  sidebarHeading("Hobbies & Interests"),
  sidebarBullet("✈️  Travelling"),
  sidebarBullet("👨‍👩‍👧  Family Time"),
  sidebarBullet("🍳  Cooking"),
  sidebarBullet("📈  Trading"),
  sidebarBullet("🤖  AI Exploring"),
  sidebarBullet("📚  Tech Blogs"),

  spacer(2),

  sidebarHeading("Certifications"),
  sidebarText("AWS: Certified Solutions Architect", { size: 17 }),
  sidebarText("AZURE: Microsoft Azure Administrator", { size: 17 }),
  sidebarText("ITIL: ITIL V4 Foundation", { size: 17 }),

  spacer(2),

  sidebarHeading("Focus Areas"),
  sidebarBullet("SRE & Reliability"),
  sidebarBullet("Cloud Operations"),
  sidebarBullet("CI/CD & IaC"),
  sidebarBullet("Observability"),
  sidebarBullet("Incident Management"),
  sidebarBullet("AI-Driven Ops"),
  sidebarBullet("Zero Downtime"),
  sidebarBullet("Platform Engineering"),

  spacer(2),

  sidebarHeading("Industry Domains"),
  sidebarBullet("Banking & Financial Services"),
  sidebarBullet("E-commerce & Lab Services"),
  sidebarBullet("Insurance & Utilities"),
  sidebarBullet("Information Storage & Data Mgmt"),
]);

function skillSection(title, items) {
  return [
    new Paragraph({
      spacing: { before: mm(2), after: mm(1) },
      shading: { type: ShadingType.CLEAR, fill: C.lightBlue },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.accent } },
      children: [
        new TextRun({ text: "  " + title, bold: true, size: 19, color: C.accent2, font: "Segoe UI" }),
      ],
    }),
    new Paragraph({
      spacing: { before: mm(1), after: mm(2) },
      children: [
        new TextRun({ text: items.join("  ·  "), size: 18, color: C.muted, font: "Segoe UI" }),
      ],
    }),
  ];
}

function awardCard(title, meta) {
  return [
    new Paragraph({
      spacing: { before: mm(2), after: mm(1) },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.accent2 } },
      children: [
        new TextRun({ text: "  ★  " + title, bold: true, size: 19, color: C.ink, font: "Segoe UI" }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: mm(1) },
      children: [
        new TextRun({ text: meta, size: 17, color: C.muted, font: "Segoe UI" }),
      ],
    }),
  ];
}

const p3Content = buildContent([
  contentHeading("Core Skills"),

  ...skillSection("Cloud Platforms", ["AWS (EC2, S3, Route 53)", "Auto Scaling & CloudWatch", "Microsoft Azure (VMs, AKS)", "Azure Monitor & AD", "Multi-Cloud Ops & DR", "Cloud Migration & IaaS/PaaS"]),
  ...skillSection("CI/CD & Release Engineering", ["Octopus Deploy & ACDC", "GitHub Actions & Jenkins", "Blue-Green Deployments", "Auto Rollback Pipelines", "Smoke & Regression Testing", "Playwright (Test Automation)"]),
  ...skillSection("SRE & Reliability", ["SLO / SLI / SLA & Error Budgets", "P1/P2 Incident War Rooms", "Root Cause Analysis (RCA)", "Change & Problem Management", "DR & Resiliency Testing", "Zero-Downtime Operations"]),
  ...skillSection("Observability & Monitoring", ["Splunk (SPL Dashboards)", "AppDynamics APM", "Dynatrace & Datadog", "Grafana & Prometheus", "CloudWatch & SolarWinds", "Oberv · Metrics · Logs · Traces"]),
  ...skillSection("Containers & Kubernetes", ["Docker & Containerisation", "Kubernetes (AKS & EKS)", "Cluster Administration", "Microservices Architecture", "Cloud-Native Deployments"]),
  ...skillSection("IaC & Automation", ["Terraform & CloudFormation", "Bicep & Chef", "PowerShell & Python", "Runbook & Self-Heal Automation", "Bash / YAML / JSON"]),
  ...skillSection("Platform, Network & DB", ["IIS · Windows Server · AD", "F5 BIG-IP & Akamai CDN/WAF", "Load Balancing & VMware", "SQL Server · MySQL · Oracle", "IBM WebSphere"]),
  ...skillSection("ITSM & Governance", ["ServiceNow & Jira", "BMC Remedy & Assyst", "SSL / TLS Cert Lifecycle", "Vulnerability Remediation", "KB Articles & Runbooks", "ITIL V4 Framework"]),
  ...skillSection("AI Tools & Adoption", ["GitHub Copilot", "Claude Code & Roo Code", "Cline & ChatGPT", "VS Code + AI Extensions", "AI-Driven IaC & Diagnostics"]),

  contentHeading("Professional Timeline"),
  new Paragraph({
    spacing: { before: mm(2), after: mm(1) },
    children: [new TextRun({ text: "15+ years across Banking, Financial Services, E-commerce & Information Storage — building, automating, and owning zero-downtime enterprise platforms.", size: 18, color: C.muted, font: "Segoe UI" })],
  }),
  new Paragraph({
    spacing: { before: mm(2), after: mm(1) },
    children: [
      new TextRun({ text: "2010", bold: true, size: 19, color: C.accent2, font: "Segoe UI" }),
      new TextRun({ text: "  →  B.Tech — JNTU Hyderabad   |   ", size: 18, color: C.muted, font: "Segoe UI" }),
      new TextRun({ text: "2016", bold: true, size: 19, color: C.accent2, font: "Segoe UI" }),
      new TextRun({ text: "  →  System Engineer — Iron Mountain (USA)", size: 18, color: C.muted, font: "Segoe UI" }),
    ],
  }),
  new Paragraph({
    spacing: { before: mm(1), after: mm(1) },
    children: [
      new TextRun({ text: "2018", bold: true, size: 19, color: C.accent2, font: "Segoe UI" }),
      new TextRun({ text: "  →  Sr. SRE / Product Specialist — Eurofins (USA)   |   ", size: 18, color: C.muted, font: "Segoe UI" }),
      new TextRun({ text: "2021", bold: true, size: 19, color: C.accent2, font: "Segoe UI" }),
      new TextRun({ text: "  →  SRE / Service Delivery Analyst — FIS Global (USA)", size: 18, color: C.muted, font: "Segoe UI" }),
    ],
  }),
  new Paragraph({
    spacing: { before: mm(1), after: mm(3) },
    children: [
      new TextRun({ text: "2022 →", bold: true, size: 19, color: C.accent2, font: "Segoe UI" }),
      new TextRun({ text: "  SRE, DevOps & Platform Engineer — CBA CommBiz (Australia)", size: 18, color: C.muted, font: "Segoe UI" }),
    ],
  }),

  contentHeading("Awards & Recognition"),

  ...awardCard("Star of the Month — CBA", "Recognised for outstanding ownership, zero-downtime delivery, and proactive SRE practices on CommBiz — CBA's flagship business banking platform serving 500K+ customers."),
  ...awardCard("MTTD Reduced ~40%", "Architected Splunk observability stack with correlated dashboards and intelligent alerting, enabling proactive detection of payment processing anomalies across CommBiz."),
  ...awardCard("Zero-Downtime Release Pipeline", "Architected blue-green deployment pipelines with auto-rollback, smoke-test gates, and ServiceNow change governance — eliminating unplanned outages during production releases."),
  ...awardCard("Repeat Incidents Reduced ~30%", "Drove structured RCA, ITIL V4 problem management, preventive action programmes, and KB documentation that measurably reduced repeat production incidents at CBA."),
  ...awardCard("15+ Hours Saved Per Release", "Developed PowerShell and Python automation for SSL renewals, deployment validation, compliance checks, and patching workflows — significantly reducing toil per release cycle."),
  ...awardCard("AI Adoption Pioneer", "First on team to integrate GitHub Copilot, Claude Code, Roo Code, Cline, and ChatGPT into SRE and IaC workflows — accelerating engineering velocity and improving code quality."),
]);

// ── Assemble document ─────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [
          {
            level: 0,
            format: NumberFormat.BULLET,
            text: "●",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: mm(6), hanging: mm(4) } }, run: { size: 14, color: C.accent2 } },
          },
        ],
      },
    ],
  },
  sections: [
    // Page 1
    {
      properties: {
        page: {
          size: { width: mm(210), height: mm(297), orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [layoutTable(p1Sidebar, p1Content)],
    },
    // Page 2
    {
      properties: {
        page: {
          size: { width: mm(210), height: mm(297), orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [layoutTable(p2Sidebar, p2Content)],
    },
    // Page 3
    {
      properties: {
        page: {
          size: { width: mm(210), height: mm(297), orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [layoutTable(p3Sidebar, p3Content)],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("profile/Naveen_Reddy_Janagama_Resume.docx", buf);
  console.log("✅  profile/Naveen_Reddy_Janagama_Resume.docx generated successfully");
});
