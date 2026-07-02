// Shared chrome behavior for all design-preview pages.
// — live PT clock in the status bar
// — Latest Contributions marquee (renders into #feedTrack)

(function () {
  // ─── live clock
  function tick() {
    const el = document.getElementById('clock');
    if (!el) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    el.textContent = `${hh}:${mm}:${ss} PT`;
  }
  setInterval(tick, 1000); tick();

  // ─── Latest Contributions ticker
  const feedItems = [
    { verb:'ind',  verbLabel:'IND',  amt:'$5,000',  donor:'M. Castelan-Wirth',          ctx:'TECHCO · SF',                recipParty:'d', recip:'NEWSOM-COLE',     when:'2h ago' },
    { verb:'pac',  verbLabel:'PAC',  amt:'$25,000', donor:'CA Service Workers United PAC', ctx:'LABOR',                  recipParty:'d', recip:'KOUNALAKIS-PARK', when:'4h ago' },
    { verb:'ind',  verbLabel:'IND',  amt:'$3,200',  donor:'E. Briones-Park',             ctx:'VENTURE INC · MENLO PARK', recipParty:'d', recip:'NEWSOM-COLE',     when:'8h ago' },
    { verb:'loan', verbLabel:'LOAN', amt:'$50,000', donor:'self-funded',                 ctx:'',                         recipParty:'r', recip:'HILTON',          when:'12h ago' },
    { verb:'ind',  verbLabel:'IND',  amt:'$1,500',  donor:'J. Quan-Ouyang',              ctx:'OAKLAND',                  recipParty:'d', recip:'RIVERA',          when:'1d ago' },
    { verb:'pac',  verbLabel:'PAC',  amt:'$15,000', donor:'Tech for California PAC',     ctx:'TECH',                     recipParty:'d', recip:'NEWSOM-COLE',     when:'1d ago' },
    { verb:'ind',  verbLabel:'IND',  amt:'$4,800',  donor:'C. Olafson',                  ctx:'INVESTOR · ATHERTON',      recipParty:'r', recip:'BIANCO',          when:'2d ago' },
    { verb:'ind',  verbLabel:'IND',  amt:'$2,000',  donor:'L. Hartwell-Vargas',          ctx:'REAL ESTATE LP · SAN DIEGO',recipParty:'d', recip:'KOUNALAKIS-PARK',when:'2d ago' },
    { verb:'pac',  verbLabel:'PAC',  amt:'$7,500',  donor:'CA Apartment Association IE Cmte', ctx:'REAL ESTATE',         recipParty:'r', recip:'BIANCO',          when:'3d ago' },
    { verb:'ind',  verbLabel:'IND',  amt:'$1,200',  donor:'T. Magnusson-Lin',            ctx:'ATTORNEY · SACRAMENTO',    recipParty:'d', recip:'RIVERA',          when:'3d ago' },
    { verb:'pac',  verbLabel:'PAC',  amt:'$8,400',  donor:'Building & Construction Trades Council PAC', ctx:'LABOR',     recipParty:'d', recip:'NEWSOM-COLE',     when:'4d ago' },
    { verb:'ind',  verbLabel:'IND',  amt:'$3,500',  donor:'M. Reichert Jr.',             ctx:'RETIRED · ATHERTON',       recipParty:'r', recip:'BIANCO',          when:'5d ago' }
  ];
  function feedEl(it) {
    const ctxBlock = it.ctx ? `<span class="meta">${it.ctx}</span><span class="meta">·</span>` : '';
    return `
      <span class="feed__item">
        <span class="verb ${it.verb}">${it.verbLabel}</span>
        <span class="amt">${it.amt}</span>
        <span class="who">${it.donor}</span>
        ${ctxBlock}
        <span class="arrow">→</span>
        <span class="recip"><span class="party-${it.recipParty}">${it.recipParty.toUpperCase()}</span> ${it.recip}</span>
        <span class="meta">·</span>
        <span class="meta">${it.when}</span>
      </span>
    `;
  }
  const track = document.getElementById('feedTrack');
  if (track) track.innerHTML = feedItems.map(feedEl).join('') + feedItems.map(feedEl).join('');
})();
