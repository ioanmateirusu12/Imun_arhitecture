// ============================================================================
// data/molecules.js — Molecule imune
// ============================================================================
// Conține: imunoglobuline, MHC/HLA, markeri CD, citokine, chemokine,
// componente ale complementului, TLR, și alte molecule-cheie.
// Surse: Janeway's Immunobiology 9e (Murphy & Weaver, 2017) +
//        Cianga — Tehnici utilizate în imunologie (PIM, 2008)
// ============================================================================

// ----------------------------------------------------------------------------
// IMUNOGLOBULINE
// ----------------------------------------------------------------------------
export const ANTIBODIES = [
  {
    id: 'IgG',
    name_ro: 'Imunoglobulina G',
    heavy_chain: 'γ (gamma)',
    structure: 'Monomer (2 H + 2 L)',
    mw_kDa: 150,
    serum_concentration: '8-18 g/L (≈75% din Ig serice)',
    half_life: '21 zile (IgG3: 7 zile)',
    subclasses: {
      IgG1: 'Cea mai abundentă; fixează C1q; FcγR; traversează placenta',
      IgG2: 'Răspuns la polizaharide capsulare bacteriene',
      IgG3: 'Fixare complement puternică; T1/2 scurt',
      IgG4: 'Nu fixează complement; Fab-arm exchange; răspuns cronic'
    },
    functions: [
      'Neutralizare toxine și viruși',
      'Opsonizare (via FcγR)',
      'Activare cale clasică complement',
      'ADCC (prin NK cu CD16/FcγRIIIa)',
      'Traversează placenta (transport FcRn) — imunitate pasivă fetală'
    ]
  },
  {
    id: 'IgM',
    name_ro: 'Imunoglobulina M',
    heavy_chain: 'μ (miu)',
    structure: 'Pentamer (10 H + 10 L + lanț J) seric; monomer ca BCR',
    mw_kDa: 970,
    serum_concentration: '0.5-2 g/L',
    half_life: '5 zile',
    functions: [
      'Prima Ig din răspunsul primar (fără class switch)',
      'Cea mai eficientă activator al complementului (10 situsuri Fc)',
      'Aglutinare puternică',
      'Nu traversează placenta → IgM ↑ la nou-născut = infecție congenitală'
    ]
  },
  {
    id: 'IgA',
    name_ro: 'Imunoglobulina A',
    heavy_chain: 'α (alfa)',
    structure: 'Monomer seric; dimer + lanț J + componentă secretorie în mucoase',
    mw_kDa: '160 (monomer) / 400 (sIgA)',
    serum_concentration: '1-4 g/L',
    subclasses: ['IgA1 (ser)', 'IgA2 (mucoase — rezistent la proteaze bacteriene)'],
    functions: [
      'Imunitatea mucoaselor',
      'Exclusiune imună (împiedică aderența patogenilor)',
      'Nu activează complement pe calea clasică',
      'Prezentă în colostru/lapte — protecție pasivă neonatală'
    ],
    transport: 'pIgR (receptor polimeric Ig) — transport transepitelial'
  },
  {
    id: 'IgE',
    name_ro: 'Imunoglobulina E',
    heavy_chain: 'ε (epsilon)',
    structure: 'Monomer',
    mw_kDa: 190,
    serum_concentration: '<0.0003 g/L (cea mai rară)',
    half_life: '2-3 zile seric; săptămâni fixată pe FcεRI',
    functions: [
      'Hipersensibilitate tip I (alergii, astm, anafilaxie)',
      'Apărare anti-helmintică',
      'Legare mare afinitate pe FcεRI (mastocite, bazofile) → degranulare'
    ]
  },
  {
    id: 'IgD',
    name_ro: 'Imunoglobulina D',
    heavy_chain: 'δ (delta)',
    structure: 'Monomer',
    serum_concentration: '0.03 g/L',
    functions: [
      'Co-exprimată cu IgM pe LB naive (BCR)',
      'Marker de maturare LB',
      'Rol în imunitatea respiratorie superioară'
    ]
  }
];

