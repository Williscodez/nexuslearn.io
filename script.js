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

});