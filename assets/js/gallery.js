const images = document.querySelectorAll('.author-gallery-image');
const dots = document.querySelectorAll('.gallery-dot');

const prev = document.querySelector('.gallery-prev');
const next = document.querySelector('.gallery-next');

if (
  images.length &&
  dots.length &&
  prev &&
  next
) {

  let current = 0;

  function showSlide(index) {

    images.forEach(image =>
      image.classList.remove('is-active')
    );

    dots.forEach(dot =>
      dot.classList.remove('is-active')
    );

    images[index].classList.add('is-active');
    dots[index].classList.add('is-active');

    current = index;
  }

  next.addEventListener('click', () => {

    let index = current + 1;

    if (index >= images.length) {
      index = 0;
    }

    showSlide(index);

  });

  prev.addEventListener('click', () => {

    let index = current - 1;

    if (index < 0) {
      index = images.length - 1;
    }

    showSlide(index);

  });

  dots.forEach((dot, index) => {

    dot.addEventListener('click', () => {
      showSlide(index);
    });

  });

  setInterval(() => {

    let index = current + 1;

    if (index >= images.length) {
      index = 0;
    }

    showSlide(index);

  }, 5000);

}