// ----------------------------------------------------------------------------
// STRUCTURA IMUNOGLOBULINELOR (Fab, Fc, domenii, balama)
// ----------------------------------------------------------------------------
export const IG_STRUCTURE = {
  heavy_chains: ['μ (IgM)', 'δ (IgD)', 'γ1-γ4 (IgG)', 'α1-α2 (IgA)', 'ε (IgE)'],
  light_chains: ['κ (kappa) — ~60% la om', 'λ (lambda) — ~40% la om'],
  fragments: {
    Fab: 'Antigen-binding — VH+VL+CH1+CL; 3 CDR/lanț (hipervariabile)',
    Fc:  'Crystallizable — CH2+CH3; leagă FcR, C1q, FcRn',
    hinge: 'Regiunea balama — flexibilitate; susceptibilă la proteoliză (papaina/pepsina)'
  },
  domains: {
    V: 'Variabil (VH, VL) — CDR1, CDR2, CDR3',
    C: 'Constant (CH1, CH2, CH3, ±CH4 pentru μ/ε; CL)'
  },
  proteolysis: {
    papain: '2 × Fab + 1 × Fc (taie deasupra hinge)',
    pepsin: '1 × F(ab\')₂ + fragmente Fc digerate (taie sub hinge)'
  }
};

// ----------------------------------------------------------------------------
// MHC / HLA
// ----------------------------------------------------------------------------
export const MHC = [
  {
    id: 'MHC_I',
    name: 'MHC clasa I',
    loci_human: ['HLA-A', 'HLA-B', 'HLA-C'],
    structure: 'Lanț α (α1, α2, α3) + β2-microglobulină non-covalent',
    expression: 'Toate celulele nucleate (NU eritrocite mature)',
    peptide_length: '8-10 aa (tipic 9)',
    peptide_source: 'Proteine citosolice/endogene',
    presented_to: 'Limfocite T CD8+',
    processing_pathway: [
      'Proteine citosolice ubiquitinate',
      'Degradare în proteazom (imunoproteazom stimulat de IFN-γ)',
      'Transport prin TAP1/TAP2 în RE',
      'Complex de încărcare: calnexină → ERp57/tapasină/calreticulina',
      'Legare peptid → eliberare β2m-α stabilizat',
      'Transport Golgi → membrană plasmatică'
    ],
    functions: [
      'Prezentare antigene endogene (virali, tumorali)',
      'Ligand inhibitor pentru KIR (NK) — semnal "self"',
      'Rol central în rejetul de transplant'
    ],
    polymorphism: 'Cele mai polimorfe gene umane — peste 35.000 alele cunoscute (IMGT/HLA)'
  },
  {
    id: 'MHC_II',
    name: 'MHC clasa II',
    loci_human: ['HLA-DR', 'HLA-DQ', 'HLA-DP'],
    structure: 'Heterodimer αβ (fiecare lanț: α1+α2 sau β1+β2)',
    expression: 'Constitutivă: DC, Mφ, LB, epiteliu timic; inductibilă prin IFN-γ (CIITA)',
    peptide_length: '13-25 aa (șanț deschis la ambele capete)',
    peptide_source: 'Proteine exogene (endocitate/fagocitate)',
    presented_to: 'Limfocite T CD4+',
    processing_pathway: [
      'Antigen endocitat → endozom precoce',
      'Lanț invariant (Ii/CD74) trimer blochează șanțul în RE',
      'Catepsine (S, L) degradează Ii → CLIP',
      'HLA-DM catalizează schimbul CLIP ↔ peptid antigenic',
      'HLA-DO reglează DM în LB',
      'Compartiment MIIC → membrană plasmatică'
    ],
    nomenclature: 'HLA-DR*15:01 (locus * grup_alelic : număr_alelă)'
  },
  {
    id: 'MHC_III',
    name: 'Regiunea MHC clasa III',
    note: 'Regiune 6p21 — gene complement (C2, C4A, C4B, Bf), TNF, LT, HSP70. NU prezintă antigen.'
  },
  {
    id: 'CD1',
    name: 'CD1 (non-clasic)',
    subfamily: ['Grup 1: CD1a, CD1b, CD1c', 'Grup 2: CD1d'],
    ligands: 'Lipide, glicolipide, lipopeptide (ex. α-GalCer)',
    presented_to: 'LT NKT (CD1d), LT γδ, LT αβ specifice lipidelor'
  },
  {
    id: 'MR1',
    name: 'MR1',
    note: 'Prezintă metaboliți de riboflavină (B2) de origine microbiană către limfocitele MAIT.'
  },
  {
    id: 'HLA-E',
    name: 'HLA-E (non-clasic)',
    note: 'Leagă peptide semnal de HLA-A/B/C → ligand pentru NKG2A (inhibitor) pe NK.'
  },
  {
    id: 'HLA-G',
    name: 'HLA-G (non-clasic)',
    note: 'Exprimat pe trofoblast; induce toleranță materno-fetală (inhibă NK decidual).'
  }
];

