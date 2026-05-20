# 🖥️ Windows XP Portfolio Simulation

Welcome to the **Windows XP Portfolio Website**! This is a highly interactive, responsive desktop simulation that recreates the nostalgic look and feel of the classic Windows XP Luna theme. It is designed to act as a unique personal portfolio showcasing your biography, projects, skills, system diagnostics, and resume.

Built using clean, modern web standards: **HTML5**, **Vanilla JS**, and **Vanilla CSS** powered by **Vite** for fast hot module reloading and optimized bundling.

---

## ✨ Features

- **Draggable & Focusable Windows:** Click, drag, minimize, maximize, and stack windows with automatic active/inactive styling and z-index management.
- **Authentic Windows XP Controls:** Accurate window styling with custom vector-based SVG buttons (Back, Forward, Search, Folders, Go) and desaturated inactive title bar states.
- **Interactive Start Menu & Taskbar:** Working Start Menu with links to various apps, active task indicators on the taskbar, and a real-time system clock.
- **Sound Effects:** Original startup and window navigation sound effects (can be toggled in the interface).
- **Explorer-style Content:**
  - **About Me:** Biography paragraphs and info cards.
  - **Projects:** Windows Explorer card layout showcasing web applications and repositories.
  - **Skills:** Color-coded categorical skills sheets.
  - **My Computer:** Authentic drive status bars tracking developer experience and statistics.
  - **Resume:** PDF-embedded window frame with print/download capability.
  - **Contact:** Classic dialog box with custom web links.

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher recommended).

### 🛠️ Installation & Run

1. Clone or download the repository to your local machine:
   ```bash
   git clone <your-repository-url>
   cd windows-xp-portfolio
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local URL displayed (typically `http://localhost:5173`).

4. Build the project for production:
   ```bash
   npm run build
   ```
   The built assets will be placed in the `/dist` directory, ready to be hosted on Netlify, Vercel, GitHub Pages, or any web server.

---

## ⚙️ Customization Guide

You do **not** need to touch any core engine files to personalize this portfolio. All content and layout settings are defined in a single file: `src/js/config.js`.

### 📂 Edit `src/js/config.js`

Open [src/js/config.js](windows-xp-portfolio/src/js/config.js) in your editor to customize the following objects:

#### 1. Personal Information (`USER`)
Update your name, title, and profile picture avatar path:
```javascript
export const USER = {
  name: "Your Name",
  title: "Your Title / Professional Tagline",
  avatar: "/assets/boot/user.png", // Path to your profile picture
};
```

#### 2. Social Links (`SOCIAL`)
Define your email, website, and social media handles. Each item appears as a row in the **Contact** window:
```javascript
export const SOCIAL = [
  {
    label: "Email",
    value: "your.email@example.com",
    href: "mailto:your.email@example.com",
    icon: "/assets/desktop/Email.png",
  },
  // Add other social platforms...
];
```

#### 3. Biography (`BIO` & `BIO_CALLOUT`)
Provide paragraphs for the **About Me** window and a short callout message:
```javascript
export const BIO = [
  "Paragraph 1 goes here...",
  "Paragraph 2 goes here...",
];
export const BIO_CALLOUT = "Currently working on <strong>exciting project X</strong>";
```

#### 4. Projects (`PROJECTS`)
Add project cards to display in the **Projects** explorer window:
```javascript
export const PROJECTS = [
  {
    title: "Awesome App Name",
    desc: "A brief description of what this project does and the problems it solves.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    link: "https://github.com/username/repo",
  },
];
```

#### 5. Skills Grid (`SKILLS`)
List your technical capabilities by category. Supported colors are `"blue" | "purple" | "orange" | "green"`:
```javascript
export const SKILLS = [
  {
    title: "Technical Stack",
    color: "blue",
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)"],
  },
];
```

#### 6. System Properties (`MYCOMPUTER`)
Map your experience statistics as drive capacities in the **My Computer** window:
```javascript
export const MYCOMPUTER = {
  os: "Windows XP Professional (Portfolio Edition)",
  processor: "Creative Mind™ @ Maximum GHz",
  ram: "Unlimited Imagination MB",
  drives: [
    { label: "Local Disk (C:)", icon: "💾", stat: "250+ Videos", fill: 65 }, // Fill percentage 0-100
    { label: "Storage (D:)", icon: "💿", stat: "7+ Years Exp", fill: 78 },
  ],
};
```

#### 7. Resume Integration (`RESUME`)
Link your PDF resume so that it loads inside the portfolio viewer:
- Place your PDF file in `public/` or `public/assets/resume/`.
- Reference the path and filename:
```javascript
export const RESUME = {
  pdfPath: "/assets/resume/your-resume.pdf",
  filename: "your-resume.pdf",
};
```

#### 8. Window Dimensions (`WINDOW_SIZES`)
Adjust the default loading width and height (in pixels) for each window dynamically:
```javascript
export const WINDOW_SIZES = {
  about:      { width: 600, height: 450 },
  projects:   { width: 700, height: 520 },
  // ...
};
```

---

## 🎨 Asset Customization

- **Wallpaper:** To change the desktop background, replace the image file in `public/assets/desktop/` or update the `#desktop` styling rule inside [src/css/desktop.css](windows-xp-portfolio/src/css/desktop.css).
- **Icons & Avatars:** Place custom PNG/SVG files under `public/assets/desktop/` and reference their paths in `src/js/config.js`.
- **System Sounds:** Sound files are loaded from `public/sounds/` or similar static directories. You can substitute the `.mp3`/`.wav` files for custom startup or window sound effects.

---

## 📄 License

This project is licensed under the ISC License. Feel free to use, modify, and distribute it for personal or commercial use!
