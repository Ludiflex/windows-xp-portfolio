// =============================================================================
//  Window Content Renderers
//  Builds the inner HTML for each window body.
//  All displayed data comes from config.js — don't hardcode personal info here.
// =============================================================================

import {
  USER,
  BIO,
  BIO_CALLOUT,
  PROJECTS,
  SKILLS,
  SOCIAL,
  MYCOMPUTER,
  RESUME,
} from "./config.js";

/**
 * Returns the inner HTML for a given window ID.
 * @param {string} id  One of: "about" | "projects" | "skills" | "resume" | "contact" | "mycomputer"
 * @returns {string} HTML string
 */
export function getWindowContent(id) {
  switch (id) {
    case "about":      return renderAbout();
    case "projects":   return renderProjects();
    case "skills":     return renderSkills();
    case "resume":     return renderResume();
    case "contact":    return renderContact();
    case "mycomputer": return renderMyComputer();
    default:
      return `<p style="padding:16px">Window content not found.</p>`;
  }
}

// ── About ──────────────────────────────────────────────────────────────────────

function renderAbout() {
  const paragraphs = BIO.map((p) => `<p class="about-bio">${p}</p>`).join("");
  return `
    <div class="about-content">
      <div class="about-content-left">
        <img class="profile-image" src="${USER.avatar}" alt="${USER.name}" draggable="false" />
      </div>
      <div class="about-content-right">
        <h2 class="about-name">${USER.name}</h2>
        <p class="about-title">${USER.title}</p>
        ${paragraphs}
        <div class="info-box" style="margin-top:12px">
          <span style="font-size:16px">&#9432;</span>
          <span>${BIO_CALLOUT}</span>
        </div>
      </div>
    </div>
  `;
}

// ── Projects ───────────────────────────────────────────────────────────────────

function renderProjects() {
  const cards = PROJECTS.map((p) => {
    const tags = p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("");
    return `
      <div class="project-card">
        <div class="project-card-header">
          <img class="project-card-header-icon" src="/assets/desktop/projects.webp" alt="" draggable="false" />
          ${p.title}
        </div>
        <div class="project-card-body">
          <p>${p.desc}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-links">
            <a href="${p.link}" class="project-link" target="_blank" rel="noopener">View Project &#8594;</a>
          </div>
        </div>
      </div>
    `;
  }).join("");
  return `<div class="project-list">${cards}</div>`;
}

// ── Skills ─────────────────────────────────────────────────────────────────────

function renderSkills() {
  const categories = SKILLS.map((cat) => {
    const items = cat.skills.map((s) => `
      <div class="skill-item">
        <span class="skill-bullet ${cat.color}"></span>
        <span>${s}</span>
      </div>
    `).join("");
    return `
      <div class="skill-category">
        <div class="skill-category-title">${cat.title}</div>
        <div class="skill-list">${items}</div>
      </div>
    `;
  }).join("");
  return `<div class="skills-grid">${categories}</div>`;
}

// ── Resume ─────────────────────────────────────────────────────────────────────

function renderResume() {
  return `
    <div class="pdf-toolbar">
      <a href="${RESUME.pdfPath}" download class="xp-btn" title="Download Resume">
        &#128196; Download PDF
      </a>
      <a href="${RESUME.pdfPath}" target="_blank" class="xp-btn" title="Open in new tab">
        &#128194; Open in New Tab
      </a>
      <span style="margin-left:auto;color:#555">${RESUME.filename}</span>
    </div>
    <iframe
      class="pdf-iframe"
      src="${RESUME.pdfPath}"
      title="${USER.name} Resume"
    ></iframe>
  `;
}

// ── Contact ────────────────────────────────────────────────────────────────────

function renderContact() {
  const links = SOCIAL.map((s) => `
    <div class="contact-link-item">
      <img src="${s.icon}" alt="" draggable="false" />
      <a href="${s.href}" target="_blank" rel="noopener">${s.value}</a>
    </div>
  `).join("");

  return `
    <div class="contact-content">
      <div class="contact-links">
        <h3>Get in Touch</h3>
        ${links}
      </div>
      <hr style="border:none;border-top:1px solid #ACA899;margin:12px 0" />
      <div class="contact-form">
        <h3>Send a Message</h3>
        <form onsubmit="event.preventDefault(); alert('Thanks for your message! This is a portfolio demo.');">
          <div class="form-group">
            <label class="form-label" for="contact-name">Name:</label>
            <input type="text" id="contact-name" class="form-input" placeholder="Your Name" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="contact-email">Email:</label>
            <input type="email" id="contact-email" class="form-input" placeholder="your@email.com" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="contact-message">Message:</label>
            <textarea id="contact-message" class="form-textarea" placeholder="Your message..." rows="4" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="xp-btn">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ── My Computer ────────────────────────────────────────────────────────────────

function renderMyComputer() {
  const drives = MYCOMPUTER.drives.map((d) => {
    const bar = d.fill !== null
      ? `<div class="drive-space-bar"><div class="drive-space-fill" style="width:${d.fill}%"></div></div>`
      : "";
    return `
      <div class="drive-item">
        <div class="drive-item-icon" style="font-size:28px;width:32px;text-align:center">${d.icon}</div>
        <div class="drive-item-info">
          <div class="drive-item-name"><strong>${d.label}</strong></div>
          ${bar}
          <div class="drive-item-space">${d.stat}</div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="mycomputer-content">
      <div class="mycomputer-section-title">System Information</div>
      <div style="padding:4px 8px;font-size:12px;line-height:1.8">
        <p><strong>OS:</strong> ${MYCOMPUTER.os}</p>
        <p><strong>Processor:</strong> ${MYCOMPUTER.processor}</p>
        <p><strong>RAM:</strong> ${MYCOMPUTER.ram}</p>
        <p><strong>User:</strong> ${USER.name}</p>
      </div>
      <div class="mycomputer-section-title">Drives</div>
      <div class="drive-list">${drives}</div>
    </div>
  `;
}