// ----------------------------------------------------------------------------
// CITOKINE — Grupate pe familii
// ----------------------------------------------------------------------------
export const CYTOKINES = [
  // === Interleukine cheie ===
  { id: 'IL-1', family: 'IL-1', sources: ['Macrofage', 'DC', 'Keratinocite', 'Epiteliu'],
    targets: ['LT', 'LB', 'Hepatocite', 'Hipotalamus'],
    functions: ['Pro-inflamator', 'Febră', 'Proteine de fază acută', 'Activare LT'],
    receptors: ['IL-1R1 (semnal)', 'IL-1R2 (momeală)', 'IL-1Ra (antagonist endogen)'],
    clinical: 'Blocada cu Anakinra (IL-1Ra), Canakinumab (anti-IL-1β) — boli autoinflamatorii.' },
  { id: 'IL-2', family: 'γc', sources: ['LT activate (Th1, Th2 precoce)'],
    targets: ['LT (autocrin)', 'LB', 'NK', 'Treg'],
    functions: ['Proliferare clonală LT', 'Supraviețuire Treg (IL-2 low-dose)', 'Activare NK'],
    receptors: ['CD25 (IL-2Rα)', 'CD122 (IL-2Rβ)', 'CD132 (γc)'],
    clinical: 'Aldesleukin — terapia cancerului (melanom, carcinom renal); imunosupresia CD25 cu Basiliximab.' },
  { id: 'IL-4', family: 'γc', sources: ['Th2', 'Mastocite', 'Bazofile', 'NKT'],
    functions: ['Diferențiere Th2', 'Class switch spre IgE și IgG1/IgG4', 'Polarizare M2', 'Inhibă Th1'],
    master_for: 'Th2 (prin STAT6)',
    clinical: 'Dupilumab (anti-IL-4Rα) pentru astm, dermatită atopică, rinosinuzită.' },
  { id: 'IL-5', family: 'β-common', sources: ['Th2', 'ILC2', 'Mastocite'],
    targets: ['Eozinofile', 'LB'], functions: ['Dezvoltare/supraviețuire eozinofile', 'Producție IgA'],
    clinical: 'Mepolizumab, Reslizumab (anti-IL-5); Benralizumab (anti-IL-5Rα) — astm eozinofilic.' },
  { id: 'IL-6', family: 'IL-6/gp130', sources: ['Mφ', 'Fibroblaste', 'Endoteliu', 'Th17'],
    functions: ['Proteine fază acută', 'Diferențiere Th17 (+TGF-β)', 'Activare LB → plasmocit', 'Febră'],
    clinical: 'Tocilizumab, Sarilumab (anti-IL-6R) — artrită reumatoidă, arterită temporală, sindrom de eliberare citokine post-CAR-T.' },
  { id: 'IL-7', family: 'γc', sources: ['Celule stromale ale timusului și măduvei'],
    functions: ['Supraviețuire LT naive și memorie', 'Dezvoltare limfocite T și B'],
    clinical: 'Deficit IL-7Rα → SCID (forma T-B+NK+).' },
  { id: 'IL-8 / CXCL8', family: 'Chemokine CXC', sources: ['Mφ', 'Epiteliu'],
    functions: ['Chemotaxie neutrofile', 'Angiogeneză'], receptors: ['CXCR1', 'CXCR2'] },
  { id: 'IL-10', family: 'IL-10', sources: ['Treg', 'Tr1', 'Breg', 'M2'],
    functions: ['Anti-inflamator major', 'Inhibă producția IL-12, IFN-γ, TNF', 'Suprimă MHC-II/co-stim'] },
  { id: 'IL-12', family: 'IL-12', sources: ['DC', 'Mφ (activate)'],
    targets: ['LT naive', 'NK'], functions: ['Diferențiere Th1', 'Activare NK', 'Producție IFN-γ'],
    structure: 'Heterodimer p35 + p40', note: 'p40 împărtășit cu IL-23 (p19+p40).' },
  { id: 'IL-13', family: 'γc', sources: ['Th2', 'ILC2'], functions: ['Hiperreactivitate bronșică', 'Metaplazie mucoasă', 'Fibroză'] },
  { id: 'IL-15', family: 'γc', functions: ['Supraviețuire NK și LT memorie', 'trans-prezentat pe IL-15Rα'] },
  { id: 'IL-17', family: 'IL-17', sources: ['Th17', 'γδT', 'ILC3', 'MAIT'],
    functions: ['Recrutare neutrofile', 'Producție defensine, mucine', 'Inflamație cronică'],
    clinical: 'Secukinumab, Ixekizumab (anti-IL-17A); Brodalumab (anti-IL-17RA) — psoriazis.' },
  { id: 'IL-18', family: 'IL-1', functions: ['Sinergic cu IL-12 → IFN-γ din NK/Th1'] },
  { id: 'IL-21', family: 'γc', sources: ['Tfh', 'Th17', 'NKT'], functions: ['SHM/CSR în centre germinale', 'Diferențiere plasmocit'] },
  { id: 'IL-22', family: 'IL-10', sources: ['Th17', 'Th22', 'ILC3'],
    functions: ['Apărare barieră epitelială', 'Producție defensine și mucine de keratinocite și enterocite'] },
  { id: 'IL-23', family: 'IL-12', structure: 'p19 + p40', functions: ['Stabilizare/menținere Th17', 'Activare patogenicitate Th17'],
    clinical: 'Ustekinumab (anti-p40), Guselkumab/Risankizumab (anti-p19) — psoriazis, boala Crohn.' },
  { id: 'IL-33', family: 'IL-1', note: 'Alarmină — eliberată de celule deteriorate; activează ILC2, mastocite, Th2.' },

  // === Interferoni ===
  { id: 'IFN-α/β', family: 'IFN tip I', sources: ['Aproape toate celulele (antiviral)', 'pDC (producție masivă)'],
    receptors: ['IFNAR1/IFNAR2 → JAK1/TYK2 → STAT1/STAT2 → ISGF3'],
    functions: ['Inducere expresie gene antivirale (ISG)', 'Inhibiție replicare virală', 'Activare NK', 'Up-regulare MHC-I'] },
  { id: 'IFN-γ', family: 'IFN tip II', sources: ['Th1', 'CD8+', 'NK', 'NKT', 'ILC1'],
    receptors: ['IFNGR1/IFNGR2 → JAK1/JAK2 → STAT1'],
    functions: ['Activare M1 (clasică)', 'Up-regulare MHC-I și MHC-II', 'Class switch IgG2a/IgG3', 'Inhibă Th2/Th17'],
    clinical: 'Deficit IFN-γR → susceptibilitate la micobacterii (MSMD — Mendelian Susceptibility to Mycobacterial Disease).' },
  { id: 'IFN-λ', family: 'IFN tip III', note: 'IFN-λ1-4 (IL-28A, IL-28B, IL-29, IL-29B) — acționează predominant pe epiteliu.' },

  // === TNF și familia ===
  { id: 'TNF-α', family: 'TNF', sources: ['Mφ', 'LT', 'NK', 'Mastocite'],
    functions: ['Pro-inflamator major', 'Febră', 'Cașexie', 'Activare endoteliu', 'Apoptoză (TNFR1/2)'],
    clinical: 'Infliximab, Adalimumab, Etanercept, Certolizumab, Golimumab — RA, SpA, IBD, psoriazis.' },
  { id: 'LT-α / TNF-β', family: 'TNF', functions: ['Organogeneza ganglionilor limfatici', 'Activare macrofage'] },
  { id: 'BAFF / BLyS', family: 'TNF', note: 'Supraviețuire LB. Belimumab (anti-BAFF) — LES.' },
  { id: 'APRIL', family: 'TNF', note: 'Supraviețuire plasmocit, class switch IgA.' },
  { id: 'CD40L', family: 'TNF', sources: ['LT activate (CD40L / CD154)'],
    function: 'Legare CD40 pe LB, DC, Mφ → activare, class switch, maturare DC',
    clinical: 'Deficit CD40L → Sindrom hiper-IgM legat de X (HIGM1).' },
  { id: 'FasL', family: 'TNF', function: 'Cale extrinsecă a apoptozei (Fas/CD95 → FADD → Casp-8)',
    clinical: 'Deficit Fas → ALPS (sindrom limfoproliferativ autoimun).' },
  { id: 'TRAIL', family: 'TNF', function: 'Apoptoză selectivă în celule tumorale (DR4, DR5)' },

  // === TGF-β ===
  { id: 'TGF-β', family: 'TGF-β', sources: ['Treg', 'Mφ', 'Plachete', 'Celule epiteliale'],
    functions: ['Anti-inflamator', 'Diferențiere Treg (+IL-2) sau Th17 (+IL-6)', 'Class switch IgA', 'Fibroză'] },

  // === Factori de creștere hematopoietici ===
  { id: 'GM-CSF', family: 'β-common', functions: ['Dezvoltare granulocite și monocite', 'Maturare DC'], clinical: 'Sargramostim — neutropenie post-chimioterapie.' },
  { id: 'G-CSF', family: 'Clasa I', functions: ['Producție și eliberare neutrofile'], clinical: 'Filgrastim — neutropenie febrilă.' },
  { id: 'M-CSF', family: 'RTK', functions: ['Dezvoltare monocit/macrofag'] },
  { id: 'TSLP', family: 'γc-like', note: 'Alarmină epitelială → activează ILC2, DC → polarizare Th2.' }
];

