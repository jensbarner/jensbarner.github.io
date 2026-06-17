document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initAuthorGallery();
  protectImages();
});

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
