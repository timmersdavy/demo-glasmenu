// Een glasbord per klik: het oude zwaait weg, het nieuwe komt binnen.
// Zonder JS (of met "verminder beweging") staan alle borden gewoon onder of naast elkaar.
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('js');

  var rail = document.querySelector('.rail');
  var borden = Array.prototype.slice.call(document.querySelectorAll('.paneel'));
  if (!rail || !borden.length) return;

  // Knoppenrij boven het glas
  var tabs = document.createElement('div');
  tabs.className = 'tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Kies een rubriek');
  var knoppen = borden.map(function(b){
    var k = document.createElement('button');
    k.type = 'button';
    k.setAttribute('role', 'tab');
    k.setAttribute('aria-controls', b.id);
    k.setAttribute('aria-selected', 'false');
    k.textContent = b.querySelector('h2').lastChild.textContent.trim();
    k.addEventListener('click', function(){ toon(b.id); });
    tabs.appendChild(k);
    return k;
  });
  rail.parentNode.insertBefore(tabs, rail);

  var huidig = -1;
  var timers = [];

  function toon(id){
    var nieuw = borden.findIndex(function(b){ return b.id === id; });
    if (nieuw < 0 || nieuw === huidig) return;

    timers.forEach(clearTimeout); timers = [];
    borden.forEach(function(b, i){
      if (i !== huidig && i !== nieuw) b.classList.remove('actief', 'komt', 'gaat');
    });

    rail.classList.toggle('achteruit', huidig > -1 && nieuw < huidig);

    if (huidig > -1){
      var oud = borden[huidig];
      oud.classList.remove('actief', 'komt');
      oud.classList.add('gaat');
      timers.push(setTimeout(function(){ oud.classList.remove('gaat'); }, 600));
    }

    var b = borden[nieuw];
    b.classList.remove('gaat');
    b.classList.add('actief', 'komt');
    timers.push(setTimeout(function(){ b.classList.remove('komt'); }, 1700));

    knoppen.forEach(function(k, i){ k.setAttribute('aria-selected', i === nieuw ? 'true' : 'false'); });
    huidig = nieuw;
  }

  // Links bovenaan de pagina schakelen ook van bord
  document.querySelectorAll('nav a').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = (a.getAttribute('href') || '').slice(1);
      if (borden.some(function(b){ return b.id === id; })){
        e.preventDefault();
        toon(id);
        rail.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  toon(borden[0].id);
})();
