// ============================================================================
// views/simulator.js — Simulator de răspuns imun pe timeline
// ============================================================================

const SCENARIOS = {
  'viral_acute': {
    name: 'Infecție virală acută (ex. gripă)',
    pathogen: 'Influenza A',
    events: [
      { t: '0 h',    desc: 'Virionii ajung pe epiteliul respirator; se leagă de sialic acid receptors (HA)' },
      { t: '2-4 h',  desc: 'Replicare virală intracelulară; RIG-I detectează 5\'-ppp ARN → IFN-α/β prin MAVS-IRF3/7' },
      { t: '6-8 h',  desc: 'IFN-α/β → JAK1/TYK2 → STAT1/2 → ISG-uri (MxA, OAS, PKR) → stare antivirală' },
      { t: '12-24 h',desc: 'DC rezidente prind antigen; pDC secretă IFN-α masiv' },
      { t: '24 h',   desc: 'NK recrutate (IL-15 trans-prezentat, IL-12) → ucid celule infectate (missing self)' },
      { t: 'Ziua 2', desc: 'DC migrează în ganglion (CCR7 → CCL19/21); prezintă antigen pe MHC-I și MHC-II' },
      { t: 'Ziua 3', desc: 'Activare LT CD8+ specifice → proliferare; IL-12 → Th1 (T-bet)' },
      { t: 'Ziua 5', desc: 'CTL efectorii migrează în plămân; perforină + granzime ucid celule infectate' },
      { t: 'Ziua 6', desc: 'Tfh apar în centre germinale; LB suferă SHM și CSR → IgG anti-HA' },
      { t: 'Ziua 7-10', desc: 'Plasmocite secretă IgG neutralizante; clearance viral; contracția populației' },
      { t: 'Săpt. 2+', desc: 'Memorie stabilită: TCM (CCR7+CD62L+), TEM (CCR7-CD62L-), LB memorie IgG+' }
    ]
  },
  'bacterial_extracell': {
    name: 'Infecție bacteriană extracelulară (ex. Streptococcus)',
    pathogen: 'Streptococcus pyogenes',
    events: [
      { t: '0 h',    desc: 'Bacteria penetrează bariera epitelială; LTA, peptidoglican detectate de TLR2/TLR4' },
      { t: '1-2 h',  desc: 'Macrofage rezidente fagocitează; secretă IL-1β, IL-6, IL-8, TNF-α, IL-12' },
      { t: '2-4 h',  desc: 'Endoteliu activat (TNF); E-selectină și ICAM-1 up-regulate' },
      { t: '4-6 h',  desc: 'Neutrofile extravazate în masă (cascada rolling→arrest→diapedeză); fagocitoză și burst oxidativ' },
      { t: '6-12 h', desc: 'Calea alternativă a complementului activată pe suprafața bacteriei → C3b opsonizare, C5a chemotactic' },
      { t: 'Ziua 1-2', desc: 'DC migrează în ganglion; prezintă antigen' },
      { t: 'Ziua 3-4', desc: 'Activare LT CD4+ → Th17 (IL-6/IL-23) și Tfh' },
      { t: 'Ziua 5-7', desc: 'LB foliculare activate; plasmocite secretă IgM (early) și IgG opsonizant' },
      { t: 'Ziua 7+', desc: 'Anticorpi + complement → ADCC și lizis bacterii; încărcare pentru fagocitoză via FcγR' }
    ]
  },
  'helminth': {
    name: 'Infestare helmintică',
    pathogen: 'Schistosoma mansoni',
    events: [
      { t: '0-1 h',  desc: 'Parazitul (cercarie) penetrează pielea; alarmine IL-33, TSLP eliberate de keratinocite' },
      { t: '2-12 h', desc: 'ILC2 activate → IL-4, IL-5, IL-13 (masiv)' },
      { t: 'Ziua 1-2', desc: 'Bazofile și mastocite activate; DC prezintă antigen' },
      { t: 'Ziua 3-5', desc: 'Polarizare Th2 (GATA3); eozinofilie majoră prin IL-5' },
      { t: 'Ziua 6-10', desc: 'IL-4 → class switch IgE; plasmocite IgE acoperă paraziți' },
      { t: 'Săpt. 2+',  desc: 'Eozinofile cu FcεRI degranulează (MBP, ECP) pe suprafața parazitului' },
      { t: 'Cronic',    desc: 'Granulom epitelioid în jurul ouălor; fibroză hepatică; IL-10 de la Treg moderează distrugerea' }
    ]
  },
  'vaccine_primary': {
    name: 'Răspuns primar la vaccin (subunitate + adjuvant)',
    pathogen: 'Vaccin subunitate (ex. HBV surface Ag + alum)',
    events: [
      { t: '0 h',    desc: 'Injectare i.m.; alum → inflamație sterilă, activare NLRP3, recrutare neutrofile și monocite' },
      { t: '1-2 zile', desc: 'DC încarcă antigen; migrează în ganglion regional' },
      { t: 'Ziua 3-5', desc: 'LT naive activate; diferențiere Tfh (IL-6)' },
      { t: 'Ziua 7-10', desc: 'Centre germinale stabilite; LB naive → plasmoblaști IgM' },
      { t: 'Săpt. 2',  desc: 'SHM/CSR în GC; IgG de afinitate crescută apare în ser' },
      { t: 'Săpt. 3-4', desc: 'Titru IgG maxim; plasmocite longevive în măduvă' },
      { t: 'Luni',     desc: 'Memorie LB; răspuns mai rapid și mai puternic la rapel (răspuns secundar)' }
    ]
  },
  'autoimmune': {
    name: 'Activare autoimună (ex. LES)',
    pathogen: 'Autoantigen (ADN, histone, Sm)',
    events: [
      { t: 'Cronic', desc: 'Pierdere toleranță centrală sau periferică; autoreactivitate' },
      { t: 'Inițiere', desc: 'Apoptoză defectuoasă → expunere cromatină / UV → Ag disponibili' },
      { t: 'Timp 1', desc: 'pDC detectează ADN/ARN self (TLR7/9) → IFN-α tip I (signatura LES)' },
      { t: 'Timp 2', desc: 'Autoanticorpi ANA, anti-dsDNA, anti-Sm formează complexe imune' },
      { t: 'Timp 3', desc: 'CI activează C3/C4 → consum → hipocomplementemie' },
      { t: 'Timp 4', desc: 'CI depuse în glomerul → glomerulonefrită lupică' },
      { t: 'Target', desc: 'Belimumab (anti-BAFF), Rituximab, HCQ, steroizi, Voclosporin' }
    ]
  }
};

