// ============================================================================
// data/genetics.js — Genetica imună
// ============================================================================
// Conține: recombinarea V(D)J, structura loci Ig și TCR, class switch, SHM,
// enzime (RAG1/2, AID, TdT), sistemul HLA (organizare genomică, haplotipuri,
// tipare moleculară — SSP, SSOP, SBT), alogenitate.
// Surse: Janeway's Immunobiology 9e (Ch 5) + Cianga (capitolele HLA și biologie
// moleculară aplicată) + IMGT.
// ============================================================================

// ----------------------------------------------------------------------------
// LOCI-I IMUNOGLOBULINEI — Organizare genomică umană
// ----------------------------------------------------------------------------
export const IG_LOCI = {
  IGH: {
    chromosome: '14q32.33',
    segments: {
      V:  '~40-46 funcționale (din ~125 totale)',
      D:  '~23 (DH)',
      J:  '~6 (JH)',
      C:  'Cμ, Cδ, Cγ3, Cγ1, Cα1, Cψγ, Cγ2, Cγ4, Cε, Cα2 — (ordine 5\'→3\' post-switch)'
    },
    rearrangement: 'D-J mai întâi, apoi V-DJ; pe alela pre-B; exclusiune alelică'
  },
  IGK: {
    chromosome: '2p11.2',
    segments: { V: '~30-35 funcționale', J: '5 (Jκ)', C: 'Cκ unic' },
    rearrangement: 'V-J; dacă non-productiv pe ambele alele → încearcă λ'
  },
  IGL: {
    chromosome: '22q11.2',
    segments: { V: '~30 funcționale', J: '4-5 (Jλ fiecare cu propriul Cλ)', C: 'Cλ1-Cλ7' }
  }
};

// ----------------------------------------------------------------------------
// LOCI-I TCR — Organizare genomică umană
// ----------------------------------------------------------------------------
export const TCR_LOCI = {
  TRA: {
    chromosome: '14q11.2',
    segments: { V: '~50 Vα', J: '~61 Jα', C: 'Cα unic' },
    rearrangement: 'V-J; locus TRD este encuibat în TRA (între Vα și Jα)'
  },
  TRB: {
    chromosome: '7q34',
    segments: { V: '~40-48 Vβ funcționale', D: '2 (Dβ1, Dβ2)', J: '13 (Jβ1, Jβ2)', C: 'Cβ1, Cβ2' },
    rearrangement: 'D-J întâi, apoi V-DJ'
  },
  TRG: {
    chromosome: '7p14',
    segments: { V: '~6 Vγ funcționale', J: '5 Jγ', C: 'Cγ1, Cγ2' }
  },
  TRD: {
    chromosome: '14q11.2 (în interiorul TRA)',
    segments: { V: '3-5 Vδ (plus unele Vα partajate)', D: '3 (Dδ)', J: '4 (Jδ)', C: 'Cδ unic' },
    rearrangement: 'D-D-J-V posibil (3 segmente D concatenate) → diversitate mare CDR3'
  }
};

