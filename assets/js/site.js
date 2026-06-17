document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initAuthorGallery();
  initCookieConsent();
  protectImages();
});

const analyticsConfig = {
  measurementId: "G-XXXXXXXXXX",
  storageKey: "job_cookie_consent_v1"
};

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
    dots.forEach(dot => dot.classList.remove("is-active"));

    images[index].classList.add("is-active");
    dots[index].classList.add("is-active");
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % images.length);
  }

  function restartTimer() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(nextSlide, 5000);
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

  restartTimer();
}

function initCookieConsent() {
  const storedConsent = window.localStorage.getItem(analyticsConfig.storageKey);

  initGoogleConsent();

  if (storedConsent === "accepted") {
    grantAnalyticsConsent();
    loadGoogleAnalytics();
  } else if (storedConsent !== "rejected") {
    showCookieDialog();
  }

  document.querySelectorAll("[data-cookie-settings]").forEach(button => {
    button.addEventListener("click", () => showCookieDialog(true));
  });
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
  const existingDialog = document.querySelector(".cookie-consent");
  if (existingDialog) existingDialog.remove();

  const dialog = document.createElement("section");
  dialog.className = "cookie-consent";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "false");
  dialog.setAttribute("aria-label", "Cookie-Einstellungen");
  dialog.innerHTML = `
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

  document.body.append(dialog);

  dialog.querySelector("[data-cookie-accept]").addEventListener("click", () => {
    window.localStorage.setItem(analyticsConfig.storageKey, "accepted");
    grantAnalyticsConsent();
    loadGoogleAnalytics();
    dialog.remove();
  });

  dialog.querySelector("[data-cookie-reject]").addEventListener("click", () => {
    window.localStorage.setItem(analyticsConfig.storageKey, "rejected");
    denyAnalyticsConsent();
    dialog.remove();
  });

  if (isSettings) {
    dialog.querySelector("[data-cookie-reject]").focus();
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

  if (!/^G-[A-Z0-9]+$/.test(measurementId) || measurementId === "G-XXXXXXXXXX") {
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
