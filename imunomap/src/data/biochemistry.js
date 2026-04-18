// ============================================================================
// data/biochemistry.js — Biochimia semnalizării imune
// ============================================================================
// Conține căile de semnalizare majore: TCR, BCR, CD28, TLR, JAK-STAT,
// NF-κB, NFAT, MAPK, apoptoză, procesare antigenică, cascade de complement.
// Surse: Janeway 9e (Ch 7, 8), + integrări farmacologice și clinice.
// ============================================================================

// ----------------------------------------------------------------------------
// CALEA DE SEMNALIZARE TCR — Activarea limfocitului T
// ----------------------------------------------------------------------------
export const TCR_PATHWAY = {
  name: 'Signaling TCR (semnal 1)',
  initiation: [
    'Contact TCR–peptid/MHC pe APC',
    'CD4 sau CD8 (co-receptor) aduce Lck (Src-kinază) în proximitate',
    'Lck fosforilează ITAM-urile din CD3ζ, γ, δ, ε (2 tirozine fiecare ITAM × 10 ITAM-uri = 20 p-Tyr per TCR)',
    'ZAP-70 se leagă la ITAM-urile fosforilate dublu prin domeniile SH2 în tandem',
    'Lck fosforilează și activează ZAP-70'
  ],
  downstream: [
    'ZAP-70 → fosforilare LAT (scaffold transmembranar) și SLP-76',
    'LAT recrutează: Grb2, Gads, PLCγ1, PI3K',
    'PLCγ1 → IP3 + DAG',
    'IP3 → Ca2+ din RE → CRAC (Orai1/STIM1) → calcineurină',
    'Calcineurină defosforilează NFAT → NFAT nuclear',
    'DAG → PKCθ → CARMA1/BCL10/MALT1 → IKK → NF-κB',
    'DAG → RasGRP → Ras-GTP → Raf → MEK → ERK → AP-1 (Fos, Jun)'
  ],
  transcription_factors: ['NFAT', 'NF-κB', 'AP-1'],
  outcome: 'Transcripție IL-2 și receptorul IL-2 (CD25) → proliferare clonală',
  drugs: {
    'Ciclosporina A': 'Leagă ciclofilina → inhibă calcineurina → blocaj NFAT',
    'Tacrolimus':     'Leagă FKBP12 → inhibă calcineurina',
    'Dasatinib':      'Inhibitor Lck/Src (off-target în terapia imună)'
  }
};

export const CD28_COSTIM = {
  name: 'Co-stimulare CD28 (semnal 2)',
  ligands: ['CD80 (B7-1) și CD86 (B7-2) pe APC activate'],
  downstream: [
    'CD28 cross-link → activare PI3K → PIP3',
    'PIP3 recrutează Akt (via PDK1) → mTORC1',
    'Activare Vav1 → GEF pentru Rac1 → reorganizare citoschelet',
    'Stabilizează mARN IL-2; previne anergia'
  ],
  checkpoints: {
    'CTLA-4': {
      expression: 'LT activate, Treg (constitutiv)',
      affinity: 'Superioară CD28 pentru CD80/CD86 → competiție',
      function: 'Semnal inhibitor; trans-endocitează CD80/CD86 de pe APC',
      drug: 'Ipilimumab (anti-CTLA-4) — melanom, RCC, NSCLC'
    },
    'PD-1': {
      ligands: ['PD-L1 (CD274) — ubicvitar inductibil', 'PD-L2 (CD273) — APC'],
      function: 'Recrutează SHP-2 → defosforilează CD28 și TCR proximale → „exhaustion"',
      drugs: ['Nivolumab, Pembrolizumab, Cemiplimab (anti-PD-1)', 'Atezolizumab, Durvalumab, Avelumab (anti-PD-L1)']
    },
    'LAG-3':  { function: 'Leagă MHC-II cu afinitate mai mare decât CD4 → inhibă', drug: 'Relatlimab' },
    'TIM-3':  { function: 'Leagă galectina-9, fosfatidilserină', role: 'Epuizare LT' },
    'TIGIT':  { function: 'Leagă CD155 → inhibă; competiție cu co-stimulator DNAM-1' },
    'BTLA':   { function: 'Leagă HVEM; inhibitor' }
  }
};

