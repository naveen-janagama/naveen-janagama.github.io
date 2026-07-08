/**
 * Naveen Reddy Janagama — Resume DOCX Generator
 * Matches the 3-page HTML resume design as closely as docx allows.
 * Run: node generate-resume-docx.js
 */

const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType, VerticalAlign,
  PageOrientation, convertMillimetersToTwip, NumberFormat,
} = require("docx");
const fs = require("fs");

// ─── Measurements ─────────────────────────────────────────────────────────────
const mm   = (v) => convertMillimetersToTwip(v);
const PAGE_W   = mm(210);
const SIDEBAR_W = mm(64);
const CONTENT_W = mm(146);   // 210 - 64

// ─── Colour palette (matches CSS vars) ───────────────────────────────────────
const CLR = {
  sidebarBg:  "0B1F3A",
  sidebarBg2: "0A1730",
  white:      "FFFFFF",
  name:       "FFFFFF",
  roleText:   "93C5FD",
  roleSub:    "7DD3FC",
  sidebarH2:  "BFDBFE",
  sidebarTxt: "E2E8F0",
  sidebarMut: "CBD5E1",
  divider:    "1E3A5F",
  accent:     "0EA5E9",
  accent2:    "1D4ED8",
  accentDark: "1E3A8A",
  lightBlueBg:"EFF6FF",
  lightBlueBd:"BFDBFE",
  chipBg:     "DBEAFE",
  chipTxt:    "1E40AF",
  chip2Bg:    "DCFCE7",
  chip2Txt:   "166534",
  chip3Bg:    "F3E8FF",
  chip3Txt:   "6B21A8",
  chip4Bg:    "ECFEFF",
  chip4Txt:   "0E7490",
  chip5Bg:    "FEF9C3",
  chip5Txt:   "854D0E",
  companyBg:  "F0F7FF",
  contentBg:  "FFFFFF",
  ink:        "0F172A",
  muted:      "334155",
  border:     "DBE5F3",
  awardBdr:   "1D4ED8",
  tlLine:     "2563EB",
};

const CHIP_COLORS = [
  [CLR.chipBg,  CLR.chipTxt],
  [CLR.chip2Bg, CLR.chip2Txt],
  [CLR.chip3Bg, CLR.chip3Txt],
  [CLR.chip4Bg, CLR.chip4Txt],
  [CLR.chip5Bg, CLR.chip5Txt],
];

const FONT = "Segoe UI";

// ─── Shared border configs ────────────────────────────────────────────────────
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto" };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideH: NO_BORDER, insideV: NO_BORDER };

// ─── Sidebar paragraph builders ──────────────────────────────────────────────
function sbPara(children, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.spaceBefore ?? mm(1.2), after: opts.spaceAfter ?? mm(1.2), line: opts.line ?? 240 },
    shading: { type: ShadingType.CLEAR, fill: CLR.sidebarBg },
    border: opts.border || undefined,
    children,
  });
}

function sbH2(text) {
  return sbPara([
    new TextRun({ text: text.toUpperCase(), bold: true, size: 17, color: CLR.sidebarH2, font: FONT }),
  ], { spaceBefore: mm(3.5), spaceAfter: mm(1.5), border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: "1E3A5F" } } });
}

function sbText(text, opts = {}) {
  return sbPara([
    new TextRun({ text, size: opts.size ?? 17, color: opts.color ?? CLR.sidebarTxt, bold: opts.bold ?? false, font: FONT }),
  ], { spaceBefore: mm(0.8), spaceAfter: mm(0.8) });
}

function sbBullet(text, opts = {}) {
  return sbPara([
    new TextRun({ text: "▸  ", size: 15, color: CLR.accent, font: FONT }),
    new TextRun({ text, size: opts.size ?? 17, color: opts.color ?? CLR.sidebarMut, font: FONT }),
  ], { spaceBefore: mm(0.6), spaceAfter: mm(0.6) });
}

