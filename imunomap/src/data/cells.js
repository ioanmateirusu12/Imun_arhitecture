// ============================================================================
// data/cells.js — Celulele sistemului imun
// ============================================================================
// Fiecare celulă conține: identificator, nume RO/EN, origine, markeri CD,
// subtipuri, funcții, citokine produse, receptori exprimați, rol clinic.
// Sursa primară: Cianga P. — „Tehnici utilizate în imunologie" (PIM, 2008)
// + revizuiri din Janeway, Abbas, Murphy.
// ============================================================================

export const CELLS = [
  // -------------------- STEM & PROGENITOR --------------------
  {
    id: 'HSC',
    name_ro: 'Celulă stem hematopoietică',
    name_en: 'Hematopoietic stem cell',
    lineage: 'stem',
    origin: 'Măduvă osoasă',
    markers: ['CD34+', 'CD38-', 'Lin-', 'Sca-1+', 'c-Kit+'],
    functions: [
      'Auto-reînnoire',
      'Diferențiere multipotentă în toate celulele hematopoietice'
    ],
    produces_cytokines: [],
    notes:
      'Celula fondatoare a întregului sistem hematopoietic. Se poate diferenția ' +
      'în progenitor mieloid comun (CMP) sau progenitor limfoid comun (CLP).',
    subtypes: ['LT-HSC (long-term)', 'ST-HSC (short-term)', 'MPP (multipotent progenitor)']
  },
  {
    id: 'CLP',
    name_ro: 'Progenitor limfoid comun',
    name_en: 'Common lymphoid progenitor',
    lineage: 'lymphoid',
    origin: 'Măduvă osoasă',
    markers: ['CD34+', 'CD10+', 'CD38+', 'IL-7Rα+'],
    functions: ['Generare limfocite T, B, NK și ILC'],
    notes: 'Migrează în timus pentru linia T; rămâne în măduvă pentru linia B.'
  },
  {
    id: 'CMP',
    name_ro: 'Progenitor mieloid comun',
    name_en: 'Common myeloid progenitor',
    lineage: 'myeloid',
    origin: 'Măduvă osoasă',
    markers: ['CD34+', 'CD38+', 'IL-3Rα+'],
    functions: ['Generare granulocite, monocite, eritrocite, trombocite, mastocite']
  },

  // -------------------- LIMFOCITE T --------------------
  {
    id: 'TCD4',
    name_ro: 'Limfocit T helper',
    name_en: 'CD4+ T helper cell',
    lineage: 'lymphoid',
    origin: 'Timus',
    markers: ['CD3+', 'CD4+', 'CD8-', 'TCRαβ+'],
    functions: [
      'Activarea limfocitelor B',
      'Activarea macrofagelor',
      'Orchestrarea răspunsului imun adaptativ',
      'Selecție de clasă Ig prin secreție de citokine'
    ],
    subtypes: ['Th1', 'Th2', 'Th17', 'Th9', 'Th22', 'Tfh', 'Treg'],
    produces_cytokines: ['IL-2', 'IFN-γ', 'IL-4', 'IL-17', 'IL-21', 'TGF-β'],
    receptors: ['TCRαβ', 'CD28', 'CTLA-4', 'PD-1', 'ICOS', 'CD40L'],
    restriction: 'MHC clasa II',
    clinical:
      'Deficit în HIV/SIDA (țintă principală, determină susceptibilitate la infecții oportuniste).'
  },
  {
    id: 'Th1',
    name_ro: 'Limfocit Th1',
    name_en: 'T helper 1',
    lineage: 'lymphoid',
    parent: 'TCD4',
    markers: ['T-bet+', 'CXCR3+', 'CCR5+'],
    master_regulator: 'T-bet (TBX21)',
    differentiation_cytokines: ['IL-12', 'IFN-γ'],
    signature_cytokines: ['IFN-γ', 'IL-2', 'TNF-β (LT)'],
    functions: [
      'Activare macrofage (→ M1 clasică)',
      'Apărare contra patogenilor intracelulari (Mycobacterium, Listeria)',
      'Induce clasa IgG opsonizantă (IgG2a la șoarece, IgG1/IgG3 la om)'
    ],
    pathology: 'Participă la autoimunitate organ-specifică (SM, DZ tip 1).'
  },
  {
    id: 'Th2',
    name_ro: 'Limfocit Th2',
    name_en: 'T helper 2',
    lineage: 'lymphoid',
    parent: 'TCD4',
    markers: ['GATA3+', 'CCR4+', 'CCR8+', 'CRTh2+'],
    master_regulator: 'GATA3',
    differentiation_cytokines: ['IL-4'],
    signature_cytokines: ['IL-4', 'IL-5', 'IL-13', 'IL-9', 'IL-25'],
    functions: [
      'Apărare anti-helmintică',
      'Inducere class switch IgE (prin IL-4)',
      'Activare eozinofile (prin IL-5)',
      'Activare mastocite și bazofile'
    ],
    pathology: 'Implicat central în astm, rinită alergică, dermatită atopică.'
  },
  {
    id: 'Th17',
    name_ro: 'Limfocit Th17',
    name_en: 'T helper 17',
    lineage: 'lymphoid',
    parent: 'TCD4',
    markers: ['RORγt+', 'CCR6+', 'CD161+'],
    master_regulator: 'RORγt (RORC)',
    differentiation_cytokines: ['TGF-β', 'IL-6', 'IL-23', 'IL-1β'],
    signature_cytokines: ['IL-17A', 'IL-17F', 'IL-22', 'IL-21', 'GM-CSF'],
    functions: [
      'Apărare contra fungilor și bacteriilor extracelulare',
      'Recrutare neutrofile (prin IL-17 → CXCL8)',
      'Menținerea barierei epiteliale'
    ],
    pathology: 'Psoriazis, spondilartrită, boli inflamatorii intestinale, SM.'
  },
  {
    id: 'Treg',
    name_ro: 'Limfocit T reglator',
    name_en: 'Regulatory T cell',
    lineage: 'lymphoid',
    parent: 'TCD4',
    markers: ['CD4+', 'CD25^high', 'FoxP3+', 'CD127^low', 'CTLA-4+'],
    master_regulator: 'FoxP3',
    differentiation_cytokines: ['TGF-β', 'IL-2'],
    signature_cytokines: ['IL-10', 'TGF-β', 'IL-35'],
    functions: [
      'Suprimarea răspunsurilor imune',
      'Menținerea toleranței periferice',
      'Prevenirea autoimunității'
    ],
    subtypes: ['nTreg (timică)', 'iTreg (periferică / TGF-β-indusă)', 'Tr1 (IL-10)'],
    pathology: 'Mutațiile FoxP3 → sindromul IPEX (autoimunitate severă neonatală).'
  },
  {
    id: 'Tfh',
    name_ro: 'Limfocit T helper folicular',
    name_en: 'Follicular helper T cell',
    lineage: 'lymphoid',
    parent: 'TCD4',
    markers: ['CXCR5+', 'PD-1+', 'ICOS^high', 'Bcl-6+'],
    master_regulator: 'Bcl-6',
    signature_cytokines: ['IL-21', 'IL-4'],
    location: 'Centre germinale din ganglioni limfatici',
    functions: [
      'Ajută celulele B în centrele germinale',
      'Induce hipermutație somatică (SHM)',
      'Induce class switch recombination (CSR)',
      'Generarea plasmocitelor și celulelor B memorie'
    ]
  },
  {
    id: 'TCD8',
    name_ro: 'Limfocit T citotoxic',
    name_en: 'CD8+ cytotoxic T lymphocyte (CTL)',
    lineage: 'lymphoid',
    origin: 'Timus',
    markers: ['CD3+', 'CD8+', 'CD4-', 'TCRαβ+'],
    restriction: 'MHC clasa I',
    functions: [
      'Liza celulelor infectate viral',
      'Liza celulelor tumorale',
      'Liza celulelor grefă (rejet de transplant)'
    ],
    mechanisms: [
      'Granzime + Perforină (inducere apoptoză prin Caspase)',
      'Fas-L / Fas (cale extrinsecă a apoptozei)',
      'Secreție IFN-γ și TNF-α'
    ],
    receptors: ['TCRαβ', 'CD8αβ', 'CD28', 'PD-1', 'KIR'],
    produces_cytokines: ['IFN-γ', 'TNF-α', 'IL-2'],
    clinical: 'Limfocit central în imunitatea antivirală și antitumorală.'
  },
  {
    id: 'Tgd',
    name_ro: 'Limfocit T γδ',
    name_en: 'Gamma delta T cell',
    lineage: 'lymphoid',
    markers: ['CD3+', 'TCRγδ+', 'de obicei CD4- CD8-'],
    functions: [
      'Recunoaștere ne-MHC restrictivă',
      'Recunoaștere fosfoantigeni (Vγ9Vδ2)',
      'Supravegherea barierelor epiteliale',
      'Citotoxicitate rapidă și producție de IL-17'
    ],
    notes: '≈1-5% din LT circulante; majoritari în epiteliul intestinal și piele.'
  },
  {
    id: 'NKT',
    name_ro: 'Limfocit NKT',
    name_en: 'Natural Killer T cell',
    lineage: 'lymphoid',
    markers: ['CD3+', 'TCRαβ (repertoriu restrâns Vα24-Jα18 la om)', 'CD161+', 'NK1.1+ (șoarece)'],
    restriction: 'CD1d (lipide)',
    functions: [
      'Recunoaște glicolipide prezentate pe CD1d',
      'Eliberare rapidă masivă de citokine (IFN-γ, IL-4)',
      'Punte între imunitatea înnăscută și cea adaptativă'
    ]
  },
  {
    id: 'MAIT',
    name_ro: 'Limfocit MAIT',
    name_en: 'Mucosal-Associated Invariant T cell',
    lineage: 'lymphoid',
    markers: ['CD3+', 'TCR Vα7.2-Jα33 (om)', 'CD161^high', 'IL-18R+'],
    restriction: 'MR1',
    ligands: ['Metaboliți de riboflavină (vitamina B2) de origine microbiană'],
    functions: ['Apărare antibacteriană la nivelul mucoaselor', 'Producție rapidă IFN-γ, IL-17, TNF']
  },

  // -------------------- LIMFOCITE B --------------------
  {
    id: 'B_naiv',
    name_ro: 'Limfocit B naiv',
    name_en: 'Naive B cell',
    lineage: 'lymphoid',
    origin: 'Măduvă osoasă',
    markers: ['CD19+', 'CD20+', 'IgM+', 'IgD+', 'CD27-'],
    functions: [
      'Recunoaștere antigen prin BCR',
      'Prezentare antigenică către Tfh',
      'După activare → plasmocit sau celulă B memorie'
    ],
    location: 'Foliculi primari în ganglioni, splină, MALT'
  },
  {
    id: 'B_memorie',
    name_ro: 'Limfocit B memorie',
    name_en: 'Memory B cell',
    lineage: 'lymphoid',
    markers: ['CD19+', 'CD20+', 'CD27+', 'IgG/IgA/IgE+ (class-switched)'],
    functions: [
      'Răspuns secundar rapid',
      'Repertoriu maturat prin SHM',
      'Diferențiere rapidă în plasmocite la re-expunere'
    ]
  },
  {
    id: 'plasmocit',
    name_ro: 'Plasmocit',
    name_en: 'Plasma cell',
    lineage: 'lymphoid',
    markers: ['CD138+', 'CD38^high', 'CD19^low/-', 'CD20-', 'MHC-II↓'],
    functions: ['Secreție masivă de anticorpi (~2000 molecule/sec)'],
    lifespan: 'Plasmocite cu viață scurtă (~3-5 zile) sau lungă (ani, în nișa medulară)',
    clinical: 'Proliferare malignă → Mielom Multiplu (proteina monoclonală M).'
  },
  {
    id: 'B1',
    name_ro: 'Limfocit B-1',
    name_en: 'B-1 cell',
    lineage: 'lymphoid',
    markers: ['CD5+ (B-1a) sau CD5- (B-1b)', 'IgM^high', 'IgD^low'],
    location: 'Cavități peritoneală și pleurală',
    functions: ['Producție IgM naturală (polireactivă)', 'Apărare T-independentă precoce']
  },
  {
    id: 'Breg',
    name_ro: 'Limfocit B reglator',
    name_en: 'Regulatory B cell',
    lineage: 'lymphoid',
    markers: ['CD19+', 'CD24^high', 'CD38^high (la om)', 'CD1d^high'],
    signature_cytokines: ['IL-10', 'TGF-β', 'IL-35'],
    functions: ['Suprimarea inflamației', 'Inducere Treg']
  },

  // -------------------- CELULE NK & ILC --------------------
  {
    id: 'NK',
    name_ro: 'Celulă Natural Killer',
    name_en: 'Natural Killer cell',
    lineage: 'lymphoid',
    markers_human: ['CD3-', 'CD56+', 'CD16+ (subset)', 'NKp46+'],
    subtypes: ['CD56^bright (imunoregulator, secretor)', 'CD56^dim (citotoxic)'],
    receptors: ['KIR (inhibitori/activatori)', 'NKG2A', 'NKG2D', 'CD16 (FcγRIIIa)', 'Natural cytotoxicity receptors (NKp30, NKp44, NKp46)'],
    functions: [
      'Citotoxicitate prin "missing self" (absența MHC I)',
      'ADCC (antibody-dependent cellular cytotoxicity) prin CD16',
      'Producție IFN-γ în răspunsul antiviral precoce',
      'Supraveghere antitumorală'
    ],
    mechanisms: ['Perforină + Granzime', 'TRAIL / FasL', 'Citokine']
  },
  {
    id: 'ILC1',
    name_ro: 'Celulă limfoidă înnăscută tip 1',
    name_en: 'Innate lymphoid cell 1',
    lineage: 'lymphoid',
    markers: ['T-bet+', 'NKp46+', 'CD127+', 'CD3-'],
    signature_cytokines: ['IFN-γ', 'TNF-α'],
    functions: ['Analogul înnăscut al Th1', 'Apărare intracelulară']
  },
  {
    id: 'ILC2',
    name_ro: 'Celulă limfoidă înnăscută tip 2',
    name_en: 'Innate lymphoid cell 2',
    lineage: 'lymphoid',
    markers: ['GATA3+', 'CRTh2+', 'CD127+', 'CD3-'],
    signature_cytokines: ['IL-5', 'IL-13', 'IL-9'],
    functions: ['Analogul înnăscut al Th2', 'Răspuns anti-parazitar', 'Rol în astm alergic'],
    activators: ['IL-25', 'IL-33', 'TSLP']
  },
  {
    id: 'ILC3',
    name_ro: 'Celulă limfoidă înnăscută tip 3',
    name_en: 'Innate lymphoid cell 3',
    lineage: 'lymphoid',
    markers: ['RORγt+', 'CD127+', 'CD3-'],
    signature_cytokines: ['IL-17', 'IL-22', 'GM-CSF'],
    functions: ['Analogul înnăscut al Th17', 'Homeostazie intestinală', 'Organogeneza ganglionilor limfatici (LTi)']
  },

  // -------------------- FAGOCITE MONONUCLEARE --------------------
  {
    id: 'monocit',
    name_ro: 'Monocit',
    name_en: 'Monocyte',
    lineage: 'myeloid',
    markers_human: ['CD14+', 'CD16+/-', 'HLA-DR+'],
    subtypes: [
      'Clasic (CD14^high CD16-) — ~85%',
      'Intermediar (CD14^high CD16+)',
      'Non-clasic (CD14^low CD16^high) — patrulare vasculară'
    ],
    functions: ['Precursor de macrofage și DC tisulare', 'Fagocitoză', 'Prezentare antigenică']
  },
  {
    id: 'macrofag',
    name_ro: 'Macrofag',
    name_en: 'Macrophage',
    lineage: 'myeloid',
    markers: ['CD68+', 'CD14+', 'F4/80+ (șoarece)', 'MHC-II+'],
    subtypes: ['M1 (clasic, pro-inflamator)', 'M2 (alternativ, reparator)'],
    M1: {
      activators: ['IFN-γ', 'LPS'],
      produces: ['IL-1β', 'IL-6', 'IL-12', 'TNF-α', 'iNOS/NO'],
      role: 'Apărare antimicrobiană, inflamație'
    },
    M2: {
      activators: ['IL-4', 'IL-13', 'IL-10', 'TGF-β'],
      produces: ['IL-10', 'TGF-β', 'Arginază-1'],
      role: 'Reparare tisulară, fibroză, suprimare inflamație'
    },
    tissue_resident: [
      'Celule Kupffer (ficat)',
      'Microglie (SNC)',
      'Macrofage alveolare (plămân)',
      'Osteoclaste (os)',
      'Histiocite (țesut conjunctiv)',
      'Celule Langerhans (epidermă — înrudite)'
    ],
    functions: [
      'Fagocitoză (receptori: Fc, CR1/CR3, Dectin-1, Mannose-R)',
      'Prezentare antigenică către LT CD4',
      'Reparare tisulară',
      'Secreție citokine'
    ]
  },
  {
    id: 'DC',
    name_ro: 'Celulă dendritică',
    name_en: 'Dendritic cell',
    lineage: 'myeloid',
    markers: ['CD11c+', 'MHC-II^high', 'CD80+', 'CD86+'],
    subtypes: [
      'cDC1 (CD141+ / CD8α+) — prezentare încrucișată, activare CD8',
      'cDC2 (CD1c+ / CD11b+) — activare CD4, răspuns Th2/Th17',
      'pDC (plasmacitoidă, CD303+ / BDCA-2+) — producție masivă IFN-α/β',
      'Celule Langerhans (Langerin/CD207+, epidermă)',
      'moDC (derivate din monocite, inflamatorii)'
    ],
    functions: [
      'Captare antigen la periferie (macropinocitoză, endocitoză)',
      'Maturare și migrare în ganglionii limfatici (prin CCR7)',
      'Prezentare antigen — cele mai eficiente APC',
      'Activare limfocite T naive (singurele APC capabile)'
    ],
    signals_for_T: [
      '1. TCR + MHC-peptid',
      '2. CD28 ↔ CD80/CD86 (co-stimulare)',
      '3. Citokine (polarizare Th1/Th2/Th17/Treg)'
    ]
  },

  // -------------------- GRANULOCITE --------------------
  {
    id: 'neutrofil',
    name_ro: 'Neutrofil',
    name_en: 'Neutrophil',
    lineage: 'myeloid',
    markers: ['CD66b+', 'CD15+', 'CD16+', 'MPO+'],
    abundance: '40-70% din leucocitele sangvine',
    lifespan: '~6-12 ore în circulație, ~1-2 zile în țesut',
    functions: [
      'Fagocitoză',
      'Degranulare (elastază, mieloperoxidază, defensine, lactoferină)',
      'Explozie respiratorie (NADPH oxidază → ROS)',
      'NETosis (Neutrophil Extracellular Traps)'
    ],
    granules: [
      'Azurofile (primare): MPO, elastază, defensine, catepsină G',
      'Specifice (secundare): lactoferină, colagenază, lizozim',
      'Gelatinază (terțiare): gelatinază, lizozim',
      'Vezicule secretorii: fosfatază alcalină, CD35, CD11b/CD18'
    ],
    recruitment: 'Prin CXCL8 (IL-8), leucotriena B4, C5a'
  },
  {
    id: 'eozinofil',
    name_ro: 'Eozinofil',
    name_en: 'Eosinophil',
    lineage: 'myeloid',
    markers: ['CD125+ (IL-5Rα)', 'CCR3+', 'Siglec-8+'],
    abundance: '1-6% din leucocite',
    granules: [
      'Major Basic Protein (MBP)',
      'Eosinophil Cationic Protein (ECP)',
      'Eosinophil Peroxidase (EPO / EPX)',
      'Eosinophil-Derived Neurotoxin (EDN)'
    ],
    functions: [
      'Apărare anti-parazitară (helminti)',
      'Rol patogenic în astm alergic',
      'Remodelare tisulară'
    ],
    stimuli: ['IL-5 (dezvoltare, supraviețuire)', 'IL-33', 'eotaxine (CCL11, CCL24, CCL26)']
  },
  {
    id: 'bazofil',
    name_ro: 'Bazofil',
    name_en: 'Basophil',
    lineage: 'myeloid',
    markers: ['CD123+', 'FcεRI+', 'CD203c+'],
    abundance: '<1% din leucocite (cel mai rar granulocit)',
    granules: ['Histamină', 'Heparină', 'Proteaze'],
    functions: [
      'Reacții alergice IgE-mediate (degranulare)',
      'Producție IL-4, IL-13 (promovează Th2)',
      'Apărare anti-parazitară'
    ]
  },
  {
    id: 'mastocit',
    name_ro: 'Mastocit',
    name_en: 'Mast cell',
    lineage: 'myeloid',
    markers: ['c-Kit+ (CD117)', 'FcεRI+', 'Triptază+'],
    location: 'Țesuturi (piele, mucoase, în jurul vaselor)',
    subtypes: [
      'MC-T (triptază+, mucoase)',
      'MC-TC (triptază+ chimază+, țesut conjunctiv)'
    ],
    granules_preformed: ['Histamină', 'Triptază', 'Chimază', 'Heparină', 'TNF-α preformat'],
    granules_denovo: ['Prostaglandine (PGD2)', 'Leucotriene (LTC4, LTD4)', 'PAF', 'citokine'],
    functions: [
      'Reacții de hipersensibilitate tip I (imediate)',
      'Apărare anti-parazitară',
      'Modulare imunitate înnăscută/adaptativă'
    ],
    clinical: 'Anafilaxie; mastocitoză (proliferare malignă cu mutația KIT D816V).'
  },

  // -------------------- ALTE --------------------
  {
    id: 'MDSC',
    name_ro: 'Celule supresoare de origine mieloidă',
    name_en: 'Myeloid-Derived Suppressor Cell',
    lineage: 'myeloid',
    markers_mouse: ['CD11b+ Gr1+'],
    markers_human: ['CD33+ CD11b+ HLA-DR^low/-'],
    functions: [
      'Suprimarea limfocitelor T (prin Arg1, iNOS, ROS)',
      'Expansiune în cancer și inflamație cronică'
    ]
  },
  {
    id: 'FDC',
    name_ro: 'Celulă dendritică foliculară',
    name_en: 'Follicular dendritic cell',
    lineage: 'stromal',
    markers: ['CD21+ (CR2)', 'CD23+', 'CD35+ (CR1)'],
    location: 'Centre germinale',
    functions: [
      'Reținerea complexelor imune pe suprafață (iccosome)',
      'Prezentare antigen nativ celulelor B în centrul germinal',
      'Suport pentru selecția afinităților în SHM'
    ],
    note: 'NU este înrudită cu celulele dendritice clasice; origine stromală.'
  }
];

export const CELL_LINEAGES = {
  stem:     { label: 'Stem/Progenitor', color: '#6b7280' },
  lymphoid: { label: 'Limfoid',         color: '#3b82f6' },
  myeloid:  { label: 'Mieloid',         color: '#f59e0b' },
  stromal:  { label: 'Stromal',         color: '#10b981' }
};

export const findCell = (id) => CELLS.find(c => c.id === id);

// Flat colors map (ex: LINEAGE_COLORS.lymphoid = "#3b82f6")
export const LINEAGE_COLORS = Object.fromEntries(
  Object.entries(CELL_LINEAGES).map(([k, v]) => [k, v.color])
);