// ----------------------------------------------------------------------------
// CHEMOKINE — Familii și receptori
// ----------------------------------------------------------------------------
export const CHEMOKINES = [
  { id: 'CXCL8 (IL-8)', receptors: ['CXCR1', 'CXCR2'], targets: 'Neutrofile', role: 'Inflamație acută' },
  { id: 'CXCL9/10/11', receptors: ['CXCR3'], targets: 'Th1, CD8, NK', role: 'Inflamație Th1; induse de IFN-γ' },
  { id: 'CXCL12 (SDF-1)', receptors: ['CXCR4'], targets: 'HSC, LB, LT naive, plasmocite', role: 'Homing în măduvă; SNC' },
  { id: 'CXCL13', receptors: ['CXCR5'], targets: 'LB, Tfh', role: 'Foliculi limfoizi B' },
  { id: 'CCL2 (MCP-1)', receptors: ['CCR2'], targets: 'Monocite, LT memorie', role: 'Recrutare monocite' },
  { id: 'CCL3/4/5 (MIP-1α/β, RANTES)', receptors: ['CCR1', 'CCR5'], targets: 'Mφ, LT, NK' },
  { id: 'CCL11/24/26 (eotaxine)', receptors: ['CCR3'], targets: 'Eozinofile, Th2, mastocite', role: 'Inflamație alergică' },
  { id: 'CCL17, CCL22', receptors: ['CCR4'], targets: 'Th2, Treg, piele' },
  { id: 'CCL19, CCL21', receptors: ['CCR7'], targets: 'LT naive, DC mature', role: 'Homing în ganglionul limfatic' },
  { id: 'CCL20', receptors: ['CCR6'], targets: 'Th17, ILC3, LB', role: 'Mucoase' },
  { id: 'CCL25', receptors: ['CCR9'], targets: 'LT intestinale', role: 'Homing intestinal' },
  { id: 'CCL28', receptors: ['CCR10'], targets: 'Plasmocite IgA, LT cutanate' }
];

