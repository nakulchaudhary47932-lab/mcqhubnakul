/* ==========================================================
   app.js - shared code used on every page
   (subject list, theme toggle, mobile menu, small helpers)
   ========================================================== */

/* Single source of truth for the 12 subjects.
   Later pages (subjects, quiz, dashboard) reuse this list. */
const SUBJECTS = [
  { id: "c",                     name: "C Programming",                 icon: "🔧", file: "data/c.json",                     desc: "Syntax, pointers, arrays, functions and memory." },
  { id: "cpp",                   name: "C++ Programming",               icon: "⚙️", file: "data/cpp.json",                   desc: "OOP, templates, STL and modern C++." },
  { id: "python",                name: "Python Programming",            icon: "🐍", file: "data/python.json",                desc: "Core Python, data types, functions and OOP." },
  { id: "dsa",                   name: "Data Structures & Algorithms",  icon: "🌲", file: "data/dsa.json",                   desc: "Arrays, trees, graphs, sorting and complexity." },
  { id: "dbms",                  name: "DBMS & SQL",                    icon: "🗄️", file: "data/dbms.json",                  desc: "Relational model, normalization, SQL and transactions." },
  { id: "os",                    name: "Operating System",              icon: "🖥️", file: "data/os.json",                    desc: "Processes, scheduling, memory and file systems." },
  { id: "networks",              name: "Computer Networks",             icon: "🌐", file: "data/networks.json",              desc: "OSI/TCP-IP, routing, protocols and security." },
  { id: "digital-electronics",   name: "Digital Electronics",           icon: "🔌", file: "data/digital-electronics.json",   desc: "Logic gates, circuits, flip-flops and K-maps." },
  { id: "software-engineering",  name: "Software Engineering",          icon: "📐", file: "data/software-engineering.json",  desc: "SDLC, design, testing and project management." },
  { id: "java",                  name: "Java Programming",              icon: "☕", file: "data/java.json",                  desc: "OOP, collections, exceptions and multithreading." },
  { id: "mathematics",           name: "Mathematics for Computing",     icon: "➗", file: "data/mathematics.json",           desc: "Discrete math, probability, linear algebra." },
  { id: "data-science-ai",       name: "Data Science & AI",             icon: "🤖", file: "data/data-science-ai.json",       desc: "Statistics, machine learning and neural networks." }
];

const QUESTIONS_PER_SUBJECT = 100;
const THEME_KEY = "techmcq_theme";

/* ---------- Theme (dark / light) ---------- */
function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch (error) {
    return "dark"; // LocalStorage can be blocked in private mode
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) button.textContent = theme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
  const next = getSavedTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_KEY, next); } catch (error) { /* ignore */ }
  applyTheme(next);
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after tapping a link
  links.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- Subject cards (homepage) ---------- */
function renderSubjectCards() {
  const grid = document.getElementById("subject-grid");
  if (!grid) return;

  grid.innerHTML = SUBJECTS.map(subject => `
    <a class="card reveal" href="subjects.html?subject=${subject.id}">
      <div class="card-icon">${subject.icon}</div>
      <h3>${subject.name}</h3>
      <p>${subject.desc}</p>
      <div class="card-meta">${QUESTIONS_PER_SUBJECT} MCQs →</div>
    </a>
  `).join("");
}

/* ---------- Animated counters ---------- */
function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = 1500; // milliseconds
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* ---------- Start everything ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getSavedTheme());

  const themeButton = document.getElementById("theme-toggle");
  if (themeButton) themeButton.addEventListener("click", toggleTheme);

  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  initMobileMenu();
  renderSubjectCards(); // must run before the scroll reveal so new cards are observed
  initScrollReveal();
  initCounters();
});