// ----------------------------------------------------------------------------
// RECOMBINAREA V(D)J — Mecanism molecular
// ----------------------------------------------------------------------------
export const VDJ_RECOMBINATION = {
  steps: [
    {
      n: 1, name: 'Recunoaștere RSS',
      desc: 'RAG1/RAG2 recunosc Recombination Signal Sequences (RSS) = ' +
            'heptamer CACAGTG — 12/23 bp spacer — nonamer ACAAAAACC. Regula 12/23: ' +
            'recombinarea doar între RSS de tipuri opuse (12 cu 23).'
    },
    {
      n: 2, name: 'Sinapsă și clivare',
      desc: 'RAG1/2 + HMGB1 formează complexul sinaptic. Introduc o tăietură ' +
            'monocatenară la capătul codificator, apoi un atac nucleofil intramolecular ' +
            'creează hairpin (cap codificator) + capăt blunt (cap semnal).'
    },
    {
      n: 3, name: 'Rezoluție prin NHEJ',
      desc: 'Calea Non-Homologous End Joining: Ku70/Ku80 → DNA-PKcs → Artemis ' +
            '(deschide hairpin asimetric → P-nucleotides) → TdT adaugă N-nucleotides ' +
            '(doar la IGH, TRB, TRD, TRG) → XRCC4/LigaseIV unesc capetele.'
    },
    {
      n: 4, name: 'Checkpoint pre-BCR / pre-TCR',
      desc: 'La LB: lanț μ împreună cu VpreB + λ5 = pre-BCR → semnalizare prin Igα/Igβ; ' +
            'la LT: TCRβ + pTα = pre-TCR. Semnalul oprește recombinarea pe cealaltă alelă ' +
            '(exclusiune alelică) și induce proliferare.'
    }
  ],
  enzymes: {
    RAG1: { fn: 'Recunoaștere RSS (nonamer), activitate catalitică', expression: 'pro-B, pro-T',
            clinical: 'Deficit complet → SCID T-B-NK+ (forma Omenn cu mutații hipomorfe).' },
    RAG2: { fn: 'Partener al RAG1', expression: 'pro-B, pro-T' },
    TdT:  { fn: 'Adaugă N-nucleotide (template-independent) la joncțiuni',
            expression: 'Pro-B și pro-T; ABSENT în LB fetale — explică absența IgG/IgA ' +
                        'cu diversitate N la făt.',
            contributes_to: 'Cea mai mare parte a diversității CDR3' },
    Artemis: { fn: 'Deschide hairpin-ul; nuclează pe ADN',
               clinical: 'Deficit → SCID cu radiosensibilitate.' },
    DNAPK: { fn: 'Fosforilează Artemis; deficit la șoarecii SCID' },
    Ku70_Ku80: { fn: 'Recunoaștere capete DS-break' },
    LigaseIV: { fn: 'Unește capetele de ADN', clinical: 'Deficit → SCID cu microcefalie.' }
  },
  diversity: {
    sources: [
      'Combinatorică V(D)J (câte un segment din fiecare set)',
      'Flexibilitate joncțională (exonuclează + P/N-adiții)',
      'Combinație între lanțuri (H×L pentru Ig; α×β sau γ×δ pentru TCR)',
      'Hipermutație somatică (numai Ig, post-activare, CG)'
    ],
    theoretical_max_BCR_human: '~5 × 10^13 specificități',
    theoretical_max_TCR_human: '~10^16 specificități'
  }
};

// ----------------------------------------------------------------------------
// ACTIVATION-INDUCED CYTIDINE DEAMINASE (AID) — SHM și CSR
// ----------------------------------------------------------------------------
export const AID = {
  full_name: 'Activation-Induced Cytidine Deaminase',
  gene: 'AICDA (12p13.31)',
  expression: 'Exclusiv în LB activate din centrele germinale (CG)',
  activity: 'Deaminează dCitozină → dUracil pe ADN monocatenar expus în timpul transcripției',
  induction: 'CD40 + IL-4 (sau IL-21 prin Tfh); STAT6, NF-κB, Bcl-6-dependent',
  processes: {
    SHM: {
      name: 'Somatic Hypermutation',
      location: 'Regiunile V (VH + VL) — hotspots RGYW/WRCY',
      mechanism: [
        'AID → U pe ADN ss (expusă la transcripție)',
        'Replicare peste U → tranziție C→T / G→A',
        'Uracil-DNA Glycosylase (UNG) → situs AP → TLS polimeraze (η, ι, ζ) → mutații diverse',
        'MSH2/MSH6 (MMR) → recrutare polη → mutații pe A:T'
      ],
      frequency: '~10^-3 mutații/bp/generație (de milioane de ori peste rata normală)',
      outcome: 'Selecție prin afinitate — LB cu BCR de afinitate crescută leagă antigen pe FDC, primesc ajutor de la Tfh și supraviețuiesc'
    },
    CSR: {
      name: 'Class Switch Recombination',
      location: 'Regiuni switch (S) repetitive în fața fiecărui CH (Sμ, Sγ, Sα, Sε)',
      mechanism: [
        'Citokine specifice induc transcripție „germline" prin regiunea S (cu ARN G-quadruplex)',
        'AID deaminează C pe ambele catene',
        'UNG + APE1 → breaks în S donor (Sμ) și S acceptor',
        'Reuniune prin NHEJ → excizia ADN între S-uri (ca cerc episomal)',
        'Același exon VDJ este acum alăturat unui CH diferit'
      ],
      cytokine_directing_switch: {
        'IgG1 (om)': ['IL-4', 'IL-13'],
        'IgG2 (om)': 'IFN-γ',
        'IgG3 (om)': 'IFN-γ',
        'IgG4 (om)': ['IL-4', 'IL-13', 'IL-10'],
        'IgA':       ['TGF-β', 'APRIL', 'BAFF'],
        'IgE':       ['IL-4', 'IL-13']
      }
    }
  },
  clinical: {
    HIGM2: 'Deficit AID → Sindrom Hiper-IgM tip 2 — IgM ↑, IgG/IgA/IgE↓, fără SHM, fără CSR',
    HIGM5: 'Deficit UNG → Hiper-IgM tip 5 (similar fenotip)',
    tumor_risk: 'AID off-target pe loci non-Ig (c-Myc, BCL6) → translocări → limfom Burkitt, DLBCL'
  }
};

