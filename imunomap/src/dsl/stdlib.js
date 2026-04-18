// ============================================================================
// dsl/stdlib.js — Biblioteca standard ImmunoScript
// ============================================================================
// Pre-populează mediul global cu:
//  - Obiecte imune (cell, cytokine, antibody, MHC) din fișierele de date
//  - Funcții încorporate: print, log, query, simulate_response, ELISA, etc.
// ============================================================================

import { CELLS } from '../data/cells.js';
import { ANTIBODIES, MHC, CYTOKINES, CHEMOKINES, COMPLEMENT, PRRs, CD_MARKERS } from '../data/molecules.js';
import { IG_LOCI, TCR_LOCI, VDJ_RECOMBINATION, AID, HLA_SYSTEM, HLA_TYPING_METHODS, CROSSMATCH, ANIMAL_MODELS } from '../data/genetics.js';
import { TCR_PATHWAY, BCR_PATHWAY, JAK_STAT, NFKB_PATHWAY, ANTIGEN_PROCESSING, APOPTOSIS, INFLAMMASOME, RESPIRATORY_BURST, LEUKOCYTE_ADHESION, CD28_COSTIM } from '../data/biochemistry.js';
import { TECHNIQUES } from '../data/techniques.js';
import { BioObject } from './interpreter.js';

// ----------------------------------------------------------------------------
// Helper: convertire obiecte JS în BioObject
// ----------------------------------------------------------------------------
function toBio(kind, rec) {
  if (!rec) return null;
  const name = rec.id || rec.cd || rec.name || 'unknown';
  const props = { ...rec };
  return new BioObject(kind, name, props);
}

