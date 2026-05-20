// =============================================================================
//  PORTFOLIO CONFIG
//  ─────────────────────────────────────────────────────────────────────────────
//  This is the ONLY file you need to edit to personalise this portfolio.
//  All other JS files are engine code — leave them alone.
// =============================================================================

// ── Personal Info ──────────────────────────────────────────────────────────────
export const USER = {
  /** Your display name — shown in Start Menu header, About window, and My Computer */
  name: "Ludiflex",

  /** Subtitle shown in the About window */
  title: "YouTuber • Tech Educator • Frontend Developer",

  /** Path to your avatar image */
  avatar: "/assets/boot/user.png",

};

// ── Contact & Social Links ─────────────────────────────────────────────────────
/** Each entry renders as a clickable row in the Contact window */
export const SOCIAL = [
  {
    label: "Email",
    value: "hello@ludiflex.com",
    href: "mailto:hello@ludiflex.com",
    icon: "/assets/desktop/Email.png",
  },
  {
    label: "Website",
    value: "ludiflex.com",
    href: "https://ludiflex.com",
    icon: "/assets/desktop/projects.webp",
  },
  {
    label: "YouTube",
    value: "youtube.com/@ludiflex",
    href: "https://youtube.com/@ludiflex",
    icon: "/assets/desktop/My Videos.png",
  },
];

// ── About Me ───────────────────────────────────────────────────────────────────
/** Each string is a separate paragraph in the About window */
export const BIO = [
  "Hello! I'm Ludiflex, a passionate tech educator and frontend developer. I create engaging educational content that helps aspiring developers master web technologies through practical, hands-on tutorials on my YouTube channel.",
  "With 7+ years of experience in web development and content creation, I've published 250+ videos reaching a global audience. I specialise in HTML5, CSS3, JavaScript, responsive design, and UI/UX principles.",
  "When I'm not coding or teaching, I'm exploring new design tools, building creative projects like this Windows XP portfolio, or brainstorming new ways to make tech education more accessible.",
];

/** Small info callout shown below the bio paragraphs */
export const BIO_CALLOUT = "Currently creating weekly content at <strong>youtube.com/@ludiflex</strong>";

// ── Projects ───────────────────────────────────────────────────────────────────
/** Add, remove, or reorder entries freely. Each entry is one project card. */
export const PROJECTS = [
  {
    title: "Windows XP Interface Recreation",
    desc: "A fully interactive Windows XP desktop simulation built from scratch with vanilla JavaScript. Features draggable windows, working taskbar, start menu, and authentic XP visual styling.",
    tech: ["HTML5", "CSS3", "JavaScript", "Vite"],
    link: "#",
  },
  {
    title: "Frontend Beginner Roadmap Series",
    desc: "A comprehensive YouTube tutorial series guiding beginners through their first steps in frontend development. Covers HTML, CSS, and JavaScript fundamentals with real-world projects.",
    tech: ["HTML5", "CSS3", "JavaScript", "YouTube"],
    link: "https://youtube.com/@ludiflex",
  },
  {
    title: "Creator Toolkit & Templates",
    desc: "A collection of ready-to-use web templates, UI components, and design resources for content creators and aspiring developers.",
    tech: ["Figma", "HTML5", "CSS3", "Responsive Design"],
    link: "#",
  },
];

// ── Skills ─────────────────────────────────────────────────────────────────────
/** Supported color values: "blue" | "purple" | "orange" | "green" */
export const SKILLS = [
  {
    title: "Frontend Development",
    color: "blue",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Responsive Design",
      "Web Accessibility",
      "CSS Animations",
    ],
  },
  {
    title: "Design & UI/UX",
    color: "purple",
    skills: [
      "Figma",
      "UI/UX Design",
      "Prototyping",
      "Wireframing",
      "Visual Design",
      "Design Systems",
    ],
  },
  {
    title: "Content Creation",
    color: "orange",
    skills: [
      "Video Production",
      "Script Writing",
      "Video Editing",
      "Adobe Premiere Pro",
      "After Effects",
      "Thumbnail Design",
    ],
  },
  {
    title: "Tools & Workflow",
    color: "green",
    skills: [
      "VS Code",
      "Git / GitHub",
      "Notion",
      "Vite / Webpack",
      "Chrome DevTools",
      "Figma",
    ],
  },
];

// ── My Computer ────────────────────────────────────────────────────────────────
export const MYCOMPUTER = {
  os: "Windows XP Professional (Portfolio Edition)",
  processor: "Creative Mind™ @ Maximum GHz",
  ram: "Unlimited Imagination MB",

  /** Each drive renders as a row with an icon, a name, and an optional progress bar.
   *  Set `fill` to null to hide the progress bar. */
  drives: [
    { label: "Local Disk (C:)", icon: "💾", stat: "250+ Videos Produced", fill: 65 },
    { label: "Portfolio (D:)", icon: "💿", stat: "7+ Years Experience", fill: 78 },
    { label: "YouTube (Y:)", icon: "🌐", stat: "youtube.com/@ludiflex", fill: null },
  ],
};

// ── Resume ─────────────────────────────────────────────────────────────────────
export const RESUME = {
  /** Path to your PDF resume file inside /public or /assets */
  pdfPath: "/assets/resume/ludiflex-resume.pdf",

  /** Filename shown in the toolbar */
  filename: "ludiflex-resume.pdf",
};

// ── Window Sizes ───────────────────────────────────────────────────────────────
/** Default width/height for each window. Adjust to taste. */
export const WINDOW_SIZES = {
  about:      { width: 600, height: 450 },
  projects:   { width: 700, height: 520 },
  skills:     { width: 650, height: 480 },
  resume:     { width: 700, height: 550 },
  contact:    { width: 500, height: 420 },
  mycomputer: { width: 600, height: 450 },
};