// ----------------------------------------------------------------------------
// CALEA BCR — Activarea limfocitului B
// ----------------------------------------------------------------------------
export const BCR_PATHWAY = {
  signal_transducers: 'Igα (CD79a) + Igβ (CD79b) — ITAM-uri în domeniile citoplasmatice',
  downstream: [
    'Lyn (Src-kinază) fosforilează ITAM-urile',
    'Syk se leagă și este activată prin fosforilare',
    'Syk → BLNK (scaffold, analog LAT) → PLCγ2, Btk, Vav',
    'PLCγ2 → IP3/DAG → cascade NFAT, NF-κB, AP-1 (ca la TCR)',
    'Btk (Bruton tyrosine kinase) esențial pentru activare B'
  ],
  co_receptor: {
    CD19_CD21_CD81: 'Complex co-receptor B; CD21 (CR2) leagă C3d pe antigen ' +
                    '→ scade pragul de activare ~1000×',
    CD22:           'Co-receptor inhibitor (ITIM)'
  },
  clinical: {
    'XLA (Bruton)':        'Mutații BTK → agamaglobulinemie legată de X — absența LB și Ig serice',
    'Ibrutinib':           'Inhibitor Btk — CLL, MCL, Waldenström; utilizat și în BGvH cronică',
    'Rituximab':           'Anti-CD20 — depleția LB (limfom non-Hodgkin, RA, LES, SM)',
    'Obinutuzumab':        'Anti-CD20 de generația a 2-a, ADCC crescut'
  }
};

// ----------------------------------------------------------------------------
// JAK-STAT — Calea universală a semnalizării citokinelor
// ----------------------------------------------------------------------------
export const JAK_STAT = {
  principle: 'Dimerizarea receptorilor de citokine → trans-fosforilare JAK-uri → fosforilare a tirozinelor de pe coada citoplasmatică a receptorilor → docking pentru STAT (SH2) → fosforilare STAT → dimerizare STAT → translocare nucleară → legare GAS/ISRE → transcripție',
  JAKs: ['JAK1', 'JAK2', 'JAK3 (doar cu γc)', 'TYK2'],
  STATs: ['STAT1', 'STAT2', 'STAT3', 'STAT4', 'STAT5a/b', 'STAT6'],
  cytokine_pairings: {
    'IL-2, IL-4, IL-7, IL-9, IL-15, IL-21': 'γc + JAK1/JAK3 → STAT5 (STAT3 pentru IL-21; STAT6 pentru IL-4)',
    'IL-3, IL-5, GM-CSF': 'βc + JAK2 → STAT5',
    'IL-6, IL-11, LIF':   'gp130 + JAK1/JAK2/TYK2 → STAT3',
    'IL-12, IL-23':       'JAK2/TYK2 → STAT4 (IL-12), STAT3 (IL-23)',
    'IFN-α/β':            'JAK1/TYK2 → STAT1/STAT2 + IRF9 (ISGF3) → ISRE',
    'IFN-γ':              'JAK1/JAK2 → STAT1 → GAS',
    'IL-10, IL-22':       'JAK1/TYK2 → STAT3'
  },
  regulators: {
    SOCS:  'Suppressor Of Cytokine Signaling — feedback negativ (SOCS1 pentru IFN, SOCS3 pentru IL-6/IL-10)',
    PIAS:  'Inhibitor al STAT activat',
    PTPN2_SHP1: 'Fosfataze care defosforilează JAK/STAT'
  },
  drugs: {
    'Tofacitinib':  'JAK1/JAK3 — RA, IBD',
    'Ruxolitinib':  'JAK1/JAK2 — mielofibroză, policitemia vera, GvHD',
    'Baricitinib':  'JAK1/JAK2 — RA',
    'Upadacitinib': 'JAK1 selectiv — RA, IBD, dermatită atopică',
    'Deucravacitinib': 'TYK2 — psoriazis'
  },
  clinical_deficits: {
    'JAK3 / IL-2Rγc': 'SCID T-B+NK- (X-linked sau autosomal recesiv)',
    'STAT1 gain-of-function': 'Candidoza mucocutanată cronică',
    'STAT3 dominant-negativ': 'Sindrom hiper-IgE (Job) — eczemă, abcese reci, fracturi',
    'STAT5b': 'Deficit de creștere + imunodeficiență'
  }
};