function sbSpacer() {
  return sbPara([], { spaceBefore: mm(2), spaceAfter: 0 });
}

// ─── Content paragraph builders ──────────────────────────────────────────────
function cPara(children, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.spaceBefore ?? mm(1.5), after: opts.spaceAfter ?? mm(1.5), line: opts.line ?? 252 },
    shading: opts.shading || undefined,
    border: opts.border || undefined,
    children,
  });
}

function cH2(text) {
  return new Paragraph({
    spacing: { before: mm(5), after: mm(2.5) },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: CLR.accent2 } },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 20, color: CLR.accent2, font: FONT }),
    ],
  });
}

function roleRow(title, date) {
  return new Paragraph({
    spacing: { before: mm(4.5), after: mm(1) },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: CLR.border } },
    children: [
      new TextRun({ text: title, bold: true, size: 24, color: CLR.ink, font: FONT }),
      new TextRun({ text: "    " }),
      new TextRun({
        text: date, size: 18, color: CLR.accentDark, font: FONT, bold: true,
        shading: { type: ShadingType.CLEAR, fill: CLR.chipBg },
      }),
    ],
  });
}

function companyRow(name) {
  return new Paragraph({
    spacing: { before: mm(1.5), after: mm(1.5) },
    shading: { type: ShadingType.CLEAR, fill: CLR.companyBg },
    border: { left: { style: BorderStyle.SINGLE, size: 14, color: "60A5FA" } },
    children: [
      new TextRun({ text: "  🏢  " + name, bold: true, size: 18, color: CLR.ink, font: FONT }),
    ],
  });
}

function chipRow(chips) {
  const runs = [];
  chips.forEach((c, i) => {
    const [bg, fg] = CHIP_COLORS[i % CHIP_COLORS.length];
    runs.push(new TextRun({
      text: " " + c + " ",
      size: 16, bold: true, color: fg, font: FONT,
      shading: { type: ShadingType.CLEAR, fill: bg },
    }));
    if (i < chips.length - 1) runs.push(new TextRun({ text: "  ", size: 16 }));
  });
  return new Paragraph({ spacing: { before: mm(1.5), after: mm(2) }, children: runs });
}

function cBullet(runs) {
  const children = typeof runs === "string"
    ? [new TextRun({ text: runs, size: 19, color: CLR.muted, font: FONT })]
    : runs;
  return new Paragraph({
    spacing: { before: mm(1.2), after: mm(1.2) },
    indent: { left: mm(5), hanging: mm(4) },
    children: [
      new TextRun({ text: "●  ", size: 16, color: CLR.accent2, font: FONT }),
      ...children,
    ],
  });
}

function b(text)  { return new TextRun({ text, bold: true, size: 19, color: CLR.ink,  font: FONT }); }
function n(text)  { return new TextRun({ text, size: 19, color: CLR.muted, font: FONT }); }
function spacer() { return new Paragraph({ spacing: { before: mm(2), after: 0 }, children: [] }); }

function skillRow(label, items) {
  return [
    new Paragraph({
      spacing: { before: mm(2.5), after: mm(1) },
      shading: { type: ShadingType.CLEAR, fill: CLR.lightBlueBg },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: CLR.accent } },
      children: [
        new TextRun({ text: "  " + label, bold: true, size: 18, color: CLR.accent2, font: FONT }),
      ],
    }),
    new Paragraph({
      spacing: { before: mm(0.5), after: mm(1.5) },
      children: [
        new TextRun({ text: items.join("  ·  "), size: 17, color: CLR.muted, font: FONT }),
      ],
    }),
  ];
}

