function initScrollReveals() {
  /* scroll reveals — unobserve after first paint */
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (el.classList.contains('map-svg')) {
          el.classList.toggle('map-in-view', entry.isIntersecting);
          if (entry.isIntersecting) {
            el.classList.add('is-visible', 'map-drawn');
          }
          return;
        }
        if (!entry.isIntersecting) return;
        el.classList.add('is-visible');
        revealObs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-title, .margin-note, .reveal-entry, .map-svg').forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-title, .margin-note, .reveal-entry, .map-svg').forEach(function (el) {
      el.classList.add('is-visible');
      if (el.classList.contains('map-svg')) {
        el.classList.add('map-drawn', 'map-in-view');
      }
    });
  }
}
