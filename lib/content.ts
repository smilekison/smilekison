/* ============================================================================
   SITE CONTENT — single source of truth.
   Every string the visitor reads lives here. Edit this file, rebuild, done.

   Reconciled from public/Smile_Kisan_CV.pdf and the previous smilekisan.com
   build, where the two disagreed (phone number, employer names/dates,
   certifications) the conflict was resolved directly with Smile rather than
   guessed. See git history for the reconciliation notes.
   ============================================================================ */

export const profile = {
  name: "Smile Kisan",
  role: "DevOps Engineer",
  // The one sentence a recruiter remembers. Keep it under ~60 characters.
  statement: "Engineering reliable systems from code to cloud.",
  // Hero paragraph. 2 sentences max — the page moves on quickly.
  summary:
    "DevOps engineer with 1.5+ years across AWS infrastructure, CI/CD automation and containerized platforms — from an infrastructure lead role in Nepal to a DevOps internship supporting production systems in the UK. Currently building two platforms end-to-end while open to new roles.",
  availability: "Open to DevOps, Platform & SRE roles — UK and Lithuania",
  email: "smilekisan.dev@gmail.com",
  domain: "smilekisan.com",
  photo: "/pp.jpg",
  links: {
    github: "https://github.com/smilekison",
    linkedin: "https://www.linkedin.com/in/smile-kisan/",
  },
};

/* -------------------------------------------------------------------------- */