function awardRow(title, meta) {
  return [
    new Paragraph({
      spacing: { before: mm(2.5), after: mm(0.5) },
      border: { left: { style: BorderStyle.SINGLE, size: 14, color: CLR.awardBdr } },
      children: [
        new TextRun({ text: "  ★  " + title, bold: true, size: 19, color: CLR.ink, font: FONT }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: mm(1) },
      indent: { left: mm(4) },
      children: [
        new TextRun({ text: meta, size: 17, color: CLR.muted, font: FONT }),
      ],
    }),
  ];
}

// ─── Table layout ─────────────────────────────────────────────────────────────
function buildPage(sbChildren, ctChildren) {
  return new Table({
    width: { size: PAGE_W, type: WidthType.DXA },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        cantSplit: false,
        children: [
          // Sidebar cell
          new TableCell({
            width: { size: SIDEBAR_W, type: WidthType.DXA },
            verticalAlign: VerticalAlign.TOP,
            shading: { type: ShadingType.CLEAR, fill: CLR.sidebarBg },
            borders: {
              top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER,
              right: { style: BorderStyle.SINGLE, size: 6, color: CLR.accent },
            },
            margins: { top: mm(6), bottom: mm(6), left: mm(4), right: mm(4) },
            children: sbChildren,
          }),
          // Content cell
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            verticalAlign: VerticalAlign.TOP,
            shading: { type: ShadingType.CLEAR, fill: CLR.contentBg },
            borders: NO_BORDERS,
            margins: { top: mm(6), bottom: mm(6), left: mm(6), right: mm(6) },
            children: ctChildren,
          }),
        ],
      }),
    ],
  });
}

// ─── Photo ────────────────────────────────────────────────────────────────────
const photoData = fs.readFileSync("profile/naveen.jpg");
const photoRun = new ImageRun({
  data: photoData,
  transformation: { width: 120, height: 155 },
  type: "jpg",
});

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — Sidebar
// ═══════════════════════════════════════════════════════════════════════════════
const p1Sb = [
  // Name
  sbPara([
    new TextRun({ text: "NAVEEN REDDY", bold: true, size: 30, color: CLR.name, font: FONT }),
  ], { align: AlignmentType.CENTER, spaceBefore: mm(4), spaceAfter: 0 }),
  sbPara([
    new TextRun({ text: "JANAGAMA", bold: true, size: 30, color: CLR.name, font: FONT }),
  ], { align: AlignmentType.CENTER, spaceBefore: 0, spaceAfter: mm(1.5) }),
  sbPara([
    new TextRun({ text: "AI-Enabled SRE & DevOps Engineer", bold: true, size: 16, color: CLR.roleText, font: FONT }),
  ], { align: AlignmentType.CENTER, spaceBefore: 0, spaceAfter: 0 }),
  sbPara([
    new TextRun({ text: "Platform & Cloud Engineering Specialist", size: 15, color: CLR.roleSub, font: FONT }),
  ], {
    align: AlignmentType.CENTER, spaceBefore: 0, spaceAfter: mm(3),
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: CLR.divider } },
  }),

  // Photo
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: mm(4), after: mm(4) },
    shading: { type: ShadingType.CLEAR, fill: CLR.sidebarBg },
    children: [photoRun],
  }),

  // Contact
  sbH2("Contact"),
  sbText("📞  +91 99122 46990"),
  sbText("📧  naveen535990@gmail.com"),
  sbText("📍  Hyderabad, India"),
  sbText("🔗  linkedin.com/in/naveen-reddy-janagama", { size: 15 }),
  sbText("🐙  github.com/naveen-janagama"),

  sbSpacer(),

  // Education
  sbH2("Education"),
  sbText("Bachelor of Technology", { bold: true }),
  sbText("JNTU, Hyderabad, India"),
  sbText("2010"),

  sbSpacer(),

  // Certifications
  sbH2("Certifications"),
  sbText("AWS: Certified Solutions Architect", { size: 16 }),
  sbText("AZURE: Microsoft Azure Administrator", { size: 16 }),
  sbText("ITIL: ITIL V4 Foundation", { size: 16 }),

  sbSpacer(),

  // Languages
  sbH2("Languages"),
  sbText("English  ·  Hindi  ·  Telugu"),

  sbSpacer(),

  // Focus Areas
  sbH2("Focus Areas"),
  sbBullet("SRE & Reliability"),
  sbBullet("Cloud Operations"),
  sbBullet("CI/CD & IaC"),
  sbBullet("Observability"),
  sbBullet("Incident Management"),
  sbBullet("AI-Driven Ops"),
  sbBullet("Zero Downtime"),
  sbBullet("Platform Engineering"),

  sbSpacer(),

  // Industry Domains
  sbH2("Industry Domains"),
  sbBullet("Banking & Financial Services"),
  sbBullet("E-commerce & Lab Services"),
  sbBullet("Insurance & Utilities"),
  sbBullet("Information Storage & Data Mgmt"),
];

