const images = document.querySelectorAll("img[data-src]");

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      observer.unobserve(lazyImage);
    }
  });
}, options);

images.forEach((lazyImage) => {
  observer.observe(lazyImage);
});