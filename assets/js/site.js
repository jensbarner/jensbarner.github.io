document.addEventListener("DOMContentLoaded", () => {
  initThemeSwitch();
  initMobileNavigation();
  initAuthorGallery();
  initCookieConsent();
  initAnalyticsClickTracking();
  protectImages();
});

const analyticsConfig = {
  measurementId: "G-R13Q2JEHFQ",
  storageKey: "job_cookie_consent_v1",
  sessionRejectedKey: "job_cookie_rejected_session_v1"
};

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

function initCookieConsent() {
  let storedConsent = window.localStorage.getItem(analyticsConfig.storageKey);
  const rejectedThisSession = window.sessionStorage.getItem(analyticsConfig.sessionRejectedKey) === "true";

  initGoogleConsent();

  if (storedConsent === "accepted") {
    grantAnalyticsConsent();
    loadGoogleAnalytics();
  } else {
    window.localStorage.removeItem(analyticsConfig.storageKey);
    storedConsent = null;
  }

  if (!storedConsent && !rejectedThisSession && !isPrivacyInformationPage()) {
    showCookieDialog();
  }

  document.querySelectorAll("[data-cookie-settings]").forEach(button => {
    button.addEventListener("click", () => showCookieDialog(true));
  });
}

function isPrivacyInformationPage() {
  return window.location.pathname === "/de/datenschutz/";
}

function initGoogleConsent() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });
}

function showCookieDialog(isSettings = false) {
  const existingDialog = document.querySelector(".cookie-consent-backdrop");
  if (existingDialog) existingDialog.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "cookie-consent-backdrop";

  const dialog = document.createElement("section");
  dialog.className = "cookie-consent";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Cookie-Einstellungen");
  dialog.innerHTML = `
    <span class="cookie-consent-mark" aria-hidden="true"></span>
    <p class="cookie-consent-eyebrow">Datenschutz</p>
    <h2>Cookies & Analyse</h2>
    <p>
      Diese Website kann Google Analytics verwenden, um anonymisierte
      Besuchsstatistiken zu erfassen. Analytics wird erst nach Ihrer Zustimmung
      aktiviert. Sie können die Auswahl jederzeit ändern.
      <a href="/de/datenschutz/">Datenschutzerklärung</a>
    </p>
    <div class="cookie-consent-actions">
      <button class="button primary" type="button" data-cookie-accept>
        Akzeptieren
      </button>
      <button class="button secondary" type="button" data-cookie-reject>
        Ablehnen
      </button>
    </div>
  `;

  backdrop.append(dialog);
  document.body.append(backdrop);

  dialog.querySelector("[data-cookie-accept]").addEventListener("click", () => {
    window.localStorage.setItem(analyticsConfig.storageKey, "accepted");
    window.sessionStorage.removeItem(analyticsConfig.sessionRejectedKey);
    grantAnalyticsConsent();
    loadGoogleAnalytics();
    backdrop.remove();
  });

  dialog.querySelector("[data-cookie-reject]").addEventListener("click", () => {
    window.localStorage.removeItem(analyticsConfig.storageKey);
    window.sessionStorage.setItem(analyticsConfig.sessionRejectedKey, "true");
    denyAnalyticsConsent();
    backdrop.remove();
  });

  if (isSettings) {
    dialog.querySelector("[data-cookie-accept]").focus();
  }
}

function grantAnalyticsConsent() {
  window.gtag("consent", "update", {
    analytics_storage: "granted"
  });
}

function denyAnalyticsConsent() {
  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });
}

function loadGoogleAnalytics() {
  const measurementId = analyticsConfig.measurementId;

  if (!/^G-[A-Z0-9]{6,}$/.test(measurementId)) {
    return;
  }

  if (document.querySelector(`script[src*="${measurementId}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true
  });
}

function initAnalyticsClickTracking() {
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a");
    if (!(link instanceof HTMLAnchorElement)) return;

    const url = new URL(link.href, window.location.href);
    const label = link.textContent.trim().replace(/\s+/g, " ");

    if (isBookPurchaseLink(url)) {
      trackAnalyticsEvent("book_buy_click", {
        link_url: url.href,
        link_text: label || "Buch kaufen"
      });
      return;
    }

    if (isMusicPlatformLink(url)) {
      trackAnalyticsEvent("song_platform_click", {
        platform: getMusicPlatform(url.hostname),
        link_url: url.href,
        link_text: label || "Musikplattform"
      });
      return;
    }

    if (url.pathname.includes("/leseprobe/")) {
      trackAnalyticsEvent("sample_read_click", {
        link_url: url.href,
        link_text: label || "Leseprobe"
      });
      return;
    }

    if (url.pathname === "/de/kontakt/" || url.protocol === "mailto:") {
      trackAnalyticsEvent("contact_click", {
        link_url: url.href,
        link_text: label || "Kontakt"
      });
    }
  });
}

function trackAnalyticsEvent(eventName, parameters = {}) {
  if (window.localStorage.getItem(analyticsConfig.storageKey) !== "accepted") return;

  window.gtag("event", eventName, {
    ...parameters,
    page_location: window.location.href
  });
}

function isBookPurchaseLink(url) {
  return url.hostname.includes("amzn.to") || url.hostname.includes("amazon.");
}

function isMusicPlatformLink(url) {
  return [
    "open.spotify.com",
    "music.apple.com",
    "music.amazon.",
    "music.youtube.com"
  ].some(host => url.hostname.includes(host));
}

function getMusicPlatform(hostname) {
  if (hostname.includes("spotify")) return "spotify";
  if (hostname.includes("apple")) return "apple_music";
  if (hostname.includes("amazon")) return "amazon_music";
  if (hostname.includes("youtube")) return "youtube_music";
  return "music_platform";
}

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