// PAGE 1 — Content
const p1Ct = [
  cH2("Profile Summary"),
  new Paragraph({
    spacing: { before: mm(2), after: mm(3) },
    shading: { type: ShadingType.CLEAR, fill: CLR.lightBlueBg },
    border: { left: { style: BorderStyle.SINGLE, size: 14, color: CLR.accent2 } },
    children: [
      new TextRun({ text: "  ", size: 19 }),
      b("AI-Enabled Site Reliability, DevOps, and Platform Engineer"),
      n(" with "), b("15+ years"), n(" delivering zero-downtime, enterprise-grade platforms for "),
      b("Commonwealth Bank of Australia (CommBiz)"), n(", FIS Global, and Eurofins across Banking, Financial Services, E-commerce, Insurance, and Information Storage domains."),
    ],
  }),
  new Paragraph({
    spacing: { before: mm(1.5), after: mm(3) },
    shading: { type: ShadingType.CLEAR, fill: CLR.lightBlueBg },
    border: { left: { style: BorderStyle.SINGLE, size: 14, color: CLR.accent2 } },
    children: [
      new TextRun({ text: "  ", size: 19 }),
      n("Currently owning end-to-end production reliability for CommBiz — CBA's flagship business banking platform serving "),
      b("500,000+ customers"), n(" — including blue-green release engineering via "),
      b("Octopus Deploy & ACDC"), n(", AWS cloud operations (EC2, Route 53, Auto Scaling, Akamai CDN/WAF), full-stack observability with "),
      b("Splunk & AppDynamics"), n(", and P1/P2 incident war-room leadership under ITIL V4 governance and ServiceNow change control."),
    ],
  }),
  new Paragraph({
    spacing: { before: mm(1.5), after: mm(3) },
    children: [
      n("Deep expertise in multi-cloud infrastructure (AWS & Azure), Kubernetes (AKS & EKS), Docker containerisation, microservices, IaC (Terraform, CloudFormation, Bicep, Chef), CI/CD pipelines (GitHub Actions, Jenkins), and intelligent monitoring (Splunk, Dynatrace, Grafana, Prometheus, CloudWatch, SolarWinds, Datadog). Early AI adopter integrating "),
      b("GitHub Copilot, Claude Code, Roo Code, Cline, and ChatGPT"), n(". Certified: "),
      b("AWS Solutions Architect · Azure Administrator (AZ-104) · ITIL V4 Foundation"), n("."),
    ],
  }),

  // Stat chips
  chipRow(["15+ Yrs · SRE & DevOps", "Zero-Downtime Releases", "AWS & Azure Multi-Cloud", "K8s · Docker · IaC", "AI-Driven Engineering"]),

  cH2("Professional Experience"),

  roleRow("SRE, DevOps & Platform Engineer", "Jan 2022 – Present"),
  companyRow("Commonwealth Bank of Australia — CommBiz Platform"),
  chipRow(["Banking", "CBA", "CommBiz", "500K+ Business Customers", "AWS", "Akamai"]),

  cBullet([b("Own end-to-end production release management"), n(" for CommBiz using "), b("Octopus Deploy"), n(" & "), b("ACDC"), n(" — blue-green deployments, controlled rollouts, auto smoke tests, auto-rollback, and "), b("ServiceNow"), n(" change-gate governance — zero-downtime for 500K+ business banking customers.")]),
  cBullet([n("Drive "), b("AWS cloud operations"), n(" — EC2, S3, Route 53 DNS failover, Auto Scaling, and "), b("Akamai CDN/WAF"), n(" — maintaining multi-region availability and executing DR strategies for mission-critical banking workloads.")]),
  cBullet([n("Architect and maintain "), b("Splunk"), n(" observability platform: custom SPL dashboards, log analytics, correlated alerting, and SLI/SLO metrics — reducing MTTD by "), b("~40%"), n(" and enabling proactive detection of payment processing anomalies.")]),
  cBullet([n("Deploy and manage "), b("AppDynamics APM"), n(" across application tiers — transaction flow mapping, business transaction baselining, and intelligent anomaly detection for real-time performance governance.")]),
  cBullet([n("Lead "), b("P1/P2 incident war rooms"), n(": rapid triage, coordinated service restoration, stakeholder communications, structured RCA, and post-incident reviews — reducing repeat incidents by "), b("~30%"), n(" through ITIL V4 problem management and KB article authoring.")]),
  cBullet([n("Deliver "), b("SSL/TLS certificate lifecycle management"), n(" and critical vulnerability remediation across 50+ production endpoints; manage Akamai WAF rule changes under strict change control.")]),
  cBullet([n("Develop "), b("PowerShell and Python automation"), n(" for runbook execution, self-healing workflows, deployment validation, compliance reporting, and patching — saving "), b("15+ engineering hours"), n(" per release cycle.")]),
  cBullet([n("Integrate "), b("GitHub Copilot and Claude Code"), n(" into SRE workflows for AI-assisted IaC generation, log pattern analysis, PowerShell script authoring, and incident diagnostics.")]),
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — Sidebar
// ═══════════════════════════════════════════════════════════════════════════════
const p2Sb = [
  sbPara([
    new TextRun({ text: "EXPERIENCE", bold: true, size: 28, color: CLR.name, font: FONT }),
  ], { align: AlignmentType.CENTER, spaceBefore: mm(4), spaceAfter: mm(1) }),
  sbPara([
    new TextRun({ text: "Continued from Page 1", size: 15, color: CLR.roleSub, font: FONT }),
  ], {
    align: AlignmentType.CENTER, spaceBefore: 0, spaceAfter: mm(4),
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: CLR.divider } },
  }),

  sbH2("Key Achievements"),
  sbBullet("Star of Month — CBA: Outstanding ownership & zero-downtime delivery.", { size: 16 }),
  sbBullet("MTTD –40%: Splunk observability stack with correlated dashboards.", { size: 16 }),
  sbBullet("Repeat Incidents –30%: Structured RCA & ITIL V4 problem management.", { size: 16 }),
  sbBullet("15+ Hrs Saved/Release: PowerShell & Python runbook automation.", { size: 16 }),
  sbBullet("Zero-Downtime Releases: Blue-green pipelines with auto-rollback.", { size: 16 }),
  sbBullet("AI Pioneer: GitHub Copilot, Claude Code, Roo Code, Cline, ChatGPT.", { size: 16 }),

  sbSpacer(),

  sbH2("Day-to-Day Activities"),
  sbBullet("Blue-Green Releases"),
  sbBullet("Octopus Deploy / ACDC"),
  sbBullet("P1/P2 War Rooms"),
  sbBullet("Splunk SPL Dashboards"),
  sbBullet("AppDynamics APM"),
  sbBullet("ServiceNow Changes"),
  sbBullet("RCA & Post-Mortems"),
  sbBullet("SSL & Vuln Management"),
  sbBullet("AWS Cloud Operations"),
  sbBullet("PowerShell / Python"),
  sbBullet("Runbook Automation"),
  sbBullet("GitHub Copilot / AI"),

  sbSpacer(),

  sbH2("Clients & Employers"),
  sbBullet("Commonwealth Bank"),
  sbBullet("FIS Global"),
  sbBullet("Eurofins"),
  sbBullet("Iron Mountain"),
  sbBullet("J.P. Morgan (via FIS)"),
  sbBullet("IMFS"),
];