export const about = {
  heading: "I make deployment boring.",
  body: [
    "Most outages are not exotic. They are a manual step someone forgot, a config that drifted, or a signal nobody was watching. My work is removing those three failure modes from a team's delivery path.",
    "I came to infrastructure through software engineering — at Terakoya Academia I progressed from intern to infrastructure lead, which shapes how I still approach it: pipelines are products, runbooks are interfaces, and the people deploying under pressure are the users.",
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

export const metrics: Metric[] = [
  {
    value: 75,
    suffix: "%",
    label: "Faster deployments",
    note: "CI/CD migrated to Jenkins + SonarQube at Terakoya Academia",
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "System uptime",
    note: "Sustained across critical infrastructure at Fortray Global Services",
  },
  {
    value: 1.5,
    suffix: "+",
    decimals: 1,
    label: "Years in infrastructure",
    note: "Combined across Terakoya Academia and Fortray Global Services",
  },
  {
    value: 80,
    suffix: "%",
    label: "Manual work reduced",
    note: "Automated monitoring & alerting with PowerShell and Bash",
  },
];

/* -------------------------------------------------------------------------- */

export type TimelineEntry = {
  year: string;
  title: string;
  org: string;
  location?: string;
  body: string;
  // Itemized achievements, matching smilekisan.com's per-role bullet lists.
  // Omitted for non-job entries (education, the "Now" summary).
  bullets?: string[];
  tags: string[];
};

// Newest first — the timeline reads most-recent-to-oldest, like a changelog.
export const timeline: TimelineEntry[] = [
  {
    year: "Now",
    title: "Building, and open to new roles",
    org: "AutoDeploy & LearnInclusive",
    body: "Building two platforms end-to-end — a DevOps automation tool and an accessibility-first LMS — while open to DevOps, platform and SRE roles in the UK and Lithuania.",
    tags: ["Terraform", "Docker", "Kubernetes", "Supabase"],
  },
  {
    year: "2024–25",
    title: "Junior DevOps Engineer (Intern, Hybrid)",
    org: "Fortray Global Services Limited",
    location: "United Kingdom",
    body: "Managed the GitLab/Nexus toolchain across critical infrastructure and led troubleshooting for production issues alongside developers and security engineers.",
    bullets: [
      "Managed the enterprise-wide DevOps toolchain (GitLab, Nexus) across varied deployment strategies, sustaining 99.9% uptime on critical infrastructure.",
      "Automated monitoring and alerting with PowerShell and Bash, cutting manual intervention by 80% and improving incident response time.",
      "Led root-cause troubleshooting for production issues, implementing proactive measures to improve system resilience.",
      "Built monitoring dashboards and automated alerting in Prometheus and Grafana for latency-sensitive applications.",
      "Implemented DevSecOps practices to keep security compliance built into the deployment pipeline, not bolted on after.",
    ],
    tags: ["GitLab CI", "PowerShell", "Prometheus", "Grafana"],
  },
  {
    year: "2022–23",
    title: "Relocated to the UK for a Master's",
    org: "M.Sc. Advanced Computer Science — Distinction, Cardiff Metropolitan University",
    location: "Cardiff, United Kingdom",
    body: "Moved to Cardiff to study cloud computing and distributed systems, completing a dissertation on infrastructure automation. Worked part-time as restaurant crew to support the move while studying.",
    tags: ["Cloud Computing", "Distributed Systems"],
  },
  {
    year: "2020–22",
    title: "Software Engineer → DevOps Engineer",
    org: "Terakoya Academia",
    location: "Nepal",
    body: "Progressed from intern to Infrastructure Team Lead, taking ownership of AWS infrastructure, automation and deployment workflows.",
    bullets: [
      "Progressed from intern to Infrastructure Team Lead / DevOps Engineer, owning cloud infrastructure and deployment workflows.",
      "Designed and automated AWS infrastructure across EC2, VPC, IAM, S3, RDS, ECS, ECR, Lambda and API Gateway.",
      "Automated infrastructure provisioning with Terraform and Ansible, improving environment consistency and cutting manual deployment effort.",
      "Migrated CI/CD to Jenkins with SonarQube vulnerability scanning built into every build — a 75% faster release cycle.",
      "Containerized applications with Docker and ran Kubernetes workloads: scheduling, deployments, services, cluster-level troubleshooting.",
    ],
    tags: ["AWS", "Terraform", "Jenkins", "Docker", "Kubernetes"],
  },
  {
    year: "2015–19",
    title: "Academic foundation",
    org: "Computing diplomas, then a B.Sc. (Hons)",
    location: "Nepal",
    body: "Level 4 and 5 Diplomas in Computing through NCC Education at Softwarica College, followed by a B.Sc. (Hons) in Computing — First Class — through Leeds Beckett University at The British College, Nepal.",
    tags: ["Computing", "Programming Fundamentals"],
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

export const projects: Project[] = [
  {
    slug: "cicd-transformation",
    index: "01",
    title: "Enterprise CI/CD pipeline transformation",
    tagline:
      "Migrated Terakoya Academia off legacy release tooling onto Jenkins, with security scanning built into every build.",
    year: "2022",
    role: "Software Engineer / DevOps — pipeline migration and security integration",
    problem:
      "Releases ran on legacy CI/CD tooling with no automated security scanning and heavy manual steps between build and deploy. Vulnerabilities were only caught if someone remembered to check, and deployment speed was capped by how much of the process a person had to run by hand.",
    solution:
      "Migrated the pipeline to Jenkins-based automation, with SonarQube integrated as a blocking stage for vulnerability and code-quality scanning. Build, test and deploy stages were automated end-to-end, removing the manual handoffs that previously slowed every release.",
    outcomes: [
      { value: "75%", label: "Faster deployment cycle" },
      { value: "Jenkins", label: "Replaced legacy release tooling" },
      { value: "SonarQube", label: "Automated vulnerability scanning added" },
    ],
    stack: ["Jenkins", "SonarQube", "Docker", "GitLab CI", "AWS"],
    architecture: [
      { id: "dev", label: "Developer", detail: "Pushes a commit to the shared repository.", to: ["git"] },
      { id: "git", label: "Git", detail: "Triggers the pipeline on push, no manual kickoff.", to: ["ci"] },
      { id: "ci", label: "Jenkins build", detail: "Compiles, tests, and builds a container image.", to: ["scan"] },
      { id: "scan", label: "SonarQube scan", detail: "Blocking code-quality and vulnerability scan before deploy.", to: ["deploy"] },
      { id: "deploy", label: "Deploy", detail: "Automated deployment replacing the previous manual handoff.", to: ["prod"] },
      { id: "prod", label: "Production", detail: "Release cycle time cut by 75% end to end.", to: [] },
    ],
  },
  {
    slug: "autodeploy",
    index: "02",
    title: "AutoDeploy — multi-service DevOps automation platform",
    tagline:
      "A GitHub App that reads a repository and generates its Docker, CI/CD, Kubernetes, Terraform and Ansible configuration automatically.",
    year: "Current",
    role: "Personal project — solo architecture, backend and DevOps tooling",
    problem:
      "Setting up consistent CI/CD, container and infrastructure-as-code configuration for a new project is repetitive and easy to get wrong — most teams either skip it or hand-roll it per repository, with no shared standard.",
    solution:
      "Built a 7-service platform, each with its own database and signed service-to-service authentication. A GitHub App analyses a repository's dependencies and generates tailored Docker, CI/CD, Kubernetes, Terraform and Ansible configuration. Deploys run over SSH with pre-deployment health checks, nginx traffic switching and automatic rollback, promoting the exact tested image from staging to production by digest.",
    outcomes: [
      { value: "7", label: "Independently deployable services" },
      { value: "Zero-downtime", label: "SSH deploys with health-checked rollout and rollback" },
      { value: "AES-256-GCM", label: "Credential encryption, with org-scoped RBAC and audit logging" },
    ],
    stack: ["Docker", "Kubernetes", "Terraform", "Ansible", "Nginx", "GitHub Actions"],
    architecture: [
      { id: "app", label: "GitHub App", detail: "Analyses a connected repository's dependencies on install.", to: ["gen"] },
      { id: "gen", label: "Config generator", detail: "Produces tailored Docker, CI/CD, Kubernetes, Terraform and Ansible configuration.", to: ["stage"] },
      { id: "stage", label: "Staging deploy", detail: "SSH deploy with pre-deployment health checks.", to: ["switch"] },
      { id: "switch", label: "Traffic switch", detail: "Nginx cuts traffic over once staging passes its checks.", to: ["prod"] },
      { id: "prod", label: "Production", detail: "Promoted by digest — the exact image tested in staging.", to: ["rollback"] },
      { id: "rollback", label: "Rollback", detail: "Automatic revert to the last healthy image on failure.", to: [] },
    ],
  },
  {
    slug: "learninclusive",
    index: "03",
    title: "LearnInclusive — accessibility-first cloud LMS",
    tagline:
      "A learning platform for schools designed around captions, voice navigation and dyslexia-friendly interfaces from day one.",
    year: "Current",
    role: "Personal project — solo product design, frontend and data model",
    problem:
      "Most school LMS platforms treat accessibility as an afterthought, leaving students with visual, cognitive or language needs poorly served by tools built for everyone else first.",
    solution:
      "Designed an accessibility-first LMS for students, teachers, parents and administrators using React, TypeScript, Supabase and PostgreSQL. Role-based access is enforced with Supabase Authentication and Postgres Row Level Security, and the interface includes captions, voice navigation, dyslexia-friendly layouts and multilingual support by default.",
    outcomes: [
      { value: "4", label: "Distinct user roles: students, teachers, parents, admins" },
      { value: "RLS", label: "Postgres Row Level Security enforces per-role access" },
      { value: "Multilingual", label: "Accessibility and language support built in, not bolted on" },
    ],
    stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Row Level Security"],
    architecture: [
      { id: "user", label: "User", detail: "Student, teacher, parent or administrator signs in.", to: ["auth"] },
      { id: "auth", label: "Supabase Auth", detail: "Authenticates and assigns the user's role.", to: ["rls"] },
      { id: "rls", label: "Row Level Security", detail: "Postgres policies scope every query to what that role can see.", to: ["data"] },
      { id: "data", label: "PostgreSQL", detail: "Course, progress and communication data, per-school.", to: ["storage"] },
      { id: "storage", label: "Storage", detail: "Captions, materials and accessibility assets.", to: [] },
    ],
  },
];

/* -------------------------------------------------------------------------- */

export type Tech = {
  name: string;
  category:
    | "Cloud"
    | "Orchestration"
    | "Delivery"
    | "Infrastructure as code"
    | "Observability"
    | "Databases"
    | "Languages";
  // How it actually fits your workflow — shown on hover (desktop) or tap (mobile).
  use: string;
  // Related technology names — used to highlight the cluster on interaction.
  related: string[];
};

export const stack: Tech[] = [
  { name: "AWS", category: "Cloud", use: "Primary cloud — EC2, VPC, IAM, S3, RDS, ECS, ECR, Lambda, API Gateway.", related: ["Terraform", "Docker", "CloudWatch"] },
  { name: "Azure", category: "Cloud", use: "Fundamentals-certified (AZ-900); most hands-on production work has been on AWS.", related: ["Terraform"] },
  { name: "Kubernetes", category: "Orchestration", use: "Workload scheduling, deployments, services and cluster-level troubleshooting.", related: ["Docker", "Helm", "AutoDeploy"] },
  { name: "Docker", category: "Orchestration", use: "Containerized every service at Terakoya and both current personal projects.", related: ["Kubernetes", "Jenkins", "Ansible"] },
  { name: "Helm", category: "Orchestration", use: "Chart-based Kubernetes deployments for repeatable releases.", related: ["Kubernetes"] },
  { name: "Terraform", category: "Infrastructure as code", use: "Provisioned AWS infrastructure at Terakoya; drives config generation in AutoDeploy.", related: ["AWS", "Ansible"] },
  { name: "Ansible", category: "Infrastructure as code", use: "Configuration automation alongside Terraform for consistent environments.", related: ["Terraform", "Docker"] },
  { name: "CloudFormation", category: "Infrastructure as code", use: "AWS-native IaC, used alongside Terraform where it fit better.", related: ["AWS"] },
  { name: "Jenkins", category: "Delivery", use: "Migrated Terakoya's release pipeline onto it, with SonarQube as a blocking stage.", related: ["SonarQube", "Docker"] },
  { name: "GitLab CI", category: "Delivery", use: "Managed the GitLab/Nexus toolchain at Fortray across critical infrastructure.", related: ["Nexus"] },
  { name: "GitHub Actions", category: "Delivery", use: "CI/CD for personal projects, including AutoDeploy's own self-hosted pipeline.", related: ["Docker", "Terraform"] },
  { name: "SonarQube", category: "Delivery", use: "Automated vulnerability and code-quality scanning before deploy.", related: ["Jenkins"] },
  { name: "Prometheus", category: "Observability", use: "Monitoring at Fortray, sustaining 99.9% uptime on critical infrastructure.", related: ["Grafana"] },
  { name: "Grafana", category: "Observability", use: "Dashboards and alerting paired with Prometheus.", related: ["Prometheus"] },
  { name: "CloudWatch", category: "Observability", use: "AWS-native monitoring and CloudTrail-based access auditing.", related: ["AWS"] },
  { name: "ELK Stack", category: "Observability", use: "Log aggregation and search alongside metrics-based monitoring.", related: ["Grafana"] },
  { name: "PostgreSQL", category: "Databases", use: "Primary database for LearnInclusive, with Row Level Security for access control.", related: ["Supabase"] },
  { name: "MySQL", category: "Databases", use: "Relational data store used in earlier production systems.", related: [] },
  { name: "DynamoDB", category: "Databases", use: "Managed NoSQL for AWS-native workloads.", related: ["AWS"] },
  { name: "Redis", category: "Databases", use: "Caching and ephemeral state where latency matters.", related: [] },
  { name: "Python", category: "Languages", use: "Automation scripting and backend services.", related: ["Bash"] },
  { name: "Bash", category: "Languages", use: "Operational scripting — the default for pipeline and runbook automation.", related: ["Python", "PowerShell"] },
  { name: "PowerShell", category: "Languages", use: "Automated monitoring and alerting scripts at Fortray, cutting manual work by 80%.", related: ["Bash"] },
  { name: "TypeScript", category: "Languages", use: "LearnInclusive's frontend, and Node.js services elsewhere.", related: [] },
];

/* -------------------------------------------------------------------------- */

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  status: "Certified" | "In progress";
  // What the certification actually validates — public, factual scope of
  // the exam, not a personal claim. Optional url shows a "View credential"
  // link when set; left unset here since no public verify links exist yet.
  description: string;
  url?: string;
};

export const certifications: Certification[] = [
  {
    name: "Docker Certified Associate",
    issuer: "Docker",
    year: "2024",
    status: "Certified",
    description: "Container fundamentals, image lifecycle, orchestration, networking and security.",
  },
  {
    name: "HashiCorp Certified: Terraform Associate",
    issuer: "HashiCorp",
    year: "2024",
    status: "Certified",
    description: "Infrastructure as code: workflow, state management, modules and provisioning.",
  },
  {
    name: "AWS Certified Developer — Associate",
    issuer: "Amazon Web Services",
    year: "2023",
    status: "Certified",
    description: "Developing and deploying applications on AWS, plus core debugging and optimization.",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2022",
    status: "Certified",
    description: "Foundational AWS cloud concepts, core services, security and billing.",
  },
];

/* -------------------------------------------------------------------------- */

// Decorative terminal. These are not executed — they are a readable summary.
export const terminal: { cmd: string; out: string[] }[] = [
  { cmd: "whoami", out: ["smile-kisan — devops engineer"] },
  { cmd: "expertise --list", out: ["aws", "kubernetes", "ci/cd", "terraform", "observability"] },
  {
    cmd: "cat philosophy.txt",
    out: ["automate the repetitive.", "observe the important.", "secure the critical."],
  },
  { cmd: "status", out: ["open to devops, platform & sre roles — uk and lithuania"] },
];

/* -------------------------------------------------------------------------- */

export const contact = {
  heading: "Have a system that needs to scale?",
  body: "I am open to DevOps, platform and cloud infrastructure roles in the UK and Lithuania, and to consulting on delivery pipelines and cloud platforms. Send a message directly, or email me.",
  cta: "Start a conversation",
  // ▲ VERIFY — get a free access key at https://web3forms.com (30 seconds,
  // just your email). Paste it here; the form won't send mail without it.
  // The key is public-by-design (Web3Forms validates the destination
  // server-side), so it's fine to ship in client code.
  web3formsAccessKey: "",
};

export const sections = [
  { id: "about", label: "About", index: "01" },
  { id: "experience", label: "Experience", index: "02" },
  { id: "projects", label: "Projects", index: "03" },
  { id: "github", label: "GitHub", index: "04" },
  { id: "stack", label: "Stack", index: "05" },
  { id: "certifications", label: "Certifications", index: "06" },
  { id: "contact", label: "Contact", index: "07" },
] as const;
