document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    link.style.color = "#f8f9fa";
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 2000; // Durée du défilement en millisecondes
    const startTime = performance.now();

    function scrollStep(timestamp) {
      const currentTime = timestamp || performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easing = easeInOutQuad(progress);
      window.scrollTo(0, startPosition + distance * easing);

      if (elapsed < duration) {
        requestAnimationFrame(scrollStep);
      }
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(scrollStep);
  });
});

// Fonction appelée lors du survol du lien
function handleLinkHover() {
  var link = document.querySelector("a.btn.btn-outline-success");
  link.style.color = "yellow";
}

// Fonction appelée lorsque le curseur quitte le lien
function handleLinkExit() {
  var link = document.querySelector("a.btn.btn-outline-success");
  link.style.color = "black";
}