// PAGE 2 — Content
const p2Ct = [
  cH2("Professional Experience (Continued)"),

  roleRow("Service Delivery Analyst / SRE", "Aug 2021 – Dec 2021"),
  companyRow("FIS Global — Express SRO Global Payments Platform (USA)"),
  chipRow(["Financial Services", "FIS Global", "130+ Countries", "Azure", "Dynatrace"]),
  cBullet([n("Deployed and operated multi-tier applications across "), b("Microsoft Azure"), n(" — Azure VMs, App Services, load balancers, and "), b("SQL Server"), n(" databases — supporting global ATM, POS, and online payment-gateway processing across 130+ countries.")]),
  cBullet([n("Engineered intelligent monitoring using "), b("Azure Monitor and Dynatrace"), n(" — custom dashboards, distributed tracing, anomaly detection alerts, and correlated log queries surfacing failed and fraudulent transaction patterns before business impact.")]),
  cBullet([n("Managed "), b("P1/P2 incident response"), n(" under strict financial SLAs: rapid triage, deep SQL Server query analysis, DB job monitoring, fraud transaction investigation, and coordinated service restoration across distributed payment systems.")]),
  cBullet("Authored incident runbooks, KB articles, and escalation playbooks standardising response procedures and reducing MTTR for recurring payment gateway failures."),

  spacer(),

  roleRow("Senior Product Specialist / SRE", "Sep 2018 – Aug 2021"),
  companyRow("Eurofins IT Solutions — EOL & OSO Platforms (USA)"),
  chipRow(["E-commerce", "Eurofins", "50 Countries", "IIS", "Jenkins", "Azure"]),
  cBullet([n("Managed full-stack application hosting on "), b("IIS and IBM WebSphere"), n(" across dev, staging, and production — enforcing environment parity, configuration standards, and IIS application pool health for 99.9% SLA across 50 countries.")]),
  cBullet([n("Executed controlled production deployments using "), b("Jenkins CI, Chef"), n(" configuration management, and "), b("Octopus Deploy"), n(" — environment-specific config injection, pre/post-deployment smoke tests, and rollback procedures.")]),
  cBullet([n("Provisioned and maintained "), b("Azure VMs, load balancers, and MySQL databases"), n("; authored PowerShell automation for IIS configuration, server patching, and operational compliance; managed Active Directory and Windows Server infrastructure.")]),
  cBullet("Performed SSL certificate management, security hardening, and infrastructure setup for new regional PSC application deployments — supporting 24×7 global laboratory operations."),

  spacer(),

  roleRow("System Engineer — Application Management", "Feb 2016 – Sep 2018"),
  companyRow("Iron Mountain — Hosted Accutrac & GroupTrak GTx (USA)"),
  chipRow(["Information Storage", "Iron Mountain", "Windows Server", "IIS", "SQL Server"]),
  cBullet("Provided 24×7 application support for IIS-hosted Hosted Accutrac (order management) and GroupTrak GTx (marketing fulfilment) platforms — handling incidents, change requests, and service restorations under ITSM governance."),
  cBullet([n("Managed "), b("Windows Server, IIS, and SQL Server"), n(" infrastructure — deployments, application tier configuration, DB job monitoring, and scheduled task management across production and DR environments.")]),
  cBullet("Coordinated structured troubleshooting, root cause analysis, and KB article authoring — building a reusable knowledge base that reduced repeat incident resolution time across multi-tier hosted applications."),
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — Sidebar
// ═══════════════════════════════════════════════════════════════════════════════
const p3Sb = [
  sbPara([
    new TextRun({ text: "SKILLS & MORE", bold: true, size: 26, color: CLR.name, font: FONT }),
  ], { align: AlignmentType.CENTER, spaceBefore: mm(4), spaceAfter: mm(1) }),
  sbPara([
    new TextRun({ text: "SRE · DevOps · Platform · Cloud · AI", size: 15, color: CLR.roleSub, font: FONT }),
  ], {
    align: AlignmentType.CENTER, spaceBefore: 0, spaceAfter: mm(4),
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: CLR.divider } },
  }),

  sbH2("Hobbies & Interests"),
  sbBullet("✈️  Travelling"),
  sbBullet("👨‍👩‍👧  Family Time"),
  sbBullet("🍳  Cooking"),
  sbBullet("📈  Trading"),
  sbBullet("🤖  AI Exploring"),
  sbBullet("📚  Tech Blogs"),

  sbSpacer(),

  sbH2("Certifications"),
  sbText("AWS: Certified Solutions Architect", { size: 16 }),
  sbText("AZURE: Microsoft Azure Administrator", { size: 16 }),
  sbText("ITIL: ITIL V4 Foundation", { size: 16 }),

  sbSpacer(),

  sbH2("Focus Areas"),
  sbBullet("SRE & Reliability"),
  sbBullet("Cloud Operations"),
  sbBullet("CI/CD & IaC"),
  sbBullet("Observability"),
  sbBullet("Incident Management"),
  sbBullet("AI-Driven Ops"),
  sbBullet("Zero Downtime"),
  sbBullet("Platform Engineering"),

  sbSpacer(),

  sbH2("Industry Domains"),
  sbBullet("Banking & Financial Services"),
  sbBullet("E-commerce & Lab Services"),
  sbBullet("Insurance & Utilities"),
  sbBullet("Information Storage & Data Mgmt"),

  sbSpacer(),

  sbH2("Languages"),
  sbText("English  ·  Hindi  ·  Telugu"),
];

