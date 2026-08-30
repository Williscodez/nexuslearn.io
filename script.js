/* =====================================================================
   NEXUSLEARN — SHARED SCRIPT
   Loaded on every page (index.html, learn.html, and all 33 subject
   pages). Every block is guarded (checks the element exists before
   using it) so this ONE file works safely on any page, instead of
   needing separate/duplicated scripts per page.
   Structure:
   1. Mobile nav toggle
   2. Subject-picker modal (index.html)
   3. Hero mark pulse speed on resize
   4. Form tabs (subject pages)
   5. Scroll-reveal animation
   6. Progress tracking (localStorage)
   7. Site search (index built from subject/topic titles below)
   ===================================================================== */

// Static search index — subject + topic titles, used by the search
// feature (section 7). Kept as data here so search works on every
// page without a fetch() call or a separate JSON file to maintain.
const NEXUSLEARN_SEARCH_INDEX = [
  {
    "name": "Mathematics",
    "file": "Mathematics.html",
    "topics": [
      "Sets",
      "Number bases",
      "Fractions, decimals and percentages",
      "Indices and logarithms",
      "Relations and functions",
      "Linear equations and inequalities",
      "Plane geometry",
      "Statistics",
      "Quadratic equations",
      "Trigonometry",
      "Vectors",
      "Probability"
    ]
  },
  {
    "name": "General Science",
    "file": "General-Science.html",
    "topics": [
      "Scientific method and lab safety",
      "Living and non-living things",
      "Matter and its states",
      "Introduction to ecosystems",
      "Human body systems",
      "Forces and energy",
      "Acids, bases and salts",
      "Environmental science and conservation",
      "Electricity and magnetism",
      "Genetics and heredity",
      "Chemical reactions",
      "Space science and the solar system"
    ]
  },
  {
    "name": "English Language",
    "file": "English-Language.html",
    "topics": [
      "Grammar fundamentals",
      "Comprehension skills",
      "Letter writing",
      "Vocabulary building",
      "Narrative and descriptive essays",
      "Summary writing",
      "Literary appreciation",
      "Oral communication skills",
      "Argumentative and persuasive writing",
      "Report writing",
      "Advanced comprehension and critical reading",
      "Exam preparation and past questions"
    ]
  },
  {
    "name": "Social Studies",
    "file": "Social-Studies.html",
    "topics": [
      "Introduction to social studies and citizenship",
      "Family and community life",
      "Map reading and geography basics",
      "Governance and the constitution",
      "Ghana's history and independence",
      "Population and settlement",
      "Culture and national identity",
      "Human rights and responsibilities",
      "Economic development and resources",
      "Regional and international cooperation",
      "Environmental and resource management",
      "Conflict and peacebuilding"
    ]
  },
  {
    "name": "Art and Design Foundation",
    "file": "Art-and-Design-Foundation.html",
    "topics": [
      "Elements and principles of design",
      "Drawing fundamentals",
      "Colour theory",
      "Design tools and materials",
      "Composition and perspective",
      "Traditional Ghanaian art forms",
      "Digital design basics",
      "Sketching and rendering techniques",
      "Portfolio development",
      "Design for print and media",
      "Sculpture and 3D form",
      "Independent design project"
    ]
  },
  {
    "name": "Performing Arts",
    "file": "Performing-Arts.html",
    "topics": [
      "Introduction to music theory",
      "Rhythm and traditional drumming",
      "Dance fundamentals",
      "Voice and basic performance skills",
      "Ghanaian traditional music and dance",
      "Music composition basics",
      "Drama and stagecraft",
      "Group performance projects",
      "Contemporary performance styles",
      "Music production basics",
      "Choreography",
      "Final performance project"
    ]
  },
  {
    "name": "Biology",
    "file": "Biology.html",
    "topics": [
      "Cell biology and classification",
      "Nutrition in plants and animals",
      "Reproduction in plants",
      "Ecology and habitats",
      "Transport systems",
      "Respiration and gas exchange",
      "Excretion",
      "Genetics and variation",
      "Nervous and endocrine systems",
      "Human reproduction and growth",
      "Evolution and natural selection",
      "Human impact on the environment"
    ]
  },
  {
    "name": "Chemistry",
    "file": "Chemistry.html",
    "topics": [
      "Introduction to chemistry and lab safety",
      "Atomic structure and the periodic table",
      "Chemical bonding",
      "Separation techniques",
      "Acids, bases and salts",
      "Chemical reactions and equations",
      "The mole concept",
      "Electrolysis",
      "Rate of reaction and equilibrium",
      "Organic chemistry basics",
      "Metals and their extraction",
      "Industrial chemistry in Ghana"
    ]
  },
  {
    "name": "Physics",
    "file": "Physics.html",
    "topics": [
      "Measurement and units",
      "Motion and forces",
      "Energy and work",
      "Introduction to waves",
      "Electricity and circuits",
      "Magnetism",
      "Heat and temperature",
      "Light and optics",
      "Electromagnetism",
      "Modern physics",
      "Simple harmonic motion",
      "Electronics basics"
    ]
  },
  {
    "name": "Biomedical Science",
    "file": "Biomedical-Science.html",
    "topics": [
      "Introduction to the human body",
      "Cells, tissues and organs",
      "Basic anatomy and physiology",
      "Health and hygiene",
      "The immune system",
      "Common diseases and their causes",
      "Diagnostic techniques",
      "Nutrition and health",
      "Pharmacology basics",
      "Medical ethics",
      "Careers in biomedical science",
      "Public health and epidemiology"
    ]
  },
  {
    "name": "Agricultural Science",
    "file": "Agricultural-Science.html",
    "topics": [
      "Introduction to agriculture in Ghana",
      "Soil science basics",
      "Crop production fundamentals",
      "Farm tools and equipment",
      "Livestock production",
      "Plant and animal diseases",
      "Agricultural economics basics",
      "Irrigation and water management",
      "Sustainable and climate-smart agriculture",
      "Agribusiness and marketing",
      "Farm mechanization",
      "Agricultural extension and policy"
    ]
  },
  {
    "name": "Agriculture",
    "file": "Agriculture.html",
    "topics": [
      "Basic farming practices",
      "Land preparation and planting",
      "Farm safety",
      "Introduction to agroforestry",
      "Animal husbandry",
      "Pest and weed control",
      "Post-harvest handling and storage",
      "Cooperative farming",
      "Agricultural value chains",
      "Agri-entrepreneurship",
      "Modern farming technologies",
      "Environmental sustainability in farming"
    ]
  },
  {
    "name": "Additional Mathematics",
    "file": "Additional-Mathematics.html",
    "topics": [
      "Algebraic expressions and functions",
      "Coordinate geometry basics",
      "Sequences and series",
      "Binomial theorem introduction",
      "Differentiation",
      "Integration basics",
      "Trigonometric identities",
      "Further equations and inequalities",
      "Applications of calculus",
      "Vectors in three dimensions",
      "Complex numbers introduction",
      "Further probability and statistics"
    ]
  },
  {
    "name": "ICT",
    "file": "ICT.html",
    "topics": [
      "Introduction to computers and digital literacy",
      "Word processing and document design",
      "File and data management",
      "Internet and online safety",
      "Spreadsheets and data analysis",
      "Presentation software",
      "Introduction to the web (HTML basics)",
      "Digital citizenship and ethics",
      "Databases basics",
      "Introduction to programming logic",
      "Multimedia and graphic tools",
      "ICT in everyday life and careers"
    ]
  },
  {
    "name": "Art and Design Studio",
    "file": "Art-and-Design-Studio.html",
    "topics": [
      "Studio practice fundamentals",
      "Materials and media exploration",
      "Life drawing and observation",
      "Developing a personal style",
      "Advanced composition techniques",
      "Mixed media and experimentation",
      "Critique and art appreciation",
      "Ghanaian and African contemporary art",
      "Independent studio project planning",
      "Exhibition and presentation skills",
      "Portfolio refinement",
      "Preparing for further study or a creative career"
    ]
  },
  {
    "name": "Literature in English",
    "file": "Literature-in-English.html",
    "topics": [
      "Introduction to literary genres",
      "Elements of poetry",
      "Elements of prose fiction",
      "Reading and responding to drama",
      "African literature and oral tradition",
      "Literary devices and figurative language",
      "Character and theme analysis",
      "Comparative literary study",
      "Critical essay writing on literary texts",
      "World literature perspectives",
      "Literary criticism approaches",
      "Preparing set texts for examination"
    ]
  },
  {
    "name": "History",
    "file": "History.html",
    "topics": [
      "Introduction to historical method",
      "Pre-colonial Ghanaian states and societies",
      "Trans-Saharan and Atlantic trade",
      "European contact and early colonization",
      "Colonial rule in the Gold Coast",
      "Nationalism and the independence movement",
      "Key nationalist leaders and events",
      "Ghana's independence and early nationhood",
      "Post-independence political history",
      "Ghana and Pan-Africanism",
      "Economic history and development",
      "Contemporary Ghana in a global context"
    ]
  },
  {
    "name": "Government",
    "file": "Government.html",
    "topics": [
      "Introduction to government and political systems",
      "Sources and types of law",
      "Citizenship and civic responsibility",
      "Organs of government",
      "The constitution of Ghana",
      "Elections and political parties",
      "Local government and decentralization",
      "Public administration basics",
      "International relations and organizations",
      "Human rights and the rule of law",
      "Political ideologies",
      "Governance challenges and reform"
    ]
  },
  {
    "name": "Geography",
    "file": "Geography.html",
    "topics": [
      "Map reading and geographical skills",
      "Landforms and physical geography of Ghana",
      "Weather and climate",
      "Population and settlement patterns",
      "Agriculture and land use",
      "Ghana's natural resources",
      "Urbanization and migration",
      "Regional geography of West Africa",
      "Environmental issues and climate change",
      "Economic geography and trade",
      "Disaster management",
      "Geographic information and technology"
    ]
  },
  {
    "name": "Economics",
    "file": "Economics.html",
    "topics": [
      "Basic economic concepts and scarcity",
      "Demand and supply",
      "Types of economic systems",
      "Money and banking basics",
      "Production, costs and revenue",
      "Market structures",
      "National income and GDP",
      "Public finance and taxation",
      "International trade and exchange rates",
      "Economic growth and development",
      "Unemployment and inflation",
      "Economic policy in Ghana"
    ]
  },
  {
    "name": "Religious and Moral Education",
    "file": "Religious-and-Moral-Education.html",
    "topics": [
      "Introduction to world religions",
      "Christianity in Ghana",
      "Islam in Ghana",
      "Traditional African religion",
      "Moral values and ethical reasoning",
      "Religion and society",
      "Comparative religious practices",
      "Rites of passage across traditions",
      "Religion, law and human rights",
      "Contemporary moral issues",
      "Interfaith dialogue and tolerance",
      "Religion's role in nation-building"
    ]
  },
  {
    "name": "French",
    "file": "French.html",
    "topics": [
      "Greetings and introductions",
      "Basic grammar",
      "Everyday vocabulary",
      "Simple conversations",
      "Past and future tenses",
      "Reading comprehension",
      "Writing short compositions",
      "French-speaking cultures",
      "Advanced grammar structures",
      "Listening and oral proficiency",
      "Literature and media in French",
      "Exam preparation and past questions"
    ]
  },
  {
    "name": "Spanish",
    "file": "Spanish.html",
    "topics": [
      "Greetings and introductions",
      "Basic grammar",
      "Everyday vocabulary",
      "Simple conversations",
      "Past and future tenses",
      "Reading comprehension",
      "Writing short compositions",
      "Spanish-speaking cultures",
      "Advanced grammar structures",
      "Listening and oral proficiency",
      "Literature and media in Spanish",
      "Exam preparation and past questions"
    ]
  },
  {
    "name": "Arabic",
    "file": "Arabic.html",
    "topics": [
      "The Arabic alphabet and script",
      "Greetings and introductions",
      "Basic grammar and sentence structure",
      "Everyday vocabulary",
      "Reading and writing practice",
      "Past and present tense usage",
      "Simple conversations and dialogues",
      "Arab culture and traditions",
      "Advanced grammar structures",
      "Listening and oral proficiency",
      "Arabic literature and media",
      "Exam preparation and past questions"
    ]
  },
  {
    "name": "Computing",
    "file": "Computing.html",
    "topics": [
      "Introduction to programming concepts",
      "Algorithms and flowcharts",
      "Introduction to a programming language",
      "Data types and variables",
      "Control structures",
      "Functions and modular programming",
      "Introduction to data structures",
      "Problem-solving with code",
      "Object-oriented programming basics",
      "Databases and SQL basics",
      "Web development fundamentals",
      "Software development project"
    ]
  },
  {
    "name": "Applied Technology",
    "file": "Applied-Technology.html",
    "topics": [
      "Introduction to applied technology",
      "Basic tools and workshop safety",
      "Materials and their properties",
      "Simple technical drawing",
      "Electrical and electronic basics",
      "Woodwork and metalwork techniques",
      "Maintenance and repair skills",
      "Technology in everyday life",
      "Renewable energy technology",
      "Project design and fabrication",
      "Technology and sustainability",
      "Independent applied technology project"
    ]
  },
  {
    "name": "Design Communication Technology",
    "file": "Design-Communication-Technology.html",
    "topics": [
      "Introduction to technical drawing",
      "Geometric construction",
      "Orthographic projection",
      "Drawing instruments and standards",
      "Isometric and perspective drawing",
      "Sectioning and dimensioning",
      "Computer-aided design (CAD) basics",
      "Architectural drawing basics",
      "Advanced CAD techniques",
      "Working drawings and assembly drawings",
      "Design communication for engineering",
      "Portfolio and presentation project"
    ]
  },
  {
    "name": "Engineering",
    "file": "Engineering.html",
    "topics": [
      "Introduction to engineering disciplines",
      "Engineering mathematics basics",
      "Materials and their engineering properties",
      "Engineering design process",
      "Mechanics and structures",
      "Electrical engineering basics",
      "Engineering drawing and CAD",
      "Problem-solving and prototyping",
      "Systems and control engineering",
      "Engineering ethics and safety",
      "Project management basics",
      "Capstone engineering project"
    ]
  },
  {
    "name": "Manufacturing Engineering",
    "file": "Manufacturing-Engineering.html",
    "topics": [
      "Introduction to manufacturing processes",
      "Materials for manufacturing",
      "Workshop safety and tools",
      "Basic machining techniques",
      "Production planning basics",
      "Quality control fundamentals",
      "Automation and manufacturing technology",
      "Manufacturing in Ghana's industry",
      "Lean manufacturing principles",
      "Computer-aided manufacturing (CAM)",
      "Supply chain basics",
      "Independent manufacturing project"
    ]
  },
  {
    "name": "Aviation and Aerospace Engineering",
    "file": "Aviation-and-Aerospace-Engineering.html",
    "topics": [
      "Introduction to flight and aerodynamics",
      "History of aviation",
      "Aircraft structures basics",
      "Aviation safety fundamentals",
      "Principles of propulsion",
      "Aircraft systems overview",
      "Introduction to aerospace materials",
      "Air navigation basics",
      "Spacecraft and satellite basics",
      "Aerospace design principles",
      "Careers in aviation and aerospace",
      "Aerospace project and case studies"
    ]
  },
  {
    "name": "Robotics",
    "file": "Robotics.html",
    "topics": [
      "Introduction to robotics",
      "Basic electronics for robotics",
      "Sensors and actuators",
      "Simple robot building",
      "Robot programming basics",
      "Control systems for robots",
      "Mechanical design for robots",
      "Robotics competitions and challenges",
      "Advanced robot programming",
      "Artificial intelligence basics in robotics",
      "Robotics project design",
      "Careers in robotics and automation"
    ]
  },
  {
    "name": "Physical Education and Health (Core)",
    "file": "Physical-Education-and-Health-Core.html",
    "topics": [
      "Introduction to physical fitness",
      "Basic sports skills",
      "Health and nutrition basics",
      "Safety in physical activity",
      "Team sports and games",
      "Individual fitness training",
      "First aid basics",
      "Personal health and wellness",
      "Sports science fundamentals",
      "Community health and recreation",
      "Leadership in physical activity",
      "Lifelong fitness planning"
    ]
  },
  {
    "name": "Physical Education and Health (Elective)",
    "file": "Physical-Education-and-Health-Elective.html",
    "topics": [
      "Foundations of sports science",
      "Anatomy and physiology for sport",
      "Introduction to coaching",
      "Sports and recreation management basics",
      "Exercise physiology",
      "Sports psychology basics",
      "Advanced coaching techniques",
      "Event and competition organization",
      "Sports injury prevention and care",
      "Nutrition for athletic performance",
      "Careers in sport and health science",
      "Independent sports science project"
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- 1. MOBILE NAV TOGGLE -------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* -------------------- 2. SUBJECT-PICKER MODAL -------------------- */
  const startLearningButton = document.querySelector("[data-open-modal]");
  const modal = document.getElementById("subjectModal");

  if (startLearningButton && modal) {
    const closeButton = modal.querySelector(".close-button");
    const groupSelect = document.getElementById("subjectGroup");
    const subjectSelect = document.getElementById("subjectDropdown");
    const goButton = document.getElementById("gotoSubject");

    const openModal = () => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    };

    startLearningButton.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // Filter the subject list by group using data-group attributes.
    // Rebuilds the actual <option> elements rather than toggling
    // hidden/display, because mobile browsers hand <select> off to
    // the native OS picker, which largely ignores hidden/display on
    // options — only options that are truly absent from the DOM
    // are reliably excluded there.
    if (groupSelect && subjectSelect) {
      // Snapshot the full, unfiltered option set once from the original markup
      const allOptgroups = Array.from(subjectSelect.querySelectorAll("optgroup")).map((group) => ({
        label: group.label,
        dataGroup: group.dataset.group,
        options: Array.from(group.querySelectorAll("option")).map((opt) => ({
          value: opt.value,
          text: opt.textContent,
        })),
      }));

      const rebuildSubjectOptions = (selectedGroup) => {
        subjectSelect.innerHTML = '<option value="">Select a subject</option>';

        allOptgroups.forEach((group) => {
          if (selectedGroup !== "" && group.dataGroup !== selectedGroup) return;

          const optgroupEl = document.createElement("optgroup");
          optgroupEl.label = group.label;
          optgroupEl.dataset.group = group.dataGroup;

          group.options.forEach((opt) => {
            const optionEl = document.createElement("option");
            optionEl.value = opt.value;
            optionEl.textContent = opt.text;
            optgroupEl.appendChild(optionEl);
          });

          subjectSelect.appendChild(optgroupEl);
        });
      };

      groupSelect.addEventListener("change", () => {
        rebuildSubjectOptions(groupSelect.value);
      });
    }

    // Navigate to the chosen subject's card on learn.html
    if (goButton && subjectSelect) {
      goButton.addEventListener("click", () => {
        const selectedSubject = subjectSelect.value;

        if (!selectedSubject) {
          subjectSelect.focus();
          return;
        }

        window.location.href = selectedSubject;
      });
    }
  }

  /* -------------------- 3. HERO MARK PULSE SPEED -------------------- */
  const heroMark = document.querySelector(".hero-mark");

  if (heroMark) {
    const adjustAnimationSpeed = () => {
      heroMark.style.animationDuration = window.innerWidth < 600 ? "3.2s" : "2.4s";
    };

    adjustAnimationSpeed();
    window.addEventListener("resize", adjustAnimationSpeed);
  }

  /* -------------------- 4. FORM TABS (subject pages) -------------------- */
  const formTabs = document.querySelectorAll(".form-tab");

  if (formTabs.length) {
    formTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = tab.getAttribute("aria-controls");
        const targetPanel = document.getElementById(targetId);
        if (!targetPanel) return;

        formTabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        document.querySelectorAll(".form-panel").forEach((p) => p.classList.remove("is-active"));

        tab.setAttribute("aria-selected", "true");
        targetPanel.classList.add("is-active");
      });
    });
  }

  /* -------------------- 5. SCROLL-REVEAL ANIMATION -------------------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (revealTargets.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // No IntersectionObserver support (or nothing to reveal) — just show everything
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------------------- 6. PROGRESS TRACKING --------------------
     Persists per-topic completion in localStorage, scoped per browser.
     No HTML edits needed on any subject page — checkboxes and
     progress counts are all injected here at runtime. The subject's
     storage key is just its page filename (e.g. "Mathematics"),
     since that string is already used consistently everywhere else
     (hrefs, dropdown values) — nothing extra to keep in sync. */
  const PROGRESS_KEY = "nexuslearn:progress";
  const TOPICS_PER_SUBJECT = 12; // every subject page is 3 forms x 4 topics

  const slugify = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");

  const subjectKeyFromHref = (href) => href.replace(/\.html$/i, "");

  const loadProgressStore = () => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch (e) {
      return {};
    }
  };

  const saveProgressStore = (store) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
    } catch (e) {
      // localStorage unavailable (private browsing, storage full, etc.)
      // — progress just won't persist this session.
    }
  };

  // --- Subject pages: checkboxes on topic rows + live progress counts ---
  const topicRows = document.querySelectorAll(".topic-row");

  if (topicRows.length) {
    const subjectKey = subjectKeyFromHref(window.location.pathname.split("/").pop());
    const store = loadProgressStore();
    const completed = new Set(store[subjectKey] || []);

    const persist = () => {
      store[subjectKey] = Array.from(completed);
      saveProgressStore(store);
    };

    const updateSummaries = () => {
      document.querySelectorAll(".form-panel").forEach((panel) => {
        const rows = panel.querySelectorAll(".topic-row");
        const done = Array.from(rows).filter((r) => completed.has(r.dataset.topicId)).length;
        const tab = document.getElementById(panel.getAttribute("aria-labelledby"));
        if (!tab) return;

        let badge = tab.querySelector(".tab-progress");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "tab-progress";
          tab.appendChild(badge);
        }
        badge.textContent = `${done}/${rows.length}`;
      });

      const summary = document.querySelector(".subject-progress-summary");
      if (summary) {
        summary.textContent = `${completed.size} of ${topicRows.length} topics complete`;
      }
    };

    topicRows.forEach((row) => {
      const titleEl = row.querySelector(".topic-info h3");
      if (!titleEl) return;

      const topicId = slugify(titleEl.textContent);
      row.dataset.topicId = topicId;

      const label = document.createElement("label");
      label.className = "topic-complete";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Mark "${titleEl.textContent}" as complete`);
      checkbox.checked = completed.has(topicId);
      row.classList.toggle("is-complete", checkbox.checked);

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          completed.add(topicId);
        } else {
          completed.delete(topicId);
        }
        row.classList.toggle("is-complete", checkbox.checked);
        persist();
        updateSummaries();
      });

      label.appendChild(checkbox);
      row.prepend(label);
    });

    const subjectHeader = document.querySelector(".subject-header");
    if (subjectHeader && !subjectHeader.querySelector(".subject-progress-summary")) {
      const summaryEl = document.createElement("p");
      summaryEl.className = "subject-progress-summary";
      subjectHeader.appendChild(summaryEl);
    }

    updateSummaries();
  }

  // --- learn.html: a small progress badge on each subject card, once started ---
  const subjectCards = document.querySelectorAll(".subject-card");

  if (subjectCards.length) {
    const store = loadProgressStore();

    subjectCards.forEach((card) => {
      const learnMoreLink = card.querySelector(".subject-card-actions a.button");
      const actions = card.querySelector(".subject-card-actions");
      if (!learnMoreLink || !actions) return;

      const subjectKey = subjectKeyFromHref(learnMoreLink.getAttribute("href"));
      const doneCount = (store[subjectKey] || []).length;

      if (doneCount > 0) {
        const badge = document.createElement("span");
        badge.className = "card-progress-badge";
        badge.textContent = `${doneCount}/${TOPICS_PER_SUBJECT} complete`;
        actions.appendChild(badge);
      }
    });
  }

  /* -------------------- 7. SITE SEARCH --------------------
     Injects a search trigger into the header and a results overlay,
     on every page, without needing to edit any page's HTML. Searches
     NEXUSLEARN_SEARCH_INDEX (subject + topic titles) defined at the
     top of this file. Every result links to a subject page — there's
     no per-topic deep link yet since lesson content isn't built out. */
  const headerWrap = document.querySelector(".site-header .wrap");

  if (headerWrap && typeof NEXUSLEARN_SEARCH_INDEX !== "undefined") {
    const navToggleEl = headerWrap.querySelector(".nav-toggle");
    const siteNavEl = headerWrap.querySelector(".site-nav");

    const searchToggle = document.createElement("button");
    searchToggle.className = "search-toggle";
    searchToggle.type = "button";
    searchToggle.setAttribute("aria-label", "Search subjects and topics");
    searchToggle.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

    // Group search + nav elements together on the right of the header,
    // reparenting the existing nav-toggle/site-nav nodes (this preserves
    // their already-attached event listeners — moving a node doesn't
    // detach its listeners, only its position in the tree changes).
    const navGroup = document.createElement("div");
    navGroup.className = "nav-group";
    navGroup.appendChild(searchToggle);
    if (navToggleEl) navGroup.appendChild(navToggleEl);
    if (siteNavEl) navGroup.appendChild(siteNavEl);
    headerWrap.appendChild(navGroup);

    const overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="search-panel">
        <button type="button" class="close-button search-close" aria-label="Close search">&times;</button>
        <label for="siteSearchInput" class="search-label">Search subjects and topics</label>
        <input type="text" id="siteSearchInput" class="search-input" placeholder="e.g. Vectors, Biology, Trigonometry" autocomplete="off">
        <ul class="search-results"></ul>
      </div>
    `;
    document.body.appendChild(overlay);

    const searchInput = overlay.querySelector("#siteSearchInput");
    const resultsList = overlay.querySelector(".search-results");
    const closeSearchBtn = overlay.querySelector(".search-close");

    const openSearch = () => {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      searchInput.value = "";
      renderResults("");
      setTimeout(() => searchInput.focus(), 50);
    };

    const closeSearch = () => {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    };

    const renderResults = (query) => {
      resultsList.innerHTML = "";
      const q = query.trim().toLowerCase();
      if (!q) {
        const hint = document.createElement("li");
        hint.className = "search-hint";
        hint.textContent = "Start typing to search across every subject and topic.";
        resultsList.appendChild(hint);
        return;
      }

      const matches = [];

      NEXUSLEARN_SEARCH_INDEX.forEach((subject) => {
        if (subject.name.toLowerCase().includes(q)) {
          matches.push({ label: subject.name, sub: "Subject", file: subject.file });
        }
        subject.topics.forEach((topic) => {
          if (topic.toLowerCase().includes(q)) {
            matches.push({ label: topic, sub: subject.name, file: subject.file });
          }
        });
      });

      if (!matches.length) {
        const empty = document.createElement("li");
        empty.className = "search-hint";
        empty.textContent = `No matches for "${query}".`;
        resultsList.appendChild(empty);
        return;
      }

      matches.slice(0, 20).forEach((match) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = match.file;
        link.innerHTML = `<span class="search-result-title">${match.label}</span><span class="search-result-sub">${match.sub}</span>`;
        item.appendChild(link);
        resultsList.appendChild(item);
      });
    };

    searchToggle.addEventListener("click", openSearch);
    closeSearchBtn.addEventListener("click", closeSearch);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeSearch();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeSearch();
      }
    });

    searchInput.addEventListener("input", () => {
      renderResults(searchInput.value);
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const firstLink = resultsList.querySelector("a");
        if (firstLink) window.location.href = firstLink.getAttribute("href");
      }
    });
  }

});