// ----------------------------------------------------------------------------
// COMPLEMENT — Componente și căi
// ----------------------------------------------------------------------------
export const COMPLEMENT = {
  pathways: {
    classical: {
      trigger: 'Complexe imune (IgG/IgM + Ag) leagă C1q',
      components: ['C1 (C1q + C1r + C1s)', 'C4 → C4a + C4b', 'C2 → C2a + C2b', 'C3 convertaza: C4b2a'],
      C3_convertase: 'C4b2a',
      C5_convertase: 'C4b2a3b'
    },
    lectin: {
      trigger: 'MBL (Mannose-Binding Lectin) sau ficoline leagă carbohidrați microbieni',
      components: ['MBL + MASP1/MASP2', 'clivează C4 și C2 ca în calea clasică'],
      C3_convertase: 'C4b2a'
    },
    alternative: {
      trigger: 'Hidroliză spontană C3 → C3(H2O); stabilizată pe suprafețe microbiene',
      components: ['C3', 'Factor B', 'Factor D', 'Properdină (stabilizator)'],
      C3_convertase: 'C3bBb',
      C5_convertase: 'C3bBb3b',
      amplification_loop: 'C3b generat de orice cale se leagă la FB → Bb → C3 convertaza alternativă → amplificare'
    }
  },
  common_terminal: {
    steps: ['C5 → C5a + C5b', 'C5b + C6 + C7 + C8 + C9n → MAC (Membrane Attack Complex)'],
    MAC: 'C5b-9 — formează pori litici în membrana țintă'
  },
  effector_functions: {
    opsonization: 'C3b → CR1 (CD35), iC3b → CR3 (CD11b/CD18), CR4',
    anaphylatoxins: ['C3a', 'C4a', 'C5a — cel mai puternic chemoatractant pentru neutrofile'],
    lysis: 'MAC pe bacterii Gram-negative, celule infectate/alogene',
    B_cell_costim: 'C3d → CR2 (CD21) pe LB → scade pragul de activare de ~1000×',
    immune_complex_clearance: 'C3b/CR1 pe eritrocite transportă IC la ficat/splină'
  },
  regulators: {
    soluble: ['C1-INH', 'C4BP', 'Factor H', 'Factor I', 'S-protein (vitronectina)', 'Clusterina'],
    membrane: ['DAF (CD55)', 'MCP (CD46)', 'CR1 (CD35)', 'CD59 (protector anti-MAC)']
  },
  pathology: {
    C1_INH_deficit: 'Angioedem ereditar (HAE)',
    C2_deficit: 'Asociere cu LES',
    C3_deficit: 'Infecții piogenice severe recurente',
    C5_9_deficit: 'Susceptibilitate la Neisseria',
    MBL_deficit: 'Infecții pediatrice recurente',
    CD55_CD59_deficit: 'Hemoglobinuria paroxistică nocturnă (PNH) — defect GPI-anchor; Eculizumab (anti-C5).',
    Factor_H_mutation: 'Sindrom hemolitic-uremic atipic (aHUS); DMAE'
  }
};

