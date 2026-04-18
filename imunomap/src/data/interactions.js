// ============================================================================
// data/interactions.js — Interacțiunile rețelei imune (muchiile grafului)
// ============================================================================
// Definește legăturile dintre entitățile imune pentru harta Cytoscape.
// Fiecare muchie: {source, target, type, label, note?}
// Tipuri: differentiation, activation, inhibition, secretion, presentation,
//         cytotoxicity, help, co-stimulation, recruitment, signaling
// ============================================================================

export const INTERACTIONS = [
  // ============ DIFERENȚIERE (lineage) ============
  { s: 'HSC',  t: 'CLP',  type: 'differentiation', lbl: 'diferențiere limfoid' },
  { s: 'HSC',  t: 'CMP',  type: 'differentiation', lbl: 'diferențiere mieloid' },
  { s: 'CLP',  t: 'TCD4', type: 'differentiation', lbl: 'via timus (semnal Notch)' },
  { s: 'CLP',  t: 'TCD8', type: 'differentiation', lbl: 'via timus' },
  { s: 'CLP',  t: 'Tgd',  type: 'differentiation', lbl: 'timus (early)' },
  { s: 'CLP',  t: 'B_naiv', type: 'differentiation', lbl: 'în măduvă osoasă' },
  { s: 'CLP',  t: 'NK',   type: 'differentiation' },
  { s: 'CLP',  t: 'ILC1', type: 'differentiation' },
  { s: 'CLP',  t: 'ILC2', type: 'differentiation' },
  { s: 'CLP',  t: 'ILC3', type: 'differentiation' },
  { s: 'CMP',  t: 'monocit',   type: 'differentiation' },
  { s: 'CMP',  t: 'neutrofil', type: 'differentiation' },
  { s: 'CMP',  t: 'eozinofil', type: 'differentiation' },
  { s: 'CMP',  t: 'bazofil',   type: 'differentiation' },
  { s: 'CMP',  t: 'mastocit',  type: 'differentiation' },
  { s: 'CMP',  t: 'DC',        type: 'differentiation', lbl: 'via cDC/pDC precursors' },
  { s: 'monocit', t: 'macrofag', type: 'differentiation', lbl: 'în țesut (M-CSF, GM-CSF)' },
  { s: 'monocit', t: 'DC',       type: 'differentiation', lbl: 'moDC (inflamator)' },

  // Subsetele Th — se diferențiază din TCD4 naiv
  { s: 'TCD4', t: 'Th1',  type: 'differentiation', lbl: 'IL-12 + IFN-γ → T-bet' },
  { s: 'TCD4', t: 'Th2',  type: 'differentiation', lbl: 'IL-4 → GATA3' },
  { s: 'TCD4', t: 'Th17', type: 'differentiation', lbl: 'TGF-β + IL-6 + IL-23 → RORγt' },
  { s: 'TCD4', t: 'Treg', type: 'differentiation', lbl: 'TGF-β + IL-2 → FoxP3' },
  { s: 'TCD4', t: 'Tfh',  type: 'differentiation', lbl: 'IL-6 + IL-21 → Bcl-6' },

  // B-cell
  { s: 'B_naiv',    t: 'plasmocit',   type: 'differentiation', lbl: 'după activare' },
  { s: 'B_naiv',    t: 'B_memorie',   type: 'differentiation', lbl: 'din centrul germinal' },
  { s: 'B_memorie', t: 'plasmocit',   type: 'differentiation', lbl: 'răspuns secundar' },

  // Macrofag polarization
  { s: 'macrofag', t: 'macrofag', type: 'differentiation', lbl: 'M1 (IFN-γ+LPS) / M2 (IL-4,IL-13)' },

  // ============ PREZENTARE ANTIGENICĂ ============
  { s: 'DC',        t: 'TCD4', type: 'presentation', lbl: 'MHC-II + peptid → TCR' },
  { s: 'DC',        t: 'TCD8', type: 'presentation', lbl: 'MHC-I + peptid (cross-presentation)' },
  { s: 'macrofag',  t: 'TCD4', type: 'presentation', lbl: 'MHC-II' },
  { s: 'B_naiv',    t: 'TCD4', type: 'presentation', lbl: 'MHC-II (B cell → Tfh)' },

  // ============ CO-STIMULARE ============
  { s: 'DC',       t: 'TCD4', type: 'co_stimulation', lbl: 'CD80/86 → CD28 (semnal 2)' },
  { s: 'DC',       t: 'TCD8', type: 'co_stimulation', lbl: 'CD80/86 → CD28' },

  // ============ AJUTOR Tfh → B ============
  { s: 'Tfh',      t: 'B_naiv',  type: 'help', lbl: 'CD40L → CD40; IL-21 → SHM/CSR' },
  { s: 'Tfh',      t: 'B_memorie', type: 'help', lbl: 'IL-21' },

  // ============ CITOTOXICITATE ============
  { s: 'TCD8',     t: 'TCD8',   type: 'cytotoxicity', lbl: 'Perforină + Granzime (țintă: celulă infectată/tumorală)' },
  { s: 'NK',       t: 'NK',     type: 'cytotoxicity', lbl: 'Missing self + ADCC (CD16)' },

  // ============ CITOKINE — secreție & efect ============
  // Th1
  { s: 'Th1',      t: 'macrofag', type: 'activation',  lbl: 'IFN-γ → M1' },
  { s: 'Th1',      t: 'B_naiv',   type: 'help',        lbl: 'class switch IgG2a' },
  { s: 'Th1',      t: 'Th2',      type: 'inhibition',  lbl: 'IFN-γ inhibă Th2' },

  // Th2
  { s: 'Th2',      t: 'B_naiv',     type: 'help',       lbl: 'IL-4 → class switch IgE, IgG1' },
  { s: 'Th2',      t: 'eozinofil',  type: 'activation', lbl: 'IL-5 (dezvoltare, supraviețuire)' },
  { s: 'Th2',      t: 'mastocit',   type: 'activation', lbl: 'IL-4, IL-13' },
  { s: 'Th2',      t: 'macrofag',   type: 'activation', lbl: 'IL-4, IL-13 → M2' },
  { s: 'Th2',      t: 'Th1',        type: 'inhibition', lbl: 'IL-4 inhibă Th1' },

  // Th17
  { s: 'Th17',     t: 'neutrofil',  type: 'recruitment', lbl: 'IL-17 → CXCL8 de la epiteliu' },

  // Treg
  { s: 'Treg',     t: 'TCD4',     type: 'inhibition', lbl: 'IL-10, TGF-β, consum IL-2' },
  { s: 'Treg',     t: 'TCD8',     type: 'inhibition', lbl: 'IL-10, CTLA-4 → APC' },
  { s: 'Treg',     t: 'DC',       type: 'inhibition', lbl: 'CTLA-4 → trans-endocitoza CD80/86' },

  // Tfh → în centrul germinal
  { s: 'Tfh',      t: 'FDC',      type: 'co_localization', lbl: 'centre germinale' },
  { s: 'FDC',      t: 'B_naiv',   type: 'presentation',    lbl: 'iccosome — Ag nativ retained' },

  // NK ↔ DC (cross-talk)
  { s: 'NK',       t: 'DC',       type: 'activation', lbl: 'IFN-γ → maturare DC' },
  { s: 'DC',       t: 'NK',       type: 'activation', lbl: 'IL-12, IL-15 trans-prezentat' },

  // ILC
  { s: 'ILC1',     t: 'macrofag', type: 'activation',  lbl: 'IFN-γ' },
  { s: 'ILC2',     t: 'eozinofil', type: 'activation', lbl: 'IL-5' },
  { s: 'ILC3',     t: 'neutrofil', type: 'recruitment', lbl: 'IL-17' },

  // Fagocite & granule
  { s: 'neutrofil', t: 'neutrofil', type: 'effector', lbl: 'Fagocitoza, NETosis, degranulare' },
  { s: 'macrofag',  t: 'macrofag',  type: 'effector', lbl: 'Fagocitoza, producție citokine' },
  { s: 'mastocit',  t: 'mastocit',  type: 'effector', lbl: 'Degranulare — histamină, triptază, LTC4' },
  { s: 'eozinofil', t: 'eozinofil', type: 'effector', lbl: 'MBP, ECP — apărare anti-helminți' },
  { s: 'bazofil',   t: 'Th2',      type: 'help',     lbl: 'IL-4 promovează Th2' },

  // Plasmocit → secreție Ig
  { s: 'plasmocit', t: 'IgG', type: 'secretion' },
  { s: 'plasmocit', t: 'IgM', type: 'secretion' },
  { s: 'plasmocit', t: 'IgA', type: 'secretion' },
  { s: 'plasmocit', t: 'IgE', type: 'secretion' },
  { s: 'plasmocit', t: 'IgD', type: 'secretion' },

  // Ig → funcții efectorii
  { s: 'IgG', t: 'macrofag',  type: 'effector',      lbl: 'Opsonizare via FcγR' },
  { s: 'IgG', t: 'NK',        type: 'effector',      lbl: 'ADCC via CD16/FcγRIIIa' },
  { s: 'IgM', t: 'macrofag',  type: 'effector',      lbl: 'Activare complement → opsonizare' },
  { s: 'IgE', t: 'mastocit',  type: 'binding',       lbl: 'FcεRI — degranulare alergică' },
  { s: 'IgE', t: 'bazofil',   type: 'binding',       lbl: 'FcεRI' },
  { s: 'IgA', t: 'neutrofil', type: 'effector',      lbl: 'FcαRI' },

  // MHC — prezentare (link către celule)
  { s: 'MHC_I',  t: 'TCD8', type: 'presentation' },
  { s: 'MHC_II', t: 'TCD4', type: 'presentation' },
  { s: 'CD1',    t: 'NKT',  type: 'presentation' },
  { s: 'MR1',    t: 'MAIT', type: 'presentation' }
];

