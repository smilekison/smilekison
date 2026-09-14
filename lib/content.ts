/* ============================================================================
   SITE CONTENT — single source of truth.
   Every string the visitor reads lives here. Edit this file, rebuild, done.

   Lines marked  // ▲ VERIFY  are placeholders I could not source from your
   brief. Replace them with real facts before you publish. Nothing here is a
   fabricated statistic — the numbers come from your own pre.txt brief, but
   confirm them anyway.
   ============================================================================ */

export const profile = {
  name: "Smile Kisan",
  role: "DevOps Engineer",
  // The one sentence a recruiter remembers. Keep it under ~60 characters.
  statement: "Engineering reliable systems from code to cloud.",
  // Hero paragraph. 2 sentences max — the page moves on quickly.
  summary:
    "I build and operate the delivery infrastructure that software teams ship on — pipelines, container platforms, and the observability that proves they work. Currently focused on Kubernetes platform engineering and cloud cost discipline.",
  location: "United Kingdom", // ▲ VERIFY
  availability: "Open to DevOps & platform engineering roles",
  email: "smilekisan.dev@gmail.com",
  domain: "smilekisan.com",
  links: {
    github: "https://github.com/smilekisan", // ▲ VERIFY
    linkedin: "https://www.linkedin.com/in/smilekisan", // ▲ VERIFY
    resume: "/resume.pdf", // drop your PDF at public/resume.pdf
  },
};

/* -------------------------------------------------------------------------- */

export const about = {
  heading: "I make deployment boring.",
  body: [
    "Most outages are not exotic. They are a manual step someone forgot, a config that drifted, or a signal nobody was watching. My work is removing those three failure modes from a team's delivery path.",
    "I came to infrastructure through software engineering, which shapes how I approach it: pipelines are products, runbooks are interfaces, and the people deploying at 2am are the users. Reliability is a design problem before it is an ops problem.",
  ],
  // Short principles. Three is the right number; four starts to read as filler.
  principles: [
    {
      title: "Automate the repetitive",
      body: "If a human does it twice, it becomes a pipeline stage. Manual steps are unreviewed, untested code.",
    },
    {
      title: "Observe the important",
      body: "Dashboards nobody reads are decoration. Instrument the handful of signals that predict user pain.",
    },
    {
      title: "Secure the critical",
      body: "Scanning in CI, least-privilege by default, secrets that never touch a repository. Security is a build stage, not an audit.",
    },
  ],
};

/* -------------------------------------------------------------------------- */

export type Metric = {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  note: string;
};

// ▲ VERIFY — these figures come from your brief. Confirm each is defensible in
// an interview before publishing; a number you cannot explain is worse than none.
export const metrics: Metric[] = [
  {
    value: 75,
    suffix: "%",
    label: "Faster deployments",
    note: "Release cycle reduction after CI/CD rebuild",
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Service availability",
    note: "Sustained across managed production workloads",
  },
  {
    value: 2.5,
    suffix: "+",
    decimals: 1,
    label: "Years in infrastructure",
    note: "Platform, delivery and cloud operations",
  },
  {
    value: 40,
    suffix: "%",
    label: "Cloud spend reduced",
    note: "Rightsizing, autoscaling and storage lifecycle", // ▲ VERIFY
  },
];

/* -------------------------------------------------------------------------- */

export type TimelineEntry = {
  year: string;
  title: string;
  org: string;
  body: string;
  tags: string[];
};

// ▲ VERIFY — organisation names are placeholders. Replace `org` with real ones.
export const timeline: TimelineEntry[] = [
  {
    year: "2020",
    title: "Software Engineering",
    org: "First engineering role",
    body: "Started in application development — building services, writing tests, and learning what makes code survive contact with production. The habit of treating infrastructure as software started here.",
    tags: ["Python", "Git", "REST APIs", "SQL"],
  },
  {
    year: "2022",
    title: "Relocation to the UK",
    org: "Career transition",
    body: "Moved to the United Kingdom and deliberately shifted toward infrastructure, where the problems I found most interesting lived: delivery speed, reliability, and the cost of running software at scale.",
    tags: ["Linux", "Networking", "Bash", "Docker"],
  },
  {
    year: "2024",
    title: "DevOps Engineering",
    org: "Delivery & automation",
    body: "Owned CI/CD for multi-service applications. Replaced manual release checklists with pipelines that build, scan, test and promote artefacts, cutting release cycles substantially and removing the deploy-day ritual.",
    tags: ["Jenkins", "GitLab CI", "Terraform", "Ansible"],
  },
  {
    year: "2025",
    title: "Cloud Infrastructure",
    org: "Platform engineering",
    body: "Designed and operated Kubernetes platforms on AWS — provisioning through Terraform, GitOps-driven deployments, and a Prometheus/Grafana stack that gave teams real service-level visibility for the first time.",
    tags: ["AWS", "Kubernetes", "Helm", "Prometheus"],
  },
  {
    year: "Now",
    title: "Platform reliability",
    org: "Current work",
    body: "Working on the boring-by-design end of platform engineering: progressive delivery, policy-as-code guardrails, and making cost a first-class metric alongside latency and error rate.",
    tags: ["ArgoCD", "OpenTelemetry", "FinOps", "Policy as code"],
  },
];