// ----------------------------------------------------------------------------
// SISTEMUL HLA — Organizare genomică și polimorfism
// ----------------------------------------------------------------------------
export const HLA_SYSTEM = {
  location: 'Brațul scurt al cromozomului 6 (6p21.3) — ~4 Mb',
  organization: {
    class_II: 'Telomeric → centromeric: DPB1-DPA1-DOA-DMA-DMB-DOB-TAP1-PSMB9-TAP2-PSMB8-DQA1-DQB1-DQA2-DQB2-DRB-DRA',
    class_III: '≈700 kb cu gene ale complementului (C2, C4A, C4B, Bf), TNF, LT-α/β, HSP70, CYP21',
    class_I: 'Centromeric → telomeric: HLA-B → HLA-C → HLA-A (plus non-clasice HLA-E, F, G)'
  },
  inheritance: 'Haplotip = alelele de pe același cromozom 6. Transmitere Mendeliană co-dominantă → fiecare individ exprimă 2 haplotipuri (unul de la fiecare părinte).',
  sibling_probabilities: {
    HLA_identical: '25%',
    haploidentical: '50%',
    fully_mismatched: '25%'
  },
  polymorphism: {
    alleles_catalogued_IMGT: 'Peste 35.000 alele clasice (actualizare IMGT/HLA dinamică)',
    most_polymorphic: 'HLA-B > HLA-DRB1 > HLA-A > HLA-C',
    hypervariable_regions: 'Exonii 2 și 3 (MHC-I) și exonul 2 (MHC-II) — codifică șanțul peptidic'
  },
  nomenclature: {
    format: 'HLA-DRB1*13:01:01:02N',
    fields: {
      '1st (allele group)': 'Familie alelică (serologic)',
      '2nd (protein)':      'Variante de proteină (aa diferit)',
      '3rd (synonymous)':   'Substituții sinonime în regiuni codante',
      '4th (non-coding)':   'Diferențe în introni / UTR',
      suffix: 'N (null), L (low), S (secreted), C (cytoplasm), A (aberrant), Q (questionable)'
    }
  },
  disease_associations: [
    { hla: 'HLA-B*27',          disease: 'Spondilită anchilozantă', RR: '~90' },
    { hla: 'HLA-B*57:01',       disease: 'Hipersensibilitate la abacavir (test obligatoriu pre-tratament)', RR: 'contraindicație' },
    { hla: 'HLA-DR3 / DR4',     disease: 'Diabet zaharat tip 1 (DR3/DR4 heterozigot cel mai mare risc)' },
    { hla: 'HLA-DR2 (DRB1*15)', disease: 'Scleroză multiplă' },
    { hla: 'HLA-DQ2 / DQ8',     disease: 'Boala celiacă (prezintă peptide de gluten)' },
    { hla: 'HLA-DR4',           disease: 'Artrită reumatoidă (epitopul comun SE)' },
    { hla: 'HLA-B*15:02',       disease: 'Sindrom Stevens-Johnson la carbamazepină (populația asiatică)' },
    { hla: 'HLA-B*51',          disease: 'Boala Behçet' },
    { hla: 'HLA-Cw6',           disease: 'Psoriazis' }
  ]
};

