document.addEventListener("DOMContentLoaded", () => {
  initThemeSwitch();
  initMobileNavigation();
  initAuthorGallery();
  initContactForms();
  protectImages();
});

const themeConfig = {
  storageKey: "job_theme_preference_v1",
  options: ["auto", "light", "dark"]
};

applyStoredTheme();

function applyStoredTheme() {
  const storedTheme = window.localStorage.getItem(themeConfig.storageKey);
  const theme = themeConfig.options.includes(storedTheme) ? storedTheme : "auto";
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function initThemeSwitch() {
  const buttons = document.querySelectorAll("[data-theme-option]");
  if (!buttons.length) return;

  const storedTheme = window.localStorage.getItem(themeConfig.storageKey);
  const activeTheme = themeConfig.options.includes(storedTheme) ? storedTheme : "auto";

  updateThemeButtons(activeTheme, buttons);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const nextTheme = button.getAttribute("data-theme-option");
      if (!themeConfig.options.includes(nextTheme)) return;

      if (nextTheme === "auto") {
        window.localStorage.removeItem(themeConfig.storageKey);
      } else {
        window.localStorage.setItem(themeConfig.storageKey, nextTheme);
      }

      applyTheme(nextTheme);
      updateThemeButtons(nextTheme, buttons);
    });
  });
}

function updateThemeButtons(activeTheme, buttons) {
  buttons.forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.getAttribute("data-theme-option") === activeTheme)
    );
  });
}

function initMobileNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (!header || !toggle || !navigation) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.addEventListener("click", event => {
    if (event.target instanceof HTMLAnchorElement) {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initAuthorGallery() {
  const gallery = document.querySelector(".author-gallery");
  if (!gallery) return;

  const images = gallery.querySelectorAll(".author-gallery-image");
  const dots = gallery.querySelectorAll(".gallery-dot");
  const prev = gallery.querySelector(".gallery-prev");
  const next = gallery.querySelector(".gallery-next");

  if (!images.length || !dots.length || !prev || !next) return;

  let current = 0;
  let timer = null;

  function showSlide(index) {
    images.forEach(image => image.classList.remove("is-active"));
    dots.forEach(dot => {
      dot.classList.remove("is-active");
      dot.removeAttribute("aria-current");
    });

    images[index].classList.add("is-active");
    dots[index].classList.add("is-active");
    dots[index].setAttribute("aria-current", "true");
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % images.length);
  }

  function restartTimer() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(nextSlide, 8000);
  }

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  next.addEventListener("click", () => {
    nextSlide();
    restartTimer();
  });

  prev.addEventListener("click", () => {
    showSlide((current - 1 + images.length) % images.length);
    restartTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });
  });

  gallery.addEventListener("mouseenter", stopTimer);
  gallery.addEventListener("mouseleave", restartTimer);
  gallery.addEventListener("focusin", stopTimer);
  gallery.addEventListener("focusout", restartTimer);

  restartTimer();
}

function initContactForms() {
  const forms = document.querySelectorAll("[data-contact-form]");
  if (!forms.length) return;

  forms.forEach(form => {
    const submittedAt = form.querySelector('input[name="submittedAt"]');
    const status = form.querySelector(".contact-form-status");
    const submitButton = form.querySelector('button[type="submit"]');
    const language = form.getAttribute("data-contact-language") || "de";
    const messages = contactFormMessages[language] || contactFormMessages.de;

    if (submittedAt) {
      submittedAt.value = String(Date.now());
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!status || !submitButton) return;

      status.className = "contact-form-status";
      status.textContent = messages.sending;
      submitButton.disabled = true;

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.language = language;

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || messages.error);
        }

        form.reset();
        if (submittedAt) {
          submittedAt.value = String(Date.now());
        }
        status.classList.add("is-success");
        status.textContent = messages.success;
      } catch (error) {
        status.classList.add("is-error");
        status.textContent = error.message || messages.error;
      } finally {
        submitButton.disabled = false;
      }
    });
  });
}

const contactFormMessages = {
  de: {
    sending: "Nachricht wird gesendet ...",
    success: "Vielen Dank. Ihre Nachricht wurde gesendet.",
    error: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie direkt per E-Mail."
  },
  en: {
    sending: "Sending message ...",
    success: "Thank you. Your message has been sent.",
    error: "The message could not be sent. Please try again or contact me directly by email."
  }
};

function protectImages() {
  document.addEventListener("contextmenu", event => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", event => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });
}
