function initLightbox() {
  /* lightbox */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCap = document.getElementById('lightbox-cap');
  var closeBtn = document.getElementById('close');

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  }

  document.querySelectorAll('.taped-photo').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var img = thumb.querySelector('img');
      lightboxImg.src = thumb.getAttribute('data-full');
      lightboxImg.alt = img ? img.alt : '';
      lightboxCap.textContent = thumb.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeLightbox();
  });
}