/* -------------------------------------------------------------------------- */

export type ArchNode = {
  id: string;
  label: string;
  detail: string;
  // ids of nodes this one feeds into
  to: string[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  problem: string;
  solution: string;
  outcomes: { value: string; label: string }[];
  stack: string[];
  architecture: ArchNode[];
  // Optional external links; omit to hide the button.
  repo?: string;
  live?: string;
};

// ▲ VERIFY — these are structured from the project archetypes in your brief.
// Replace the prose with the real engagements, and delete any you did not do.
export const projects: Project[] = [
  {
    slug: "cicd-transformation",
    index: "01",
    title: "Enterprise CI/CD transformation",
    tagline:
      "Replaced a manual, checklist-driven release process with a pipeline that builds, scans, and promotes every commit.",
    year: "2024",
    role: "DevOps Engineer — pipeline design and rollout",
    problem:
      "Releases were a scheduled event. A coordinator walked a checklist across four environments, artefacts were rebuilt per stage so staging and production were never provably identical, and a failed deploy meant a manual rollback under time pressure. Deployment frequency was capped by how many checklists a person could run.",
    solution:
      "One pipeline, one artefact. A commit produces a single signed container image that is promoted — never rebuilt — through environments. Static analysis, dependency and image scanning run as blocking stages before promotion. Environment configuration moved into version-controlled Terraform and Helm values, so an environment became a reviewable pull request rather than tribal knowledge.",
    outcomes: [
      { value: "75%", label: "Faster release cycle" },
      { value: "1", label: "Artefact per release, promoted not rebuilt" },
      { value: "0", label: "Manual promotion steps remaining" },
    ],
    stack: ["Jenkins", "Docker", "Terraform", "AWS", "Trivy", "Helm"],
    architecture: [
      { id: "dev", label: "Developer", detail: "Pushes a feature branch and opens a pull request.", to: ["git"] },
      { id: "git", label: "Git", detail: "Branch protection and required reviews gate the trunk.", to: ["ci"] },
      { id: "ci", label: "CI build", detail: "Compiles, unit-tests, and builds one immutable container image.", to: ["scan"] },
      { id: "scan", label: "Security scan", detail: "SAST plus dependency and image CVE scanning. A critical finding fails the build.", to: ["registry"] },
      { id: "registry", label: "Registry", detail: "Signed image lands once and is promoted by digest thereafter.", to: ["cd"] },
      { id: "cd", label: "Deploy", detail: "Helm release against the target cluster, values sourced from Git.", to: ["prod"] },
      { id: "prod", label: "Production", detail: "Health checks gate the rollout; failure triggers automatic rollback.", to: [] },
    ],
  },
  {
    slug: "kubernetes-platform",
    index: "02",
    title: "Kubernetes platform on AWS",
    tagline:
      "A provisioned-from-code EKS platform with GitOps delivery, so product teams deploy without filing infrastructure tickets.",
    year: "2025",
    role: "Platform Engineer — architecture and operations",
    problem:
      "Each team ran its own compute, configured by hand. Cluster versions, ingress patterns, and secret handling differed per team, which made a security change an N-team negotiation. Onboarding a new service took weeks and no two environments were reproducible.",
    solution:
      "A single multi-tenant EKS platform defined entirely in Terraform, with namespace-per-team isolation, standard ingress and TLS, and workload identity replacing long-lived credentials. Delivery is GitOps: ArgoCD reconciles cluster state from a repository, so the cluster's configuration is reviewable and revertible. A golden-path Helm chart made new service onboarding a same-day task.",
    outcomes: [
      { value: "99.9%", label: "Platform availability" },
      { value: "40%", label: "Compute spend reduced via rightsizing" },
      { value: "Same day", label: "New service onboarding" },
    ],
    stack: ["AWS EKS", "Terraform", "ArgoCD", "Helm", "Karpenter", "Cert-manager"],
    architecture: [
      { id: "user", label: "User", detail: "Traffic arrives at the edge over TLS.", to: ["lb"] },
      { id: "lb", label: "Load balancer", detail: "AWS ALB terminates TLS and routes by host and path.", to: ["ingress"] },
      { id: "ingress", label: "Ingress", detail: "In-cluster controller applies routing, rate limits and auth headers.", to: ["api"] },
      { id: "api", label: "Services", detail: "Team workloads in isolated namespaces with resource quotas.", to: ["workers", "db"] },
      { id: "workers", label: "Workers", detail: "Queue consumers scaled on backlog depth, not CPU.", to: ["db"] },
      { id: "db", label: "Data", detail: "Managed RDS with automated backups and a tested restore path.", to: [] },
    ],
  },
  {
    slug: "observability-stack",
    index: "03",
    title: "Observability and SLO programme",
    tagline:
      "Turned a wall of unread dashboards into four service-level objectives that page a human only when users are affected.",
    year: "2025",
    role: "DevOps Engineer — instrumentation and alerting",
    problem:
      "Alerting was threshold-based and noisy: high CPU paged at 3am whether or not a request had ever failed. Engineers had learned to ignore the channel, which meant real incidents were found by customers first. There was no shared definition of 'the service is healthy'.",
    solution:
      "Instrumented services with OpenTelemetry so latency and errors are measured at the request path rather than inferred from host metrics. Defined SLOs per service with explicit error budgets, and rewrote alerts to fire on burn rate — fast burn pages, slow burn opens a ticket. Every alert links to a runbook with the first three commands to run.",
    outcomes: [
      { value: "4", label: "Services with defined, agreed SLOs" },
      { value: "Burn rate", label: "Alerting model, replacing static thresholds" },
      { value: "1 link", label: "From every page to its runbook" },
    ],
    stack: ["Prometheus", "Grafana", "OpenTelemetry", "Alertmanager", "Loki"],
    architecture: [
      { id: "app", label: "Services", detail: "OpenTelemetry SDK emits traces, metrics and structured logs.", to: ["otel"] },
      { id: "otel", label: "Collector", detail: "Batches, samples and routes telemetry to the right backend.", to: ["prom", "loki"] },
      { id: "prom", label: "Metrics", detail: "Prometheus stores series and evaluates SLO burn-rate rules.", to: ["alert", "graf"] },
      { id: "loki", label: "Logs", detail: "Structured logs, queryable by the same labels as the metrics.", to: ["graf"] },
      { id: "alert", label: "Alerting", detail: "Fast burn pages on-call; slow burn files a ticket.", to: ["oncall"] },
      { id: "graf", label: "Dashboards", detail: "One board per service, showing the four signals that matter.", to: [] },
      { id: "oncall", label: "On-call", detail: "Every page links to a runbook with the first commands to run.", to: [] },
    ],
  },
];

/* -------------------------------------------------------------------------- */

export type Tech = {
  name: string;
  category: "Cloud" | "Orchestration" | "Delivery" | "Infrastructure as code" | "Observability" | "Languages";
  // How it actually fits your workflow — shown on hover (desktop) or tap (mobile).
  use: string;
  // Related technology names — used to highlight the cluster on interaction.
  related: string[];
};

export const stack: Tech[] = [
  { name: "AWS", category: "Cloud", use: "Primary platform — EKS, RDS, S3, IAM and networking.", related: ["Terraform", "Kubernetes", "Karpenter"] },
  { name: "Azure", category: "Cloud", use: "Secondary cloud for AKS workloads and Entra ID integration.", related: ["Kubernetes", "Terraform"] }, // ▲ VERIFY
  { name: "Kubernetes", category: "Orchestration", use: "Runtime for every long-lived service I operate.", related: ["Docker", "Helm", "ArgoCD", "AWS", "Prometheus"] },
  { name: "Docker", category: "Orchestration", use: "Build once, promote by digest. Multi-stage builds keep images small.", related: ["Kubernetes", "Jenkins", "Trivy"] },
  { name: "Helm", category: "Orchestration", use: "Golden-path chart so a new service ships on day one.", related: ["Kubernetes", "ArgoCD"] },
  { name: "Terraform", category: "Infrastructure as code", use: "Every cloud resource is a reviewable plan before it exists.", related: ["AWS", "Azure", "Kubernetes"] },
  { name: "Ansible", category: "Infrastructure as code", use: "Configuration for the hosts that cannot be immutable yet.", related: ["Terraform", "Linux"] },
  { name: "Jenkins", category: "Delivery", use: "Pipeline-as-code for build, scan and promotion stages.", related: ["Docker", "Trivy", "Terraform"] },
  { name: "GitLab CI", category: "Delivery", use: "Merge-request pipelines with environment-scoped credentials.", related: ["Docker", "Terraform"] },
  { name: "ArgoCD", category: "Delivery", use: "Cluster state reconciled from Git — drift is visible and revertible.", related: ["Kubernetes", "Helm"] },
  { name: "Trivy", category: "Delivery", use: "Dependency and image CVE scanning as a blocking build stage.", related: ["Docker", "Jenkins"] },
  { name: "Prometheus", category: "Observability", use: "Metrics store and SLO burn-rate rule evaluation.", related: ["Grafana", "Kubernetes", "OpenTelemetry"] },
  { name: "Grafana", category: "Observability", use: "One board per service showing latency, errors, traffic, saturation.", related: ["Prometheus", "Loki"] },
  { name: "OpenTelemetry", category: "Observability", use: "Vendor-neutral instrumentation at the request path.", related: ["Prometheus", "Grafana", "Loki"] },
  { name: "Loki", category: "Observability", use: "Structured logs sharing labels with the metrics.", related: ["Grafana", "Prometheus"] },
  { name: "Python", category: "Languages", use: "Automation, glue services and operational tooling.", related: ["Bash", "Linux"] },
  { name: "Bash", category: "Languages", use: "Pipeline steps and the scripts that live inside runbooks.", related: ["Linux", "Python"] },
  { name: "Go", category: "Languages", use: "Small controllers and CLIs where a static binary is the right answer.", related: ["Kubernetes", "Docker"] }, // ▲ VERIFY
  { name: "Linux", category: "Languages", use: "The substrate. Systemd, networking, and where the packets actually go.", related: ["Bash", "Ansible"] },
];

/* -------------------------------------------------------------------------- */

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  status: "Certified" | "In progress";
  url?: string;
};