// ----------------------------------------------------------------------------
// TIPAREA HLA — Metode moleculare (din Cianga, cap. „Tiparea tisulară")
// ----------------------------------------------------------------------------
export const HLA_TYPING_METHODS = [
  {
    id: 'CDC',
    name: 'Microlimfocitotoxicitatea (CDC)',
    principle: 'Limfocite + ser anti-HLA specific + complement iepure + colorant vital → ' +
               'celulele ucise încorporează colorantul; identificarea alelei se face după panelul de seruri',
    advantages: ['Istoric "gold standard"', 'Rapid', 'Ieftin'],
    disadvantages: ['Rezoluție scăzută (antigenică, nu alelică)', 'Necesită celule vii', 'Seruri dificil de obținut'],
    status: 'Înlocuit pentru tipare de rutină; mai folosit pentru cross-match complement-dependent.'
  },
  {
    id: 'FLOW',
    name: 'Citometria în flux',
    principle: 'Anti-HLA fluorescenți sau cross-match cu ser pacient + limfocite donor + anti-IgG-FITC',
    advantages: ['Sensibilitate mare', 'Diferențiere LB/LT', 'Cross-match virtuală (Luminex)'],
    status: 'Utilizat pentru cross-match și detectare anticorpi anti-HLA (Luminex single antigen).'
  },
  {
    id: 'SSP',
    name: 'PCR-SSP (Sequence-Specific Priming)',
    principle: 'Amplificare cu primeri alelă-specifici; prezența/absența bandei pe gel → alelă',
    resolution: 'Medie-înaltă (2 câmpuri)',
    advantages: ['Rapid (2-3h)', 'Simplu', 'Potrivit pentru tipare urgentă (grefă cadaver)'],
    disadvantages: ['Multe reacții pentru acoperire', 'Ambiguități alelice']
  },
  {
    id: 'SSOP',
    name: 'PCR-SSOP (Sequence-Specific Oligonucleotide Probing)',
    principle: 'Amplificarea genei → hibridizare cu sonde marcate (pe membrane sau beads Luminex)',
    resolution: 'Medie (2 câmpuri), poate ajunge la 4 câmpuri cu panel extins',
    advantages: ['High-throughput (Luminex)', 'Tipare simultană multiplă']
  },
  {
    id: 'SBT',
    name: 'SBT — Sequence-Based Typing',
    principle: 'Amplificare + secvențiere Sanger (bidirecțională) a exonilor polimorfi',
    resolution: 'Mare (4 câmpuri) — identificare alelică completă',
    advantages: ['Standardul de aur pentru grefe neînrudite', 'Rezoluție maximă'],
    disadvantages: ['Ambiguități de fază (heterozigot nedefinit) necesită primeri suplimentari']
  },
  {
    id: 'NGS',
    name: 'Secvențiere de generație următoare (NGS)',
    principle: 'Sequencing masiv paralel — rezolvă ambiguitățile de fază',
    resolution: 'Foarte mare (4 câmpuri cu faze)',
    status: 'Devenit standardul actual pentru tipare HLA clinic și în registru.'
  },
  {
    id: 'MLC',
    name: 'Cultura limfocitară mixtă (MLC)',
    principle: 'Limfocite donor iradiate + limfocite receptor → proliferare (măsurată prin incorporare 3H-timidină) → stimulare funcțională = incompatibilitate',
    status: 'Istoric; înlocuit de metodele moleculare, dar util în cercetare.'
  }
];

// ----------------------------------------------------------------------------
// CROSS-MATCH (X-match) — Compatibilitatea pre-transplant
// ----------------------------------------------------------------------------
export const CROSSMATCH = {
  purpose: 'Detectarea anticorpilor preformați în serul receptorului împotriva HLA-ului donorului — contraindicație pentru transplant (risc de rejet hiperacut).',
  types: [
    {
      id: 'CDC-XM',
      method: 'Ser receptor + limfocite donor + complement iepure → liză dacă există anti-HLA',
      sensitivity: 'Medie'
    },
    {
      id: 'Flow-XM',
      method: 'Ser receptor + limfocite donor + anti-IgG-FITC → citometrie',
      sensitivity: 'Înaltă — detectează anticorpi non-fixatori de complement'
    },
    {
      id: 'Virtual-XM',
      method: 'Comparare digitală între anticorpii anti-HLA ai receptorului (Luminex SAB) și tiparea HLA a donorului',
      sensitivity: 'Foarte înaltă — identifică DSA (donor-specific antibodies)',
      use: 'Standard actual; permite alocare de organ rapidă.'
    }
  ],
  DSA: 'Donor-Specific Antibodies — anticorpi anti-HLA ai receptorului direcționați specific împotriva alelelor donorului; risc de rejet acut umoral și cronic.',
  PRA: 'Panel Reactive Antibody — procentul din populația generală cu care receptorul ar avea XM pozitivă (sensibilizare prin transfuzii, sarcini, grefe anterioare).'
};