// PAGE 3 — Content
const p3Ct = [
  cH2("Core Skills"),
  ...skillRow("Cloud Platforms",         ["AWS (EC2, S3, Route 53)", "Auto Scaling & CloudWatch", "Microsoft Azure (VMs, AKS)", "Azure Monitor & AD", "Multi-Cloud Ops & DR", "IaaS/PaaS"]),
  ...skillRow("CI/CD & Release",         ["Octopus Deploy & ACDC", "GitHub Actions & Jenkins", "Blue-Green Deployments", "Auto Rollback Pipelines", "Smoke Testing", "Playwright"]),
  ...skillRow("SRE & Reliability",       ["SLO / SLI / SLA & Error Budgets", "P1/P2 Incident War Rooms", "Root Cause Analysis", "Change & Problem Mgmt", "DR & Resiliency", "Zero-Downtime"]),
  ...skillRow("Observability",           ["Splunk (SPL Dashboards)", "AppDynamics APM", "Dynatrace & Datadog", "Grafana & Prometheus", "CloudWatch & SolarWinds", "Oberv · MLT"]),
  ...skillRow("Containers & Kubernetes", ["Docker & Containerisation", "Kubernetes (AKS & EKS)", "Cluster Administration", "Microservices Architecture", "Cloud-Native Deployments"]),
  ...skillRow("IaC & Automation",        ["Terraform & CloudFormation", "Bicep & Chef", "PowerShell & Python", "Runbook & Self-Heal Automation", "Bash / YAML / JSON"]),
  ...skillRow("Platform, Network & DB",  ["IIS · Windows Server · AD", "F5 BIG-IP & Akamai CDN/WAF", "Load Balancing & VMware", "SQL Server · MySQL · Oracle", "IBM WebSphere"]),
  ...skillRow("ITSM & Governance",       ["ServiceNow & Jira", "BMC Remedy & Assyst", "SSL / TLS Cert Lifecycle", "Vulnerability Remediation", "KB Articles & Runbooks", "ITIL V4"]),
  ...skillRow("AI Tools & Adoption",     ["GitHub Copilot", "Claude Code & Roo Code", "Cline & ChatGPT", "VS Code + AI Extensions", "AI-Driven IaC & Diagnostics"]),

  cH2("Professional Timeline"),
  new Paragraph({
    spacing: { before: mm(2), after: mm(1.5) },
    children: [n("15+ years across Banking, Financial Services, E-commerce & Information Storage — building, automating, and owning zero-downtime enterprise platforms.")],
  }),
  ...["2010  →  B.Tech — JNTU Hyderabad",
      "2016  →  System Engineer — Iron Mountain (USA)",
      "2018  →  Sr. SRE / Product Specialist — Eurofins (USA)",
      "2021  →  SRE / Service Delivery Analyst — FIS Global (USA)",
      "2022 →  SRE, DevOps & Platform Engineer — CBA CommBiz (Australia)"].map((line) => {
    const [yr, ...rest] = line.split("  →  ");
    return new Paragraph({
      spacing: { before: mm(1), after: mm(1) },
      children: [
        new TextRun({ text: yr + "  →  ", bold: true, size: 19, color: CLR.accent2, font: FONT }),
        new TextRun({ text: rest.join(""), size: 19, color: CLR.muted, font: FONT }),
      ],
    });
  }),

  cH2("Awards & Recognition"),
  ...awardRow("Star of the Month — CBA",         "Recognised for outstanding ownership, zero-downtime delivery, and proactive SRE practices on CommBiz — CBA's flagship business banking platform serving 500K+ customers."),
  ...awardRow("MTTD Reduced ~40%",               "Architected Splunk observability stack with correlated dashboards and intelligent alerting, enabling proactive detection of payment processing anomalies across CommBiz."),
  ...awardRow("Zero-Downtime Release Pipeline",  "Architected blue-green deployment pipelines with auto-rollback, smoke-test gates, and ServiceNow change governance — eliminating unplanned outages during production releases."),
  ...awardRow("Repeat Incidents Reduced ~30%",   "Drove structured RCA, ITIL V4 problem management, preventive action programmes, and KB documentation that measurably reduced repeat production incidents at CBA."),
  ...awardRow("15+ Hours Saved Per Release",     "Developed PowerShell and Python automation for SSL renewals, deployment validation, compliance checks, and patching workflows — significantly reducing toil per release cycle."),
  ...awardRow("AI Adoption Pioneer",             "First on team to integrate GitHub Copilot, Claude Code, Roo Code, Cline, and ChatGPT into SRE and IaC workflows — accelerating engineering velocity and improving code quality."),
];

// ═══════════════════════════════════════════════════════════════════════════════
// Build & Write
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 19, color: CLR.muted },
        paragraph: { spacing: { line: 252 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: mm(210), height: mm(297), orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [buildPage(p1Sb, p1Ct)],
    },
    {
      properties: {
        page: {
          size: { width: mm(210), height: mm(297), orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [buildPage(p2Sb, p2Ct)],
    },
    {
      properties: {
        page: {
          size: { width: mm(210), height: mm(297), orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [buildPage(p3Sb, p3Ct)],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "profile/Naveen_Reddy_Janagama_Resume.docx";
  const tmp = out + ".tmp";
  fs.writeFileSync(tmp, buf);
  try { fs.unlinkSync(out); } catch (_) {}
  fs.renameSync(tmp, out);
  console.log("✅  " + out + " generated successfully");
}).catch((err) => {
  console.error("❌  Error generating docx:", err.message);
  process.exit(1);
});