export function initSimulator() {
  const host = document.getElementById('view-simulator');
  host.innerHTML = `
    <div class="sim-container">
      <h1 style="font-size:22px;background:linear-gradient(90deg,#5b8cff,#22d3ee);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px">
        ▶ Simulator răspuns imun
      </h1>
      <p style="color:#8892b0;margin-bottom:20px">Selectează un scenariu și urmărește desfășurarea răspunsului pe timeline</p>

      <div class="sim-controls">
        <select id="scenario-select">
          ${Object.entries(SCENARIOS).map(([k, s]) =>
            `<option value="${esc(k)}">${esc(s.name)}</option>`
          ).join('')}
        </select>
        <button class="btn-primary" id="btn-run-sim">Rulează</button>
        <button class="btn-ghost" id="btn-step-sim">Pas cu pas</button>
      </div>

      <div class="timeline" id="sim-timeline">
        <p style="color:#5a6487;text-align:center;padding:40px">
          Selectează un scenariu și apasă „Rulează" pentru a vedea cronologia răspunsului imun
        </p>
      </div>
    </div>
  `;

  const sel = document.getElementById('scenario-select');
  const timeline = document.getElementById('sim-timeline');

  document.getElementById('btn-run-sim').addEventListener('click', () => {
    const scenario = SCENARIOS[sel.value];
    renderTimeline(timeline, scenario, false);
  });

  document.getElementById('btn-step-sim').addEventListener('click', () => {
    const scenario = SCENARIOS[sel.value];
    renderTimeline(timeline, scenario, true);
  });
}

function renderTimeline(host, scenario, stepByStep) {
  host.innerHTML = `
    <h3 style="color:#22d3ee;margin-bottom:8px">${esc(scenario.name)}</h3>
    <p style="color:#8892b0;font-size:12px;margin-bottom:16px">Patogen: <strong style="color:#f59e0b">${esc(scenario.pathogen)}</strong></p>
    <div id="timeline-body"></div>
  `;
  const body = document.getElementById('timeline-body');

  if (!stepByStep) {
    body.innerHTML = scenario.events.map(e => renderEvent(e)).join('');
  } else {
    let i = 0;
    const pushNext = () => {
      if (i >= scenario.events.length) return;
      const div = document.createElement('div');
      div.innerHTML = renderEvent(scenario.events[i]);
      body.appendChild(div.firstElementChild);
      i++;
      if (i < scenario.events.length) setTimeout(pushNext, 700);
    };
    pushNext();
  }
}

function renderEvent(e) {
  return `
    <div class="timeline-event">
      <div class="timeline-time">${esc(e.t)}</div>
      <div class="timeline-desc">${esc(e.desc)}</div>
    </div>
  `;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