// ----------------------------------------------------------------------------
// PRR — RECEPTORI DE RECUNOAȘTERE A PATTERNURILOR
// ----------------------------------------------------------------------------
export const PRRs = {
  TLR: [
    { id: 'TLR1/TLR2', location: 'membrană plasmatică', ligand: 'lipopeptide triacilate (bacterii G+)', pathway: 'MyD88 → NF-κB' },
    { id: 'TLR2/TLR6', location: 'membrană plasmatică', ligand: 'lipopeptide diacilate, LTA, zimozan', pathway: 'MyD88 → NF-κB' },
    { id: 'TLR3',      location: 'endozom', ligand: 'ARN dublu-catenar (viral)', pathway: 'TRIF → IRF3 → IFN tip I' },
    { id: 'TLR4',      location: 'membrană plasmatică + endozom', ligand: 'LPS (cu CD14, MD-2)', pathway: 'MyD88 + TRIF (dual)' },
    { id: 'TLR5',      location: 'membrană plasmatică', ligand: 'flagelină', pathway: 'MyD88 → NF-κB' },
    { id: 'TLR7',      location: 'endozom', ligand: 'ARN monocatenar bogat în U (viral)', pathway: 'MyD88 → IRF7 → IFN tip I' },
    { id: 'TLR8',      location: 'endozom', ligand: 'ARN monocatenar', pathway: 'MyD88' },
    { id: 'TLR9',      location: 'endozom', ligand: 'ADN CpG nemetilat (bacterian/viral)', pathway: 'MyD88 → IRF7' },
    { id: 'TLR10',     location: 'membrană plasmatică', ligand: 'neclar (funcție modulatoare)', pathway: 'diverse' }
  ],
  NLR: [
    { id: 'NOD1', ligand: 'iE-DAP (peptidoglican G-)', pathway: 'RIP2 → NF-κB' },
    { id: 'NOD2', ligand: 'MDP (muramyl dipeptid)', pathway: 'RIP2 → NF-κB',
      clinical: 'Mutații CARD15/NOD2 — boala Crohn; sindromul Blau' },
    { id: 'NLRP3', note: 'Inflamazom — activat de ATP, cristale (urat, colesterol, azbest), K+ efflux → caspase-1 → IL-1β, IL-18, piroptoză',
      clinical: 'Sindroame autoinflamatorii (CAPS: Muckle-Wells, FCAS, NOMID/CINCA)' },
    { id: 'NLRP1', note: 'Inflamazom — sensor de toxină letală antrax' },
    { id: 'NAIP/NLRC4', note: 'Sensor de flagelină și T3SS citosolice' }
  ],
  RLR: [
    { id: 'RIG-I', ligand: 'ARN cu 5\'-ppp (viral)', pathway: 'MAVS → IRF3/7 → IFN tip I' },
    { id: 'MDA5', ligand: 'ARN dsARN lung', pathway: 'MAVS → IFN tip I' }
  ],
  CLR: [
    { id: 'Dectin-1', ligand: 'β-glucani (fungi)', pathway: 'Syk → CARD9 → NF-κB' },
    { id: 'Dectin-2', ligand: 'structuri α-manoză (Candida)', pathway: 'FcRγ → Syk → CARD9' },
    { id: 'Mincle',   ligand: 'TDM (corpul bacil TB), SAP130 (self-stress)' },
    { id: 'DC-SIGN',  ligand: 'HIV gp120, Mycobacterium, virusuri' },
    { id: 'Mannose Receptor (CD206)', ligand: 'manoză/fucoză', function: 'endocitoză' }
  ],
  cytosolic_DNA: [
    { id: 'cGAS-STING', ligand: 'ADN citosolic', pathway: 'cGAS → cGAMP → STING → TBK1 → IRF3 → IFN tip I',
      clinical: 'Mutații gain-of-function STING → SAVI (STING-associated vasculopathy)' },
    { id: 'AIM2', note: 'Inflamazom — sensor de ADN citosolic dublu-catenar' }
  ]
};

