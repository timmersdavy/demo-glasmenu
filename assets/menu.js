// Alle borden staan als rij in de diepte. Het aangeklikte komt naar voren en licht op.
// Zonder JS (of met "verminder beweging") staan alle borden gewoon open onder of naast elkaar.
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
  var timer;

  function toon(id){
    var nieuw = borden.findIndex(function(b){ return b.id === id; });
    if (nieuw < 0 || nieuw === huidig) return;
    huidig = nieuw;

    borden.forEach(function(b, i){
      var o = i - nieuw;
      b.className = b.className.replace(/\bo[pm]?\d\b/g, '').replace(/\s+/g, ' ').trim();
      b.classList.add(o === 0 ? 'o0' : (o > 0 ? 'op' : 'om') + Math.min(Math.abs(o), 4));
      b.classList.remove('komt');
      if (o === 0){
        b.removeAttribute('role'); b.removeAttribute('tabindex');
        void b.offsetWidth; b.classList.add('komt');
      } else {
        b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
        b.setAttribute('aria-label', 'Open ' + knoppen[i].textContent);
      }
    });
    clearTimeout(timer);
    timer = setTimeout(function(){ borden[nieuw].classList.remove('komt'); }, 1800);
    knoppen.forEach(function(k, i){ k.setAttribute('aria-selected', i === nieuw ? 'true' : 'false'); });
  }

  // Klik op een bord in de rij haalt het naar voren
  borden.forEach(function(b){
    b.addEventListener('click', function(){ toon(b.id); });
    b.addEventListener('keydown', function(e){
      if (b.classList.contains('o0')) return;
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toon(b.id); }
    });
  });

  // Pijltjes links en rechts
  document.addEventListener('keydown', function(e){
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var n = huidig + (e.key === 'ArrowRight' ? 1 : -1);
    if (n >= 0 && n < borden.length) toon(borden[n].id);
  });

  // Links bovenaan de pagina schakelen ook van bord
  document.querySelectorAll('nav a').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = (a.getAttribute('href') || '').slice(1);
      if (borden.some(function(b){ return b.id === id; })){
        e.preventDefault();
        toon(id);
        rail.scrollIntoView({behavior:'smooth', block:'center'});
      }
    });
  });

  toon(borden[0].id);
})();