// ----------------------------------------------------------------------------
// Culori per tip de interacțiune (pentru harta Cytoscape)
// ----------------------------------------------------------------------------
export const INTERACTION_STYLES = {
  differentiation:  { color: '#6b7280', style: 'solid',  width: 2, arrow: 'triangle' },
  presentation:     { color: '#0ea5e9', style: 'solid',  width: 3, arrow: 'triangle' },
  co_stimulation:   { color: '#22d3ee', style: 'dashed', width: 2, arrow: 'diamond' },
  co_localization:  { color: '#64748b', style: 'dotted', width: 1, arrow: 'none' },
  activation:       { color: '#22c55e', style: 'solid',  width: 2, arrow: 'triangle' },
  inhibition:       { color: '#ef4444', style: 'solid',  width: 2, arrow: 'tee' },
  secretion:        { color: '#f59e0b', style: 'solid',  width: 2, arrow: 'circle' },
  cytotoxicity:     { color: '#dc2626', style: 'solid',  width: 3, arrow: 'triangle-backcurve' },
  help:             { color: '#a855f7', style: 'solid',  width: 2, arrow: 'triangle' },
  recruitment:      { color: '#06b6d4', style: 'dashed', width: 2, arrow: 'triangle' },
  effector:         { color: '#ec4899', style: 'solid',  width: 2, arrow: 'triangle' },
  binding:          { color: '#eab308', style: 'dashed', width: 2, arrow: 'diamond' }
};