// ▲ VERIFY — replace with certifications you actually hold. Delete the rest.
// An unearned certification on a portfolio is the fastest way to fail a screen.
export const certifications: Certification[] = [
  { name: "AWS Certified Solutions Architect — Associate", issuer: "Amazon Web Services", year: "2024", status: "Certified" },
  { name: "Certified Kubernetes Administrator", issuer: "The Linux Foundation", year: "2025", status: "Certified" },
  { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", year: "2024", status: "Certified" },
  { name: "Certified Kubernetes Security Specialist", issuer: "The Linux Foundation", year: "2026", status: "In progress" },
];

/* -------------------------------------------------------------------------- */

// Decorative terminal. These are not executed — they are a readable summary.
export const terminal: { cmd: string; out: string[] }[] = [
  { cmd: "whoami", out: ["smile-kisan — devops engineer, united kingdom"] },
  { cmd: "expertise --list", out: ["cloud", "kubernetes", "ci/cd", "infrastructure as code", "observability"] },
  {
    cmd: "cat philosophy.txt",
    out: ["automate the repetitive.", "observe the important.", "secure the critical."],
  },
  { cmd: "status", out: ["available for platform & devops roles"] },
];

/* -------------------------------------------------------------------------- */

export const contact = {
  heading: "Have a system that needs to scale?",
  body: "I am open to DevOps, platform and cloud infrastructure roles, and to consulting on delivery pipelines and Kubernetes platforms. The fastest way to reach me is email.",
  cta: "Start a conversation",
};

export const sections = [
  { id: "about", label: "About", index: "01" },
  { id: "experience", label: "Experience", index: "02" },
  { id: "projects", label: "Projects", index: "03" },
  { id: "stack", label: "Stack", index: "04" },
  { id: "certifications", label: "Certifications", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
] as const;