// ----------------------------------------------------------------------------
// Export principal: populează globals-ul Interpreter-ului
// ----------------------------------------------------------------------------
export function createStdLib(interpreter) {
  const g = interpreter.globals;

  // ====== 1. Obiecte imunologice preîncărcate ======
  // Celule — expuse prin nume (ex. TCD4, Th1, macrofag)
  for (const c of CELLS) {
    const bio = toBio('cell', c);
    g.define(c.id, bio);
    if (c.synonym) g.define(c.synonym, bio);
  }

  // Expunere colectivă
  g.define('CELLS', CELLS.map(c => toBio('cell', c)));

  // Anticorpi
  for (const ab of ANTIBODIES) g.define(ab.id, toBio('antibody', ab));
  g.define('ANTIBODIES', ANTIBODIES.map(a => toBio('antibody', a)));

  // MHC
  for (const m of MHC) g.define(m.id, toBio('mhc', m));
  g.define('MHC_ALL', MHC.map(m => toBio('mhc', m)));

  // Citokine — ID-urile conțin cratime (IL-2, IFN-γ), deci și cu underscore
  for (const ck of CYTOKINES) {
    const bio = toBio('cytokine', ck);
    g.define(ck.id, bio);
    g.define(ck.id.replace(/[-α-γ]/g, '_'), bio); // variantă fără simboluri
  }
  g.define('CYTOKINES', CYTOKINES.map(c => toBio('cytokine', c)));
  g.define('CHEMOKINES', CHEMOKINES.map(c => toBio('chemokine', c)));

  // CD markers
  g.define('CD_MARKERS', CD_MARKERS);
  for (const cd of CD_MARKERS) g.define(cd.cd, toBio('cd', cd));

  // Genetică
  g.define('IG_LOCI', IG_LOCI);
  g.define('TCR_LOCI', TCR_LOCI);
  g.define('VDJ', VDJ_RECOMBINATION);
  g.define('AID', AID);
  g.define('HLA_SYSTEM', HLA_SYSTEM);
  g.define('HLA_TYPING', HLA_TYPING_METHODS);
  g.define('CROSSMATCH', CROSSMATCH);
  g.define('ANIMAL_MODELS', ANIMAL_MODELS);

  // Biochimie / căi de semnalizare
  g.define('TCR_PATHWAY', TCR_PATHWAY);
  g.define('BCR_PATHWAY', BCR_PATHWAY);
  g.define('CD28_COSTIM', CD28_COSTIM);
  g.define('JAK_STAT', JAK_STAT);
  g.define('NFKB', NFKB_PATHWAY);
  g.define('ANTIGEN_PROCESSING', ANTIGEN_PROCESSING);
  g.define('APOPTOSIS', APOPTOSIS);
  g.define('INFLAMMASOME', INFLAMMASOME);
  g.define('RESPIRATORY_BURST', RESPIRATORY_BURST);
  g.define('LEUKOCYTE_ADHESION', LEUKOCYTE_ADHESION);
  g.define('COMPLEMENT', COMPLEMENT);
  g.define('PRRs', PRRs);

  // Tehnici de laborator
  g.define('TECHNIQUES', TECHNIQUES.map(t => toBio('technique', t)));

  // ====== 2. Funcții built-in ======
  g.define('print', (...args) => { interpreter.print(...args); return null; });
  g.define('log',   (...args) => { interpreter.print('[log]', ...args); return null; });

  // query: caută în date pe nume sau ID
  g.define('query', (term) => {
    const t = String(term).toLowerCase();
    const results = [];
    const searchIn = [
      ...CELLS.map(c => ({ kind: 'cell', rec: c })),
      ...ANTIBODIES.map(a => ({ kind: 'antibody', rec: a })),
      ...CYTOKINES.map(c => ({ kind: 'cytokine', rec: c })),
      ...MHC.map(m => ({ kind: 'mhc', rec: m })),
      ...CD_MARKERS.map(c => ({ kind: 'cd', rec: c, id: c.cd })),
      ...TECHNIQUES.map(tc => ({ kind: 'technique', rec: tc }))
    ];
    for (const x of searchIn) {
      const id = (x.id || x.rec.id || x.rec.cd || x.rec.name || '').toLowerCase();
      const name_ro = (x.rec.name_ro || '').toLowerCase();
      const name = (x.rec.name || '').toLowerCase();
      if (id.includes(t) || name_ro.includes(t) || name.includes(t)) {
        results.push(toBio(x.kind, x.rec));
      }
    }
    return results;
  });

  // describe: listează proprietățile unui obiect bio
  g.define('describe', (obj) => {
    if (!obj) return 'null';
    if (obj instanceof BioObject) {
      const lines = [`[${obj.kind}] ${obj.name}`];
      for (const k of Object.keys(obj)) {
        if (k === 'kind' || k === 'name') continue;
        lines.push(`  ${k}: ${interpreter.stringify(obj[k])}`);
      }
      const txt = lines.join('\n');
      interpreter.print(txt);
      return txt;
    }
    const s = interpreter.stringify(obj);
    interpreter.print(s);
    return s;
  });

  // Operațiuni biologice simulate
  g.define('differentiate', (source, options = {}) => {
    const src = source?.name || String(source);
    const with_cytokines = options?.with || options?.cytokines || [];
    const w = Array.isArray(with_cytokines)
      ? with_cytokines.map(c => c?.name || c).join(', ')
      : (with_cytokines?.name || String(with_cytokines));
    const ev = `Diferențiere ${src}` + (w ? ` cu ${w}` : '');
    interpreter.logEvent('differentiate', ev);
    // produce un derivat cu sufix
    return new BioObject('cell', `${src}_derived`, { parent: src, with: with_cytokines });
  });

  // ELISA simulat — returnează valori sintetice
  g.define('ELISA', (opts = {}) => {
    const target = opts?.target?.name || opts?.target || 'analyt';
    const sample = opts?.sample || 'ser';
    // valoare aleatorie pentru demo
    const conc = Math.round((Math.random() * 450 + 50) * 100) / 100;
    const result = new BioObject('assay_result', `ELISA_${target}`, {
      target, sample, concentration: conc, units: 'pg/mL', method: 'sandwich'
    });
    interpreter.logEvent('assay', `ELISA ${target} în ${sample}: ${conc} pg/mL`);
    return result;
  });

  // Citometrie în flux simulată
  g.define('flow_cytometry', (sample, markers = []) => {
    const markerList = Array.isArray(markers) ? markers : [markers];
    const names = markerList.map(m => m?.name || m?.cd || String(m));
    // generează populații sintetice
    const populations = names.map(m => ({
      marker: m,
      percent_positive: Math.round(Math.random() * 1000) / 10,
      MFI: Math.round(Math.random() * 10000)
    }));
    const result = new BioObject('flow_result', 'cytometry', {
      sample: sample?.name || sample,
      populations
    });
    interpreter.logEvent('assay', `Citometrie: ${names.join(', ')}`);
    return result;
  });

  // PCR simulat
  g.define('PCR', (opts = {}) => {
    const target = opts?.target || opts?.gene || 'genă';
    const cycles = opts?.cycles || 35;
    interpreter.logEvent('assay', `PCR ${target} (${cycles} cicluri)`);
    return new BioObject('pcr_result', `PCR_${target}`, { target, cycles, result: 'amplified' });
  });

  // Simulare răspuns imun
  g.define('simulate_response', (pathogen, days = 7) => {
    const pName = pathogen?.name || String(pathogen);
    const events = [
      `T0: ${pName} penetrează bariera epitelială`,
      `T+2h: PRR (TLR, NLR) detectează PAMP-uri → NF-κB → citokine pro-inflamatorii`,
      `T+6h: Neutrofile extravazate via cascada de adeziune (selectine→integrine)`,
      `T+12h: Macrofagele rezidente fagocitează; DC încarcă antigen pe MHC-II`,
      `T+24h: DC migrează spre ganglionul limfatic (CCR7 → CCL19/21)`,
      `Ziua 2: Prezentare antigenică către LT naive; co-stimulare CD28:CD80/86`,
      `Ziua 3: Expansiune clonală LT CD4+ și CD8+; diferențiere Th1/Th17`,
      `Ziua 4-5: Tfh ajută LB în centre germinale → IgM → class switch`,
      `Ziua 6-7: Plasmocite secretoare de IgG; LT efectorii migrează în țesut`,
      `Ziua 8-10: Control patogen; apoptoza populațiilor efectorii`,
      `Ziua 14+: Memorie imună stabilită (TCM, TEM, LB memorie, plasmocite longevive)`
    ];
    const d = typeof days === 'object' ? days.value : days;
    const n = Math.min(events.length, Math.max(1, Math.round(d)));
    for (let i = 0; i < n; i++) interpreter.logEvent('step', events[i]);
    return new BioObject('simulation', `response_${pName}`, { pathogen: pName, duration: d, events: events.slice(0, n) });
  });

  // Utilitare
  g.define('length', (x) => Array.isArray(x) ? x.length : (typeof x === 'string' ? x.length : 0));
  g.define('range',  (a, b, step = 1) => {
    const start = b === undefined ? 0 : a;
    const end   = b === undefined ? a : b;
    const arr = [];
    for (let i = start; i < end; i += step) arr.push(i);
    return arr;
  });
  g.define('keys',   (o) => Object.keys(o || {}));
  g.define('values', (o) => Object.values(o || {}));
  g.define('push',   (arr, x) => { arr.push(x); return arr; });
  g.define('concat', (a, b) => [...a, ...b]);

  // Math
  g.define('abs',   Math.abs);
  g.define('min',   Math.min);
  g.define('max',   Math.max);
  g.define('round', Math.round);
  g.define('floor', Math.floor);
  g.define('ceil',  Math.ceil);
  g.define('sqrt',  Math.sqrt);
  g.define('pow',   Math.pow);
  g.define('log2',  Math.log2);
  g.define('log10', Math.log10);
  g.define('random', Math.random);

  // Constante utile pentru biologie
  g.define('AVOGADRO',  6.022e23);
  g.define('PI',        Math.PI);
}