// ----------------------------------------------------------------------------
// NF-κB — Inflamație, apărare, supraviețuire
// ----------------------------------------------------------------------------
export const NFKB_PATHWAY = {
  subunits: ['p65 (RelA)', 'RelB', 'c-Rel', 'p50 (NF-κB1)', 'p52 (NF-κB2)'],
  canonical: {
    activators: ['TNF-α (TNFR1)', 'IL-1 (IL-1R)', 'TLR', 'TCR', 'BCR'],
    cascade: [
      'Receptor → adaptori (MyD88/TRAF/TRADD)',
      'Complex IKK (IKKα/IKKβ/NEMO) activat',
      'IKKβ fosforilează IκBα → ubiquitinare → degradare proteazomală',
      'p65/p50 eliberat → translocare nucleară',
      'Transcripție: IL-6, IL-8, TNF, IL-1β, Bcl-xL, A20, COX-2'
    ]
  },
  non_canonical: {
    activators: ['LT-β', 'BAFF', 'CD40L'],
    cascade: [
      'NIK stabilizat',
      'IKKα fosforilează p100',
      'p100 procesat → p52',
      'p52/RelB translocare nucleară',
      'Transcripție: limfoorganogeneza, centre germinale'
    ]
  },
  deficits_clinical: {
    'NEMO (X-linked)': 'Displazie ectodermică cu imunodeficiență',
    'IKBA gain':       'Imunodeficiență cu displazie ectodermică',
    'CARD11, BCL10, MALT1': 'SCID cu limfom risc crescut'
  }
};

// ----------------------------------------------------------------------------
// PROCESAREA ANTIGENICĂ — Calea MHC-I și MHC-II
// ----------------------------------------------------------------------------
export const ANTIGEN_PROCESSING = {
  MHC_I_pathway: {
    name: 'Calea endogenă (citosolică)',
    steps: [
      '1. Proteine citosolice ubiquitinate',
      '2. Degradate în proteazom (imunoproteazom după IFN-γ: β1i, β2i, β5i → peptide preferate MHC-I)',
      '3. Peptide transportate prin TAP1/TAP2 (TAP) în RE — consumă ATP',
      '4. În RE: complexul de încărcare (peptide-loading complex, PLC): calnexină → ERp57 → tapasină → calreticulina',
      '5. MHC-I/β2m leagă peptid; eliberare și trafic prin Golgi → membrană',
      '6. Prezentare peptid 8-10 aa pe MHC-I către LT CD8+'
    ],
    cross_presentation: {
      desc: 'Capacitatea cDC1 de a prezenta antigene exogene pe MHC-I (esențial pentru CTL anti-virali și anti-tumorali care nu infectează direct DC).',
      mechanism: 'Fagozom "permeabil" → peptide scapă în citosol; sau încărcare vacuolară alternativă.'
    }
  },
  MHC_II_pathway: {
    name: 'Calea exogenă (endo-lizozomală)',
    steps: [
      '1. Antigen endocitat/fagocitat',
      '2. MHC-II sintetizat în RE; asociat cu lanțul invariant (Ii/CD74, trimer) care blochează șanțul peptidic',
      '3. Complex MHC-II/Ii direcționat în compartimentul MIIC',
      '4. Catepsine (S, L) clivează Ii → CLIP rămâne în șanț',
      '5. HLA-DM catalizează schimbul CLIP ↔ peptid antigenic (HLA-DO modulează DM în LB)',
      '6. MHC-II/peptid → membrană plasmatică',
      '7. Prezentare peptid 13-25 aa către LT CD4+'
    ]
  },
  CD1_pathway: {
    name: 'Prezentare antigene lipidice',
    desc: 'CD1a/b/c/d leagă lipide/glicolipide; CD1d prezintă α-GalCer la LT NKT.'
  }
};