// ----------------------------------------------------------------------------
// SELECȚIE CD MARKERS (esențiali pentru citometrie și imunofenotipare)
// ----------------------------------------------------------------------------
export const CD_MARKERS = [
  { cd: 'CD1a',  expr: 'Langerhans, timocite, DC', fn: 'Prezentare antigene lipidice' },
  { cd: 'CD2',   expr: 'LT, NK', fn: 'Adeziune (leagă CD58)' },
  { cd: 'CD3',   expr: 'LT, NKT', fn: 'Complex CD3 (γδεζ) — semnal TCR' },
  { cd: 'CD4',   expr: 'Th, monocite, Mφ', fn: 'Co-receptor MHC-II; receptor HIV' },
  { cd: 'CD5',   expr: 'LT, B-1a', fn: 'Modulare TCR/BCR' },
  { cd: 'CD7',   expr: 'LT, NK, progenitori', fn: 'Pan-T precoce' },
  { cd: 'CD8',   expr: 'LT citotoxice', fn: 'Co-receptor MHC-I (αβ sau αα)' },
  { cd: 'CD10',  expr: 'Pro-B, LB germinali, neutrofile', fn: 'CALLA; metaloendopeptidază' },
  { cd: 'CD11a', expr: 'Leucocite', fn: 'LFA-1 α (leagă ICAM)' },
  { cd: 'CD11b', expr: 'Mielocite, NK', fn: 'CR3 α (leagă iC3b, ICAM)' },
  { cd: 'CD11c', expr: 'DC, Mφ, unele LB', fn: 'CR4 α' },
  { cd: 'CD14',  expr: 'Monocite, Mφ', fn: 'Co-receptor LPS (TLR4)' },
  { cd: 'CD15',  expr: 'Neutrofile, Reed-Sternberg', fn: 'Lewis X' },
  { cd: 'CD16',  expr: 'NK (CD56dim), neutrofile, Mφ', fn: 'FcγRIIIa — ADCC' },
  { cd: 'CD18',  expr: 'Leucocite', fn: 'β2-integrină (LFA-1, CR3, CR4) — deficit → LAD-1' },
  { cd: 'CD19',  expr: 'LB (toate stadiile)', fn: 'Co-receptor BCR (cu CD21, CD81)' },
  { cd: 'CD20',  expr: 'LB (pre-B → memorie; NU plasmocit)', fn: 'Canal calciu; țintă Rituximab' },
  { cd: 'CD21',  expr: 'LB, FDC', fn: 'CR2 — leagă C3d și EBV' },
  { cd: 'CD22',  expr: 'LB', fn: 'Siglec-2 — inhibitor BCR' },
  { cd: 'CD23',  expr: 'LB activate, eozinofile', fn: 'FcεRII (receptor afinitate mică pentru IgE)' },
  { cd: 'CD25',  expr: 'LT activate, Treg', fn: 'IL-2Rα' },
  { cd: 'CD27',  expr: 'LT, LB memorie, NK', fn: 'Co-stim (leagă CD70)' },
  { cd: 'CD28',  expr: 'LT', fn: 'Co-stimulare (leagă CD80/CD86) — semnal 2' },
  { cd: 'CD30',  expr: 'LT/LB activate, Reed-Sternberg', fn: 'Co-stim; țintă Brentuximab' },
  { cd: 'CD32',  expr: 'Leucocite', fn: 'FcγRII (IIa activator, IIb inhibitor)' },
  { cd: 'CD33',  expr: 'Mielocite', fn: 'Siglec-3; țintă Gemtuzumab' },
  { cd: 'CD34',  expr: 'HSC, progenitori, endoteliu', fn: 'Marker hematopoietic' },
  { cd: 'CD35',  expr: 'Eritrocite, LB, Mφ', fn: 'CR1 — clearance IC' },
  { cd: 'CD38',  expr: 'Plasmocite, LT activate', fn: 'ADP-riboză ciclază; țintă Daratumumab (mielom)' },
  { cd: 'CD40',  expr: 'LB, DC, Mφ, endoteliu', fn: 'Co-stim (leagă CD40L) — class switch' },
  { cd: 'CD44',  expr: 'Hematopoietic', fn: 'Leagă ac. hialuronic; homing' },
  { cd: 'CD45',  expr: 'Toate leucocitele', fn: 'LCA — tirozin fosfatază (izoforme RA/RO)' },
  { cd: 'CD45RA', expr: 'LT naive', fn: 'Izoform LT naiv' },
  { cd: 'CD45RO', expr: 'LT memorie/activate', fn: 'Izoform LT memorie' },
  { cd: 'CD52',  expr: 'Limfocite', fn: 'Țintă Alemtuzumab' },
  { cd: 'CD54',  expr: 'Endoteliu activat', fn: 'ICAM-1 — ligand LFA-1' },
  { cd: 'CD55',  expr: 'Toate celulele', fn: 'DAF (reglator complement)' },
  { cd: 'CD56',  expr: 'NK, NKT, neuroni', fn: 'NCAM' },
  { cd: 'CD57',  expr: 'NK, LT terminal diferențiate', fn: 'Marker senescență' },
  { cd: 'CD58',  expr: 'APC, eritrocite', fn: 'LFA-3 — ligand CD2' },
  { cd: 'CD59',  expr: 'Toate celulele', fn: 'Protector anti-MAC' },
  { cd: 'CD62L', expr: 'LT naive, granulocite', fn: 'L-selectină — homing HEV' },
  { cd: 'CD64',  expr: 'Mφ, monocite', fn: 'FcγRI (mare afinitate)' },
  { cd: 'CD66b', expr: 'Granulocite', fn: 'Marker neutrofil' },
  { cd: 'CD68',  expr: 'Mφ', fn: 'Marker macrofag' },
  { cd: 'CD69',  expr: 'Limfocite activate', fn: 'Marker de activare precoce' },
  { cd: 'CD80',  expr: 'APC activate', fn: 'B7-1 — leagă CD28/CTLA-4' },
  { cd: 'CD86',  expr: 'APC activate', fn: 'B7-2 — leagă CD28/CTLA-4' },
  { cd: 'CD95',  expr: 'Ubicvitar', fn: 'Fas — apoptoză' },
  { cd: 'CD117', expr: 'HSC, mastocite', fn: 'c-Kit (receptor SCF)' },
  { cd: 'CD122', expr: 'LT, NK', fn: 'IL-2Rβ / IL-15Rβ' },
  { cd: 'CD123', expr: 'pDC, bazofile, BPDCN', fn: 'IL-3Rα' },
  { cd: 'CD127', expr: 'LT naive/memorie, ILC', fn: 'IL-7Rα' },
  { cd: 'CD132', expr: 'Limfocite', fn: 'γc (comun pentru IL-2, 4, 7, 9, 15, 21)' },
  { cd: 'CD138', expr: 'Plasmocite, epiteliu', fn: 'Syndecan-1 — marker plasmocit' },
  { cd: 'CD152', expr: 'LT activate, Treg', fn: 'CTLA-4 — checkpoint inhibitor (Ipilimumab)' },
  { cd: 'CD154', expr: 'LT activate', fn: 'CD40L (deficit → HIGM1)' },
  { cd: 'CD161', expr: 'NK, NKT, MAIT, Th17', fn: 'KLRB1' },
  { cd: 'CD206', expr: 'Mφ (M2), DC imature', fn: 'Mannose Receptor' },
  { cd: 'CD274', expr: 'APC, tumori', fn: 'PD-L1 — checkpoint (Atezolizumab, Durvalumab)' },
  { cd: 'CD279', expr: 'LT epuizate', fn: 'PD-1 — checkpoint (Nivolumab, Pembrolizumab)' },
  { cd: 'CD357', expr: 'LT activate, Treg', fn: 'GITR — co-stim' }
];