// ----------------------------------------------------------------------------
// MODELE ANIMALE (din Cianga)
// ----------------------------------------------------------------------------
export const ANIMAL_MODELS = [
  {
    id: 'inbred',
    name: 'Șoareci inbred (singenici)',
    description: 'Obținuți prin >20 generații de împerechere frate×soră → >99% homozigoți, identici genetic.',
    uses: ['Studii imune reproductibile', 'Transplant singeneic de referință'],
    examples: ['C57BL/6', 'BALB/c', 'DBA/2', 'C3H', 'NOD (diabet autoimun)']
  },
  {
    id: 'congenic',
    name: 'Șoareci congenici',
    description: 'Linie inbred în care a fost introdus un singur locus de la altă linie (backcross repetitiv).',
    uses: ['Studii de alele HLA/H-2 specifice', 'Marker congenic (ex. CD45.1/.2) pentru transferul adoptiv']
  },
  {
    id: 'chimera',
    name: 'Șoareci chimerici',
    description: 'Organism cu populații celulare din 2 genotipuri diferite (ex. măduvă transplantată după iradiere letală).',
    uses: ['Ontogeneza limfocitelor', 'Originea hematopoietică vs timică a unor celule']
  },
  {
    id: 'SCID',
    name: 'Șoareci SCID',
    description: 'Mutație spontană Prkdc^scid → deficit DNA-PKcs → blocaj V(D)J → absența LB și LT matur.',
    uses: ['Xenotransplant celule umane (humanized mice PBMC-NSG sau BLT)', 'Studii de oncogeneză']
  },
  {
    id: 'nude',
    name: 'Șoareci nuzi (nu/nu)',
    description: 'Mutație FOXN1 → aplazie timică → absență LT mature; NK și LB intacte; absență păr (fenotip nude).',
    uses: ['Xenografe tumorale umane', 'Studii de funcție LT']
  },
  {
    id: 'NOD-SCID',
    name: 'NSG / NOG (NOD-SCID-γc−/−)',
    description: 'Fond NOD (deficit NK funcțional) + SCID + KO IL2Rγc → lipsă LT, LB și NK.',
    uses: ['Cea mai permisivă gazdă pentru xenograft uman', 'Modele "humanized"']
  },
  {
    id: 'transgenic',
    name: 'Șoareci transgenici',
    description: 'Gene străine integrate aleator în genom prin microinjecție în pronucleul oului fertilizat sau prin recombinare lentivirală.',
    uses: ['Studii de expresie forțată (ex. TCR transgenic OT-I, OT-II)', 'Modele de boli umane']
  },
  {
    id: 'knockout',
    name: 'Șoareci knock-out (KO)',
    description: 'Gena țintă este inactivată prin recombinare omologă în celule ES, urmată de generarea șoarecilor chimerici → transmitere în germline.',
    types: ['Constitutiv (gena absentă în toate celulele, toată viața)',
            'Condițional (Cre-loxP — KO specific țesut/timp)',
            'Inductibil (tamoxifen-Cre, tet-on/off)'],
    uses: ['Studierea funcției genei', 'Modele de imunodeficiențe']
  },
  {
    id: 'knockin',
    name: 'Șoareci knock-in',
    description: 'Înlocuirea precisă a unei gene native cu o versiune modificată (mutant, reporter, humanizat).',
    uses: ['Modele de boală cu mutații specifice', 'Linii „reporter" fluorescente (FoxP3-GFP)']
  },
  {
    id: 'CRISPR',
    name: 'Editare CRISPR/Cas9 (adăugat ed. Janeway 9)',
    description: 'sgRNA + Cas9 → double strand break → NHEJ (KO) sau HDR (KI). Rapid, eficient, multiplexabil.',
    uses: ['KO în embrioni direct (fără ES)', 'KI precis', 'Screening-uri genomice cu biblioteci de sgRNA', 'Editare in vivo']
  }
];
