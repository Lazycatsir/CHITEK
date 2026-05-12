// CHITEK Shared Scripts
(function() {
  'use strict';

  // ─── Scroll fade-in animation ───
  function initScrollAnimation() {
    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-up').forEach(function(el) {
      observer.observe(el);
    });
    // Trigger for above-fold elements
    setTimeout(function() {
      document.querySelectorAll('.hero .fade-up').forEach(function(el) {
        el.classList.add('visible');
      });
    }, 100);
  }

  // ─── Initialize on load ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimation);
  } else {
    initScrollAnimation();
  }

})();
