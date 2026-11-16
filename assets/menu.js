// Borden blijven dicht tot je erop tikt of klikt. Zonder JS staat alles gewoon open en leesbaar.
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('js');

  function open(paneel){
    if (paneel.classList.contains('in')) return;
    paneel.classList.add('in');
    paneel.setAttribute('aria-expanded', 'true');
  }

  document.querySelectorAll('.paneel').forEach(function(paneel){
    // Het praktische bord (uren, belknop) staat altijd open.
    if (paneel.id === 'praktisch'){ paneel.classList.add('in'); return; }
    paneel.setAttribute('role', 'button');
    paneel.setAttribute('tabindex', '0');
    paneel.setAttribute('aria-expanded', 'false');
    paneel.addEventListener('click', function(){ open(paneel); });
    paneel.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        open(paneel);
      }
    });
  });

  // Een link in het menu (bv. Koffie bovenaan) opent het bord waar je naartoe springt.
  document.querySelectorAll('nav a').forEach(function(a){
    a.addEventListener('click', function(){
      var doel = document.querySelector(a.getAttribute('href'));
      if (doel && doel.classList.contains('paneel')) open(doel);
    });
  });
})();
