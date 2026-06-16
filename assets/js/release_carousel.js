document.addEventListener("DOMContentLoaded", () => {

  const carousel = document.querySelector(".works-carousel");
  const prevBtn = document.querySelector(".works-gallery-prev");
  const nextBtn = document.querySelector(".works-gallery-next");

  if (!carousel || !prevBtn || !nextBtn) return;

  const originalItems = [...carousel.children];

  originalItems.forEach(item => {
    carousel.appendChild(item.cloneNode(true));
  });

  const firstItem = carousel.querySelector(".work-cover");

  const scrollAmount = firstItem
    ? firstItem.offsetWidth + 56
    : 276;

  const originalWidth = originalItems.length * scrollAmount;

  function checkLoop() {
    if (carousel.scrollLeft >= originalWidth) {
      carousel.scrollLeft = carousel.scrollLeft - originalWidth;
    }

    if (carousel.scrollLeft <= 0) {
      carousel.scrollLeft = originalWidth + carousel.scrollLeft;
    }
  }

  function scrollNext() {
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });

    setTimeout(checkLoop, 400);
  }

  function scrollPrev() {
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });

    setTimeout(checkLoop, 400);
  }

  nextBtn.addEventListener("click", scrollNext);
  prevBtn.addEventListener("click", scrollPrev);

});