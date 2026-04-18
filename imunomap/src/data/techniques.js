// ============================================================================
// data/techniques.js — Tehnici utilizate în imunologie
// ============================================================================
// Integrare detaliată a tehnicilor descrise în Cianga — „Tehnici utilizate în
// imunologie" (PIM, 2008), completată cu Appendix I din Janeway 9e
// („The Immunologist's Toolbox").
// ============================================================================

export const TECHNIQUES = [
  // ==========================================================================
  // REACȚII ANTIGEN-ANTICORP — Principii
  // ==========================================================================
  {
    id: 'ag_ab_interaction',
    category: 'Fundamente',
    name: 'Interacțiunea antigen-anticorp',
    bonds: [
      'Electrostatice (ionice) — ~1/r²',
      'Hidrogen — ~3-7 kcal/mol',
      'Van der Waals — forțe slabe dar numeroase',
      'Hidrofobe — forța dominantă în paratop-epitop'
    ],
    factors: [
      'Specificitate — complementaritate spațială și chimică',
      'Afinitate — constanta Ka pentru un situs de legare',
      'Aviditate — efectul cumulativ al mai multor situsuri (IgM pentamer > IgG monomer)',
      'Reactivitate încrucișată — epitopi similari pe antigene diferite',
      'Accesibilitate epitopică — conformație, mascarea de către glicozilare',
      'Valența — număr de situsuri de legare/antigen',
      'Concentrație — echivalența este punctul optim de precipitare',
      'pH, temperatură, forță ionică, potențial zeta'
    ]
  },

  // ==========================================================================
  // ANTICORPI MONOCLONALI
  // ==========================================================================
  {
    id: 'mAb',
    category: 'Producție',
    name: 'Anticorpi monoclonali (Köhler & Milstein, 1975)',
    method: [
      '1. Imunizare șoarece cu antigenul de interes',
      '2. Prelevare splină → limfocite B',
      '3. Fuziune LB cu celule mielom (Sp2/0, NS1) deficiente HGPRT — prin PEG (polietilen glicol)',
      '4. Selecție în mediu HAT (hipoxantină-aminopterină-timidină) — supraviețuiesc doar hibridoamele (HGPRT+ de la LB și nemuritoare de la mielom)',
      '5. Screening prin ELISA pentru clonele secretoare de Ac de interes',
      '6. Diluție limită — clonă pură (monoclonală)',
      '7. Expansiune in vitro sau ascită (in vivo, interzisă în multe țări)'
    ],
    modern_variants: [
      'Anticorpi himerici (mouse Fv + human Fc) — sufix „-ximab" (Rituximab)',
      'Anticorpi humanizați (CDR-grafted) — sufix „-zumab" (Trastuzumab)',
      'Anticorpi complet umani (phage display, transgenic) — sufix „-umab" (Adalimumab)',
      'Anticorpi bispecifici — BiTE (Blinatumomab — CD19×CD3)',
      'Anticorp-drog conjugate (ADC) — Brentuximab-vedotin, Trastuzumab-emtansine',
      'Fragmente Fab, scFv, nanobodies (VHH — cămăluțe, llama)'
    ]
  },

  // ==========================================================================
  // REACȚII DE PRECIPITARE
  // ==========================================================================
  {
    id: 'precipitation_solution',
    category: 'Precipitare',
    name: 'Precipitarea în soluție',
    principle: 'Formarea de reţele insolubile Ag-Ac la echivalență (zone: prozonă, echivalență, postzonă)',
    methods: ['Heidelberger (curba cantitativă)', 'Test de precipitare în inel (Oudin)'],
    current_use: 'Rareori în rutină; util pentru cuantificare în cercetare.'
  },
  {
    id: 'ouchterlony',
    category: 'Precipitare',
    name: 'Dubla imunodifuzie (Ouchterlony)',
    principle: 'Antigenul și anticorpul difuzează unul spre altul în gel de agaroză; linia de precipitare la echivalență',
    patterns: {
      'Identitate totală': 'Linie continuă între cele 2 godeuri cu Ag — Ac recunoaște aceeași moleculă',
      'Neidentitate':      'Liniile se încrucișează — antigene diferite',
      'Identitate parțială': 'Spur (pinten) — epitop comun dar antigene diferite în rest'
    },
    uses: ['Identificare antigene', 'Comparare specificitate antiseruri'],
    current_use: 'Didactic; înlocuită în laboratoarele clinice de tehnicile cantitative.'
  },
  {
    id: 'mancini',
    category: 'Precipitare',
    name: 'Imunodifuzia radială simplă (Mancini)',
    principle: 'Antigenul difuzează radial într-un gel ce conține anticorp; inelul de precipitare are diametrul proporțional cu concentrația antigenului (relație pătratică)',
    curve: 'd² = f(concentrație)',
    uses: ['Dozare IgG, IgA, IgM serice (istoric)', 'Cuantificare componente complement'],
    current_use: 'Standard în unele laboratoare; înlocuită majoritar de nefelometrie.'
  },
  {
    id: 'immunoelectrophoresis',
    category: 'Precipitare',
    name: 'Imunelectroforeza',
    principle: 'Electroforeza antigenelor în gel urmată de imunodifuzie cu anti-ser pe un jgheab paralel',
    uses: ['Identificarea proteinelor serice', 'Detectarea paraproteinelor (mielom multiplu — componenta M)']
  },
  {
    id: 'IFE',
    category: 'Precipitare',
    name: 'Imunofixare (IFE — Immunofixation Electrophoresis)',
    principle: 'Electroforeza serului în gel + aplicarea de anti-seruri specifice (IgG, IgA, IgM, κ, λ) direct pe urma electroforetică; apoi colorare',
    uses: ['Diagnostic mielom multiplu', 'Identificarea tipului paraproteinei (ex. IgG-κ)', 'Boala lanțurilor ușoare'],
    advantage: 'Precis pentru tipizare Ig monoclonale; mai sensibil decât imunoelectroforeza.'
  },
  {
    id: 'rocket_electrophoresis',
    category: 'Precipitare',
    name: 'Electroforeza în rachetă (Laurell)',
    principle: 'Antigenul migrează electroforetic într-un gel care conține anticorp; piscul de precipitare are formă de „rachetă", înălțimea fiind proporțională cu concentrația'
  },
  {
    id: 'IEF',
    category: 'Precipitare',
    name: 'Focusare izoelectrică (IEF)',
    principle: 'Separare proteine într-un gradient de pH; proteinele se opresc la punctul lor izoelectric (pI)',
    uses: ['Separarea benzilor oligoclonale în LCR (diagnostic SM)', 'Analiza izoformelor']
  },

  // ==========================================================================
  // AGLUTINARE
  // ==========================================================================
  {
    id: 'agglutination_direct',
    category: 'Aglutinare',
    name: 'Aglutinarea directă',
    principle: 'Anticorpi aglutinează particule (eritrocite, bacterii) care poartă antigenul',
    uses: ['Grupul sangvin ABO (anti-A, anti-B reacționează cu eritrocitele)',
           'Rh (test indirect — vezi Coombs)',
           'Serologie bacteriană (Widal)']
  },
  {
    id: 'agglutination_indirect',
    category: 'Aglutinare',
    name: 'Aglutinarea pasivă (indirectă)',
    principle: 'Antigen solubil adsorbit pe particule indicatoare (latex, gelatină, eritrocite tanate) → aglutinare cu Ac',
    uses: ['Test latex pentru factor reumatoid', 'Test TPPA pentru sifilis', 'ASLO pentru streptococi']
  },
  {
    id: 'coombs',
    category: 'Aglutinare',
    name: 'Testul Coombs (anti-imunoglobulinic)',
    variants: {
      direct: 'Detectează Ac fixați pe eritrocitele pacientului (anemie hemolitică autoimună, boala hemolitică neonatală)',
      indirect: 'Detectează Ac anti-eritrocite în serul pacientului (screening Ac materni, compatibilitate transfuzie)'
    },
    principle: 'Ser anti-IgG (și anti-C3d) aglutinează eritrocitele acoperite cu Ac (direct) sau eritrocitele adăugate după incubare cu serul de testat (indirect)'
  },

  // ==========================================================================
  // TESTE DE FAZĂ SOLIDĂ
  // ==========================================================================
  {
    id: 'RIA',
    category: 'Faza solidă',
    name: 'Radioimmunoassay (RIA — Yalow & Berson, 1960)',
    principle: 'Competiție între Ag marcat radioactiv (125I, 3H) și Ag nemarcat (din probă) pentru situsuri limitate de Ac. Radioactivitatea pe faza solidă este invers proporțională cu concentrația Ag din probă.',
    uses_historical: ['Dozare hormoni (insulină, TSH)', 'Markeri tumorali'],
    status: 'Înlocuit majoritar de ELISA (rezidurile radioactive, costuri, reglementări)'
  },
  {
    id: 'RIST_RAST',
    category: 'Faza solidă',
    name: 'RIST / RAST',
    RIST: 'Radio Immuno Sorbent Test — cuantificarea IgE totale serice',
    RAST: 'Radio Allergo Sorbent Test — cuantificarea IgE specifice pentru un alergen (alergenul cuplat la faza solidă)',
    modern: 'ImmunoCAP (Phadia) — tehnologie fluoroenzimatică care a înlocuit RAST clasic.'
  },
  {
    id: 'ELISA',
    category: 'Faza solidă',
    name: 'ELISA — Enzyme Linked Immunosorbent Assay',
    principle: 'Reacție Ag-Ac pe placa de microtitrare + anticorp secundar conjugat cu enzimă (HRP/peroxidază, AP/fosfatază alcalină) → substrat cromogen (TMB, OPD, pNPP) → dezvoltare culoare → absorbanță citită la spectrofotometru.',
    variants: {
      direct: 'Ag imobilizat → Ac primar conjugat enzimatic',
      indirect: 'Ag imobilizat → Ac primar nemarcat → Ac secundar anti-specie conjugat enzimatic (amplificare)',
      sandwich: 'Ac de capturare imobilizat → Ag (din probă) → Ac de detecție conjugat. Cel mai sensibil pentru cuantificare Ag.',
      competitive: 'Ag marcat competiționează cu Ag din probă pentru Ac limitat. Util pentru molecule mici.',
      ELISPOT: 'Detectare de celule individuale producătoare (ex. secreție IFN-γ per LT). Spots numărate.'
    },
    detection_substrates: {
      HRP: 'TMB (albastru → galben la stop acid), OPD, ABTS',
      AP:  'pNPP (galben), BCIP/NBT (insolubil pentru WB/IHC)'
    },
    uses: ['Diagnostic HIV, HCV, HBV', 'Hormoni', 'Citokine', 'Autoanticorpi', 'Titruri de anticorpi post-vaccin', 'Alergeni specifici']
  },
  {
    id: 'chemiluminescence',
    category: 'Faza solidă',
    name: 'Chemiluminiscența (CLIA)',
    principle: 'Anticorpi conjugați cu substrat emițător de lumină (luminol, esteri de acridiniu). Semnalul este proporțional cu cantitatea de Ag.',
    advantages: 'Sensibilitate extrem de mare; dinamica semnalului mare; automatizare completă (analizoare moderne).',
    uses: 'Hormoni, markeri cardiaci (troponina), procalcitonina, markeri tumorali.'
  },
  {
    id: 'luminex',
    category: 'Faza solidă',
    name: 'Luminex xMAP (multiplex)',
    principle: 'Bile (microsphere) codificate intern cu 2 coloranți în diferite intensități → până la 100+ „regiuni" distincte. Fiecare regiune cuplată cu un Ac de capturare diferit. Analizoarele detectează simultan identitatea bilei (laser roșu) și semnalul analitic (laser verde/PE).',
    uses: ['Panouri multiplex de citokine (30-60 analiți simultan)', 'Tipare HLA (SSO, SAB)',
           'Detectare DSA', 'Teste autoanticorpi multiplu (ANA panel)']
  },
  {
    id: 'SPR_BLI',
    category: 'Faza solidă',
    name: 'SPR / BLI — Biosenzori label-free',
    SPR: 'Surface Plasmon Resonance (Biacore) — detectează schimbarea indicelui de refracție la suprafața senzorului când moleculele se leagă.',
    BLI: 'Bio-Layer Interferometry (Octet) — detectează modificările optice la vârful unui bioprobe.',
    measurements: ['ka (asocierea)', 'kd (disocierea)', 'KD (afinitate)'],
    uses: 'Caracterizare completă a interacțiunilor Ag-Ac în terapia cu anticorpi monoclonali (QC, dezvoltare).'
  },

  // ==========================================================================
  // IMUNOHISTOCHIMIE / IMUNOCITOCHIMIE
  // ==========================================================================
  {
    id: 'IHC',
    category: 'Microscopie',
    name: 'Imunohistochimia (IHC)',
    principle: 'Detectarea antigenelor în secțiuni tisulare prin Ac specifici vizualizați cromogenic (DAB → maro; AEC → roșu) sau fluorescent.',
    methods: {
      direct: 'Ac primar conjugat enzimatic — simplu, dar sensibilitate mai mică.',
      indirect_2step: 'Ac primar nemarcat → Ac secundar anti-specie conjugat enzimatic — amplificare.',
      indirect_3step: 'Ac primar → Ac secundar biotinilat → streptavidină-HRP (sau complex ABC — Avidin-Biotin-Complex) — amplificare maximă.',
      PAP: 'Peroxidase-Anti-Peroxidase — complex de Ac preparat în prealabil',
      APAAP: 'Alkaline Phosphatase Anti-Alkaline Phosphatase'
    },
    controls: [
      'Control pozitiv — țesut cunoscut pozitiv pentru antigen',
      'Control negativ — omiterea Ac primar sau înlocuirea cu ser normal',
      'Izotip control — Ac irelevant de același izotip/specie',
      'Absorption control — Ac + Ag în exces → dispare colorarea dacă specifică'
    ],
    background: [
      'Activitate peroxidazică endogenă → blocare cu H2O2 3-10 min',
      'Fosfatază alcalină endogenă → blocare cu levamisol',
      'Legare Fc nespecifică → blocare cu ser normal de la aceeași specie ca Ac secundar',
      'Biotină endogenă (ficat, rinichi) → bloc avidin/biotină în kit'
    ],
    counterstain: 'Hematoxilină (nuclei albaștri)',
    uses: ['Tipizare tumori (markere)', 'Receptori hormonali (ER, PR, HER2 în sân)',
           'Limfom (CD markers)', 'Boli infecțioase (antigene virale)']
  },
  {
    id: 'immunofluorescence',
    category: 'Microscopie',
    name: 'Imunofluorescența',
    fluorochromes: ['FITC (verde, 488 ex / 520 em)', 'TRITC / TexasRed (roșu)', 'Cy3, Cy5, Cy7',
                    'PE (ficoeritrină)', 'APC (alophycocianină)', 'Alexa Fluor (400-790 nm, fotostabile)',
                    'Tandem: PE-Cy5, PE-Cy7, APC-Cy7'],
    direct: 'Ac primar conjugat fluorocrom — simplu, dar un singur tag.',
    indirect: 'Ac primar + Ac secundar fluorescent — amplificare și multiplexing posibil.',
    uses: ['ANA (anticorpi antinucleari) pe celule HEp-2 — pattern omogen, periferic, centromeric, pătat etc.',
           'Depunere Ig/complement în glomerulonefrite (biopsie renală)',
           'Imunofluorescență directă în piele (lupus, pemfigus, pemfigoid)',
           'Anti-ds-DNA (Crithidia luciliae)']
  },
  {
    id: 'confocal',
    category: 'Microscopie',
    name: 'Microscopia confocală',
    principle: 'Scanarea laser secvențială a pinholului optic → elimină fluorescența out-of-focus → secțiuni optice; stack 3D reconstruibil.',
    advantages: ['Rezoluție axială superioară', 'Co-localizare precisă', 'Imagini 3D'],
    extensions: ['Multi-photon (mai puțină fototoxicitate, penetrare țesut vie)',
                 'STED, SIM, PALM/STORM (super-resolution < 200 nm)',
                 'Light-sheet (LSFM) — imagini în vivo embrion']
  },
  {
    id: 'tissueFAXS',
    category: 'Microscopie',
    name: 'TissueFAXS / microscopie digitală',
    principle: 'Scanare automată a întregii lame la mare mărire → quantificare computerizată a markerilor.',
    uses: ['Densitatea TIL (Tumor Infiltrating Lymphocytes)', 'CD8/FoxP3 ratio',
           'Co-localizări multiplex (mIF, Vectra)']
  },

  // ==========================================================================
  // CITOMETRIA ÎN FLUX
  // ==========================================================================
  {
    id: 'flow_cytometry',
    category: 'Citometrie',
    name: 'Citometria în flux',
    principle: 'Celule în suspensie trec una câte una printr-un focalizator hidrodinamic și sunt interogate de lasere. Parametri măsurați: FSC (dimensiune), SSC (granularitate), fluorescență (multi-canal).',
    components: [
      'Sistem fluidic (sheath fluid — focalizare hidrodinamică)',
      'Lasere (488 nm albastru, 633 nm roșu, 405 nm violet, 355 nm UV)',
      'Sistem optic (filtre BP, LP, SP, dichroice)',
      'Fotomultiplicatoare (PMT) sau photodiode → tensiune electrică',
      'Electronic de digitizare și analiză'
    ],
    parameters: {
      FSC: 'Forward Scatter — proporțional cu dimensiunea celulei',
      SSC: 'Side Scatter — proporțional cu complexitatea internă (granule, nuclei lobulați)',
      FL: 'Fluorescență specifică — până la 30+ parametri pe citometre spectrale'
    },
    compensation: 'Corectarea contaminării spectrale între canale (spillover). Compensare matriceală automatizată.',
    gating_strategy: [
      '1. FSC-H vs FSC-A (doublet exclusion)',
      '2. SSC-A vs FSC-A (populații principale)',
      '3. Live/Dead (7-AAD, LIVE/DEAD Fixable)',
      '4. Lineage markers (CD45 pentru leucocite)',
      '5. Populații specifice'
    ],
    sorting: 'FACS (Fluorescence-Activated Cell Sorting) — deflexie electrostatică a picăturilor încărcate pentru izolare celulară pură.',
    modern_variants: [
      'Citometrie spectrală (Aurora, ID7000) — deconvoluție de spectre, 40+ parametri',
      'CyTOF / mass cytometry — anticorpi marcați cu metale, 50+ parametri fără spillover',
      'Imaging cytometry (ImageStream) — imagini + parametri clasici'
    ]
  },
  {
    id: 'immunophenotyping',
    category: 'Citometrie',
    name: 'Aplicații citometrie în flux (imunofenotipare)',
    applications_from_Cianga: [
      'Imunofenotiparea limfocitelor (CD3, CD4, CD8, CD19, CD16/56)',
      'Diagnostic leucemii/limfoame (LLC: CD5+CD19+CD23+ etc.)',
      'Numărare CD4 absolut în HIV/SIDA (TruCount)',
      'Ploidia ADN (celule tumorale)',
      'Ciclu celular (BrdU, Ki-67)',
      'Apoptoză (Annexin V / 7-AAD)',
      'Proliferare (CFSE — diluție la fiecare diviziune)',
      'Citotoxicitate (51Cr release înlocuit cu CD107a degranulation assay)',
      'Investigare molecule solubile (CBA — Cytometric Bead Array)',
      'Medicina reproducerii (sperma capacitată, analiza ADN)',
      'Cross-match pre-transplant',
      'Analiză microbiologică (viabilitate bacteriană)',
      'Botanică (ploidie vegetală)'
    ]
  },

  // ==========================================================================
  // TEHNICI DE BIOLOGIE MOLECULARĂ
  // ==========================================================================
  {
    id: 'DNA_extraction',
    category: 'Biologie moleculară',
    name: 'Extragerea ADN',
    methods: [
      'Liza celulară + proteinază K + SDS',
      'Precipitare cu fenol-cloroform → alcool izoamilic',
      'Coloane de silice (silice leagă ADN în săruri chaotropice — Qiagen, Macherey-Nagel)',
      'Magnetic beads (automatizare — Maxwell, KingFisher)'
    ]
  },
  {
    id: 'RNA_extraction',
    category: 'Biologie moleculară',
    name: 'Extragerea ARN',
    methods: ['TRIzol / fenol acid (separă ARN de ADN)', 'Coloane de silice specifice ARN'],
    precautions: ['RNase-free!', 'DEPC-apă', 'Probe pe gheață', 'Inhibitori de ARNază (RNaseOUT)']
  },
  {
    id: 'electrophoresis',
    category: 'Biologie moleculară',
    name: 'Electroforeza acizilor nucleici',
    agarose: '0.5-2% — separă fragmente 100 bp - 25 kb. Colorare cu bromură de etidiu (cancerigenă) sau GelRed/SYBR Safe.',
    polyacrylamide: '4-20% — rezoluție înaltă < 500 bp; folosit pentru verificare PCR, SSCP, secvențiere.',
    pulsed_field: 'PFGE — fragmente mari (> 50 kb) prin schimbarea direcției câmpului periodic; utilizat pentru cromozomi întregi.'
  },
  {
    id: 'blotting',
    category: 'Biologie moleculară',
    name: 'Southern / Northern / Western Blot',
    Southern: 'ADN → electroforeză → transfer capilar pe membrană nitroceluloză/nylon → hibridizare cu sondă marcată (radio/chemilum) → detectare specifică de secvență.',
    Northern: 'ARN → aceeași procedură → analiză expresie genică.',
    Western: 'Proteine → SDS-PAGE → transfer → Ac primari + Ac secundari HRP → ECL → detectare.'
  },
  {
    id: 'PCR',
    category: 'Biologie moleculară',
    name: 'PCR — Polymerase Chain Reaction (Mullis, 1985)',
    cycle: [
      'Denaturare (94-98°C, 15-30s) — ADN catenar',
      'Annealing (50-65°C, 15-60s) — primerii hibridizează',
      'Extensie (72°C, 30s-3min) — Taq polimerază (termostabilă)'
    ],
    typical_cycles: '25-40',
    variants: {
      RT_PCR: 'Reverse Transcription PCR — ARN → ADNc (cu RT, M-MLV/AMV) → PCR. Studiază expresia genică.',
      qPCR: 'Real-time / quantitative — monitorizare în timp real cu SYBR Green (intercalator) sau probe TaqMan (FRET). Ct invers proporțional cu cantitatea inițială.',
      nested: 'Două runde PCR — creșterea specificității',
      multiplex: 'Mai multe perechi de primeri în aceeași reacție',
      digital: 'dPCR — diluție la limită → count absolut al moleculelor',
      HRM: 'High Resolution Melting — detectează SNP/metilare',
      hot_start: 'Taq inactivă la rece pentru evitarea produselor nespecifice'
    },
    applications: ['Diagnostic HIV RNA, HCV RNA, SARS-CoV-2', 'Genotipare HLA', 'Detectare minimă reziduală (BCR-ABL)', 'Cuantificare citokine', 'Sexuarea embrionilor']
  },
  {
    id: 'sequencing',
    category: 'Biologie moleculară',
    name: 'Secvențierea ADN',
    Sanger: 'Metoda dideoxi cu terminatori fluorescenți; capilar electroforeză; standard pentru verificare, SBT HLA.',
    NGS: {
      platforms: ['Illumina (sequencing by synthesis)', 'Ion Torrent (pH)', 'PacBio (HiFi long-reads)', 'Oxford Nanopore (curent ionic)'],
      applications: [
        'Tipare HLA cu rezoluție 4 câmpuri',
        'Repertoire BCR/TCR (AIRR-seq)',
        'Exom/whole genome pentru imunodeficiențe',
        'Single cell RNA-seq (10x Chromium) — heterogenitate imună',
        'ChIP-seq, ATAC-seq, spatial omics'
      ]
    }
  },
  {
    id: 'ISH_FISH_CISH',
    category: 'Biologie moleculară',
    name: 'Hibridizare in situ (ISH)',
    ISH: 'Sonde ADN/ARN marcate se hibridizează cu ținta în secțiuni tisulare',
    FISH: 'Fluorescence ISH — sonde fluorescente; translocări cromozomiale (BCR-ABL, t(14;18), HER2 amplification)',
    CISH: 'Chromogenic ISH — colorare cromogenă; citire pe microscop optic standard',
    RNAscope: 'Tehnologia de amplificare cu sonde „Z" pentru detectarea ARNm single-molecule in situ'
  },
  {
    id: 'restriction_cloning',
    category: 'Biologie moleculară',
    name: 'Clonare moleculară',
    steps: [
      'Digestie cu enzime de restricție (EcoRI, BamHI, HindIII...) — produse „sticky ends" sau „blunt"',
      'Ligatură cu T4 DNA ligază (vector + insert)',
      'Transformare în E. coli (DH5α, Top10) prin șoc termic sau electroporare',
      'Selecție prin antibiotic (ampi, kana) codificat de vector',
      'Screening (α-complementare lacZ — colonii albastre/albe; PCR, restricție)',
      'Mini-prep → secvențiere confirmare'
    ],
    vectors: {
      plasmide: 'pUC19, pBR322, pBluescript — ori + rezistență + MCS',
      fagi: 'λ (până la 20 kb insert)',
      cosmide: 'Până la 45 kb',
      BAC: 'Bacterial Artificial Chromosome — până la 300 kb',
      YAC: 'Yeast Artificial Chromosome — până la 2 Mb',
      virali: 'Adenovirus, lentivirus, AAV pentru transducție celule eucariote; CAR-T lentivirus'
    }
  },
  {
    id: 'CRISPR',
    category: 'Biologie moleculară',
    name: 'CRISPR / Cas9 (editare genomică)',
    principle: 'sgRNA (guide RNA ~20 nt) direcționează Cas9 nucleaza la secvența țintă urmată de PAM (5\'-NGG-3\'). Cas9 creează DSB → reparat prin NHEJ (indels → KO) sau HDR (integrare precisă cu template).',
    variants: {
      'Cas9 WT':    'DSB — KO prin NHEJ',
      'Cas9 nickase (nCas9)': 'Tăietură monocatenară — reduce off-target',
      'dCas9':      'Catalitic inactiv — CRISPRi/a (fuzionat cu represori/activatori)',
      'Base editors': 'Cas9(n) + deaminază (C→T sau A→G) — editare bazică fără DSB',
      'Prime editors': 'Cas9(n) + reverse transcriptază + pegRNA — inserții/deleții/substituții precise'
    },
    immunology_applications: [
      'CAR-T cu disrupția TCR pentru terapie universală off-the-shelf',
      'KO PD-1 în LT pentru creșterea eficacității',
      'Screening CRISPR whole-genome pentru gene esențiale în răspunsul imun',
      'Corecția defectelor monogenice (X-SCID, CGD — trialuri clinice)'
    ]
  },

  // ==========================================================================
  // EVALUAREA FUNCȚIONALITĂȚII (teste in vivo / in vitro)
  // ==========================================================================
  {
    id: 'eval_B',
    category: 'Evaluare funcțională',
    name: 'Evaluarea limfocitelor B',
    in_vivo: [
      'Dozarea IgG, IgA, IgM, IgE totale (nefelometrie / turbidimetrie)',
      'Dozarea subclaselor IgG (1-4)',
      'Titrul Ac post-vaccin (tetanos, difterie — Ag proteice; pneumococ — polizaharide)',
      'Izohemaglutinine (anti-A / anti-B)',
      'Electroforeza proteinelor serice (hipo-gamaglobulinemie? pic M?)'
    ],
    in_vitro: [
      'Imunofenotipare (CD19, CD20, CD27, IgM, IgD, CD38)',
      'Stimulare cu mitogeni (PWM — pokeweed), SAC, anti-IgM + CD40L',
      'Proliferare (CFSE, BrdU)',
      'Producție Ig in vitro (ELISPOT IgM/IgG plasmocite)'
    ]
  },
  {
    id: 'eval_T',
    category: 'Evaluare funcțională',
    name: 'Evaluarea limfocitelor T',
    in_vivo: [
      'Test cutanat IDR (PPD, candidă, tricophyton) — răspuns DTH de tip Mantoux',
      'Absența răspunsului DTH = anergia cutanată (SIDA, TB severă, sarcoidoză)'
    ],
    in_vitro: [
      'Imunofenotipare LT (CD3, CD4, CD8, CD45RA/RO, CCR7)',
      'Proliferare la mitogeni (PHA, ConA, PWM) — 3H-timidină, CFSE, MTS',
      'Proliferare la antigen (tuberculină, candidă, anti-CD3/CD28)',
      'Producție citokine (ELISPOT, ICS — intracellular cytokine staining)',
      'MLC (Mixed Lymphocyte Culture) — reactivitate aloantigenică',
      'Citotoxicitate: 51Cr release (clasic), CD107a mobilization, PKH-based',
      'QuantiFERON-TB Gold / T-SPOT.TB — detectare LT specifice TB (IGRA)'
    ]
  },
  {
    id: 'eval_phagocyte',
    category: 'Evaluare funcțională',
    name: 'Evaluarea fagocitelor',
    tests: [
      'NBT (Nitroblue Tetrazolium) — reducere la formazan în neutrofile activate (CGD: negativ)',
      'DHR-123 (Dihydrorhodamine) — oxidat de ROS → rhodamină fluorescentă (citometrie) — test modern pentru CGD',
      'Fagocitoza de particule (bacterii fluorescente, latex) — % celule pozitive',
      'Chemotaxia (Boyden chamber, under-agarose assay)',
      'Activitate bactericidă — supraviețuire bacterii după fagocitoză',
      'Imunofenotipare CD18, CD11a/b/c (LAD-1 diagnostic)',
      'Mieloperoxidaza (MPO — deficit: ușor/moderat, rar simptomatic)'
    ]
  },
  {
    id: 'eval_NK',
    category: 'Evaluare funcțională',
    name: 'Evaluarea NK',
    tests: [
      'Imunofenotipare (CD3- CD56+/CD16+)',
      'Citotoxicitate împotriva K562 (linie standard, lipsită de MHC-I) — 51Cr release sau CD107a',
      'Degranulare (CD107a — marker de suprafață tranzitoriu)',
      'Producție IFN-γ (ICS)',
      'Testarea receptorilor (KIR, NKG2A/C/D — Luminex sau citometrie)'
    ]
  },
  {
    id: 'eval_complement',
    category: 'Evaluare funcțională',
    name: 'Evaluarea complementului',
    tests: [
      'CH50 — activitate hemolitică totală a căii clasice (eritrocite oaie + ser + amboceptor)',
      'AH50 — activitate hemolitică a căii alternative',
      'Dozare individuală C3, C4 (nefelometrie)',
      'Dozare C1q, C1-INH, factor H (ELISA specifică)',
      'CH50 = 0 → deficit componentă clasică terminală; CH50 ↓ + AH50 ↓ → deficit componentă comună',
      'C3 ↓ izolat → consum (GN membranoproliferativă, C3 nefritic factor)',
      'C4 ↓ izolat → deficit ereditar sau boala serului (complex imun)'
    ]
  },
  {
    id: 'eval_basophil',
    category: 'Evaluare funcțională',
    name: 'Testul de activare a bazofilelor (BAT)',
    principle: 'Bazofilele sangvine incubate cu alergen suspect + co-stimulent → expresie CD63/CD203c (markeri de degranulare) măsurată în citometrie.',
    uses: 'Diagnostic alergii medicamentoase (betalactamine, AINS), alimentare, venin insecte — unde testele cutanate/IgE specifice sunt nedeterminante.'
  }
];

export const TECHNIQUE_CATEGORIES = [
  { id: 'Fundamente',          color: '#8b5cf6', icon: '⚛' },
  { id: 'Producție',           color: '#ec4899', icon: '🧬' },
  { id: 'Precipitare',         color: '#3b82f6', icon: '☁' },
  { id: 'Aglutinare',          color: '#06b6d4', icon: '🔴' },
  { id: 'Faza solidă',         color: '#10b981', icon: '🟢' },
  { id: 'Microscopie',         color: '#f59e0b', icon: '🔬' },
  { id: 'Citometrie',          color: '#ef4444', icon: '📊' },
  { id: 'Biologie moleculară', color: '#84cc16', icon: '🧪' },
  { id: 'Evaluare funcțională', color: '#a855f7', icon: '✓' }
];