// ----------------------------------------------------------------------------
// APOPTOZA — Căile extrinsecă și intrinsecă
// ----------------------------------------------------------------------------
export const APOPTOSIS = {
  extrinsic: {
    triggers: ['FasL (CD95L)', 'TNF-α (TNFR1)', 'TRAIL (DR4/DR5)'],
    cascade: [
      'Fas trimerizare → FADD (prin DD) → caspase-8 (prin DED) → DISC (Death-Inducing Signaling Complex)',
      'Caspaza-8 activă → caspaze efectorii (3, 6, 7) — direct în celulele tip I',
      'În celulele tip II: caspaza-8 → Bid → tBid → mitocondrie (cale intrinsecă amplificatoare)'
    ],
    regulation: ['FLIP (c-FLIP) — inhibitor caspazei-8']
  },
  intrinsic: {
    triggers: ['Stres celular', 'Leziuni ADN', 'Lipsă factori de creștere', 'Stres RE', 'ROS'],
    regulators: {
      pro_apoptotic: ['Bax', 'Bak', 'Bad', 'Bid', 'Bim', 'Puma', 'Noxa'],
      anti_apoptotic: ['Bcl-2', 'Bcl-xL', 'Mcl-1', 'A1', 'Bcl-w']
    },
    cascade: [
      'BH3-only proteine activate → neutralizare Bcl-2 + activare Bax/Bak',
      'Bax/Bak → MOMP (mitochondrial outer membrane permeabilization)',
      'Citocrom c eliberat → Apaf-1 + dATP → apoptozom',
      'Apoptozom activează caspaza-9 → caspaze 3, 6, 7',
      'Smac/Diablo eliberat → inhibă IAPs (XIAP) → eliberează caspazele'
    ]
  },
  executioners: ['Caspaza-3 (cea mai importantă)', 'Caspaza-6', 'Caspaza-7'],
  substrates: ['ICAD → CAD → fragmentare ADN (scara internucleozomală 180 bp)', 'Laminele', 'PARP', 'Gelsolina'],
  detection: {
    methods: [
      'Annexin V (leagă fosfatidilserina expusă — precoce)',
      'TUNEL (etichetare capete ADN fragmentat)',
      'Colorare sub-G1 (citometrie DNA ploidie)',
      'Coloranți vitali (7-AAD, PI — detectează necroza/apoptoza tardivă)',
      'Caspase cleavage (anti-PARP cleaved; FAM-FLICA)'
    ]
  },
  clinical: {
    'ALPS':         'Deficit Fas/FasL/Caspaza-8/10 → proliferare limfocitară autoimună',
    'Follicular lymphoma': 't(14;18) → supraexprimare BCL2 → rezistență la apoptoză',
    'Venetoclax':   'Inhibitor BCL-2 — CLL'
  }
};

// ----------------------------------------------------------------------------
// INFLAMAZOMUL — Piroptoza și IL-1 maturation
// ----------------------------------------------------------------------------
export const INFLAMMASOME = {
  principle: 'Complex multi-proteic citosolic care activează caspaza-1 → IL-1β/IL-18 (prin clivaj din pro-forme) + piroptoză (prin clivaj GSDMD)',
  sensors: ['NLRP3 (cel mai studiat)', 'NLRP1', 'NAIP/NLRC4', 'AIM2 (ADN)', 'Pyrin (TRIM20)'],
  NLRP3_activation: {
    signal_1: 'Priming: TLR/NF-κB → transcripție pro-IL-1β, pro-IL-18, NLRP3',
    signal_2: 'Activare: K+ efflux, ROS, leziune lizozomală, cristale',
    triggers: ['ATP extracelular (P2X7)', 'Nigericină', 'Uraţi monosodici (gută)', 'Cristale colesterol', 'Azbest, silica', 'Amiloid β', 'MSU']
  },
  assembly: 'NLRP3 → ASC (prin PYD) → Caspaza-1 (prin CARD) → „speck" perinuclear vizibil la microscopie',
  downstream: {
    IL_1beta: 'Pyrogen endogen, pro-inflamator, activare endoteliu',
    IL_18:    'Sinergie cu IL-12 → IFN-γ',
    pyroptosis: 'GSDMD clivat formează pori în membrană → liză litică proinflamatorie'
  },
  clinical: {
    CAPS:    'Cryopyrin-Associated Periodic Syndromes — mutații NLRP3 activatoare (FCAS, MWS, NOMID)',
    FMF:     'Familial Mediterranean Fever — mutații MEFV (pyrin)',
    gout:    'Cristale urat → NLRP3 → IL-1β',
    therapy: 'Anakinra, Canakinumab, Rilonacept — blocadă IL-1'
  }
};

