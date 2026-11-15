// Panelen rustig laten binnenschuiven. Zonder JS staat alles gewoon zichtbaar.
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('js');
  var zien = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); zien.unobserve(e.target); }
    });
  }, {threshold:.25});
  document.querySelectorAll('.paneel').forEach(function(p){ zien.observe(p); });
})();
