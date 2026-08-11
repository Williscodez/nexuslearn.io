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
   4. Scroll-reveal animation
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
    const optgroups = subjectSelect ? subjectSelect.querySelectorAll("optgroup") : [];

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

    // Filter the subject list by group using data-group attributes
    // (matched against optgroup, not fragile label-text matching)
    if (groupSelect && subjectSelect) {
      groupSelect.addEventListener("change", () => {
        const selectedGroup = groupSelect.value;

        optgroups.forEach((group) => {
          const matches = selectedGroup === "" || group.dataset.group === selectedGroup;
          group.hidden = !matches;
        });

        subjectSelect.value = "";
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

        window.location.href = `learn.html#${selectedSubject}`;
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

  /* -------------------- 4. SCROLL-REVEAL ANIMATION -------------------- */
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