// ----------------------------------------------------------------------------
// NADPH OXIDAZĂ — Explozie respiratorie
// ----------------------------------------------------------------------------
export const RESPIRATORY_BURST = {
  complex: 'NADPH oxidaza (Phagocyte oxidase)',
  subunits: [
    'gp91phox (CYBB) — catalitic, membranar',
    'p22phox (CYBA) — membranar',
    'p47phox (NCF1) — citosolic, organizator',
    'p67phox (NCF2) — citosolic, activator',
    'p40phox (NCF4) — citosolic, reglator',
    'Rac2 — GTP-ază mică'
  ],
  reaction: '2 O2 + NADPH → 2 O2•− (superoxid) + NADP+ + H+',
  downstream_ROS: [
    'O2•− → H2O2 (SOD)',
    'H2O2 + Cl− → HOCl (acid hipocloros) prin mieloperoxidază (MPO) — extrem de bactericid',
    'Reacții Fenton: H2O2 + Fe2+ → •OH'
  ],
  clinical: {
    CGD: 'Boala granulomatoasă cronică — mutații în oricare subunitate (cel mai frecvent gp91phox X-linked). ' +
         'Diagnostic prin testul DHR (Dihydrorhodamine-123) la citometrie sau NBT clasic. ' +
         'Infecții recurente cu catalazo-pozitive (Staphylococcus, Serratia, Burkholderia, Aspergillus).',
    treatment: 'Profilaxie antibiotică/antifungică; IFN-γ recombinant; transplant HSC'
  }
};

// ----------------------------------------------------------------------------
// INTEGRINE ȘI ADEZIUNE LEUCOCITARĂ (cascada rolling-arrest-transmigration)
// ----------------------------------------------------------------------------
export const LEUKOCYTE_ADHESION = {
  cascade: [
    { step: 1, name: 'Capture și rolling', molecules: ['L-selectină (CD62L) pe leucocit', 'E-selectină, P-selectină pe endoteliu'], ligands: ['PSGL-1', 'Sialyl-Lewis^x'] },
    { step: 2, name: 'Activare prin chemokine', molecules: ['Chemokine pe endoteliu (ex. CXCL8)', 'Receptori cuplați cu proteine G'], outcome: 'Activare integrine prin semnalizare „inside-out"' },
    { step: 3, name: 'Arest ferm', molecules: ['LFA-1 (CD11a/CD18)', 'Mac-1 (CD11b/CD18)', 'VLA-4 (CD49d/CD29)'], ligands: ['ICAM-1 (CD54)', 'ICAM-2', 'VCAM-1'] },
    { step: 4, name: 'Diapedeză (transmigrare)', molecules: ['PECAM-1 (CD31)', 'CD99', 'JAM-A/B/C'] },
    { step: 5, name: 'Chemotaxie în țesut', directed_by: ['CXCL8, C5a, LTB4, fMLP (bacterial)'] }
  ],
  clinical: {
    'LAD-1': 'Deficit CD18 (β2) → absența Mac-1, LFA-1, p150/95. Întârzierea căderii cordonului ombilical, leucocitoză persistentă, infecții piogene fără puroi.',
    'LAD-2': 'Deficit fucosyl-transferază → lipsă Sialyl-Lewis^x (absent rolling).',
    'LAD-3': 'Deficit kindlin-3 → defect activare integrină + hemoragii (trombocite).'
  }
};
