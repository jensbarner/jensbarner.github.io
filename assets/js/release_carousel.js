document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".works-carousel");
  const prevBtn = document.querySelector(".works-gallery-prev");
  const nextBtn = document.querySelector(".works-gallery-next");

  if (!carousel || !prevBtn || !nextBtn) return;

  function getScrollAmount() {
    const firstItem = carousel.querySelector(".work-cover");
    if (!firstItem) return 0;

    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    return firstItem.offsetWidth + gap;
  }

  function scrollCarousel(direction) {
    const scrollAmount = getScrollAmount();
    if (!scrollAmount) return;

    carousel.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });
  }

  prevBtn.addEventListener("click", () => {
    scrollCarousel(-1);
  });

  nextBtn.addEventListener("click", () => {
    scrollCarousel(1);
  });
});