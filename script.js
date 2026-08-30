/* =====================================================================
   NEXUSLEARN — SHARED SCRIPT
   Loaded on both index.html and learn.html.
   Every block is guarded (checks the element exists before using it)
   so this ONE file works safely on any page, instead of needing
   separate/duplicated scripts per page.
   Structure:
   1. Mobile nav toggle
   2. Subject-picker modal (index.html)
   3. Hero mark pulse speed on resize
   4. Form tabs (subject pages)
   5. Scroll-reveal animation
   6. Progress tracking (localStorage)
   ===================================================================== */

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

});